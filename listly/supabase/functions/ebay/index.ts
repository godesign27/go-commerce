// Listly ↔ eBay (DD-46, R-35). Official eBay APIs only: OAuth 2.0 authorization code grant, Sell Inventory,
// Sell Account and Commerce Taxonomy. Listly never sees the seller's eBay password; tokens are encrypted here
// before storage and never returned to the app.
//
// Secrets (Supabase dashboard > Edge Functions > Secrets):
//   EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RUNAME, EBAY_ENV ("sandbox" or "production"),
//   LISTLY_TOKEN_KEY (32 random bytes, base64) for token encryption.
// The RuName's "auth accepted URL" must be: <SUPABASE_URL>/functions/v1/ebay/callback
//
// Endpoint details marked [verify] are from eBay's docs as known to us; confirm on the first sandbox run.

import { createClient } from 'npm:@supabase/supabase-js@2'

const env = (k: string) => Deno.env.get(k) ?? ''
const ENV = env('EBAY_ENV') === 'production' ? 'production' : 'sandbox'
const HOST =
  ENV === 'production'
    ? { auth: 'https://auth.ebay.com', api: 'https://api.ebay.com', web: 'https://www.ebay.com' }
    : { auth: 'https://auth.sandbox.ebay.com', api: 'https://api.sandbox.ebay.com', web: 'https://sandbox.ebay.com' }
const SCOPES = [
  'https://api.ebay.com/oauth/api_scope',
  'https://api.ebay.com/oauth/api_scope/sell.inventory',
  'https://api.ebay.com/oauth/api_scope/sell.account',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
].join(' ')

const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS } })

class EbayError extends Error {
  constructor(message: string, public needs?: string, public status = 400) {
    super(message)
  }
}

// ---------- token encryption (AES-GCM) ----------
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u))
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
let cryptoKey: CryptoKey | null = null
async function key() {
  if (cryptoKey) return cryptoKey
  const raw = unb64(env('LISTLY_TOKEN_KEY'))
  if (raw.length !== 32) throw new EbayError('Server setup: LISTLY_TOKEN_KEY must be 32 bytes, base64.', undefined, 500)
  cryptoKey = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
  return cryptoKey
}
async function encrypt(text: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await key(), new TextEncoder().encode(text)))
  return `${b64(iv)}.${b64(ct)}`
}
async function decrypt(s: string) {
  const [iv, ct] = s.split('.')
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, await key(), unb64(ct))
  return new TextDecoder().decode(pt)
}

// ---------- eBay calls ----------
const basicAuth = () => 'Basic ' + btoa(`${env('EBAY_CLIENT_ID')}:${env('EBAY_CLIENT_SECRET')}`)

async function tokenCall(body: Record<string, string>) {
  const r = await fetch(`${HOST.api}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: basicAuth(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new EbayError(j.error_description ?? j.error ?? `eBay sign-in failed (${r.status}).`)
  return j as { access_token: string; expires_in: number; refresh_token?: string; refresh_token_expires_in?: number }
}

let appToken: { token: string; until: number } | null = null
async function getAppToken() {
  if (appToken && appToken.until > Date.now() + 60_000) return appToken.token
  const t = await tokenCall({ grant_type: 'client_credentials', scope: 'https://api.ebay.com/oauth/api_scope' })
  appToken = { token: t.access_token, until: Date.now() + t.expires_in * 1000 }
  return t.access_token
}

async function call<T = Record<string, unknown>>(path: string, token: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const r = await fetch(`${HOST.api}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Language': 'en-US',
      'Accept-Language': 'en-US',
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  const text = await r.text()
  const data = text ? JSON.parse(text) : {}
  if (!r.ok) {
    const e = data.errors?.[0]
    throw new EbayError(e?.longMessage ?? e?.message ?? `eBay returned ${r.status}.`, undefined, r.status)
  }
  return data as T
}

type Connection = {
  user_id: string
  settings: Record<string, string>
  access_token_enc: string
  refresh_token_enc: string
  access_expires_at: string
}

async function userToken(userId: string): Promise<{ token: string; conn: Connection }> {
  const { data: conn } = await admin.from('marketplace_connections').select('*').eq('user_id', userId).eq('marketplace', 'ebay').maybeSingle<Connection>()
  if (!conn) throw new EbayError('Connect your eBay account first.', 'connect')
  if (new Date(conn.access_expires_at).getTime() > Date.now() + 60_000) return { token: await decrypt(conn.access_token_enc), conn }
  try {
    const t = await tokenCall({ grant_type: 'refresh_token', refresh_token: await decrypt(conn.refresh_token_enc), scope: SCOPES })
    await admin
      .from('marketplace_connections')
      .update({ access_token_enc: await encrypt(t.access_token), access_expires_at: new Date(Date.now() + t.expires_in * 1000).toISOString(), status: 'connected' })
      .eq('user_id', userId)
      .eq('marketplace', 'ebay')
    return { token: t.access_token, conn }
  } catch {
    await admin.from('marketplace_connections').update({ status: 'needs_reconnect' }).eq('user_id', userId).eq('marketplace', 'ebay')
    throw new EbayError('Your eBay connection has expired. Connect eBay again.', 'connect')
  }
}

async function signedInUser(req: Request) {
  const jwt = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!jwt) return null
  const { data } = await admin.auth.getUser(jwt)
  return data.user
}

