import { backendConfigured, supabase } from '@/lib/supabase'
import { useEffect, useRef } from 'react'
import type { Item, MarketId, Plan } from './model'
import { useStore, type AppState } from './store'

/** Version of the AI processing notice the seller agrees to (S-03 NFR: a changed notice is shown again). */
export const NOTICE_VERSION = 1

type ItemRow = {
  id: string
  name: string
  facts: Item['facts']
  drafted: boolean
  price: number | null
  status: Item['status']
  listed_on: string[]
  removed: string[]
  cost: number | null
  sale: Item['sale'] | null
  history: string[]
  photo_paths: string[]
}

/** The columns the app may write (drafted and user_id are server-owned). */
const toRow = (it: Item) => ({
  id: it.id,
  name: it.name,
  facts: it.facts,
  price: it.price ? Number(it.price) : null,
  status: it.status,
  listed_on: it.listedOn,
  removed: it.removed,
  cost: it.cost,
  sale: it.sale ?? null,
  history: it.history,
  photo_paths: it.photoPaths ?? [],
})

const fromRow = (r: ItemRow, urls: Record<string, string>): Item => ({
  id: r.id,
  name: r.name,
  facts: r.facts,
  drafted: r.drafted,
  price: r.price === null ? '' : String(r.price),
  copied: {},
  listedOn: r.listed_on as MarketId[],
  status: r.status,
  sale: r.sale ?? undefined,
  removed: r.removed as MarketId[],
  cost: r.cost === null ? null : Number(r.cost),
  history: r.history ?? [],
  photoPaths: r.photo_paths,
  photos: r.photo_paths.map((p) => urls[p]).filter(Boolean),
})

type ProfileRow = {
  plan: Plan
  plan_ends_at: string | null
  free_left: number
  markets: string[]
  ship_by: AppState['shipBy']
  default_bin: string
  keep_undo: boolean
  ai_notice_at: string | null
  ai_notice_version: number | null
}

const profilePatch = (p: ProfileRow): Partial<AppState> => ({
  plan: p.plan && (!p.plan_ends_at || new Date(p.plan_ends_at) > new Date()) ? p.plan : null,
  freeLeft: p.free_left,
  markets: p.markets as MarketId[],
  shipBy: p.ship_by,
  defaultBin: p.default_bin,
  keepUndo: p.keep_undo,
  noticeAt: p.ai_notice_version === NOTICE_VERSION ? p.ai_notice_at : null,
})

export async function fetchProfile() {
  const { data } = await supabase.from('profiles').select('*').single<ProfileRow>()
  return data ? profilePatch(data) : null
}

async function fetchItems(): Promise<Item[]> {
  const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false })
  if (error || !data) return []
  const rows = data as ItemRow[]
  const paths = rows.flatMap((r) => r.photo_paths)
  const urls: Record<string, string> = {}
  if (paths.length) {
    const { data: signed } = await supabase.storage.from('item-photos').createSignedUrls(paths, 60 * 60)
    signed?.forEach((s) => s.path && s.signedUrl && (urls[s.path] = s.signedUrl))
  }
  return rows.map((r) => fromRow(r, urls))
}

/** Saves items, drafts what the plan allows on the server, and returns the drafted ids and the new trial count. */
export async function serverDraft(items: Item[]): Promise<{ ids: string[]; freeLeft: number } | null> {
  if (!backendConfigured) return null
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return null
  const { error } = await supabase.from('items').upsert(items.map(toRow))
  if (error) throw error
  const { data, error: e2 } = await supabase.rpc('draft_items', { item_ids: items.filter((i) => !i.drafted).map((i) => i.id) })
  if (e2) throw e2
  const profile = await fetchProfile()
  return { ids: (data as string[]) ?? [], freeLeft: profile?.freeLeft ?? 0 }
}

/** PROTOTYPE stand-in for a verified store purchase (R-3). See the prototype_start_plan migration. */
export async function serverStartPlan(plan: 'reseller' | 'pass') {
  const { data: session } = await supabase.auth.getSession()
  if (!backendConfigured || !session.session) return
  await supabase.rpc('prototype_start_plan', { plan_name: plan })
}

