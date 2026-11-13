# Listly, Simple Mode (MVP 1)

> **Status:** Refined idea, output of an idea-refine session on 2026-11-13. Supersedes the platform choice in Listly PRD v0.2 (SwiftUI, iPhone-first). Listly is now one Expo app for iOS and Android.
> **Primary persona:** [Maya, the Closet Clearer](../personas/closet-clearer.md). **Next:** [Dre, the Part-Time Reseller](../personas/part-time-reseller.md) (Reseller mode).

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

eBay already turns photos into listings for free, but only for eBay. Listly's edge with Maya:

- It works for **the marketplace she actually uses**: Depop, Poshmark, Mercari, Facebook Marketplace or eBay.
- It asks about flaws instead of guessing.
- It remembers her half-finished clear-out.
- **It helps her sell more at once through bundles.**

That's a better-UX bet, not a new capability, so speed and polish carry the product.

The backend and data model are **built for Reseller mode from day one**: one canonical product record and many marketplace listings (Supabase, row-level security, a server-side AI gateway). Reseller mode then adds screens, not a migration. The existing Expo + Tamagui scaffold and the GO Mobile Design System are the foundation.

### Buyer bundles

A clear-out goes faster when one buyer takes several items. Several resale marketplaces let buyers bundle a seller's items and let sellers set a bundle discount. Listly can't create or accept bundles on the marketplace without API access, so it **supports bundles around the marketplace** instead:

1. **Bundle-friendly listing copy.** An optional line in each description inviting bundles (for example "Bundle 2+ items for 15% off"), only for marketplaces where that's allowed and used.
2. **Bundle discount helper.** During setup, Listly suggests a bundle discount and gives a short, marketplace-specific reminder of where to turn it on in that marketplace's app. It never claims the discount is active.
3. **Mark sold as a bundle.** From her listed items, Maya selects the ones that sold together, enters one total, and Listly marks them all sold, splitting the total across items in proportion to their list prices for her money-made counter.
4. **"More in your size" prompt (stretch).** When she marks an item sold, Listly shows her other listed items in the same size or brand, so she can message the buyer with a bundle offer.

Bundle sales are stored as one sale linked to many products. Reseller mode reuses this as it is, because Dre gets bundle sales too.

## Key Assumptions to Validate

- [ ] **Maya will use a separate app rather than listing directly in Depop or Poshmark.** This is the biggest risk. *Test: clickable prototype with 6–8 closet clearers; time Listly + paste against listing natively, and ask which they'd use next time.*
- [ ] **The copy-and-paste handoff isn't too much friction.** *Test: same prototype session; watch the paste step on each target app.*
- [ ] **Bundles are common and valuable for closet clearers.** *Test: ask in interviews how often buyers bundle, and track the share of Listly sales marked as bundles in beta.*
- [ ] **She comes back for her next clear-out.** *Test: 30/60-day return rate; "Still to list" reminder open rate.*
- [ ] **Running costs fit a free tier.** *Test: AI cost per listing in beta, against what a free monthly allowance can absorb.*
- [ ] **Some closet clearers will pay, or move up to Reseller mode.** *Test: optional credit pack; acceptance rate of the "you're selling more" nudge.*

## MVP Scope

**In:**
- Account creation with the one onboarding question that sets the mode (only Simple mode is active at launch).
- Photo capture from the camera or library; originals kept.
- Two or three questions asking for facts. The AI never fills in brand, size or condition on its own.
- AI-drafted title and description with honest flaw wording.
- Formatted copy for **Depop, Poshmark, Mercari, eBay, Facebook Marketplace and a generic format**, with one-tap copy for each field.
- Photos saved or shared to the camera roll or share sheet.
- "Still to list" tray.
- Mark as sold, **individually or as a bundle**, with a simple money-made counter.
- **Optional bundle line in listing copy and a bundle discount helper.**
- Server-side AI gateway with no keys in the app, a free monthly allowance, and data deletion and export controls.
- VoiceOver and Dynamic Type support (design system standards).

**Out:** everything in the list below.

## Not Doing (and Why)

- **Reseller mode interface** (inventory ledger, sold alarm, multi-marketplace copy): it comes next, and the data model already supports it.
- **Marketplace APIs and direct publishing:** no API access, and Maya doesn't need it.
- **Creating, accepting or pricing bundle offers inside the marketplaces:** that needs API access or automating the marketplace apps. Listly supports bundles around the marketplace instead.
- **Bundle price optimization or AI-negotiated offers:** too much for MVP. A fixed suggested discount is enough to learn from.
- **Brand voice profiles and `style.md`:** Maya has no "brand." They return with Reseller mode and makers.
- **Price suggestions based on sold data:** the data source and legal access aren't confirmed (see open questions).
- **SellerStudio photo editing:** it's the second app. Listly MVP uses the photos as taken.
- **Etsy and Shopify formats:** those are maker and shop channels, not where closet clearers sell.
- **Desktop or web app:** Maya is phone-only. Desktop is reconsidered for Dre after interviews.
- **Subscriptions:** a subscription doesn't match how rarely Maya sells. Launch free with an allowance and add an optional credit pack.
- **Sale-email parsing, QR bin labels, stale-inventory views:** these are Reseller mode features.

## Open Questions

- **Bundle support by marketplace:** confirm which target marketplaces support buyer bundles and seller bundle discounts today, and their current rules, before writing the helper text.
- **Price suggestion:** ship an AI estimate clearly labeled as a guess, or leave it out until there's real sold-price data?
- **Which three marketplaces matter most to closet clearers?** That decides the formatting work and the test order.
- **Copy handoff:** copy field by field, use the share sheet, or open the marketplace app directly (deep link) with a clipboard queue?
- **Paid model at launch:** free beta only, or in-app-purchase credit packs from day one? (Purchases on iOS and Android must go through the app stores' billing.)
- **Name clearance** for "Listly" before App Store submission (PRD open item 1).
- **90-day success target:** activation (first listing in under 3 minutes), 5+ items in the first session, 30-day return rate, share of sales that are bundles, and early credit-pack conversion. Paying sellers move to Reseller mode's milestone.