// ---------- listing helpers ----------
type Facts = { brand?: string; dept?: string; size?: string; meas?: string; flaws?: string; noFlaws?: boolean; cond?: string }

/** Listly condition → eBay ConditionEnum. Apparel uses the apparel-only values (eBay condition table, 2026-11). */
function condition(cond: string | undefined, apparel: boolean) {
  switch (cond) {
    case 'New with tags':
      return 'NEW'
    case 'Like new':
      return apparel ? 'PRE_OWNED_EXCELLENT' : 'USED_EXCELLENT'
    case 'Good':
      return apparel ? 'USED_EXCELLENT' : 'USED_GOOD' // apparel "Pre-owned - Good" is USED_EXCELLENT
    case 'Fair':
      return apparel ? 'PRE_OWNED_FAIR' : 'USED_ACCEPTABLE'
    default:
      throw new EbayError('Add the condition before posting.', 'condition')
  }
}

const DEPARTMENT: Record<string, string> = { "Men's": 'Men', "Women's": 'Women', Unisex: 'Unisex Adults' }

async function ensureSetup(token: string, conn: Connection, postalCode?: string) {
  const s = { ...conn.settings }
  const zip = postalCode?.trim() || s.postalCode
  if (!zip || !/^\d{5}(-\d{4})?$/.test(zip)) throw new EbayError('Enter the ZIP code you ship from.', 'postalCode')
  if (s.postalCode !== zip) {
    s.postalCode = zip
    delete s.locationKey
  }
  if (!s.locationKey) {
    // [verify] createInventoryLocation body
    const locationKey = 'listly-default'
    try {
      await call(`/sell/inventory/v1/location/${locationKey}`, token, {
        method: 'POST',
        body: { name: 'Listly', location: { address: { postalCode: zip, country: 'US' } }, locationTypes: ['WAREHOUSE'], merchantLocationStatus: 'ENABLED' },
      })
    } catch (e) {
      if (!(e instanceof EbayError) || e.status !== 409) throw e // already exists is fine
    }
    s.locationKey = locationKey
  }
  if (!s.fulfillmentPolicyId || !s.paymentPolicyId || !s.returnPolicyId) {
    const [f, p, r] = await Promise.all([
      call<{ fulfillmentPolicies?: { fulfillmentPolicyId: string }[] }>('/sell/account/v1/fulfillment_policy?marketplace_id=EBAY_US', token),
      call<{ paymentPolicies?: { paymentPolicyId: string }[] }>('/sell/account/v1/payment_policy?marketplace_id=EBAY_US', token),
      call<{ returnPolicies?: { returnPolicyId: string }[] }>('/sell/account/v1/return_policy?marketplace_id=EBAY_US', token),
    ])
    const fp = f.fulfillmentPolicies?.[0]?.fulfillmentPolicyId
    const pp = p.paymentPolicies?.[0]?.paymentPolicyId
    const rp = r.returnPolicies?.[0]?.returnPolicyId
    if (!fp || !pp || !rp)
      throw new EbayError('eBay needs a shipping, payment and return policy on your account. Set them up once in eBay Seller Hub, then post again.', 'policies')
    Object.assign(s, { fulfillmentPolicyId: fp, paymentPolicyId: pp, returnPolicyId: rp })
  }
  await admin.from('marketplace_connections').update({ settings: s }).eq('user_id', conn.user_id).eq('marketplace', 'ebay')
  return s
}

