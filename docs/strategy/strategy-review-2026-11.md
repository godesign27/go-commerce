---
title: GO Commerce strategy review
date: 2026-11-13
status: Independent second opinion, for discussion. Not a decision record.
reviewer: PM Lead review (zaidyn-pm-os prd-generator lens)
inputs:
  - docs/ideas/listly.md (Simple-mode MVP 1 one-pager, 2026-11-13)
  - docs/personas/README.md, closet-clearer.md, part-time-reseller.md
  - docs/planning/Listly_PRD.md v0.2, SellerStudio_PRD.md v0.1, ARCHITECTURE.md v0.1, GO_Commerce_Shared_Services.md v0.1
  - listly/ (Expo SDK 58, React Native 0.88, Tamagui 3, react-native-web; GO Mobile Design System)
  - Web research run 2026-11-13 (see Sources)
---

# GO Commerce strategy review (November 2026)

**How to read this.** Every section separates **Evidence** (cited, numbered to the Sources list at the end)
from **Judgment** (my opinion, labeled). Persona facts are still hypotheses: no seller interviews have been
run yet, so nothing in `docs/personas/` counts as evidence here. Where a number is my estimate, it's
labeled as one. Many competitor and pricing sources are vendor or competitor blogs; I flag that where it
matters, and you should confirm prices on the vendors' own pages before you quote them externally.

---

## Executive summary

1. **Simple mode can't produce paying sellers in 90 days, and your own one-pager already concedes it.**
   Its 90-day targets quietly move "paying sellers" to Reseller mode's milestone, which contradicts the
   README's success target. Fix the sequence: ship a thin, paid Reseller beta inside the 90-day window
   and keep Simple mode as the free acquisition front door.
2. **Listly's Simple-mode wedge is already free and built into every target marketplace.** eBay, Poshmark,
   Mercari, Depop and Facebook Marketplace all draft listings from a photo in their own apps. eBay limits
   its flagship version to the casual sellers who match Maya, and Meta shipped a standalone Seller app
   in July 2026. At least eight App Store apps already do photo → copy/paste listings. "Better UX" for
   Maya isn't defensible.
3. **Dre is the right paying market, but the planned Reseller mode is weaker than $9/month incumbents.**
   Crosslisters auto-delist through browser sessions. Listly's architecture forbids that, so Listly can
   only tell Dre what to do. The defensible position is narrower: a **phone-first inventory truth**
   (ledger, sold alarm, condition accuracy) for resellers who list from their phones. That position
   needs testing in the next 4 weeks.
4. **The unit economics work only with a cheap model and a small free allowance.** My estimate is
   $0.003–$0.08 of AI cost per listing, depending on model tier. The low end makes a free tier
   affordable; the high end eats most of a $4.99 credit pack. Fold SellerStudio into Listly as a photo
   cleanup step. Don't build it as a second app with cross-app entitlements.
5. **The cheapest next moves are tests, not code:** a side-by-side test against native AI, a pre-sale
   for Dre, a 2-week manual ledger diary, and a 100-response reseller survey. A web companion costs
   almost nothing because the scaffold already runs on the web.

---

## 1. Simple mode first versus paying sellers within 90 days

### Evidence
- The current one-pager's own 90-day target lists activation, items per session, 30-day return, bundle
  share and "early credit-pack conversion," and then says **"Paying sellers move to Reseller mode's
  milestone"** (`docs/ideas/listly.md`, Open questions). The README still says **"Success target: paying
  sellers within 90 days of launch."** The two documents disagree today.
- Maya's assumed behavior is 2–4 clear-outs a year, 5–30 items each, "willingness to pay: low; maybe a
  one-off pack" (`closet-clearer.md`). That's a proto-persona, not data.
- The capability Maya would pay for is free inside the marketplace apps she already uses:
  eBay Magical Listing [1][2], Poshmark Smart List AI [3], Mercari AI Listing Support [4], Depop's
  one-photo listing [5], and Meta AI listing plus the Seller app on Facebook Marketplace [6][7].
- eBay's flagship photo-first AI flow is reportedly limited to "new, reactivated, and casual sellers on
  the app." In other words, Maya's segment is the one eBay is deliberately serving for free [2].

