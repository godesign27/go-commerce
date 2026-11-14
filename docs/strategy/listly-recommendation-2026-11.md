---
title: Listly product recommendation
date: 2026-11-13
status: Recommendation for decision. Builds on strategy-review-2026-11.md; not yet reflected in the README, one-pager or personas.
---

# Listly: recommendation

## Recommendation

**Reposition Listly as a paid, phone-first selling app for people who sell to make money.** Lead with
Dre, the part-time reseller. Give every new user **3 free listings**, then ask them to pay. Offer two
paid options: a monthly **Reseller plan** and a one-time **Clear-out Pass** for occasional sellers like
Maya. Drop the free monthly allowance and the separate "Simple mode first" launch.

The reason is simple. Turning a photo into a listing is now free inside eBay, Poshmark, Mercari, Depop
and Facebook Marketplace, so nobody will pay for that alone. People do pay $9–$69 a month for tools
that help them **sell across several marketplaces, avoid double sales and know what they're making**
(strategy review §2, §4). Listly should charge for that, and use listing generation as the way in.

## The product

**One promise:** *"List a whole haul from your phone, sell it anywhere, and always know what's sold,
where it is and what you made."*

### What makes it worth paying for

| Feature | Why it's desirable | Can the marketplaces copy it? |
|---|---|---|
| **Haul mode.** Photograph 10–30 items in one session; Listly groups the photos into items and asks for brand, size, measurements and flaws **by voice**. | Batch listing is where resellers lose evenings. The marketplaces' own AI works item by item, inside one marketplace. | Partly: Meta's Seller app does bulk listing, but only for Facebook Marketplace. |
| **One item, every marketplace.** Ready-to-paste copy for eBay, Poshmark, Mercari, Depop and Facebook Marketplace from a single record, with one-tap copy per field. | Re-typing the same item 2–4 times is Dre's top complaint. | No. A marketplace won't format listings for its competitors. |
| **Sold-everywhere checklist.** Mark an item sold (or forward the sale email) and Listly shows every other place it's still live, with a link to each, until he confirms it's down. | Double sales cost money, ratings and goodwill. | No. |
| **Profit tracker.** Enter what he paid; Listly applies each marketplace's fees and shipping and shows net profit per item, per month and per marketplace, with a CSV export for taxes. | It answers "is this worth my time?" Every number here is deterministic, so it costs almost nothing to run. | No, for the same cross-marketplace reason. |
| **Honest condition and photo fix.** Listly asks about flaws instead of guessing, and its "fix photo" step (crop, straighten, brighten, clean background) never hides condition evidence. | Fewer returns and "not as described" disputes. This replaces SellerStudio. | Partly. The marketplaces fill in condition by guessing. |
| **Where it is.** A bin or shelf label on every item, shown when it sells. | Finding the item fast when it sells. | No. |

A labeled AI price estimate stays in, because every marketplace's own tool shows one.

### What to cut or defer

- **The separate Simple mode at launch.** Occasional sellers get the same app with fewer screens
  switched on through the Clear-out Pass, not a separate mode chosen at signup.
- **Bundle discount helpers and "more in your size."** Keep only "mark sold as a bundle."
- **Brand-voice profiles, the multi-agent architecture and SellerStudio as its own app.**
- **A sourcing scanner ("is this worth buying?").** It's a strong want for resellers, but it needs
  reliable sold-price data. Investigate it for version 2.

## Pricing and trial

| | Free trial | Then | Covers |
|---|---|---|---|
| **Reseller plan** | 3 free listings, no card. Or a 7-day App Store free trial that renews automatically. | **$12.99 a month or $99 a year** | Everything above, up to a fair-use limit (for example 500 listings a month). |
| **Clear-out Pass** | Same 3 free listings | **$6.99, one time, for 30 days** | Haul mode, copy for every marketplace, mark sold and money made, up to 100 listings. Can be upgraded to the Reseller plan. |

Notes:

- **The paywall replaces the "How do you sell?" question.** After the third listing, users pick the
  plan that fits. That's the moment they've already seen the value.
- **Trial choice:** "3 free listings, then pay" fits your ask best and costs the least in AI. An App
  Store 7-day trial that renews automatically converts more people to paid, but it needs a card up
  front, so fewer people start. Test both (see below).
- **Price check:** $12.99 sits between Flyp (about $9) and Vendoo's Starter plan (about $14.99), which
  both delist automatically. Listly can't, so don't price above them until there's proof that
  phone-first speed and the profit tracker are worth it.
- **Margins:** on a small AI model, a listing costs roughly $0.003–$0.006 (estimate), so both plans keep
  most of their revenue after Apple's or Google's 15%. On a mid-tier model, heavy use would wipe out
  the Clear-out Pass margin, which is why the default model must be the small one, with a cap on
  spending per user.
- **US web checkout:** selling the Reseller plan through a link to a web checkout would avoid the store
  fee while Apple's US ruling holds. Get a legal check before launch.

## Build order

1. **MVP:** haul mode with voice answers, copy for every marketplace, the item ledger with the
   sold-everywhere checklist, the profit tracker, the 3-listing trial and paywall, and both plans.
2. **Next (about 30–45 days later):** photo fix, bin labels, forward-your-sale-email, and the web
   companion for desk work.
3. **Decide after a terms-of-service review:** a browser extension for automatic delisting. That's the
   feature competitors charge most for, and the one that would let Listly raise its price.

## Test before building (2–3 weeks)

1. **Founding-member pre-sale:** landing page with the promise and both plans, posted in 3 reseller
   communities. Go if at least 15 people pay or reserve from about 1,000 visits.
2. **Haul-mode prototype:** 6–8 resellers list 10 items with a clickable prototype against their
   current method. Go if it's faster and at least half say they'd pay $12.99.
3. **Trial test:** in the pre-sale, split visitors between "3 free listings" and "7-day trial."
4. **Profit-tracker interest:** in the same survey, ask how resellers track profit today and whether
   they'd switch for this.

## Changes to current decisions

| Current decision | Change |
|---|---|
| Simple mode ships first, for Maya | Launch with the Reseller plan as the headline, plus the Clear-out Pass |
| Mode chosen at signup | Plan chosen at the paywall after 3 free listings |
| Free monthly allowance plus credit packs | 3 free listings, then pay: one-time pass or subscription |
| Paid Reseller beta 45 days after launch | Paid from launch day |
| Bundles supported around the marketplaces | Only "mark sold as a bundle" in MVP |
| Success target: paying sellers within 90 days | Keep, now from launch day; set a number after the pre-sale |