async function publish(userId: string, body: { itemId: string; title: string; description: string; postalCode?: string }) {
  const { data: item } = await admin.from('items').select('*').eq('id', body.itemId).eq('user_id', userId).maybeSingle()
  if (!item) throw new EbayError('That item isn’t on your account.', undefined, 404)
  if (!item.drafted) throw new EbayError('Draft this item before posting it.', 'draft')
  if (item.price === null) throw new EbayError('Set your price before posting.', 'price')
  if (!item.photo_paths?.length) throw new EbayError('This item’s photos are still uploading. Try again in a moment.', 'photos')
  const title = String(body.title ?? '').slice(0, 80).trim()
  if (!title) throw new EbayError('The listing needs a title.', 'title')

  const { token, conn } = await userToken(userId)
  const s = await ensureSetup(token, conn, body.postalCode)

  // Category from the title (Commerce Taxonomy, EBAY_US tree 0). The seller can change it on eBay afterwards.
  const sug = await call<{ categorySuggestions?: { category: { categoryId: string; categoryName: string }; categoryTreeNodeAncestors?: { categoryName: string }[] }[] }>(
    `/commerce/taxonomy/v1/category_tree/0/get_category_suggestions?q=${encodeURIComponent(title)}`,
    await getAppToken(),
  )
  const top = sug.categorySuggestions?.[0]
  if (!top) throw new EbayError('eBay couldn’t find a category for this title. Add what the item is to the title.', 'title')
  const apparel = (top.categoryTreeNodeAncestors ?? []).some((a) => a.categoryName === 'Clothing, Shoes & Accessories')

  const f = (item.facts ?? {}) as Facts
  const aspects: Record<string, string[]> = { Brand: [f.brand || 'Unbranded'] }
  if (f.size) aspects.Size = [f.size]
  if (f.dept && DEPARTMENT[f.dept]) aspects.Department = [DEPARTMENT[f.dept]]
  if (apparel && f.size) aspects['Size Type'] = ['Regular']

  const { data: signed } = await admin.storage.from('item-photos').createSignedUrls(item.photo_paths, 60 * 60 * 24 * 7)
  const imageUrls = (signed ?? []).map((x) => x.signedUrl).filter(Boolean)

  const sku = item.id as string
  await call(`/sell/inventory/v1/inventory_item/${sku}`, token, {
    method: 'PUT',
    body: {
      availability: { shipToLocationAvailability: { quantity: 1 } },
      condition: condition(f.cond, apparel),
      ...(f.flaws && !f.noFlaws ? { conditionDescription: f.flaws.slice(0, 1000) } : {}),
      product: { title, description: body.description, aspects, imageUrls },
    },
  })

  const offer = {
    sku,
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: 1,
    categoryId: top.category.categoryId,
    listingDescription: body.description,
    listingPolicies: { fulfillmentPolicyId: s.fulfillmentPolicyId, paymentPolicyId: s.paymentPolicyId, returnPolicyId: s.returnPolicyId },
    pricingSummary: { price: { value: Number(item.price).toFixed(2), currency: 'USD' } },
    merchantLocationKey: s.locationKey,
  }
  let offerId: string = item.external?.ebay?.offerId
  if (offerId) await call(`/sell/inventory/v1/offer/${offerId}`, token, { method: 'PUT', body: offer })
  else offerId = (await call<{ offerId: string }>('/sell/inventory/v1/offer', token, { method: 'POST', body: offer })).offerId

  const { listingId } = await call<{ listingId: string }>(`/sell/inventory/v1/offer/${offerId}/publish`, token, { method: 'POST' })
  const url = `${HOST.web}/itm/${listingId}`
  const day = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  await admin
    .from('items')
    .update({
      external: { ...(item.external ?? {}), ebay: { listingId, offerId, url, environment: ENV } },
      listed_on: Array.from(new Set([...(item.listed_on ?? []), 'ebay'])),
      status: item.status === 'sold' ? 'sold' : 'listed',
      history: [...(item.history ?? []), `${day} · Posted to eBay`],
    })
    .eq('id', sku)
  return { listingId, url, category: top.category.categoryName }
}