### Judgment
Maya will probably have at most one clear-out in a 90-day window. If the free allowance covers it, she
never pays. If it doesn't, she goes back to the marketplace's free built-in AI. Either way, the
credit-pack conversion rate from Simple mode will be very low. I'd plan on low single-digit percentages
at best (my estimate, untested). At that rate you'd need thousands of activated clear-outers in 90 days to
get a meaningful number of payers. That's a distribution problem the GTM plan below can't solve by launch.

The decision to ship Simple mode first isn't wrong in itself: it's the simpler build and a broad funnel.
What's wrong is attaching a revenue target to it.

**Smallest fix (pick one; I recommend A):**

| Option | Change | Cost | Why |
|---|---|---|---|
| **A. Add a paid Reseller beta inside the window** (recommended) | Launch Simple mode as planned. At about launch + 45 days, open a **paid Reseller beta** to 20–50 hand-recruited resellers: the multi-marketplace copy, an inventory ledger, and "Sold → still live on X, Y" checklist. No new AI. | Screens on the existing data model. The one-pager says Reseller mode "adds screens, not a migration." | Paying sellers come from the people who already pay for tools ($9–$69/mo, see §4). Simple mode keeps acquiring. |
| B. Change the target | Keep the sequence. Rewrite the 90-day goal as activation and retention for Simple mode, and move "paying sellers" to day 180. | A doc edit | Honest, but it delays the revenue signal you most need. |
| C. Change the pricing | Make the Simple-mode free allowance small, and sell a one-time "Clear-out pass" (for example, unlimited listings for 30 days). | Low | Gets some revenue, but it puts a paywall in front of a free alternative. I expect that to hurt activation more than it earns. |

**Recommendation:** Adopt option A. Correct the README and the one-pager so they state the same target,
and record that paying sellers are expected to come from the Reseller beta.

---

## 2. Competitive position

### Evidence

**The marketplaces' own AI (free, inside their apps):**

| Marketplace | Native AI listing | Since | Notes |
|---|---|---|---|
| eBay | Magical Listing (photo → title, category, specifics, price), plus a Magical Bulk tool for Seller Hub | 2024–25 | Photo-first flagship reportedly gated to casual/C2C sellers (2026) [1][2][8] |
| Poshmark | Smart List AI (photo → title, description, category) | Jan 2025 | Smart Sell automates offers; bulk Smart Sell added Jan 2026 [3][9] |
| Mercari | AI Listing Support (photo → description, condition, price) | Sep 2024 | Says listing time dropped to about 15 seconds (company-reported) [4] |
| Depop | One-photo AI listing (description, attributes, hashtags) | Sep 2024 | Tuned to Depop's casual voice [5] |
| Facebook Marketplace | Meta AI drafts title, price and description from photos. Standalone **Seller** app with bulk listing | Mar 2026 / Jul 2026 | Price suggested from similar local items [6][7] |

**Crosslisters (paid, built for resellers):**

| Tool | Price signal (verify on vendor page) | Auto-delist | AI listing | Mobile |
|---|---|---|---|---|
| Flyp | Free trial (about 100 days), then about $9/mo [10] | Yes (Chrome extension) | — | Extension-first |
| Vendoo | Free plan up to $149.99/mo; about $14.99 Starter cited Aug 2026 [11] | Yes | Prompt + photo; PhotoRoom backgrounds [12] | iOS/Android app, mixed reviews [12] |
| List Perfectly | $29–$249/mo [13] | Yes | — | Limited |
| Crosslist | About $29.99–$44.99/mo, AI add-on about $4.99 [14] | Yes | Photo → full listing + price (vendor claim) [14] | Web/extension |
| Nifty | About $25–$89.99/mo, credit-based AI [15] | Yes | Yes | Disputed [15] |

**Direct copy/paste look-alikes on the App Store:** Underpriced AI (a "paste kit" for Poshmark, Mercari
and Depop), SellOut, EZ Lister, Sell AI, ThreadMint AI, FlipLens AI, List My Closet, Lista [16]. Most
are free to start.

**APIs:** Poshmark has no third-party API. Depop's Seller API is partner-only. Mercari has no public
listing API that I found. eBay has an open Inventory API, but 2026 license updates add "restricted APIs"
and AI content-use restrictions [17][18].

### Judgment: where Listly is and isn't defensible

