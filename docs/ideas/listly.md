# Listly, Simple Mode (MVP 1)

> **Status:** Refined idea, output of an idea-refine session on 2026-11-13, updated the same day after the [strategy review](../strategy/strategy-review-2026-11.md). Supersedes the platform choice in Listly PRD v0.2 (SwiftUI, iPhone-first). Listly is now one Expo app for iOS and Android.
> **Primary persona:** [Maya, the Closet Clearer](../personas/closet-clearer.md). **Next:** [Dre, the Part-Time Reseller](../personas/part-time-reseller.md) (paid Reseller beta, about 45 days after launch).
> **Role of Simple mode:** the free front door. It's measured on activation and return, not revenue. Paying sellers are expected from the Reseller beta.

## Problem Statement

How might we help people clearing out their closets turn unwanted items into honest, paste-ready listings from their phone in under two minutes, so they finish the clear-out instead of giving up and donating?

## Recommended Direction

Ship **Listly Simple mode** first as a single **Expo app for iOS and Android**. The loop:

1. Snap photos.
2. Answer 2–3 plain questions (brand, size, flaws).
3. Get a listing formatted for the marketplace you use.
4. Tap copy and paste it into the marketplace app.
5. Mark it sold later, on its own or as part of a **buyer bundle**.

Unfinished items wait in a **"Still to list" tray**, so a clear-out can happen over several sittings.

Every target marketplace already turns photos into listings for free inside its own app: eBay, Poshmark, Mercari, Depop and Facebook Marketplace (with Meta AI and a standalone Seller app since July 2026). Several App Store apps also do photo-to-copy-and-paste listings. See the [strategy review](../strategy/strategy-review-2026-11.md) §2 for sources. So listing generation is the **input** to Listly, not the product. What Listly offers Maya:

- **One place for the whole clear-out:** the "Still to list" tray keeps her half-finished items, and Listly tracks what's listed and sold.
- **It asks about flaws instead of guessing.** Whether that produces measurably more accurate listings than the native tools is still to be tested (see Key Assumptions).
- It works for **the marketplace she actually uses**, and later for a second one, which is the path into Reseller mode.
- Bundles help her sell several items to one buyer, but their value to closet clearers is unproven.

That's a better-UX bet, not a new capability, and it can't stand on its own against free built-in tools. Simple mode exists to bring sellers in and to feed Reseller mode.

The backend and data model are **built for Reseller mode from day one**: one canonical product record and many marketplace listings (Supabase, row-level security, a server-side AI gateway). Reseller mode then adds screens, not a migration. The existing Expo + Tamagui scaffold and the GO Mobile Design System are the foundation.

### Buyer bundles

A clear-out goes faster when one buyer takes several items. Several resale marketplaces let buyers bundle a seller's items, but the mechanics differ: Poshmark has a seller bundle discount, Mercari bundles start with the buyer, and Depop's settings are unclear in the sources. Listly can't create or accept bundles on the marketplace without API access, so it **supports bundles around the marketplace** instead.

**In MVP 1:**

1. **Mark sold as a bundle.** From her listed items, Maya selects the ones that sold together, enters one total, and Listly marks them all sold, splitting the total across items in proportion to their list prices for her money-made counter.

**On hold until interviews show bundles matter to closet clearers:**

2. **Bundle-friendly listing copy.** An optional line in each description inviting bundles (for example "Bundle 2+ items for 15% off"), only for marketplaces where that's allowed and used.
3. **Bundle discount helper.** Listly suggests a bundle discount and gives a short, marketplace-specific reminder of where to turn it on in that marketplace's app. It never claims the discount is active.
4. **"More in your size" prompt.** When she marks an item sold, Listly shows her other listed items in the same size or brand, so she can message the buyer with a bundle offer.

Bundle sales are stored as one sale linked to many products. Reseller mode reuses this as it is, because Dre gets bundle sales too.

## Key Assumptions to Validate

In order of risk. The [strategy review](../strategy/strategy-review-2026-11.md) §7 has the full test designs and the signals that would change the plan.

