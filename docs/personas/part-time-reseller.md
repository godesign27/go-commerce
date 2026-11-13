# Persona: Dre, the Part-Time Reseller

> **Status:** Proto-persona (hypothesis). Built from the Listly PRD v0.2 and secondary market research, not from interviews with sellers. Validate it before treating it as fact. See "Research gaps" at the end.
>
> **App:** Listly, "Reseller" mode (later also SellerStudio)
> **Role in the product:** The paying core. Uses the app weekly or daily, feels the double-sale pain, and already pays for tools.

---

## Snapshot

**Andre "Dre" Coleman, 36**: logistics supervisor by day, sells vintage clothing and one-off finds on four marketplaces in the evenings and on weekends. Resale brings in a meaningful second income.

*Photo description:* In a converted spare room lined with garment racks and labeled plastic bins, a ring light on a tripod, a thrift haul in a laundry basket at his feet, phone in hand.

> "Finding the stuff is the fun part. Listing it four times and remembering where it's posted is the part that's killing me."

## Demographics and context

| | |
|---|---|
| **Age range** | 25–55 |
| **Occupation** | Full-time job; reselling is a side business he takes seriously (some do it full time) |
| **Tech comfort** | Moderate to high. Pragmatic: adopts tools that save time and drops ones that don't |
| **Devices** | Phone for sourcing, photos and quick edits. Sometimes a laptop for bulk work and spreadsheets |
| **Marketplaces** | 2–4 of: eBay, Poshmark, Mercari, Depop, Etsy (vintage), Facebook Marketplace |
| **Volume** | Lists 10–50 items a week; 100–500+ active items, nearly all quantity 1 |
| **Motivation** | Extra income, the thrill of the find, building something of his own |

## Behavioral variables

| Variable | Dre (Part-Time Reseller) | Closet Clearer |
|---|---|---|
| Listing frequency | Weekly or daily | Bursts, a few times a year |
| Active inventory | 100–500+ | < 15 |
| Marketplaces used | 2–4 (crosslists) | 1 |
| Item sourcing | Buys to resell (thrift, estate sales, bins) | Own closet |
| Time per listing tolerated | Wants it short, but invests in accuracy | < 2 minutes or quits |
| Selling is... | A business | A chore |
| Willingness to pay | Already pays about $15–50/mo for tools | Low |

## Goals

**End goals (what he wants done)**
- Turn each sourcing haul into live listings on every marketplace he uses, fast.
- **Never sell the same item twice**, and pull it everywhere else as soon as it sells.
- Know what's listed where, at what price, and how long it's been sitting.
- Find the physical item quickly when it sells.

**Experience goals (how he wants it to feel)**
- In control. One place that tells him the truth about his inventory.
- Fast and repetitive in a good way: a rhythm he can get into on a Tuesday night.

**Life goals (why it matters)**
- Reliable extra income; maybe one day reselling full time. Pride in a well-run shop with good ratings.

## Frustrations

- **Double sales.** An item sells on Poshmark while it's still live on eBay and Mercari; a second buyer pays, and he has to cancel, which hurts his seller rating and costs him in fees and goodwill.
- **Re-entering the same item 2–4 times.** Each marketplace wants different fields, categories, title lengths and photo sizes.
- **Not knowing where things are listed.** He uses a spreadsheet he keeps falling behind on.
- **Crosslisting tools that are desktop-heavy, expensive or fragile.** Browser extensions break when marketplaces change their websites.
- **Measuring and describing condition accurately** for every unique item, the thing that prevents returns.
- **Losing items on the shelf.** He sold it and now can't find which bin it's in.
- **Stale inventory.** Items that sat for 90 days and need repricing or relisting.

## Current behavior

1. Sources at thrift stores and estate sales; checks prices on his phone while shopping.
2. Batch-photographs the haul at home, measures and notes flaws.
3. Lists on his main marketplace first (often eBay or Poshmark), then copies to the others, by hand or with a crosslisting tool.
4. Tracks items in a spreadsheet or the crosslister's dashboard; bins are labeled by number.
5. When a sale notification email or push arrives, he rushes to delist elsewhere, sometimes hours later.
6. Packs and ships daily or every other day.

**Workarounds today:** Vendoo, List Perfectly or Crosslist (about $15–100/mo); spreadsheets; sticky notes on bins; marketplace auto-fill features; eBay's AI listing tool.

## Scenario: Tuesday after work