**It will be shipped free by someone else, or already is:**
- Photo → listing copy. All five target marketplaces already do this.
- Price suggestions. Mercari, Meta and eBay already suggest prices, and the one-pager *excludes* them.
  Maya's own scenario has Listly "suggest a price range," so the persona promises something the scope
  doesn't include. That's a visible gap against free tools.
- Marketplace-specific formatting. It's table stakes for every look-alike app.

**Plausibly defensible, but none of it is a moat on its own:**
1. **Honest condition capture ("ask, don't fill").** Native tools guess, and eBay sellers complain about
   AI inaccuracy [19]. Listly's "facts before fluency" principle is a real difference *if* it measurably
   reduces returns and "not as described" disputes. That's an evaluation claim you can test (§7).
2. **The canonical item record across marketplaces.** No marketplace will build a ledger of your
   listings on its *competitors*. This is structurally safe from the marketplaces, but crosslisters
   already offer it.
3. **Phone-first operation for Dre.** Crosslisters lean on browser extensions because of the API gaps.
   A reseller who works from a phone is underserved, if that reseller exists in numbers (§6, §7).
4. **The clear-out as a project** (tray, bundles, "more in your size"). It's a nice loop, but it isn't
   defensible, and it's worth less than it looks: Mercari bundles are initiated by buyers [20], and
   Depop's bundle settings are unclear in the sources [20].

**Recommendation:** Stop positioning Listly as "photo → listing, but better." Position it as **"the one
honest record of everything you're selling, wherever you sell it, from your phone."** Treat listing
generation as the input to that record, not the product. Add an AI price estimate, clearly labeled as a
guess, to MVP scope, or explicitly accept the gap against every free alternative.

---

## 3. Go-to-market

### Evidence
- ThredUp's 2026 report: 46% of resale shoppers discover items through social feeds, creators and
  in-person browsing. Gen Z drives 40% of resale growth [21]. That's shopper behavior, not seller behavior,
  but the same creators teach selling.
- r/Flipping has roughly 500K members (third-party estimate). There are also active r/Depop, r/Mercari,
  r/eBay and reseller Discord communities [22].
- App Store search for "AI listing" already returns at least eight look-alike apps [16].

### Judgment

**The first 100 users are hand-recruited, not discovered.** App Store search won't get you there: the
category is crowded, and a new app has no ranking.
- **Dre (target 50 of the first 100):** post in r/Flipping, r/poshmark and r/Mercari, plus 3–5 large
  reseller Facebook groups. Use those posts to recruit the §7 survey and diary study, then convert
  respondents to the paid beta. Lead with "tell us about your last double sale," not with an app pitch.
- **Maya (target 50):** recruit through people you know and through local "moving sale" and Buy Nothing
  style groups. Run a "clear out 10 items this weekend" challenge, with the tray as the hook.

**The first 1,000 come from micro-creators.** Recruit 10–20 reseller TikTok and YouTube creators with
5K–100K followers. Give them a revenue share on Reseller subscriptions. Content formats: "listing a
thrift haul from my phone in 15 minutes" (Dre) and "I cleared my closet in an afternoon" (Maya).
Crosslisters run affiliate-led growth in this space (judgment from how their blogs are structured; not
verified). Expect to compete for the same creators.

**Wedge marketplace.** For Dre, start with the **Poshmark + Mercari** pair, plus eBay as the third. Both
are clothing-heavy, neither has an API, and both are the platforms where a ledger and sold alarm matter
most. For Maya, **don't pick a marketplace. Pick a moment:** the clear-out (moving, a seasonal swap). Her
marketplace is whichever one she already has installed.

**Recommendation:** Make the first 100 a research cohort. Spend nothing on paid acquisition before the
§7 tests read out. Put creator revenue share and referrals into the Reseller beta plan.

---

## 4. Monetization and unit economics

### Evidence: platform fees
- **Apple:** 15% under the Small Business Program (proceeds under $1M; you must enroll) [23]. In the
  US, link-outs to web purchases currently carry **no** Apple commission, pending a court-set rate. Apple
  has proposed 15% [24].
- **Google Play (US):** 10% service fee on the first $1M, plus a 5% billing fee if you use Play
  Billing. External links and alternative billing skip the billing fee. Transaction reporting has been
  required since October 2026 [25].

