import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { randomUUID } from 'expo-crypto'
import { groupPhotos, nameFor } from './ai'
import { emptyFacts, today, type Item, type MarketId, type Perm, type Plan } from './model'

type Account = { method: 'apple' | 'google' | 'email'; email: string } | null

export type Haul = {
  photos: string[]
  /** Indices where the seller tapped "Next item" (a hint for grouping). */
  marks: number[]
  items: Item[]
  factIdx: number
}

export type AppState = {
  onboarded: boolean
  account: Account
  markets: MarketId[] // empty = all five (R-33 "Skip — draft for all five")
  cam: Perm
  mic: Perm
  freeLeft: number
  plan: Plan
  haul: Haul | null
  listings: Item[]
  shipBy: 'buyer' | 'me' | 'free'
  defaultBin: string
  setupDismissed: boolean
  defaultsSet: boolean
  linkedShops: number
  keepUndo: boolean
  welcomePlan: Plan
  /** Supabase user id when signed in; null = on-device only. */
  userId: string | null
  /** The AI notice was acknowledged on this account (S-03 c5). */
  noticeAt: string | null
  /** The saved session has been checked at launch. */
  booted: boolean
}

const initial: AppState = {
  onboarded: false,
  account: null,
  markets: [],
  cam: 'unasked',
  mic: 'unasked',
  freeLeft: 3,
  plan: null,
  haul: null,
  listings: [],
  shipBy: 'buyer',
  defaultBin: 'B1',
  setupDismissed: false,
  defaultsSet: false,
  linkedShops: 0,
  keepUndo: false,
  welcomePlan: null,
  userId: null,
  noticeAt: null,
  booted: false,
}

type Store = {
  s: AppState
  set: (patch: Partial<AppState>) => void
  startHaul: () => void
  addPhotos: (uris: string[]) => void
  markNextItem: () => void
  group: () => void
  setItems: (items: Item[]) => void
  updateItem: (id: string, patch: Partial<Item> | ((it: Item) => Partial<Item>)) => void
  /** Drafts the next items the plan allows (trial: the first 3 drafted, D-1). Returns how many were drafted. */
  draftAllowed: () => number
  finishHaul: () => void
  buy: (plan: Exclude<Plan, null>) => void
  reset: () => void
  updateListing: (id: string, patch: Partial<Item> | ((it: Item) => Partial<Item>)) => void
  /** Replaces every listing at once. Undo uses it to restore a snapshot. */
  setListings: (items: Item[]) => void
  deleteListing: (id: string) => void
  /** Prototype only: synthetic listings so the sold flow can be tried without photographing a haul. */
  loadSamples: () => void
  /** Marks the given haul items drafted (the server decides which, via draft_items). */
  markDrafted: (ids: string[], freeLeft?: number) => void
}

const Ctx = createContext<Store | null>(null)

