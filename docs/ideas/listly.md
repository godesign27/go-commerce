# Listly MVP 1

> **Status:** Current direction, adopted 2026-11-13 from the [Listly recommendation](../strategy/listly-recommendation-2026-11.md), which builds on the [strategy review](../strategy/strategy-review-2026-11.md). It replaces the earlier "Simple mode first, free allowance" plan. Listly is one Expo app for iOS and Android, which supersedes the SwiftUI, iPhone-first choice in Listly PRD v0.2.
> **Primary persona:** [Dre, the Part-Time Reseller](../personas/part-time-reseller.md) (Reseller plan). **Secondary:** [Maya, the Closet Clearer](../personas/closet-clearer.md) (Clear-out Pass).

## Problem Statement

How might we help people who sell secondhand goods for money list a whole haul from their phone, sell it on every marketplace they use, and always know what's sold, where it is and what they made?

## Recommended Direction

**Promise:** *"List a whole haul from your phone, sell it anywhere, and always know what's sold, where it is and what you made."*

Turning a photo into a listing is now free inside eBay, Poshmark, Mercari, Depop and Facebook Marketplace (see the strategy review §2). So listing generation is the **way in**, not what Listly charges for. Sellers already pay $9–$69 a month for tools that help them sell across marketplaces, avoid double sales and know what they're making. Listly charges for that.

**The loop:**

1. Photograph a haul (10–30 items) in one session.
2. Answer by voice: brand, size, measurements, flaws. The AI never fills these in on its own.
3. Get ready-to-paste copy for every marketplace the seller uses, from one item record.
4. Paste it into each marketplace app and save the listing link back to Listly.
5. When it sells, Listly shows everywhere else it's still listed until the seller confirms it's down, plus the item's bin and its net profit.

The backend is one canonical item record with many marketplace listings (Supabase, row-level security, a server-side AI gateway). The existing Expo + Tamagui scaffold and the GO Mobile Design System are the foundation.

### What makes it worth paying for

| Feature | Why it's desirable | Can the marketplaces copy it? |
|---|---|---|
| **Haul mode** with voice answers | Batch listing is where resellers lose evenings. The marketplaces' own AI works item by item, inside one marketplace. | Partly: Meta's Seller app does bulk listing, but only for Facebook Marketplace. |
| **One item, every marketplace:** copy for eBay, Poshmark, Mercari, Depop and Facebook Marketplace, one-tap copy per field | Re-typing the same item 2–4 times is the top complaint. | No. A marketplace won't format listings for its competitors. |
| **Sold-everywhere checklist** with a link to each marketplace | Double sales cost money, ratings and goodwill. | No. |
| **Profit tracker:** cost paid, each marketplace's fees and shipping, net profit per item, month and marketplace, CSV export for taxes | Answers "is this worth my time?" It's plain arithmetic, so it's cheap to run. | No. |
| **Honest condition:** asks about flaws instead of guessing | Fewer returns and "not as described" disputes. | Partly. The marketplaces' tools guess condition. |
| **A labeled AI price estimate** | Every marketplace's own tool shows one, so leaving it out is a visible gap. It's clearly labeled as a guess, never as based on sold prices. | Already does. |

## Pricing and Trial

Every new user gets **3 free listings, no card needed**. After the third listing, Listly asks them to pick a plan. There is no free monthly allowance and no "How do you sell?" question at signup.

| Plan | Price | Covers |
|---|---|---|
| **Reseller plan** | **$12.99 a month or $99 a year** | Everything in MVP 1, up to a fair-use limit (proposed: 500 listings a month) |
| **Clear-out Pass** | **$6.99, one time, for 30 days** | Haul mode, copy for every marketplace, mark sold, the sold-everywhere checklist and money made, up to 100 listings. Can be upgraded to the Reseller plan. |

- **Trial format is still being tested:** "3 free listings, then pay" against a 7-day App Store trial that renews automatically (the trial test below).
- **Price check:** $12.99 sits between Flyp (about $9) and Vendoo's Starter plan (about $14.99), which both delist automatically. Listly can't, so don't price above them until there's proof the speed and profit tracking are worth more.
- **AI cost:** the default is a small model, with a cap on spending per user each month. The estimate is about $0.003–$0.006 per listing on a small model; on a mid-tier model, heavy use would wipe out the Clear-out Pass margin.
- **Billing:** the Clear-out Pass goes through the app stores' billing. The Reseller plan can also be sold through a US web checkout while the current Apple ruling holds. Get a legal check before launch.

## Key Assumptions to Validate

Run these in the next 2–3 weeks, before more production code.