### Evidence: model prices (third-party summaries; confirm on provider pages)
- Claude Haiku 5.5: $0.10 per million input tokens and $0.50 per million output tokens [26].
- Gemini 3.6 Flash: $1.50 per million input and $7.50 per million output. An image is about 1,120
  tokens on the related Flash Image model [27].

### Judgment: estimated AI cost per listing (my model, not measured)

Assumptions: 3 photos at about 1,500 tokens each, plus about 2,000 tokens of prompt and answers, gives
about 6.5K input tokens. Output covers up to 6 marketplace formats, about 2.5K tokens. A validator pass
adds about 3K input and 0.3K output. Allow 1.5 revisions on average.

| Model tier | Cost per generation | Per listing, with validator and revisions |
|---|---|---|
| Small, fast (Haiku 5.5 class) | about $0.002 | **about $0.003–$0.006** |
| Mid tier (Flash 3.6 class) | about $0.03 | **about $0.05–$0.08** |

Storage is negligible: 3 photos at about 2 MB each costs fractions of a cent a month.

What that means:

| Plan | Gross | Net of 15% store fee | AI cost | Read |
|---|---|---|---|---|
| Simple free allowance: 20 listings a month | $0 | $0 | $0.06–$1.60 per active user per month | Affordable at the low tier. Costly at scale on the mid tier. |
| Simple credit pack: $4.99 for 50 listings | $4.99 | about $4.24 | $0.15–$4.00 | **On the mid tier, the pack is break-even.** |
| Reseller: $12.99/mo, about 150 listings | $12.99 | about $11.04 (more if billed on the web) | $0.45–$12.00 | Fine on the low tier. Underwater on the mid tier at heavy use. |

**Price positioning.** The PRD's $9.99–$19.99 Reseller range competes with Flyp at about $9/mo *with*
auto-delist [10] and Vendoo's Starter at about $14.99 [11]. A manual-alarm product at $19.99 will lose
on that comparison. Start at **$9.99–$12.99**, and justify it on mobile-first speed and listing accuracy.

**Recommendations**
1. Default every generation to the small model tier, with a measured quality gate. Escalate to a larger
   model only when the validator fails. Put a cost cap per user per month in the AI gateway from day one.
2. Simple mode: free, 20 listings a month. Offer an optional $4.99 pack and **no subscription**. Treat
   it as acquisition, not revenue.
3. Reseller mode: about $9.99–$12.99 a month with a 30-day trial. That's long enough to "catch one
   double sale," as the persona doc says. In the US, sell it **through a web checkout link-out** while
   the zero-commission ruling holds. Use the store's own billing as the fallback. Get a legal check on
   the current Apple and Google link-out terms before launch.
4. Instrument AI cost per listing in beta, and re-price after 30 days of real data.

---

## 5. SellerStudio's role

### Evidence
- Photo cleanup is already a commodity inside the incumbents. Vendoo uses PhotoRoom for backgrounds [12].
  Mercari and Depop have Photoroom partnerships [4][28].
- The SellerStudio PRD itself defers the parts with the most value: batch processing, lifestyle scenes,
  and cloud connectors are Phase 2. Its own MVP is crop, resize, background and export (SS-03, SS-04, SS-08).
- The architecture warns that "one purchase automatically unlocks all apps" can't be assumed, and lists
  cross-app entitlements as an open decision (ARCHITECTURE §12.7, Shared Services §9).

### Judgment
A second app means a second App Store listing, a second acquisition funnel, a second review cycle and
cross-app entitlements, all to sell a feature the incumbents bundle for free. That's the wrong shape for a
team that hasn't proved the first app.

The *useful* part of SellerStudio is the preservation principle: "do not erase condition evidence."
That's the same honesty position as Listly's, and it matters to Dre's vintage resale.

The shared-services plan is also over-built for MVP 1: a lead agent, seven specialists and a durable
workflow engine, for a product whose only output is text the user copies. One structured generation
call plus a deterministic validator does the same job.

**Recommendation:** Make SellerStudio a **Listly Reseller-mode feature**: a "fix photo" step (crop,
straighten, brighten, optional background, through a vendor API) inside the listing flow. Retire it as
a separate app unless research shows a maker or artist segment that would pay for it alone. Shrink
"shared services" to what Listly needs now: auth, the item record, assets, the AI gateway with cost
caps, and usage metering. Defer the orchestrator and specialist agents until there's a second
consumer.

