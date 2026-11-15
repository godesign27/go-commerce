import type { Item, MarketId } from './model'

/**
 * Marketplace fee ESTIMATES. Placeholder rates until Q-04 is answered [H — eng lead]: the real table comes from
 * the server and is checked against each marketplace's published rates. Always shown as an estimate.
 */
const RATE: Record<MarketId, (price: number) => number> = {
  ebay: (p) => p * 0.1325 + 0.4,
  poshmark: (p) => (p < 15 ? 2.95 : p * 0.2),
  mercari: (p) => p * 0.1 + 0.5,
  depop: (p) => p * 0.033 + 0.45,
  facebook: (p) => Math.max(0.4, p * 0.05),
}

export const feeFor = (m: MarketId, price: number) => Math.round(RATE[m](price) * 100) / 100

export type Breakdown = {
  sale: number
  fee: number
  /** Shipping the seller paid. null = not entered. */
  ship: number | null
  /** What the seller paid for the item. null = not entered. */
  cost: number | null
  net: number
  /** True when shipping or cost is missing: the net counts them as $0 and must say so. */
  estimate: boolean
}

export function breakdown(it: Item): Breakdown | null {
  if (!it.sale) return null
  const { price, on, ship } = it.sale
  const fee = feeFor(on, price)
  const shipPaid = !ship ? null : ship.by === 'buyer' ? 0 : ship.amt
  const net = price - fee - (shipPaid ?? 0) - (it.cost ?? 0)
  return { sale: price, fee, ship: shipPaid, cost: it.cost, net: Math.round(net * 100) / 100, estimate: shipPaid === null || it.cost === null }
}

export const money = (n: number) => `${n < 0 ? '-' : ''}$${Math.abs(n).toFixed(2)}`
