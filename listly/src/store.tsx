import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { groupPhotos, nameFor } from './ai'
import { emptyFacts, type Item, type MarketId, type Perm, type Plan } from './model'

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
}

const Ctx = createContext<Store | null>(null)
let seq = 0

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
            id: `it${++seq}`,
            photos,
            name: nameFor(p.listings.length + i),
            facts: emptyFacts(p.defaultBin),
            drafted: false,
            price: '',
            copied: {},
            listedOn: [],
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
          listings: p.haul ? [...p.haul.items.filter((i) => i.drafted), ...p.listings] : p.listings,
          haul: null,
        })),
      buy: (plan) => setS((p) => ({ ...p, plan, welcomePlan: plan })),
      reset: () => setS(initial),
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