---

## 6. Platform

### Evidence
- Dre's persona says "sometimes a laptop for bulk work and spreadsheets," and lists "desktop pull" as a
  risk. That's a hypothesis.
- Crosslisters are extension- or web-first because Poshmark, Mercari and Depop have no third-party API
  [17]. Their auto-delist works by acting in logged-in browser sessions [17].
- Listly's architecture **forbids** "unsupported browser automation or scraping of seller accounts"
  (ARCHITECTURE §7).
- The scaffold already includes `react-native-web` and an `npm run web` script (`listly/package.json`).

### Judgment
Mobile-only is right for Maya. For Dre, it's an untested bet, and the evidence leans against it for bulk
work. The deeper issue isn't mobile versus desktop. It's that **the feature that makes crosslisters worth
paying for (auto-delist) depends on browser automation that Listly has ruled out.** That's a principled
choice, and it may be the right one, but then Reseller mode has to win on something else. A browser
extension built "earlier" would mean reversing that principle, which needs a marketplace terms-of-service
review first.

A **web companion** is a different matter. It's nearly free: the same Expo codebase renders on the web.
A read-mostly web view of the ledger and the copy-ready listings helps Dre at a desk without automating
anyone's site.

**Recommendation:** Keep the native app mobile-first. Ship the Expo web build as a companion in the
Reseller beta (ledger, bulk copy, CSV export). It also gives you a place for US web checkout. Don't build
an extension until the terms-of-service review and the §7 survey show auto-delist is the deciding factor.

---

## 7. Riskiest assumptions, in order, with the cheapest test

Each test fits in 2–4 weeks with no production code.

| # | Assumption | Why it ranks here | Cheapest test (2–4 weeks) | Kill / continue signal |
|---|---|---|---|---|
| 1 | **Sellers will open a separate app instead of the marketplace's own free AI.** | Every target marketplace now does photo → listing in-app [1]–[7]. If this fails, Simple mode has no reason to exist. | Clickable prototype versus the native flow, with 8 closet clearers and 5 resellers. Each lists 3 items both ways on their own phone. Time it, count corrections, ask which they'd use next week. | Fewer than half prefer Listly, or it's slower including the paste step → drop Simple mode as a standalone product. |
| 2 | **Someone pays within 90 days.** | The success target depends on it, and Maya probably won't (§1). | Landing page plus a **founding-reseller pre-sale** (for example, $29 for 3 months, refundable) promoted in 3 reseller communities. | Fewer than 15 pre-sales from about 1,000 page visits → rethink the Reseller value proposition before you build it. |
| 3 | **Resellers will keep a manual ledger up to date.** | Without APIs, the ledger is only as true as Dre's discipline. | 2-week diary study with 6–8 resellers: a shared sheet plus a forward-your-sale-email address that you process by hand. | Ledger accuracy under about 90% by day 10 → the sold alarm can't be the hero feature without email parsing. |
| 4 | **Double sales are frequent and painful for phone-first resellers who don't already use an auto-delister.** | No published data exists [29]. The whole Reseller pitch rests on it. | 100-response survey through r/Flipping and Facebook groups: marketplaces used, tool used, double sales in the last 30 days, monthly tool spend, phone versus desk share. | If most multi-marketplace sellers already use an auto-delister → there's no gap to sell into. |
| 5 | **Copy and paste is acceptable friction on each marketplace app.** | Category pickers, size fields and photo order can't be pasted. | Test copy and paste on real devices: 3 items × 4 marketplace apps, timing each field. | More than 60 seconds of paste overhead per listing → invest in deep links and a clipboard queue first. |
| 6 | **"Ask, don't fill" produces more accurate listings than native AI.** | This is the main quality difference you can claim (§2). | Evaluation set: 30 real items with known flaws. Compare Listly's prompt output with Poshmark's, Mercari's and eBay's drafts, scored for flaw mention and false claims. | No measurable difference → drop "honest" as a positioning claim. |
| 7 | **The AI cost fits the free tier.** | It's an estimate (§4), but cheap to confirm. | Script 50 real items through 2 model tiers and log tokens. | Small tier costs more than $0.01 per listing, or fails quality → resize the allowance. |
| 8 | **The "Listly" name can be cleared.** | It's PRD open item 1, and a late rename is expensive. | Trademark knockout search plus an App Store and Play Store name check. | Conflict found → rename before beta. |

