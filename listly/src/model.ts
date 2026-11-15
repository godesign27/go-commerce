// Domain types and fixed data for Listly MVP 1 (PRD v8, design doc DD-01 to DD-43).

export type Perm = 'unasked' | 'granted' | 'denied'
export type MarketId = 'ebay' | 'poshmark' | 'mercari' | 'depop' | 'facebook'
export type Plan = 'reseller' | 'pass' | null

export const MARKETS: { id: MarketId; name: string; short: string; titleLimit: number }[] = [
  { id: 'ebay', name: 'eBay', short: 'eBay', titleLimit: 80 },
  { id: 'poshmark', name: 'Poshmark', short: 'Poshmark', titleLimit: 80 },
  { id: 'mercari', name: 'Mercari', short: 'Mercari', titleLimit: 80 },
  { id: 'depop', name: 'Depop', short: 'Depop', titleLimit: 64 },
  { id: 'facebook', name: 'Facebook Marketplace', short: 'Facebook', titleLimit: 100 },
] // title limits are placeholders until Q-04 is answered [H]

export const marketName = (id: MarketId) => MARKETS.find((m) => m.id === id)?.name ?? id

export const DEPARTMENTS = ["Men's", "Women's", 'Unisex'] as const
export const CONDITIONS = ['New with tags', 'Like new', 'Good', 'Fair'] as const

export type Facts = {
  brand: string
  dept: string
  size: string
  meas: string
  flaws: string
  noFlaws: boolean
  cond: string
  bin: string
  /** How the facts arrived. Listly only ever uses what the seller said or typed (R-6, R-10). */
  source: 'none' | 'voice' | 'typed'
  heard?: string
}

export type Item = {
  id: string
  photos: string[]
  /** What the item is. In production this comes from the AI's look at the photos; here it's a stand-in (see ai.ts). */
  name: string
  facts: Facts
  drafted: boolean
  price: string
  /** `${market}|${field}` → copied, so the seller can see their progress. */
  copied: Record<string, boolean>
  listedOn: MarketId[]
}

export const emptyFacts = (bin: string): Facts => ({
  brand: '',
  dept: '',
  size: '',
  meas: '',
  flaws: '',
  noFlaws: false,
  cond: '',
  bin,
  source: 'none',
})

/** Flaws (listed, or "no flaws") and condition are the two required answers (DD-04). */
export const factsComplete = (f: Facts) => (f.noFlaws || f.flaws.trim().length > 0) && f.cond.length > 0
