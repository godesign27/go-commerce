import type { Item } from './model'

/** The listings as they were just before a sale was recorded, so the checklist can offer "Undo sale" (D-10). */
let saleBefore: Item[] | null = null
export const setSaleBefore = (items: Item[] | null) => {
  saleBefore = items
}
export const getSaleBefore = () => saleBefore