---

## Change / Keep / Investigate

| Current decision | Call | Why (short) |
|---|---|---|
| Listly first, SellerStudio second | **Change** | SellerStudio becomes a Listly Reseller feature, not a second app (§5). |
| One Expo app for iOS and Android; desktop later | **Keep, with one change** | Ship the free Expo web companion with the Reseller beta. Hold off on an extension (§6). |
| One app, two modes; one data model | **Keep** | The data-model call is sound, and it makes option A cheap. |
| Simple mode ships first | **Keep, with one change** | Keep it as the free acquisition front door, and add a paid Reseller beta at about launch + 45 days (§1). |
| No marketplace APIs; copy and paste handoff | **Keep, and investigate** | It's forced for Poshmark, Mercari and Depop. Measure paste friction (§7 #5). Re-check eBay's 2026 API license terms before any eBay integration. |
| Bundles supported around the marketplaces | **Investigate** | Mechanics differ by marketplace, and the value to closet clearers is unproven. Keep "mark sold as bundle" and cut the rest until interviews (§2). |
| No price suggestion in MVP | **Change** | Every native tool suggests a price, and Maya's own scenario expects one. Add an estimate labeled as a guess. |
| Success target: paying sellers within 90 days | **Change** | Attach it to the Reseller beta, and make the README and one-pager agree (§1). |
| Free allowance + credit packs (Simple); subscription (Reseller); app-store billing | **Keep the model, change the details** | Small model tier by default. Reseller priced at $9.99–$12.99. US web checkout through link-out (§4). |
| Shared-services and multi-agent architecture | **Change for MVP** | Use one generation call plus a validator. Defer the orchestrator and specialists until there's a second consumer (§5). |
| No browser automation | **Keep, and investigate** | It's principled, but it removes auto-delist. Decide knowingly after the terms-of-service review and survey (§6). |

---

## Notes on the planning docs (PRD-lens review)

These are the gaps I'd fix when the Simple-mode PRD gets written. **I haven't changed any existing files.**

- **The docs contradict each other on scope.** PRD v0.2's MVP 1 targets Etsy, eBay and Shopify formats
  with `style.md` brand profiles as P0. The one-pager targets Depop, Poshmark, Mercari, Facebook
  Marketplace and eBay, and excludes brand profiles. The README says which doc wins, but the PRD still
  reads as current. Mark it superseded inline.
- **The success metrics have no baselines or targets.** "Time to first approved listing" needs a number,
  measured against the native flows from §7 #1.
- **The AI part has no autonomy or eval spec.** Drafting is non-deterministic. Its side-effect type is
  advisory (copy only, nothing is written to a marketplace), which is low risk. "No invented facts" is
  still a release criterion, though, and nothing yet defines how it's measured. §7 #6 is the starting
  evaluation set.
- **Known, assumed and decided are mixed together.** The personas say they're hypotheses, but the
  one-pager's MVP scope treats bundle frequency and copy/paste tolerance as settled. List them as
  assumptions with owners.

## Open questions

| Question | Who answers |
|---|---|
| Is 90 days still the target, and does it count Reseller-beta payers? | Founder / product owner |
| Is "no browser automation" a fixed principle, or open to review after a terms-of-service review? | Founder + legal |
| Which model provider is the default for generation, and what is the per-user monthly cost cap? | Engineering lead |
| Do current Apple and Google rules allow a US web-checkout link-out for the Reseller subscription at launch? | Legal |
| Are there makers or artists who would pay for SellerStudio on its own? | Research (interviews) |

---

## Sources

All accessed 2026-11-13. Publication dates are given where the source states them. **Vendor or
competitor source** marks commercial interest.