- [ ] **Resellers will pay $12.99 a month for this without automatic delisting.** *Test: founding-member pre-sale. A landing page with the promise and both plans, posted in 3 reseller communities. Go if at least 15 people pay or reserve from about 1,000 visits.*
- [ ] **Haul mode is faster than how they list today.** *Test: 6–8 resellers list 10 items with a clickable prototype against their current method. Go if it's faster and at least half say they'd pay $12.99.*
- [ ] **"3 free listings, then pay" converts well enough.** *Test: split pre-sale visitors between "3 free listings" and a 7-day trial that renews automatically.*
- [ ] **Resellers want the profit tracker.** *Test: in the same survey, ask how they track profit today and whether they'd switch for this.*
- [ ] **The copy-and-paste handoff isn't too much friction.** *Test: on real devices, 3 items × 4 marketplace apps, timing each field. More than 60 seconds of paste overhead per listing means deep links and a clipboard queue come first.*
- [ ] **Sellers keep the ledger up to date by hand.** *Test: a 2-week diary study with 6–8 resellers using a shared sheet and a forward-your-sale-email address processed by hand.*
- [ ] **"Ask, don't fill" produces more accurate listings than the native AI.** *Test: an evaluation set of 30 real items with known flaws, scored against Poshmark's, Mercari's and eBay's drafts.*
- [ ] **Occasional sellers will buy a one-time pass.** *Test: Clear-out Pass sales in the pre-sale and in beta.*

## MVP Scope

**In:**
- Account creation, then 3 free listings, then the paywall with both plans.
- **Haul mode:** batch photo capture from the camera or library, with photos grouped into items; originals kept.
- Voice or typed answers for brand, size, measurements and flaws. The AI never fills these in on its own.
- AI-drafted title and description with honest flaw wording, plus a labeled AI price estimate.
- Copy for **eBay, Poshmark, Mercari, Depop, Facebook Marketplace and a generic format**, with one-tap copy for each field.
- An item ledger: where each item is listed, the listing link, price and days listed.
- The **sold-everywhere checklist**, with a link to each marketplace. Listly never says an item is down until the seller confirms it.
- The **profit tracker:** cost paid, marketplace fees and shipping, net profit, CSV export.
- Mark as sold, individually or as a bundle.
- Server-side AI gateway with no keys in the app, a small model by default, a per-user monthly cost cap, and data deletion and export controls.
- One structured generation call plus a deterministic validator. No lead agent or specialist agents in MVP 1.
- VoiceOver and Dynamic Type support (design system standards).

**Next (about 30–45 days after launch):** the "fix photo" step (crop, straighten, brighten, clean background, never hiding condition evidence), bin labels, forward-your-sale-email, and a web companion from the same Expo codebase for desk work.

## Not Doing (and Why)

- **A free tier or free monthly allowance:** the 3 free listings are the trial.
- **A separate Simple mode chosen at signup:** occasional sellers get the Clear-out Pass, which shows fewer screens in the same app.
- **Automatic delisting and a browser extension:** the architecture rules out browser automation. Decide after a marketplace terms-of-service review. It's the feature competitors charge most for.
- **Marketplace APIs and direct publishing:** Poshmark, Mercari and Depop offer no third-party listing API.
- **Bundle discount helpers, bundle-friendly copy and "more in your size":** on hold until interviews show bundles matter. Only "mark sold as a bundle" stays.
- **Brand-voice profiles and `style.md`:** they return with makers.
- **SellerStudio as a separate app:** photo cleanup becomes the "fix photo" step.
- **A sourcing scanner ("is this worth buying?"):** a strong want for resellers, but it needs reliable sold-price data. Investigate for version 2.
- **Etsy and Shopify formats:** maker and shop channels.

## Open Questions

- **Trial format:** 3 free listings or a 7-day trial that renews automatically? The trial test decides.
- **Which marketplaces matter most to resellers?** That decides the formatting work and the test order. The working assumption is Poshmark, Mercari and eBay.
- **Copy handoff:** copy field by field, use the share sheet, or open the marketplace app directly (deep link) with a clipboard queue? The paste-timing test decides.
- **Fair-use limits:** confirm 500 listings a month and 100 per Clear-out Pass after the AI cost test.
- **US web checkout:** confirm the current Apple and Google rules with a legal check.
- **Name clearance** for "Listly" before App Store submission (PRD open item 1).

## Success Target (90 days after launch)

- **Paying sellers from launch day.** Set the target number after the pre-sale reads out.
- Trial-to-paid conversion, by trial format and by plan.
- Activation: first listing copied within 3 minutes of installing; 10+ items in the first haul.
- Reseller plan: listings and sales recorded per week, and retention after the first renewal.