- [ ] **Maya will use a separate app rather than the marketplace's own free AI listing.** This is the biggest risk: every target marketplace now drafts listings from a photo in its own app. *Test: clickable prototype with 8 closet clearers (and 5 resellers); each lists 3 items in Listly + paste and 3 with the marketplace's built-in AI, on their own phone. Time it, count corrections, ask which they'd use next week. Fewer than half preferring Listly means Simple mode doesn't stand on its own.*
- [ ] **"Ask, don't fill" produces more accurate listings than the native AI.** *Test: an evaluation set of 30 real items with known flaws; score Listly's drafts against Poshmark's, Mercari's and eBay's for flaws mentioned and false claims.*
- [ ] **The copy-and-paste handoff isn't too much friction.** *Test: on real devices, 3 items × 4 marketplace apps, timing each field. More than 60 seconds of paste overhead per listing means deep links and a clipboard queue come first.*
- [ ] **Running costs fit a free tier.** *Test: run 50 real items through two model tiers and log tokens. The estimate is about $0.003–$0.006 per listing on a small model and $0.05–$0.08 on a mid-tier model.*
- [ ] **She comes back for her next clear-out.** *Test: 30/60-day return rate; "Still to list" reminder open rate.*
- [ ] **Bundles are common and valuable for closet clearers.** *Test: ask in interviews how often buyers bundle, and track the share of Listly sales marked as bundles in beta.*
- [ ] **Some closet clearers move up to Reseller mode, or buy a credit pack.** *Test: acceptance rate of the "you're selling more" nudge; credit-pack conversion. Neither is counted toward the paying-seller target.*

## MVP Scope

**In:**
- Account creation with the one onboarding question that sets the mode (only Simple mode is active at launch).
- Photo capture from the camera or library; originals kept.
- Two or three questions asking for facts. The AI never fills in brand, size or condition on its own.
- AI-drafted title and description with honest flaw wording.
- **An AI price estimate, clearly labeled as a guess** and never presented as based on sold prices. Every marketplace's own AI suggests a price, and Maya expects one.
- Formatted copy for **Depop, Poshmark, Mercari, eBay, Facebook Marketplace and a generic format**, with one-tap copy for each field.
- Photos saved or shared to the camera roll or share sheet.
- "Still to list" tray.
- Mark as sold, **individually or as a bundle**, with a simple money-made counter.
- Server-side AI gateway with no keys in the app, a small model by default, a per-user monthly cost cap, a free monthly allowance (proposed: 20 listings), and data deletion and export controls.
- One structured generation call plus a deterministic validator. No lead agent or specialist agents in MVP 1.
- VoiceOver and Dynamic Type support (design system standards).

**Out:** everything in the list below.

## Not Doing (and Why)

- **Reseller mode interface** (inventory ledger, sold alarm, multi-marketplace copy): it opens as a **paid beta about 45 days after launch**, and the data model already supports it.
- **Bundle-friendly copy, the bundle discount helper and the "more in your size" prompt:** on hold until interviews show bundles matter to closet clearers.
- **Marketplace APIs and direct publishing:** no API access, and Maya doesn't need it.
- **Creating, accepting or pricing bundle offers inside the marketplaces:** that needs API access or automating the marketplace apps. Listly supports bundles around the marketplace instead.
- **Bundle price optimization or AI-negotiated offers:** too much for MVP. A fixed suggested discount is enough to learn from.
- **Brand voice profiles and `style.md`:** Maya has no "brand." They return with Reseller mode and makers.
- **Price suggestions based on sold data:** the data source and legal access aren't confirmed. MVP 1 ships a labeled AI guess instead.
- **Photo cleanup (formerly SellerStudio):** it's now a Reseller-mode "fix photo" step, not a separate app. Simple mode uses the photos as taken.
- **Etsy and Shopify formats:** those are maker and shop channels, not where closet clearers sell.
- **Desktop or web app for Simple mode:** Maya is phone-only. A web companion (from the same Expo codebase) ships with the Reseller beta for Dre.
- **Subscriptions:** a subscription doesn't match how rarely Maya sells. Launch free with an allowance and add an optional credit pack.
- **Sale-email parsing, QR bin labels, stale-inventory views:** these are Reseller mode features.

## Open Questions

- **Bundle support by marketplace:** confirm which target marketplaces support buyer bundles and seller bundle discounts today, and their current rules, before reviving the on-hold bundle features.
- **Which three marketplaces matter most to closet clearers?** That decides the formatting work and the test order.
- **Copy handoff:** copy field by field, use the share sheet, or open the marketplace app directly (deep link) with a clipboard queue? The paste-timing test decides.
- **Credit pack at launch:** the proposal is free with a 20-listing monthly allowance plus an optional $4.99 pack, sold through the app stores' billing, and no subscription for Simple mode. Confirm the allowance and pack size after the AI cost test.
- **Name clearance** for "Listly" before App Store submission (PRD open item 1).

## Success Target (90 days after launch)

- **Simple mode:** activation (first listing in under 3 minutes), 5+ items in the first session, 30-day return rate, and share of sales marked as bundles. Credit-pack sales are tracked but aren't the goal.
- **Paying sellers:** come from the **paid Reseller beta**, which opens about 45 days after launch. The target count is still to be set.
