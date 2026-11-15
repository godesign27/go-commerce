// STAND-INS for the server-side AI gateway (S-39, P-01 to P-03), which isn't built yet.
// Each function marks where the real call goes. None of them invents a fact the seller didn't give:
// drafts are built only from the seller's answers (R-6, R-10, "facts before fluency").

import type { Facts, Item, MarketId } from './model'
import { MARKETS } from './model'

/** P-01 photo grouping. Stand-in: the seller's "Next item" marks split the photos; without marks, groups of 3. */
export function groupPhotos(photos: string[], marks: number[]): string[][] {
  if (!photos.length) return []
  const cuts = [...new Set(marks.filter((m) => m > 0 && m < photos.length))].sort((a, b) => a - b)
  if (cuts.length) {
    const out: string[][] = []
    let start = 0
    for (const c of [...cuts, photos.length]) {
      if (c > start) out.push(photos.slice(start, c))
      start = c
    }
    return out
  }
  const out: string[][] = []
  for (let i = 0; i < photos.length; i += 3) out.push(photos.slice(i, i + 3))
  return out
}

/** What the AI would say each item is, from its photos. Stand-in names, synthetic. */
const NAMES = ['Denim trucker jacket', 'Band tee', 'Leather crossbody bag', 'Wool scarf', 'Table lamp', 'Knit cardigan', 'Ankle boots', 'Corduroy jacket']
export const nameFor = (i: number) => NAMES[i % NAMES.length]

/** P-02 voice extraction. Stand-in: a synthetic spoken answer per item, since there's no speech recognition yet. */
const HEARD: Omit<Facts, 'bin' | 'source'>[] = [
  { brand: "Levi's", dept: "Men's", size: 'M', meas: 'Pit to pit 21 in, length 25 in', flaws: 'Small mark on the left cuff', noFlaws: false, cond: 'Good', heard: "Levi's, men's medium, pit to pit twenty-one, length twenty-five. Small mark on the left cuff. Good condition." },
  { brand: 'Gildan', dept: 'Unisex', size: 'L', meas: 'Pit to pit 22 in', flaws: '', noFlaws: true, cond: 'Like new', heard: 'Gildan, unisex large, pit to pit twenty-two. No flaws. Like new.' },
  { brand: 'Coach', dept: "Women's", size: 'One size', meas: '9 by 6 in, strap 22 in drop', flaws: 'Light wear on the corners', noFlaws: false, cond: 'Good', heard: 'Coach, women\'s, nine by six, twenty-two inch drop. Light wear on the corners. Good.' },
  { brand: '', dept: '', size: '', meas: '70 by 12 in', flaws: '', noFlaws: false, cond: '', heard: 'Seventy by twelve.' },
  { brand: 'IKEA', dept: '', size: '', meas: '18 in tall', flaws: 'Shade has a small dent', noFlaws: false, cond: 'Good', heard: 'IKEA, eighteen inches tall. Shade has a small dent. Good.' },
]
export const heardFor = (i: number) => HEARD[i % HEARD.length]

export type DraftField = { key: string; label: string; value: string | null; limit?: number }

/** P-03 drafting. Stand-in template; production drafts come from the model, then pass the S-14 checks. */
export function draftFor(item: Item, market: MarketId): DraftField[] {
  const f = item.facts
  const limit = MARKETS.find((m) => m.id === market)?.titleLimit ?? 80
  const title = [f.brand, f.dept && f.dept !== 'Unisex' ? f.dept : '', item.name, f.size && f.size !== 'One size' ? `Size ${f.size}` : '']
    .filter(Boolean)
    .join(' ')
  const lines = [
    `${item.name}${f.brand ? ` by ${f.brand}` : ''}.`,
    f.cond ? `Condition: ${f.cond.toLowerCase()}.` : '',
    f.noFlaws ? 'No flaws noted.' : f.flaws ? `Flaws: ${f.flaws}.` : '',
    f.meas ? `Measurements: ${f.meas}.` : '',
  ].filter(Boolean)
  return [
    { key: 'title', label: 'Title', value: title, limit },
    { key: 'description', label: 'Description', value: lines.join('\n') },
    { key: 'brand', label: 'Brand', value: f.brand || null },
    { key: 'size', label: 'Size', value: f.size || (f.meas ? 'See measurements' : null) },
    { key: 'dept', label: 'Department', value: f.dept || null },
    { key: 'condition', label: 'Condition', value: f.cond || null },
  ]
}