Dre gets home with a basket of eleven items from the bins: a 90s band tee, two pairs of vintage Levi's, a leather bag and some odds and ends. After dinner he opens Listly, in Reseller mode.

He photographs the band tee. Listly asks for the facts it can't verify (tag size, pit-to-pit and length measurements, any flaws) and he answers by voice. Listly drafts copy for eBay, Poshmark and Mercari, each formatted for that marketplace with the right title length and fields, in the no-nonsense voice he set up in his brand profile. He copies the eBay version, posts it, pastes the listing link back into Listly, and repeats for the other two. Listly assigns the item to bin B4 and prints a small QR label (later release).

Thursday at lunch his phone buzzes: the band tee sold on Poshmark. He forwards the sale email to his Listly address (or taps "Sold on Poshmark"). Listly shows a red banner: **"Still live on eBay and Mercari. Remove now."** with a deep link to each. He removes both from his phone in under a minute. Listly marks the item sold, records the price, and tells him: *bin B4*.

## What Dre needs from Listly

1. **Fast, accurate item capture**: photos, measurements, flaws, by voice where possible. No facts made up by the AI.
2. **Copy formatted per marketplace** for his 2–4 marketplaces from one item record, in his brand voice.
3. **An inventory ledger:** every item, where it's listed, link, price, days listed.
4. **A "sold, remove it everywhere else" alarm** with deep links, without needing marketplace APIs (manual tap or forwarded sale email in MVP).
5. **A stale-inventory view** of items to reprice or relist.
6. **Bin and location tracking** (later release: QR labels).
7. **Later:** automatic delisting via approved APIs or a desktop/browser companion; SellerStudio photos attached to the same item.

## Design implications

- **Reseller mode = Simple mode + inventory tools.** Same capture flow, plus the ledger, multi-marketplace copy, the sold alarm and bulk actions. One data model, two levels of interface, as in the PRD's "one canonical product, many channel listings."
- **The double-sale alarm is the hero feature.** It must be impossible to miss, act within seconds and never claim an item was delisted until he confirms (PRD principle: honest status). In MVP, Listly *tells him what to do*; it doesn't do it for him.
- **Built for speed and repetition.** Voice input for measurements, "same as last item" defaults, quick switching between marketplaces, minimal confirmation dialogs for non-destructive steps.
- **Accuracy beats polish.** Condition and measurements are verified fields, clearly marked. Generated copy must never describe an item better than it is.
- **The mobile app must stand alone.** He shouldn't need a laptop for the core loop. A desktop or browser companion is a later accelerator for bulk crosslisting, and the interviews should decide how soon.
- **Monetization:** subscription in the range of about $9.99–19.99/mo (PRD: Creator and Seller Pro tiers), priced against crosslisters. Free trial long enough to catch one double sale.
- **Data he can take with him.** CSV export of his inventory. Trust matters to people running a business on the tool.

## What success looks like for him

- Lists a full haul (10+ items) in one sitting in Listly.
- Records every sale in Listly within the hour, and reports **zero double sales** in his first month.
- Uses Listly 3+ days a week.
- Converts to paid by the end of the trial, and cancels his spreadsheet (or his crosslister).

## Risks with this persona

- **Strong existing tools.** Crosslisters already do automated posting; without APIs, Listly's MVP is more manual. The pitch has to be phone-first, accurate and protecting items from double sales, not "posts for you."
- **The ledger only works if he keeps it up to date.** If recording sales feels like extra work, he'll stop and the ledger will be wrong. Forwarding sale emails is the key test.
- **Desktop pull.** If interviews show he does bulk crosslisting at a desk, the desktop or browser companion moves earlier in the roadmap.
- **Marketplace terms.** Deep links and email parsing are fine; automating marketplace websites may break their terms. Needs a review before any automation.

## Research gaps

- How many resellers use 2+ marketplaces weekly, and how often double sales actually happen (target: interview 10–15 resellers per the PRD).
- Whether sellers will forward sale emails, and how reliably marketplace sale emails can be parsed.
- Current tool spend and what would make him switch from Vendoo, List Perfectly or Crosslist.
- How much of his work is on the phone vs. at a desk.
- Which 2–4 marketplaces to support first (likely eBay, Poshmark, Mercari, Depop; confirm by interview).

**Sources behind the assumptions:** Listly PRD v0.2; crosslisting tool pricing comparisons (Vendoo, List Perfectly, Crosslist, 2026); ThredUp 2026 Resale Report; eBay Magical Listing adoption data.