// ---------- routes ----------
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  const path = new URL(req.url).pathname.replace(/^.*\/ebay/, '') || '/'
  try {
    if (!env('EBAY_CLIENT_ID') || !env('EBAY_CLIENT_SECRET') || !env('EBAY_RUNAME'))
      throw new EbayError('eBay isn’t set up on the server yet (missing eBay keys).', 'setup', 503)

    if (path === '/callback' && req.method === 'GET') {
      const u = new URL(req.url)
      const state = u.searchParams.get('state') ?? ''
      const { data: row } = await admin.from('oauth_states').select('*').eq('state', state).maybeSingle()
      if (row) await admin.from('oauth_states').delete().eq('state', state)
      if (!row || Date.now() - new Date(row.created_at).getTime() > 15 * 60_000) return new Response('This eBay sign-in link has expired. Go back to Listly and try again.', { status: 400 })
      const back = (result: string) => Response.redirect(`${row.redirect_to}${row.redirect_to.includes('?') ? '&' : '?'}ebay=${result}`, 302)
      const code = u.searchParams.get('code')
      if (!code) return back('cancelled')
      const t = await tokenCall({ grant_type: 'authorization_code', code, redirect_uri: env('EBAY_RUNAME') })
      await admin.from('marketplace_connections').upsert({
        user_id: row.user_id,
        marketplace: 'ebay',
        status: 'connected',
        environment: ENV,
        access_token_enc: await encrypt(t.access_token),
        refresh_token_enc: await encrypt(t.refresh_token ?? ''),
        access_expires_at: new Date(Date.now() + t.expires_in * 1000).toISOString(),
        refresh_expires_at: t.refresh_token_expires_in ? new Date(Date.now() + t.refresh_token_expires_in * 1000).toISOString() : null,
        settings: {},
      })
      // Business policies let the Inventory API reference shipping, payment and return policies. [verify]
      await call('/sell/account/v1/program/opt_in', t.access_token, { method: 'POST', body: { programType: 'SELLING_POLICY_MANAGEMENT' } }).catch(() => {})
      return back('connected')
    }

    const user = await signedInUser(req)
    if (!user) return json({ ok: false, error: 'Sign in to Listly first.' }, 401)
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}

    if (path === '/start' && req.method === 'POST') {
      const redirectTo = String(body.redirectTo ?? '')
      if (!/^(listly|exp|exps):\/\//.test(redirectTo)) return json({ ok: false, error: 'Bad return address.' }, 400)
      const state = crypto.randomUUID()
      await admin.from('oauth_states').insert({ state, user_id: user.id, marketplace: 'ebay', redirect_to: redirectTo })
      const url =
        `${HOST.auth}/oauth2/authorize?client_id=${encodeURIComponent(env('EBAY_CLIENT_ID'))}` +
        `&redirect_uri=${encodeURIComponent(env('EBAY_RUNAME'))}&response_type=code` +
        `&scope=${encodeURIComponent(SCOPES)}&state=${state}`
      return json({ ok: true, url, environment: ENV })
    }
    if (path === '/publish' && req.method === 'POST') return json({ ok: true, ...(await publish(user.id, body)) })
    if (path === '/disconnect' && req.method === 'POST') {
      await admin.from('marketplace_connections').delete().eq('user_id', user.id).eq('marketplace', 'ebay')
      return json({ ok: true })
    }
    return json({ ok: false, error: 'Not found.' }, 404)
  } catch (e) {
    if (e instanceof EbayError) return json({ ok: false, error: e.message, needs: e.needs }, e.status >= 500 ? e.status : 200)
    console.error(e)
    return json({ ok: false, error: 'Something went wrong talking to eBay. Try again.' }, 500)
  }
})
