import { backendConfigured, supabase } from '@/lib/supabase'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import type { Item, MarketId } from './model'

/**
 * How Listly gets a listing onto each marketplace (DD-46).
 * api: Listly posts through the marketplace's official API with a token the seller authorizes.
 * extension: the Listly Safari extension fills the marketplace's own sell page; the seller taps Post. (Next stage.)
 */
export const POSTING: Record<MarketId, { mode: 'api' | 'extension'; sellUrl: string; note: string }> = {
  ebay: { mode: 'api', sellUrl: 'https://www.ebay.com/sl/sell', note: 'Posts directly through eBay’s official API.' },
  depop: { mode: 'api', sellUrl: 'https://www.depop.com/products/create/', note: 'Direct posting once Depop approves Listly as a partner.' },
  poshmark: { mode: 'extension', sellUrl: 'https://poshmark.com/create-listing', note: 'Fills Poshmark’s own sell page in Safari. You tap List.' },
  mercari: { mode: 'extension', sellUrl: 'https://www.mercari.com/sell/', note: 'Fills Mercari’s own sell page in Safari. You tap List.' },
  facebook: { mode: 'extension', sellUrl: 'https://www.facebook.com/marketplace/create/item', note: 'Fills Facebook’s own sell page in Safari. You tap Publish.' },
}

export type EbayConnection = { status: 'connected' | 'needs_reconnect'; account: string | null; environment: 'sandbox' | 'production' } | null

export async function fetchEbayConnection(): Promise<EbayConnection> {
  if (!backendConfigured) return null
  const { data } = await supabase.from('marketplace_connections').select('status, account_name, environment').eq('marketplace', 'ebay').maybeSingle()
  return data ? { status: data.status, account: data.account_name, environment: data.environment } : null
}

type Result = { ok: true } | { ok: false; error: string; needs?: string }

async function fn<T>(route: string, body: Record<string, unknown>): Promise<(T & { ok: true }) | { ok: false; error: string; needs?: string }> {
  const { data, error } = await supabase.functions.invoke(`ebay/${route}`, { body })
  if (error) {
    // Non-2xx: read the server's own message when there is one.
    const ctx = (error as { context?: Response }).context
    const parsed = ctx ? await ctx.json().catch(() => null) : null
    return { ok: false, error: parsed?.error ?? 'Couldn’t reach Listly’s server. Check your connection and try again.', needs: parsed?.needs }
  }
  return data
}

/** Opens eBay's own sign-in in a secure browser sheet. Listly never sees the eBay password. */
export async function connectEbay(): Promise<Result> {
  const redirectTo = Linking.createURL('connections')
  const start = await fn<{ url: string }>('start', { redirectTo })
  if (!start.ok) return start
  const res = await WebBrowser.openAuthSessionAsync(start.url, redirectTo)
  if (res.type !== 'success') return { ok: false, error: 'eBay sign-in was cancelled. Nothing changed.', needs: 'cancelled' }
  const outcome = new URL(res.url).searchParams.get('ebay')
  if (outcome === 'connected') return { ok: true }
  return { ok: false, error: outcome === 'cancelled' ? 'eBay sign-in was cancelled. Nothing changed.' : 'The eBay connection didn’t finish. Try again.' }
}

export async function disconnectEbay(): Promise<Result> {
  return fn('disconnect', {})
}

export async function postToEbay(item: Item, title: string, description: string, postalCode?: string) {
  return fn<{ listingId: string; url: string; category: string }>('publish', { itemId: item.id, title, description, postalCode })
}

// ---------- Safari extension hand-off (DD-46) ----------

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
/** UTF-8 → base64url, without relying on btoa or Buffer. */
function base64url(text: string) {
  const bytes = new TextEncoder().encode(text)
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63]
    if (i + 1 < bytes.length) out += B64[(n >> 6) & 63]
    if (i + 2 < bytes.length) out += B64[n & 63]
  }
  return out
}

/**
 * Opens the marketplace's own sell page in Safari with the listing after "#listly=". The part after "#" never
 * reaches the marketplace's servers, and the Listly extension removes it from the address bar once read.
 * Photos travel as short-lived private links (30 minutes) to the seller's own folder.
 */
export async function fillOnMarketplace(mkt: MarketId, item: Item, fields: { key: string; value: string | null }[]) {
  let photos: string[] = []
  if (backendConfigured && item.photoPaths?.length) {
    const { data } = await supabase.storage.from('item-photos').createSignedUrls(item.photoPaths, 30 * 60)
    photos = (data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]
  }
  const get = (k: string) => fields.find((f) => f.key === k)?.value ?? ''
  const payload = {
    v: 1,
    title: get('title'),
    description: get('description'),
    price: item.price,
    brand: item.facts.brand,
    size: item.facts.size,
    condition: item.facts.cond,
    photos,
  }
  const url = `${POSTING[mkt].sellUrl}#listly=${base64url(JSON.stringify(payload))}`
  // Prefer Safari explicitly, so an installed marketplace app doesn't intercept the link. [verify on device]
  try {
    await Linking.openURL(`x-safari-${url}`)
  } catch {
    await Linking.openURL(url)
  }
  return { photos: photos.length }
}

/** Everything a seller pastes, in one block: title, description, price. */
export const wholeListing = (fields: { label: string; value: string | null }[], price: string) =>
  [
    ...fields.filter((f) => f.value).map((f) => (f.label === 'Title' || f.label === 'Description' ? f.value : `${f.label}: ${f.value}`)),
    price ? `Price: $${price}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