1. eBay Innovation, "'Magical' Listing Tool Harnesses the Power of AI…" — https://innovation.ebayinc.com/stories/magical-listing-tool-harnesses-the-power-of-ai-to-make-selling-on-ebay-faster-easier-and-more-accurate/ ; and "eBay reduces the time to list on mobile…" — https://innovation.ebayinc.com/stories/ebay-reduces-the-time-to-list-on-mobile-with-new-simplified-selling-tool-now-featuring-magical-listing-ai-technology/
2. ShopiFreaks, "eBay promotes its AI listing tools as leveling the field for small sellers while the flagship version stays closed to them," 2026-08-03 — https://www.shopifreaks.com/ebay-promotes-its-ai-listing-tools-as-leveling-the-field-for-small-sellers-while-the-flagship-version-stays-closed-to-them/ ; and "eBay doubles down on C2C…," Mar 2026 — https://www.shopifreaks.com/ebay-doubles-down-on-c2c-and-live-shopping-while-sidelining-business-sellers-with-feature-restrictions/
3. Retail Dive, "Poshmark generative AI Smart List tool," Jan 2025 — https://www.retaildive.com/news/poshmark-generative-ai-smart-list-tool/739025 ; Retail Brew, 2025-01-30 — https://retailbrew.com/stories/2025/01/30/poshmark-adds-a-new-ai-listing-tool-to-the-mix
4. Mercari press release, "AI listing support," 2024-09-10 — https://about.mercari.com/en/press/news/articles/20240910_aisupport ; Photoroom customer story (vendor source) — https://www.photoroom.com/customer-stories/mercari
5. Depop, "Depop launches AI-powered listing from one photo," Sep 2024 — https://news.depop.com/depop-launches-ai-powered-listing-from-one-photo/ ; Retail Dive — https://www.retaildive.com/news/depop-generative-artificial-intelligence-product-descriptions-photo/727860/
6. PYMNTS, "Meta AI Writes Listings and Sets Prices for Facebook Marketplace Sellers," 2026 — https://www.pymnts.com/meta/2026/meta-ai-writes-listings-and-sets-prices-for-facebook-marketplace-sellers/ ; TechCrunch, 2026-03-12 — https://techcrunch.com/2026/03/12/facebook-marketplace-now-lets-meta-ai-respond-to-buyers-messages
7. The Next Web, "Meta launches a standalone Seller app for Facebook Marketplace…," 2026-07-24 — https://thenextweb.com/news/meta-seller-app-facebook-marketplace-ai-listing ; Value Added Resource hands-on — https://www.valueaddedresource.net/meta-ai-listing-facebook-marketplace/
8. Chain Store Age, "eBay's latest AI seller tool enables instant multiple listings" — https://chainstoreage.com/ebays-latest-ai-seller-tool-enables-instant-multiple-listings ; Value Added Resource, "eBay Expands Magical AI Bulk Listing…" — https://valueaddedresource.net/ebay-expands-ai-bulk-listing-categories
9. Value Added Resource, "Poshmark Tests Smart Sell…" — https://www.valueaddedresource.net/poshmark-smart-sell-automate-offers-minimum-prices/ ; List Perfectly, "Poshmark Seller Updates (January 2026)" (vendor source) — https://listperfectly.com/?p=11288
10. Flyp pricing summaries (competitor sources): Crosslist — https://crosslist.com/?p=19002 ; Vendoo — https://blog.vendoo.co/flyp-vs-list-perfectly
11. Vendoo pricing: Tekpon — https://tekpon.com/software/vendoo/pricing/ ; Vendoo blog (vendor source) — https://blog.vendoo.co/vendoo-pricing-explained-and-why-its-worth-the-investment ; Nifty review, updated Oct 2026 (competitor source) — https://nifty.ai/post/vendoo-review
12. Vendoo cross-listing app page (vendor source) — https://vendoo.co/cross-listing-app ; Nifty, "Is Vendoo worth it" (competitor source) — https://nifty.ai/post/is-vendoo-worth-it
13. List Perfectly Help Center, "Subscription plans" (vendor source) — https://help.listperfectly.com/en/articles/11828301-list-perfectly-subscription-plans
14. PricingSaaS, "Crosslist Pricing Plans & History (2026)" — https://pricingsaas.com/companies/crosslist ; Crosslist, "Create listings with AI" (vendor source) — https://crosslist.com/features/create-listings-with-ai
15. Nifty docs, "Choosing a Plan" (vendor source) — https://docs.nifty.ai/getting-started/choosing-a-plan ; Vendoo, "Nifty AI pricing" (competitor source) — https://blog.vendoo.co/nifty-ai-pricing
16. App Store listings: Underpriced AI — https://apps.apple.com/us/app/underpriced-ai/id6757161449 ; SellOut — https://apps.apple.com/us/app/-/id6462701350 ; Sell AI — https://apps.apple.com/app/id6758883858 ; EZ Lister — https://apps.apple.com/us/app/id6692616510 ; ThreadMint AI — https://apps.apple.com/us/app/threadmint-ai/id6758372542 ; List My Closet — https://apps.apple.com/us/app/id6758005659 ; Lista — https://apps.apple.com/app/id1634103692 ; Underpriced iOS help — https://underpricedai.com/help/ios-app
17. Depop Partner API reference — https://partnerapi.depop.com/api-docs/reference/ ; "Does eBay, Poshmark, and Mercari Allow Third-Party Apps for Cross-Listing?," Mar 2025 — https://mylabelhaven.blogspot.com/2025/03/does-ebay-poshmark-and-mercari-allow.html
18. eBay Developers Program, Connect 2026 program updates (PDF) — https://developer.ebay.com/cms/files/connect-2026/developer_program_updates_2026_connect.pdf ; Q3 2026 newsletter — https://developer.ebay.com/updates/newsletter/q3_2026
19. Value Added Resource, "eBay Calls AI Magical Listing A Success Amid Growing Seller Complaints" — https://www.valueaddedresource.net/ebay-ai-magical-listing-complaints/
20. Crosslist, "How to bundle on Mercari" (vendor source) — https://crosslist.com/blog/how-to-bundle-on-mercari ; OneShop, "Depop Bundles" (vendor source) — https://tools.oneshop.com/blog/bundles-in-depop ; Crosslist, "How to bundle on Poshmark" (vendor source) — https://crosslist.com/blog/how-to-bundle-on-poshmark
21. ThredUp, 14th Annual Resale Report, 2026-04-02 — https://newsroom.thredup.com/news/thredup-14th-resale-report ; report PDF — https://cf-assets-tup.thredup.com/resale_report/2026/ThredUp_Resale_Report_2026.pdf
22. The Hive Index, "About r/Flipping" (third-party aggregator) — https://thehiveindex.com/communities/r-flipping/ ; "Reselling communities on Reddit" — https://thehiveindex.com/topics/reselling/platform/reddit/
23. Adapty, "App Store Small Business Program" (vendor source) — https://adapty.io/blog/app-store-small-business-program/ ; Apple newsroom, EU changes, Aug 2026 — https://www.apple.com/ca/newsroom/2026/08/apple-announces-changes-for-apps-in-the-european-union/
24. MacDailyNews, "U.S. Supreme Court clears path for App Store commission showdown…," 2026-08-14 — https://macdailynews.com/2026/08/14/u-s-supreme-court-clears-path-for-app-store-commission-showdown-as-apple-must-defend-its-rates-in-lower-court/ ; MacRumors, 2026-04-29 — https://www.macrumors.com/2026/04/29/epic-games-wins-reversal-app-store-fee-battle/
25. Android Developers Blog, "Play expanded billing," Jun 2026 — https://android-developers.googleblog.com/2026/06/play-expanded-billing.html ; Google Play Console Help — https://support.google.com/googleplay/android-developer/answer/15582165?hl=en ; Android Headlines, Jun 2026 — https://www.androidheadlines.com/2026/06/google-play-store-external-billing-fee-changes.html
26. VKTR, "Anthropic cuts small-model pricing 90% with Claude Haiku 5.5" — https://www.vktr.com/ai-platforms/anthropic-cuts-smallmodel-pricing-90-with-claude-haiku-55/ ; Kanaries, "Haiku pricing" — https://docs.kanaries.net/articles/haiku-pricing
27. Hashnode, "Gemini API Pricing in 2026: What the New 3.6 Flash Rates Mean…" — https://hashnode.com/blog/gemini-api-pricing-2026 ; Google Cloud Vertex AI pricing — https://cloud.google.com/vertex-ai/generative-ai/pricing
28. Photoroom, Depop case study (vendor source) — https://www.casestudies.com/company/photoroom/case-study/depop-boosts-listings-15-with-photoroom
29. EcommerceBytes seller survey (self-selected) — https://www.ecommercebytes.com/2022/04/20/seller-survey-results-how-to-attract-buyers-to-online-marketplaces/ ; ChannelEngine, Marketplace Seller Trends Report 2026 — https://www.channelengine.com/hubfs/Marketplace_Seller_Trends_Report_2026.pdf