/** Synthetic sample listings (no real people or photos), for trying Listings, Mark sold, the checklist and Profit. */
function sampleListings(): Item[] {
  const base = (name: string, brand: string, size: string, cond: string, price: string, listedOn: MarketId[], cost: number | null, days: number): Item => ({
    id: randomUUID(),
    photos: [],
    name,
    facts: { ...emptyFacts('B2'), brand, size, cond, noFlaws: true, source: 'typed' },
    drafted: true,
    price,
    copied: {},
    listedOn,
    status: 'listed',
    removed: [],
    cost,
    history: [`${days} days ago · Drafted`, `${days} days ago · Listed on ${listedOn.length} marketplaces`],
  })
  const sold = base('Corduroy jacket', 'Carhartt', 'L', 'Good', '58', ['poshmark', 'ebay', 'mercari'], 12, 9)
  sold.status = 'sold'
  sold.sale = { on: 'mercari', price: 55, ship: { by: 'buyer', amt: 0 }, date: 'Nov 12' }
  sold.removed = ['poshmark', 'ebay']
  sold.history.push('Nov 12 · Sold on Mercari for $55.00', 'Nov 12 · Removed from Poshmark and eBay')
  return [
    base('Denim trucker jacket', "Levi's", 'M', 'Good', '48', ['poshmark', 'ebay', 'mercari'], 9, 6),
    base('Leather crossbody bag', 'Coach', 'One size', 'Good', '65', ['poshmark', 'ebay'], null, 12),
    base('Band tee', 'Gildan', 'L', 'Like new', '22', ['depop', 'mercari'], 3, 34),
    sold,
  ]
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(initial)
  const set = useCallback((patch: Partial<AppState>) => setS((p) => ({ ...p, ...patch })), [])
  const patchHaul = useCallback((fn: (h: Haul) => Haul) => setS((p) => (p.haul ? { ...p, haul: fn(p.haul) } : p)), [])

  const store = useMemo<Store>(
    () => ({
      s,
      set,
      startHaul: () => setS((p) => ({ ...p, haul: { photos: [], marks: [], items: [], factIdx: 0 } })),
      addPhotos: (uris) => patchHaul((h) => ({ ...h, photos: [...h.photos, ...uris] })),
      markNextItem: () => patchHaul((h) => ({ ...h, marks: h.photos.length ? [...h.marks, h.photos.length] : h.marks })),
      group: () =>
        setS((p) => {
          if (!p.haul) return p
          const items: Item[] = groupPhotos(p.haul.photos, p.haul.marks).map((photos, i) => ({
            id: randomUUID(),
            photos,
            name: nameFor(p.listings.length + i),
            facts: emptyFacts(p.defaultBin),
            drafted: false,
            price: '',
            copied: {},
            listedOn: [],
            status: 'ready',
            removed: [],
            cost: null,
            history: [],
          }))
          return { ...p, haul: { ...p.haul, items, factIdx: 0 } }
        }),
      setItems: (items) => patchHaul((h) => ({ ...h, items })),
      updateItem: (id, patch) =>
        patchHaul((h) => ({
          ...h,
          items: h.items.map((it) => (it.id === id ? { ...it, ...(typeof patch === 'function' ? patch(it) : patch) } : it)),
        })),
      draftAllowed: () => {
        // Worked out from the current state so the caller gets the count straight away.
        if (!s.haul) return 0
        let budget = s.plan ? Infinity : s.freeLeft
        let n = 0
        const items = s.haul.items.map((it) => {
          if (it.drafted || budget <= 0) return it
          budget--
          n++
          return { ...it, drafted: true }
        })
        setS((p) => ({ ...p, haul: p.haul ? { ...p.haul, items } : p.haul, freeLeft: p.plan ? p.freeLeft : Math.max(0, p.freeLeft - n) }))
        return n
      },
      finishHaul: () =>
        setS((p) => ({
          ...p,
          listings: p.haul
            ? [
                // Undrafted items stay saved and locked, ready to draft when a plan is picked (R-2).
                ...p.haul.items.map((i) => ({
                  ...i,
                  status: i.listedOn.length ? ('listed' as const) : ('ready' as const),
                  history: [...i.history, `${today()} · ${i.drafted ? 'Drafted' : 'Saved, waiting for a plan'}`],
                })),
                ...p.listings,
              ]
            : p.listings,
          haul: null,
        })),
      buy: (plan) => setS((p) => ({ ...p, plan, welcomePlan: plan })),
      reset: () => setS({ ...initial, booted: true }),
      updateListing: (id, patch) =>
        setS((p) => ({ ...p, listings: p.listings.map((it) => (it.id === id ? { ...it, ...(typeof patch === 'function' ? patch(it) : patch) } : it)) })),
      setListings: (items) => setS((p) => ({ ...p, listings: items })),
      deleteListing: (id) => setS((p) => ({ ...p, listings: p.listings.filter((it) => it.id !== id) })),
      loadSamples: () => setS((p) => ({ ...p, listings: [...sampleListings(), ...p.listings] })),
      markDrafted: (ids, freeLeft) =>
        setS((p) => ({
          ...p,
          freeLeft: freeLeft ?? p.freeLeft,
          haul: p.haul ? { ...p.haul, items: p.haul.items.map((it) => (ids.includes(it.id) ? { ...it, drafted: true } : it)) } : p.haul,
        })),
    }),
    [s, set, patchHaul],
  )
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside StoreProvider')
  return v
}