/** Uploads an item's photos to the seller's private folder and returns their storage paths. */
export async function uploadPhotos(userId: string, item: Item): Promise<string[]> {
  const paths: string[] = []
  for (const [n, uri] of item.photos.entries()) {
    if (!uri.startsWith('file:') && !uri.startsWith('ph:') && !uri.startsWith('/')) continue
    const path = `${userId}/${item.id}/${n + 1}.jpg`
    const body = await (await fetch(uri)).arrayBuffer()
    const { error } = await supabase.storage.from('item-photos').upload(path, body, { contentType: 'image/jpeg', upsert: true })
    if (!error) paths.push(path)
  }
  return paths
}

export async function signOutEverywhere() {
  if (backendConfigured) await supabase.auth.signOut()
}

/**
 * Keeps the store and Supabase in step: restores the session at launch, loads the seller's profile and items,
 * and saves each change to listings and settings as it happens.
 */
export function useBackend() {
  const { s, set } = useStore()
  const synced = useRef<Map<string, string>>(new Map())
  const settings = useRef('')

  // Session: restore on launch, follow sign-in and sign-out.
  useEffect(() => {
    if (!backendConfigured) return set({ booted: true })
    const load = async (userId: string | null, email?: string) => {
      if (!userId) return set({ userId: null, booted: true })
      const [profile, items] = await Promise.all([fetchProfile(), fetchItems()])
      synced.current = new Map(items.map((i) => [i.id, JSON.stringify(toRow(i))]))
      settings.current = ''
      set({
        userId,
        account: { method: 'email', email: email ?? '' },
        listings: items,
        onboarded: !!profile?.noticeAt,
        ...(profile ?? {}),
        booted: true,
      })
    }
    supabase.auth.getSession().then(({ data }) => load(data.session?.user.id ?? null, data.session?.user.email))
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') load(session?.user.id ?? null, session?.user.email)
      if (event === 'SIGNED_OUT') set({ userId: null })
    })
    return () => data.subscription.unsubscribe()
  }, [set])

  // Listings: upsert what changed, delete what's gone.
  useEffect(() => {
    if (!s.userId) return
    const changed = s.listings.filter((i) => synced.current.get(i.id) !== JSON.stringify(toRow(i)))
    const gone = [...synced.current.keys()].filter((id) => !s.listings.some((i) => i.id === id))
    if (!changed.length && !gone.length) return
    const t = setTimeout(async () => {
      if (changed.length) {
        const { error } = await supabase.from('items').upsert(changed.map(toRow))
        if (!error) changed.forEach((i) => synced.current.set(i.id, JSON.stringify(toRow(i))))
      }
      if (gone.length) {
        const { error } = await supabase.from('items').delete().in('id', gone)
        if (!error) gone.forEach((id) => synced.current.delete(id))
      }
    }, 400)
    return () => clearTimeout(t)
  }, [s.listings, s.userId])

  // Settings the seller can change.
  useEffect(() => {
    if (!s.userId) return
    const next = JSON.stringify({ markets: s.markets, ship_by: s.shipBy, default_bin: s.defaultBin, keep_undo: s.keepUndo })
    if (!settings.current) {
      settings.current = next
      return
    }
    if (next === settings.current) return
    const t = setTimeout(async () => {
      const { error } = await supabase.from('profiles').update(JSON.parse(next)).eq('id', s.userId!)
      if (!error) settings.current = next
    }, 400)
    return () => clearTimeout(t)
  }, [s.userId, s.markets, s.shipBy, s.defaultBin, s.keepUndo])
}

/** Records that the seller agreed to the AI processing notice, with its version (S-03 c5, NFR). */
export async function acknowledgeNotice(userId: string | null) {
  if (!backendConfigured || !userId) return
  await supabase.from('profiles').update({ ai_notice_version: NOTICE_VERSION, ai_notice_at: new Date().toISOString() }).eq('id', userId)
}
