---
type: prd
product: go-commerce-listly
feature: listly-mvp-1
feature_type: agentic # AI groups photos, extracts facts from speech, drafts listings and estimates price
aliases: [Listly reseller-first MVP 1]
status: draft
author: PM Lead (prd-generator)
created: 2026-11-13
updated: 2026-11-13
source:
  - docs/ideas/listly.md
  - docs/strategy/listly-recommendation-2026-11.md
  - docs/strategy/strategy-review-2026-11.md
  - docs/personas/part-time-reseller.md
  - docs/personas/closet-clearer.md
  - docs/design/listly-mvp-1/initial-prototype.html
supersedes: MVP 1 scope in docs/planning/Listly_PRD.md v0.2 (principles, data model and security sections still apply)
published: []
---

# PRD: Listly MVP 1 — haul to paid
**Product:** Listly · **Product line:** GO Commerce · **Vertical:** — (not a ZAIDYN product) · **PM:** [TBD — owner] · **Status:** Draft
**Version:** 8 (v2 added the Home dashboard, Active listings, Profile and main navigation, R-29 to R-32; v3 added onboarding and marketplace connections, R-33 to R-35; v4 added first-run tips and the how-to, R-36 and R-37, both P0; v5 adds AI background editing and a Listly connector for Claude and ChatGPT, R-38 and R-39 at P2; v6 raises both to P1, after launch; v7 added trades as a way an item leaves inventory, R-40, and parked a Listly trade space and marketplace in the backlog; v8 applies eleven PM decisions from story writing, D-1 to D-11 in §9.6: the trial counts drafted items and locks the rest of a haul, the Clear-out Pass gets the sold-everywhere checklist, new R-41 Save photos and R-42 Item detail, a shipping choice on Mark sold, Undo and revert, a typed bin field, and smaller fixes including M-10 to M-13) · **Last updated:** 2026-11-13 · **Prototype:** [docs/design/listly-mvp-1/initial-prototype.html](../design/listly-mvp-1/initial-prototype.html)

**Depth: Full.** Listly is an AI feature (`feature_type: agentic`), so Full is the default. The AI part is
advisory: it drafts and suggests, and never acts outside Listly. §9.3 is therefore as short as the rules
allow.

## 1. Summary

People who resell secondhand goods list the same item 2–4 times across marketplaces, lose track of where
it's listed, and sometimes sell it twice. Every marketplace now drafts listings from a photo for free, but
only for itself. Listly MVP 1 is a paid phone app that turns a whole haul into ready-to-paste listings for
every marketplace, then tracks where each item is listed, what sold and what it made. The expected outcome
is paying sellers from launch day: 3 free listings, then a $12.99/month Reseller plan or a $6.99 one-time
Clear-out Pass.

## 2. Stakeholders and contacts

| Name | Role | Involvement |
|---|---|---|
| [TBD — owner] | Founder / product owner | Decides scope, pricing, success target |
| [TBD — owner] | PM | Owns this PRD and the pre-launch tests |
| [TBD — owner] | Design (ux-lead) | Prototype, copy, and design-system gaps |
| [TBD — owner] | Engineering lead | Architecture, AI gateway, evals (§9.3) |
| [TBD — owner] | Legal | App-store billing, US web checkout, marketplace terms, privacy |
| [TBD — owner] | Growth | Pre-sale, reseller communities, creator program |

## 3. Background and why now

- **Listing from a photo is now free inside every target marketplace.** eBay, Poshmark, Mercari, Depop
  and Facebook Marketplace each draft a listing from photos in their own app. Meta added a standalone
  Seller app with bulk listing in July 2026. (Strategy review §2, sources 1–8.)
- **Sellers pay for the cross-marketplace work.** Crosslisting tools cost about $9–$69 a month (Flyp,
  Vendoo, List Perfectly, Crosslist, Nifty), and they lean on browser extensions and auto-delisting
  because Poshmark, Mercari and Depop have no listing API for third parties. (Strategy review §2, §6.)
- **The earlier plan couldn't make money in 90 days.** "Simple mode first" with a free allowance would
  compete with free built-in tools and wouldn't produce payers. (Strategy review §1.)
- **AI photo editing is already free in the marketplaces.** eBay's app removes a photo's background and
  places the item on an AI-generated backdrop, in the US, UK and Germany [S1]. Depop and Mercari use
  Photoroom for photo cleanup, and Vendoo builds it in [S2]. So background editing is expected, not a
  differentiator.
- **Marketplaces judge edited photos on accuracy.** eBay doesn't ban AI-edited photos, but every photo
  must accurately show the item, and used items can't use stock photos [S3]. Etsy, since October 2026,
  requires an unedited photo of the actual item and disclosure of AI-modified images [S3].
- **Claude can't edit images itself.** Claude reads images but doesn't generate or edit them; editing
  comes from a separate image model [S4]. OpenAI's image models can edit, billed by token, at an
  estimated $0.006 to $0.21 per image, with edits costing more [S5].
- **AI assistants now have app directories.** ChatGPT's app directory (Apps SDK, built on the Model
  Context Protocol, MCP) takes third-party apps after review [S6]. Claude's connector directory grew
  past 200 connectors in 2026, including consumer apps such as Instacart, Uber and Spotify [S7]. One MCP
  server can serve both.
- **If we do nothing:** Listly ships a free feature that every marketplace already gives away.

**The evidence is thin where it matters most.** No seller interviews have been run. Double-sale
frequency, willingness to pay $12.99 without auto-delisting, and phone versus desk use are all unproven.
§9.5 lists how each gets tested.

## 4. Problem statement

**The user:** a part-time reseller (Dre) who lists 10–50 items a week on 2–4 marketplaces. They
re-enter each item for every marketplace and keep track in a spreadsheet they fall behind on. When
something sells, they rush to remove it everywhere else, sometimes hours later. Each double sale means
a cancellation, a fee and a hit to their seller rating.

**The occasional seller:** a closet clearer (Maya) who has the same listing chore a few times a year,
without the tracking problem.

The user and the buyer are the same person, so there's no split between the two problems.

All of the above comes from proto-personas and hasn't been validated.

## 5. Objective and key results

**Objective:** prove that resellers will pay for phone-first, cross-marketplace selling before Listly
invests in automation.

| Key result | Target | Source of target |
|---|---|---|
| KR1. Pre-sale: people who pay or reserve, from about 1,000 landing-page visits | ≥ 15 | Recommendation, "Test before building" |
| KR2. Paying sellers 90 days after launch | [TBD — owner], set after the pre-sale | README success target |
| KR3. New users who copy their first listing within 3 minutes of installing | Baseline n/a; target [TBD — PM] | One-pager success target |
| KR4. Trial-to-paid conversion, reported by trial format | [TBD — PM], set after the trial test | One-pager |
| KR5. AI cost per listing | ≤ $0.01 | Strategy review §7 #7 signal |

## 6. Users and segments

| Segment | Plan | Frequency | What they see |
|---|---|---|---|
| **Part-time reseller** (primary) | Reseller plan | Weekly or daily | Everything: haul mode, copy for every marketplace, ledger, sold-everywhere checklist, profit tracker |
| **Closet clearer** (secondary) | Clear-out Pass | 2–4 times a year | Home, haul mode, copy for every marketplace, Active listings, item detail, mark sold, the sold-everywhere checklist (a safety feature, D-2 in §9.6), money made, Profile. No profit tracker |

**The asymmetry:** the Reseller plan's tracking screens are clutter for the occasional seller. The plan
the user buys decides which screens show, over one data model.

## 7. Value proposition

| Job | Today's alternative | What Listly does better | Defensible? |
|---|---|---|---|
| List a haul fast | The marketplace's own AI, one item at a time, one marketplace at a time | Batch capture with voice answers, drafted for every marketplace at once | Partly. Meta's Seller app batches, but only for Facebook |
| List the same item on 2–4 marketplaces | Re-typing, or a crosslister ($9–$69/mo, mostly extension- or desk-based) | One item record, ready-to-paste copy per marketplace, all on the phone | Yes against the marketplaces; no against crosslisters on automation |
| Avoid double sales | Crosslisters' auto-delist, or remembering | Sold-everywhere checklist with links, until the seller confirms | Weaker than auto-delist. Wins only if phone speed and price matter more |
| Know what you made | Spreadsheets | Profit after each marketplace's fees and shipping, CSV export | Yes. No marketplace will report on its competitors |
| Clean up photos | eBay's free background swap; Photoroom and similar apps | Cleanup on the item record, with every flaw kept visible and the original always kept (R-25, R-38) | No. Expected, not a differentiator |
| Sell from an AI assistant | Nothing found for resale listings [H] | A Listly app in ChatGPT and a connector in Claude (R-39) | Early-mover and distribution, not a moat. Demand unproven |
| Avoid returns | AI that guesses condition | Asks for flaws and never fills facts in | Plausible, and testable (§9.3 Evaluation) |

## 8. Goals and non-goals

**Goals**
1. A reseller lists a 10-item haul for 3 marketplaces in one sitting from their phone (KR3; time target
   [TBD — PM]).
2. Every sale recorded in Listly shows each other marketplace where the item is still listed, until the
   seller confirms it's removed.
3. Net profit per item and per month, after each marketplace's fees.
4. Revenue from launch day (KR1, KR2).

**Non-goals**
- **Automatic delisting or a browser extension.** The architecture rules out browser automation. Decide
  after a marketplace terms-of-service review.
- **Posting, changing or removing listings through any marketplace.** Poshmark, Mercari, Depop and Facebook Marketplace offer no API for it. The eBay connection in MVP only reads orders and listing status (R-35).
- **A free tier or free monthly allowance.** The 3 free listings are the trial.
- **Listly inside ChatGPT or Claude in MVP 1.** It's a distribution bet with its own `write` risks; it gets its own PRD (R-39).
- **A Listly trade space or Listly marketplace.** Listly records trades made elsewhere (R-40) but doesn't host, match or broker them. A user-to-user
  trade space, and later a Listly marketplace, is a two-sided business with its own trust and safety, shipping, dispute, payment and tax work, and
  it would put Listly in competition with the marketplaces it serves. Parked in the backlog as GC-001, with a trigger to revisit.
- **A sourcing scanner ("is this worth buying?").** It needs sold-price data Listly doesn't have. Version 2
  candidate.
- **Brand-voice profiles, Etsy or Shopify formats, and bundle discount helpers.** Wrong segment, or value
  not proven.

## 9. Solution

### 9.1 Experience

The prototype is the reference for flows and screens. Open it and use **Prototype controls → Key task
flows**.

| Flow | Path | Requirements |
|---|---|---|
| 0. Onboarding | Welcome → where do you sell? → create account → camera, microphone and AI notice → first haul | R-23, R-33 |
| 1. First haul to paid | Photograph haul → check grouping → answer by voice → drafting (first 3 items) → copy listings and save photos → pick a plan (when drafting item 4, or at Finish haul) → back to the haul → draft the rest → Finish haul → the tab the haul started from | R-1 to R-12, R-18, R-32, R-41 |
| 2. Sold → remove it everywhere else | Items → item detail → mark as sold (or traded) → still live on X, Y → bin and net profit; Undo for 10 s | R-13 to R-16, R-40, R-42 |
| 3. Check profit | Items → Profit | R-16, R-17 |
| 4. Occasional seller | Haul and copy → pick a plan → back to the haul → Finish haul → Clear-out Pass home | R-18, R-19, R-32 |
| 5. Open the app (returning user) | Home dashboard → the item needing action, Active listings, a new haul, or Profit | R-29, R-30, R-32 |
| 6. Manage my account | Profile → plan and usage, marketplaces, data, notifications, sign out | R-31 |
| 7. Connect marketplaces | Profile → Marketplaces and connections → link a shop, or connect eBay | R-34, R-35 |
| 8. Learn how to use Listly | First visit to a key screen → tips; or the How-to card on Home, or Profile → Help → video and steps | R-36, R-37 |
| 9. Look after one item | Listings (or the ledger) → item detail → edit photos, facts, bin or cost; copy listings; mark sold or traded; change status back to listed; delete | R-42, R-9, R-13, R-30 |

**Main navigation (R-32):** a tab bar with **Home · Listings · New haul · Profit · Profile**. New haul is
the central action. Clear-out Pass users see Home, Listings, New haul and Profile; the Profit tab is
hidden for them (R-18).

**States every screen needs:**
- **Empty:** no items yet; no sales yet for Profit; a new user's Home (one action: start your first haul);
  no active listings.
- **Loading:** drafting, with a progress indicator and Cancel (R-7).
- **Error:**
  - voice not understood (R-6);
  - grouping failed (R-5, M-10);
  - drafting failed, or failed for only some items (R-7);
  - purchase failed (R-3);
  - camera or microphone permission denied (R-4, R-6);
  - photo library permission denied (R-41);
  - notification permission denied (R-15).
- **Partial data:** sold items with no cost (R-16).
- **Entitlement:** the trial is used up, which locks undrafted items and shows the paywall (R-1, R-2); the
  Clear-out Pass has expired or reached its listing limit (R-18).

**The prototype (v2) covers flows 0–8.** It's still missing editing a drafted field before copying it
(R-9), the Needs-action reminder notification and its permission request (R-15), the cost-entry screen
(R-16), and everything v8 added: Save photos (R-41), item detail (R-42), the shipping field on Mark sold
(R-14), Undo (§9.6 D-6), locked undrafted items (R-1), returning to the haul after a purchase (R-32), the
checklist for Clear-out Pass users (R-18) and the "step n of 4" onboarding count (R-33). **The prototype
must be updated to follow v8** before the Phase 0 prototype test.

### 9.2 Requirements

| ID | Requirement | Priority | Acceptance criteria | Notes |
|---|---|---|---|---|
| R-1 | **Trial: 3 free listings, no card.** | P0 | Given a new account, when it drafts listings, then the first 3 items drafted are free. A listing is counted when its draft finishes, once per item, not once per marketplace. Every item in a haul can still be photographed, grouped and given facts; items after the third show as ready to draft, with a lock, until a plan is chosen, and nothing entered is lost. A counter shows "Free listings: n of 3 left". Deleting a drafted item (R-42) doesn't refund it. | D-1 (§9.6) [H]. Alternative under test: a 7-day trial that renews automatically (§15) |
| R-2 | **Paywall at the moment of value.** | P0 | Given the trial is used up, when the user tries to draft a 4th item, or taps Finish haul with undrafted items, then the paywall shows both plans with price, period, limits and renewal terms. "Not now" returns to the haul: drafted listings stay copyable, and undrafted items stay saved and locked. The paywall never hides listings already drafted. | Prototype: Paywall; D-1 |
| R-3 | **Purchases and entitlements.** | P0 | The Reseller plan (monthly $12.99 / yearly $99) is an auto-renewing subscription; the Clear-out Pass ($6.99) is a one-time purchase lasting 30 days. Purchases go through App Store or Google Play billing. Entitlements are checked on the server. Restore purchases works on reinstall. A failed purchase says the user wasn't charged and offers Try again. | US web checkout for the Reseller plan pending legal (§15) |
| R-4 | **Haul capture.** | P0 | The user can take photos with the camera, or add them from the photo library, in one session. A "Next item" marker can be placed between items. Originals are kept unaltered. If camera permission is denied, the screen explains how to enable it and offers the library instead. | |
| R-5 | **AI photo grouping, confirmed by the user.** | P0 | Given a haul's photos, the system proposes items, each with its photos. The user can move a photo between items, split an item and merge two items before continuing. No facts or drafts are generated until the user confirms the grouping. "Next item" markers always override the AI. | P-01 |
| R-6 | **Facts by voice or typing, never invented.** | P0 | For each item the user can speak or type brand, size, measurements, flaws and condition; flaws and condition are required (§9.3c). The system fills a field only from what the user said or typed. A field the user didn't answer stays blank and is never filled from the photo. If speech isn't understood, the user can try again or type. If microphone permission is denied, typing is offered. The facts step also has an optional **bin** field: typed only, prefilled with the default bin (R-31), suggesting bins the seller has used before. Bin is never sent to the AI and never appears in a draft. | P-02; principle "facts before fluency"; bin D-5, D-11 [H] |
| R-7 | **Batch drafting with progress and cancel.** | P0 | After the last item's facts, the system drafts every item for every marketplace the user sells on. Progress shows within 1 second, and Cancel is available while drafting runs (§9.3 governance rules). Cancel keeps all photos and answers. If some items fail, the drafted ones are kept and each failed item offers Try again. A failure never uses up a trial listing. | P-03; M-01, M-03, M-04 |
| R-8 | **Marketplace-formatted copy.** | P0 | Drafts exist for eBay, Poshmark, Mercari, Depop, Facebook Marketplace and a generic format. Each has title, description, brand, size, condition and price fields. Titles respect each marketplace's character limit, and the count is shown. Each field has one-tap Copy with a confirmation. | Title limits to be confirmed per marketplace [TBD — eng lead] |
| R-9 | **Editable drafts.** | P0 | The user can edit any drafted field before copying. Edits are saved per marketplace. The AI's original draft is kept as a version and can be restored. | Not in the prototype |
| R-10 | **Honest flaw wording.** | P0 | Every flaw the user stated appears in the description of every marketplace's draft. No draft states a brand, material, measurement, authenticity or condition the user didn't give. | Measured by the eval set (§9.3) |
| R-11 | **Price estimate, labeled as a guess.** | P1 | Each item shows a price range labeled "Estimate from similar items. A guess, not based on sold prices." The estimate is never put into a field without the user copying or editing it. | P-04 |
| R-12 | **Record where it's listed.** | P0 | After copying, the user can mark the item listed on a marketplace, optionally pasting the listing link. "Open [marketplace]" opens that marketplace's app where a deep link exists, otherwise its website. | Deep-link support per marketplace [TBD — eng lead] |
| R-13 | **Item ledger.** | P0 (Reseller) | Items shows every item with its marketplaces, days listed, price, status (listed, sold, traded, stale at 30+ days) and bin. It can be filtered by status. A row opens item detail (R-42). Empty state: no items yet, with a start-a-haul action. | Bin is a typed free-text field, entered on the facts step (R-6, D-11) |
| R-14 | **Mark sold.** | P0 | The user records the marketplace, the sale price and shipping, as one of: **Buyer paid**, **I paid $__**, or **Free shipping (I paid)**, which asks for the amount. The choice is preselected from Selling defaults (R-31). Shipping can be skipped: profit then shows as an estimate labeled "shipping not entered", flagged like a missing cost (R-16), until the seller adds it from item detail (R-42). Shipping is never counted as $0 unless the buyer paid. The item's bin shows on this screen. The item's status changes to sold, with the date. A 10-second Undo follows. | D-5, D-6, D-9 |
| R-15 | **Sold-everywhere checklist.** | P0 | Given an item sold (or traded, R-40) on one marketplace and listed on others, on either plan, a blocking banner names each other marketplace where it's still listed, with a link to that listing. Where no link was saved, the row offers "Open [marketplace]" (its app or website) and prompts the seller to search for the item there. Each shows "Still live" until the user ticks "I removed it", which has a 10-second Undo. Listly never shows a listing as removed until the user confirms it. "Remind me in 1 hour" leaves the item flagged and sends a reminder; the first time, it asks for notification permission, and if that's denied, the item stays flagged on Home and no reminder is sent. | Both plans by D-2; D-6, D-7 |
| R-16 | **Profit tracker.** | P0 (Reseller) | The user can enter what they paid per item. Net profit = sale − marketplace fee − shipping paid by the seller (R-14) − cost. It's shown per item, per month and per marketplace. Sold items with no cost, or with shipping not entered, are counted and flagged ("n sold items have no cost", "n sales have no shipping") with an action to add them; their profit is labeled as an estimate. A sale that's undone or changed back to listed (R-42) drops out of profit, and the totals recalculate. Fee rates come from a server-maintained table with an effective date, and are shown as estimates. | Fee table owner [TBD — owner]; rates must be verified before launch |
| R-17 | **CSV export.** | P1 | Items and sales export to CSV with bin, cost, fees, shipping and net. Trades are marked as trades (R-40). A sale changed by hand after eBay recorded it is marked as a manual change (R-42). The export is labeled as a record, not tax advice. | D-10, D-11 |
| R-18 | **Clear-out Pass scope.** | P0 | The pass gives 30 days and up to 100 listings: Home, haul mode, copy, save photos (R-41), Active listings (R-30), item detail (R-42), mark sold, the sold-everywhere checklist (R-15), money made and Profile. The profit tracker and the stale filter are hidden, but the data is kept. At expiry or the limit, the paywall shows again. Upgrading to the Reseller plan keeps every item. | Checklist included by D-2: closet clearers are the sellers most likely to sell one item twice |
| R-19 | **Upgrade suggestion.** | P1 | A Clear-out Pass user with 10+ active items, or who copies to a second marketplace, is offered the Reseller plan once per pass. It's dismissible, and the plan never changes without the user choosing. | |
| R-20 | **Usage and cost limits.** | P0 | The Reseller plan has a fair-use limit (proposed 500 listings a month). A per-user monthly AI cost cap is enforced in the server-side gateway. Reaching either limit shows M-06 and never loses work. | Final limits after the AI cost test |
| R-21 | **AI run logging.** | P0 | Every AI call (grouping, extraction, drafting, estimate) is logged with time, user, model, prompt version, input references, output, cost and latency. Photos and audio are referenced, not copied into logs. | Governance rule: log all AI actions |
| R-22 | **Instrumentation.** | P0 | Events exist for every metric in §12: install, first listing copied (with time since install), items per haul, drafting outcome, paywall shown, plan chosen, purchase outcome, sale recorded, checklist confirmed, cost entered, export, Home opened, Needs-action item opened, Listings filtered, unfinished haul resumed, account deleted, each onboarding step completed or skipped, camera and microphone permission outcome, shop linked or unlinked, eBay connection started, succeeded, failed or disconnected, tip shown, advanced or skipped, how-to card dismissed, video played (with % watched), written steps opened, photos saved, photo-library and notification permission outcomes, shipping entered or skipped, Undo used, status changed back to listed, item deleted. | Analytics tool [TBD — eng lead] |
| R-23 | **Privacy controls.** | P0 | Before the first upload, the user is told that photos and voice answers are processed by a third-party AI provider. The user can export and delete all their data. Location metadata is stripped from photos before processing. | §10 |
| R-24 | **Accessibility.** | P0 | Every control has a VoiceOver/TalkBack label and role. Text supports Dynamic Type to the largest size. Touch targets are at least 44 × 44 pt. Status changes (drafting done, copied) are announced. | GO Mobile Design System standard |
| R-25 | **Photo fix (non-generative).** | P1 (fast-follow) | Crop, straighten, brighten, and remove the background to plain white or a neutral colour, on a copy of the photo. Background removal cuts the item out; it never redraws, smooths or recolours any pixel of the item. The original is always kept and is the default first photo. A side-by-side compare is shown before the edited copy is used. | Replaces SellerStudio. Vendor (for example a background-removal API) [TBD — eng lead] |
| R-26 | **Sale email forwarding.** | P1 (fast-follow) | A per-user address accepts forwarded sale emails and proposes a "mark sold" for the matching item, for the user to confirm. | |
| R-27 | **Web companion.** | P2 | A read-mostly web view of the ledger, bulk copy and CSV export from the same Expo codebase. | Don't preclude it in auth or the API |
| R-28 | **Mark sold as a bundle.** | P1 | The user selects items sold together and enters one total. Listly splits the total across the items in proportion to their list prices. | |
| R-29 | **Home dashboard (start page).** | P0 | Given a signed-in user, when the app opens, then Home shows, in this order: (1) **Needs action**: every sold item still marked live on another marketplace (R-15), each opening its checklist; (2) **Unfinished hauls**: items photographed but not yet drafted or copied, with Continue; (3) **This month**: active listings, items sold and net profit (Reseller plan) or money made (Clear-out Pass); (4) **Stale**: count of items listed 30+ days, opening a filtered Listings; (5) plan status, showing the trial counter or the Clear-out Pass days and listings left. A **Start a haul** action is always visible. A section with nothing in it is hidden, not shown empty. A new user with no items sees one card: start your first haul, with the 3-free-listings note. Figures match Listings and Profit exactly. | Replaces "Clear-out Pass home" as the Pass user's start page; the Pass version hides net profit and stale items |
| R-30 | **Active listings.** | P0 | Listings shows every listing marked live, one row per item per marketplace, with item name, marketplace, price, days listed and bin. It can be filtered by marketplace and by status (active, stale 30+ days, sold-but-still-live) and sorted by days listed or price, with active as the default filter. A row opens item detail (R-42), offers "Open listing" when a link was saved (R-12), and offers "Mark sold" (R-14). Sold-but-still-live shows on both plans (D-2); the stale filter is Reseller only (R-18). A count per marketplace shows at the top. Empty state: no active listings, with Start a haul. The list never shows a listing as removed unless the user confirmed it (R-15). | Builds on the item ledger (R-13): R-13 is per item, R-30 is per listing. Available on both plans (§15) |
| R-31 | **Profile and account.** | P0 | Profile shows and lets the user change: **Account** (email, sign-in method, sign out); **Plan** (current plan, renewal or expiry date, listings used this month or this pass, Manage subscription opening the store's subscription page, Restore purchases, Upgrade where available); **Marketplaces** (a summary of which marketplaces Listly drafts for and which are linked or connected, opening Marketplaces and connections, R-34); **Selling defaults** (who usually pays shipping, which preselects the shipping choice on Mark sold, R-14; default bin, which prefills the bin on the facts step, R-6); **Notifications** (sold-item reminders, R-15); **Privacy and data** (AI processing notice, export all data, delete account and data, R-23); **Help** (the how-to video and steps, R-37; Show tips again, R-36; contact and feedback); app version. Deleting the account asks for confirmation, states that it can't be undone, and states that an active subscription must be cancelled in the store. | |
| R-32 | **Main navigation.** | P0 | A persistent tab bar with Home, Listings, New haul, Profit and Profile. New haul is the central, most prominent action. Clear-out Pass users don't see Profit. The current tab is marked for screen readers. Starting a haul from any tab returns to that tab when the haul is finished or cancelled. Buying a plan in the middle of a haul returns the user to the haul, not to Home. | Tab bar is a GO design-system gap; D-7 |
| R-33 | **Onboarding.** | P0 | Given a first launch, the user sees, in order: (1) **Welcome**: the promise and "your first 3 listings are free, no card needed", with Get started and "I already have an account"; (2) **Where do you sell?**: pick one or more of the five marketplaces, saved as the drafting set (R-34), with Skip drafting for all five; (3) **Create an account**: Continue with Apple, Continue with Google, or email; (4) **Camera and microphone**: why each is needed and the AI processing notice (R-23), shown before the system permission prompts, with "Not now" leading to the photo library and typing. Onboarding ends in a new haul (R-4). A progress indicator shows step n of 4. If camera or microphone access is denied, the haul works with the library and typing, and says how to turn access on. No step asks for payment. A returning user who signs in skips onboarding and lands on Home (R-29). | Account before the first photo is a hypothesis [H]; see §15 |
| R-34 | **Marketplaces and connections.** | P0 | Profile → Marketplaces and connections lists all five marketplaces. Each shows: a switch for "Draft listings for [marketplace]" (the drafting set used by R-7, R-8 and the draft tabs); a status (eBay: Connected / Not connected; the others: Linked / Not linked); and the action for that status. For Poshmark, Mercari, Depop and Facebook Marketplace, **Link your shop** saves the seller's username or shop link, so Listly can open their listings (R-12, R-30) and match forwarded sale emails (R-26); Unlink removes it. The screen states that these marketplaces don't let apps post or remove listings, and that Listly never asks for marketplace passwords. Linking never claims more than it does. | Linking is a saved username, not an account connection |
| R-35 | **eBay account connection.** | P1 | Given eBay is not connected, **Connect with eBay** first shows what Listly will be able to do (see orders and listing status) and won't (post, change or end listings, see payment details), then sends the user to eBay's own sign-in. On success the status shows Connected, with the eBay username, and eBay sales are recorded as sold automatically, which triggers the sold-everywhere checklist (R-15) for the item's other marketplaces. On cancel or failure, nothing changes and the user can try again. **Disconnect** stops automatic sale detection and says that eBay sales must be marked by hand again. Tokens are stored encrypted on the server and never on the phone. | Depends on eBay API licence terms (§15); P1 because MVP works by hand without it |
| R-36 | **First-run tips.** | P0 | Given a user's first visit to Home, Copy listings (the draft screen) or Listings, a tip appears next to one control at a time, with "Tip n of N", Next (Got it on the last) and Skip tips. Each screen has at most 3 tips. A set shows once per user, and the seen state is saved to the account so it doesn't repeat on a new phone. Skip tips turns off all remaining tips. Profile → Help → Show tips again resets them. Tips never cover the control they point at, never block the screen, are announced to screen readers, close with Escape or a tap outside, and respect reduced motion. Tips don't show during onboarding or on the paywall. | P0 by product decision (2026-11-13): launch requirement for activation (KR3). Which controls get tips is [H] |
| R-37 | **How-to video and steps.** | P0 | Help offers a how-to video of about 2 minutes [H], with captions on by default and a full transcript, plus the same content as written steps in five sections: photograph a haul, answer by voice, copy to your marketplaces, when something sells, see what you made. It's reachable from: (1) a **How-to card on Home**, shown to new users until they dismiss it, with Watch the video and Read the steps; (2) a "Watch how Listly works" link on a new user's empty Home; and (3) **Profile → Help**, always. Dismissing the card says where to find the how-to again. The video plays in the app, can be paused and closed, and doesn't autoplay. The written steps work offline. | P0 by product decision (2026-11-13), same reason. The video must be ready before launch. Video production owner [TBD — owner]. The steps must be updated when the flows change |
| R-38 | **AI background replacement.** | P1 | Given an item photo, the user can pick a background style (for example "wooden table", "plain studio") or describe one. The system replaces only the background, keeping the item's pixels unchanged (masked), and shows original and edited side by side. Every edited photo is labeled "Edited background" in Listly. The unedited original stays the first photo in every draft by default. Requests that change the item itself ("remove the stain", "make it look new") are refused with M-09. Each edit shows its cost against the plan's monthly edit allowance before it runs. Edits never run in the background or without a tap. | Generative, via an image model API (for example OpenAI's), not Claude, which can't edit images [S4]. Cost per edit [TBD — eng lead] [S5]. P1 (after launch, behind R-25) by PM decision, 2026-11-13. Not a differentiator on its own [S1, S2] and adds accuracy risk [S3], so it ships only once the photo-edit eval gate (§9.3) passes |
| R-39 | **Listly for ChatGPT and Claude.** | P1 (separate PRD) | One Listly MCP server, published as a ChatGPT app and a Claude connector, lets a signed-in user, inside the assistant: ask what's live, what sold, what needs action and what they made; and send photos to start a draft haul that appears in Listly for review. The assistant never posts, marks sold, or removes anything without a confirmation in the chat, and never sees payment details. In MVP 1, only the requirement to **not preclude it** applies: the server-side API is designed so these reads and the draft-haul create can be exposed later with the user's OAuth consent. | P1 by PM decision, 2026-11-13: its PRD starts right after MVP 1 launches, if the Phase 0 demand test supports it. Distribution bet, not a moat. Needs its own PRD: it's a `write` capability (creates drafts, could mark sold), so it needs gates and a traceability spine (§9.3) that this PRD doesn't carry. Store reviews apply [S6, S7] |
| R-40 | **Mark traded.** | P1 | From an item, the user can choose **Traded** instead of a marketplace sale. They enter where the trade happened (free text, for example "Facebook group" or "in person"), what they received, and its estimated value. The item's status changes to traded, with the date. Profit counts the estimated value as the sale amount, with no marketplace fee, and labels it "trade value (estimate)". The user can add what they received to inventory as a new item, with the trade value as its cost. The sold-everywhere checklist (R-15) runs for a traded item exactly as for a sold one. A 10-second Undo follows, and the trade can be changed back to listed from item detail (R-42). Traded items appear in the ledger filter and in the CSV export (R-17) as trades. | Listly only records trades made elsewhere; it doesn't host, match or broker them (see non-goals and backlog item GC-001). Trade value is the user's estimate, never Listly's |
| R-41 | **Save photos for posting.** | P0 | On the copy screen, **Save photos** saves the item's photos to the phone's photo library, in order with the original first, in an album named after the item, so the seller can attach them when posting. Location metadata is already stripped (§10). Photo-library permission is asked the first time; if it's denied, the screen explains how to turn it on. Photos already saved for that item aren't saved again. | D-3 [H]: copy-and-paste posting needs the photos on the phone |
| R-42 | **Item detail.** | P0 | A row in Listings, the ledger, Home or Profit opens the item. It shows photos (original first), facts, condition and flaws, bin and cost; where it's listed, with links; and its status history. Photos, facts, bin, cost and shipping can be edited, and edits are versioned (R-9). Actions: copy listings, mark sold (R-14), mark traded (R-40), change status back to listed, and delete. **Changing status back to listed** is logged in the history as a manual change, and profit recalculates (R-16). "I removed it" ticks are kept, because those removals happened; the seller is asked, for each marketplace they removed it from, whether to relist there, with the saved link or the copy (M-13). If eBay recorded the sale (R-35), M-12 first asks the seller to confirm the sale was cancelled or returned. **Delete** asks for confirmation, says it can't be undone, and doesn't refund a trial listing (R-1). | D-4, D-6, D-10 [H] |

### 9.3 AI and agentic design

The vocabulary below follows `zaidyn-pm-os`'s design-context pack. GO Mobile Design System has no AI
components, so pattern names describe behaviour, not components to import.

| Decision | Specification |
|---|---|
| Side-effect type | **`advisory`**. The AI proposes groupings, extracts facts from the user's own words, drafts copy and estimates a price. Nothing it produces leaves Listly, and nothing becomes an item fact without the user confirming it. Records are saved by deterministic code on a user action. |
| Maturity level | **AI Assisted.** The product surface drives the experience. A higher level would mean acting on marketplaces, which is out of scope. |
| Experience mode and behaviors | **Assist**: the user drives. Behaviors: **Generate** (drafts) and **Suggest** (grouping, price estimate). No Confirm or Execute, because there's no AI action to approve. |
| Pattern | **AI Assisted Outputs** (drafts inside a standard screen), Simple density. **Processing** for the drafting wait, Simple. **Recommendation Prompt** for the price estimate, Simple. **Escalation** for failures, mandatory. |
| Accountability mechanisms | **Traceability:** every AI run is logged (R-21), and the draft shows which facts came from the user (R-6). **Explainability:** the grouping is labeled as automatic and to be checked (R-5), and the price is labeled as a guess (R-11). **Reversibility:** AI drafts are versioned and restorable (R-9), and the grouping is editable before anything is drafted (R-5). **Escalation:** every failure has a recovery path (§9.3e). |
| Autonomy boundary | The system may group photos, transcribe and extract the user's answers into fields, draft copy and estimate a price, without asking. It may not invent a fact, mark anything listed or sold, or contact any marketplace. |
| Human in the loop | The seller confirms the grouping (R-5), sees every extracted fact (R-6), can edit every draft (R-9), and does every copy, post, sale and removal themselves. |
| Guardrails | Never state an attribute the user didn't give (R-10). Never describe an item better than its stated condition. Never present the price as based on sold data. Imported text and marketplace content are data, not instructions. Refuse requests to add claims the user hasn't made, such as authenticity (ambiguity library). | **Photo edits (R-25, R-38):** never alter, smooth or recolour the item; never remove or hide a flaw; always keep the unedited original as the default first photo; refuse item-changing requests (M-09).
| Evaluation | **Eval set:** 30 real items with known flaws and measurements, plus 10 hauls of 10+ items for grouping, plus the §9.3b near-misses. **Scored on:** flaw recall (every stated flaw present in every marketplace draft), unstated-attribute rate, title-limit compliance, extraction accuracy against the spoken answers, grouping accuracy, and a comparison with Poshmark's, Mercari's and eBay's own drafts. **Pass:** 100% flaw recall, 0 unstated attributes, 100% title compliance; grouping and extraction thresholds [TBD — eng lead]. **Owner:** [TBD — eng lead]. **Cadence:** before launch, and on every model or prompt change. | **Photo edits (R-38):** a set of 30 item photos with visible flaws; pass = 0 changed item pixels outside the mask tolerance [TBD — eng lead] and 100% of flaws still visible, judged by a person; plus every item-changing prompt in the ambiguity library refused.
| Failure behaviour | **Low confidence on grouping:** propose it and ask the user to check (M-05). **Speech not understood:** leave the field blank and ask (M-02). **Draft fails:** keep the inputs and offer retry (M-03, M-04). Wrong output can always be edited, and edits win. |
| Explainability | Labels on the grouping and the estimate. Each drafted field traces to the user's answers ("Heard: …"). |
| Cost and latency | **Cost:** estimated about $0.003–$0.006 per listing on a small model (strategy review §4, estimate), with a target of ≤ $0.01 and a per-user monthly cap (R-20). **Latency:** progress within 1 s and cancel while drafting runs. End-to-end drafting ceiling for a 10-item haul [TBD — eng lead]. | **Background replacement (R-38):** estimated $0.006–$0.21 per edit on OpenAI's image models, more for edits [S5]; capped by a monthly edit allowance per plan [TBD — PM].
| Data boundaries | Photos (location metadata stripped), the user's spoken or typed answers, and marketplace format rules may reach the model. Account details, payment data, sale prices, costs, profit and bins never do. | Photos sent for background edits go to the image provider only after the user taps to edit.

**Governance rules** (`strategy.md` §7):

| Rule | Status |
|---|---|
| Visible activity for operations over 3 s | Met by R-7 |
| Cancel for operations over 5 s | Met by R-7 |
| Explicit approval before an irreversible external action | Not applicable: Listly takes no external action, and the seller posts and removes listings themselves |
| Log all AI actions | Met by R-21 |
| Escalate gracefully | Met by §9.3e |
| Version AI artifacts | Met by R-9 |
| Never execute silently | Met: there's no autonomous execution |
| At least 2 of the 4 mechanisms | All 4 are met (table above) |

#### 9.3b Prompt and intent surface

There's no chat. The "prompts" are system calls triggered by the user's actions, plus the user's spoken
or typed answers.

| Prompt ID | Intent | Example input | Side-effect type | Out-of-scope near-miss |
|---|---|---|---|---|
| `P-01` | Group a haul's photos into items | 9 photos, with "Next item" after photo 4 | advisory | "Find matching items online" (no web lookup) |
| `P-02` | Extract item facts from the user's answer | "Levi's, medium, pit to pit twenty-one, length twenty-five, small mark on the left cuff" | advisory | "It's authentic vintage" stated as fact (see the ambiguity library) |
| `P-03` | Draft listings for each marketplace from confirmed facts | Confirmed facts for 3 items × 5 marketplaces | advisory | "Make it sound brand new" |
| `P-04` | Estimate a price range | Confirmed facts and photos for one item | advisory | "What will it sell for?" (only a labeled guess is offered) |
| `P-05` | Replace a photo's background, keeping the item unchanged (R-38) | "Put it on a plain wooden table" | advisory | "Remove the stain" / "Make it look new" (refused, M-09) |

**Ambiguity library**

| Phrasing | Why unsupported | What the system does | Safe alternative to offer |
|---|---|---|---|
| "Make it sound brand new" / "Don't mention the stain" | It contradicts the stated condition (R-10) | Keeps the flaw in every draft and shows M-07 | Edit the wording of the flaw, not whether it's there |
| "Remove the stain from the photo" / "Make the jacket look new" | Changes the item, which misrepresents it [S3] | Refuses and shows M-09; the photo is unchanged | Edit the background only, or retake the photo |
| "It's authentic" / "Genuine designer" | Listly can't verify authenticity | Records it as the seller's statement only if it's said as such; the draft never asserts it as verified | The seller adds the proof details themselves |
| "Like new" with no flaws mentioned | Condition stated, flaws not asked | Records the condition and asks "Any flaws?" once | Answer "no flaws" explicitly |

#### 9.3c Slots and resolution

| Prompt ID | Slot | Required? | Resolved from | If unresolved | If ambiguous between candidates |
|---|---|---|---|---|---|
| `P-02` | Brand | No | User's answer | Blank; the draft omits it | Show both and ask the user to pick (M-02) |
| `P-02` | Size | Yes for clothing and shoes | User's answer | Ask once; if still blank, the draft says "see measurements" | Ask (M-02) |
| `P-02` | Measurements | No | User's answer, in units as spoken | Blank | Ask (M-02) |
| `P-02` | Flaws | Yes, answered "none" or listed | User's answer | Ask "Any flaws?" once; can't continue until answered | n/a |
| `P-02` | Condition | Yes | User's answer, mapped to each marketplace's condition values | Ask once | Ask (M-02) |
| `P-01` | Item boundaries | Yes | "Next item" markers first, then the AI | Treat the whole haul as one item and ask the user to split | Propose, and the user moves photos (M-05) |

Field length default: 255 characters, except descriptions, which follow each marketplace's limit [TBD —
eng lead].

#### 9.3d Flow, gates, and the commit boundary

**Flow table only.** At `advisory`, the AI changes nothing, so there are no gates or commit boundary.

| Node ID | Type | What happens | Leads to |
|---|---|---|---|
| `N-01` | receive | Haul photos and "Next item" markers uploaded | N-02 |
| `N-02` | interpret | Photos grouped into proposed items (P-01) | N-03 |
| `N-03` | clarify | The user checks and edits the grouping | N-04 |
| `N-04` | interpret | Spoken or typed answers turned into fields (P-02) | N-05 |
| `N-05` | clarify | A missing required slot or ambiguous answer is asked about | N-04 or N-06 |
| `N-06` | validate | Facts complete enough to draft; cost cap and entitlement checked | N-07 or N-09 |
| `N-07` | interpret | Drafts generated for each item and marketplace (P-03), and the estimate (P-04) | N-08 |
| `N-08` | summarise | Drafts shown, editable and copyable | end |
| `N-09` | recover | A limit was reached or a failure occurred; message and recovery shown | N-06 or end |

#### 9.3e Messages and failure modes

The wording is `ux-lead`'s, written against the voice rules. This table sets intent only.

| Message ID | Trigger | Type | Blocks flow? | Requires user action? | Intent of the message |
|---|---|---|---|---|---|
| `M-01` | N-07 | progress | No | No (Cancel available) | Drafting is running, for how many items and marketplaces |
| `M-02` | N-05 | clarification request | Yes | Yes | Which fact wasn't understood, or which two values it could be; offer to try again or type |
| `M-03` | N-09 | failure | Yes | Yes | Drafting failed; photos and answers are saved; no trial listing was used; Try again |
| `M-04` | N-09 | partial success | No | Optional | Which items drafted and which didn't; retry the rest |
| `M-05` | N-03 | validation warning | No | Yes (confirm the grouping) | The grouping is automatic and should be checked |
| `M-06` | N-06 | failure | Yes | Yes | The listing limit or AI cap was reached; what's saved, when it resets, and the upgrade option if any |
| `M-07` | N-07 | validation warning | No | No | A stated flaw stays in the draft; how to change its wording |
| `M-08` | N-08 | final summary | No | No | n items ready for n marketplaces; trial counter |
| `M-09` | P-05 | validation warning | Yes | Yes | The edit would change the item, so it wasn't made; offer a background-only edit |
| `M-10` | N-02, N-09 | failure | Yes | Yes | Grouping failed; the photos are kept; try again, or continue with the haul as one item and split it by hand |
| `M-11` | P-05 | failure | Yes | Yes | The monthly photo-edit allowance is used up; when it resets; the upgrade option, if any; the photo is unchanged |
| `M-12` | R-42 | confirmation | Yes | Yes | eBay reported this sale; only undo it if the sale was cancelled or returned; the change is logged |
| `M-13` | R-42 | clarification request | No | Optional | The item is listed again; it was removed from these marketplaces; relist there, with the saved link or the copy |

| Failure | What the user sees | What was and wasn't committed | Recovery path |
|---|---|---|---|
| No result: the photos can't be grouped | M-05 with everything as one item | n/a | Split manually |
| Grouping call fails (timeout or provider down) | M-10 | n/a | Try again, or continue as one item |
| Photo-edit allowance used up (R-38) | M-11 | n/a | Wait for the reset, or upgrade |
| More than one result: the grouping is ambiguous | M-05 | n/a | Move photos |
| Camera or microphone permission denied | An explanation and a link to Settings | n/a | Library, or typing |
| An answer is ambiguous | M-02 | n/a | Pick a value, or type |
| Timeout or AI provider unavailable | M-03 | n/a | Try again; inputs are kept |
| Some items fail | M-04 | n/a | Retry the failed items |
| User cancels drafting | Back to facts; inputs kept | n/a | Draft again |
| Limit reached | M-06 | n/a | Wait for the reset, or upgrade |

**Terminal states:** answered (all drafted) · partial (some items) · unavailable (provider down) ·
excluded by entitlement (trial or limit used up).

#### 9.3f Traceability spine

**Capability type check:** `advisory` — Not applicable at this capability type.

### 9.4 Technical considerations

- **Platform:** one Expo (React Native) app for iOS and Android, on the existing scaffold and GO Mobile
  Design System. Supabase Postgres with row-level security, private object storage for photos, and a
  server-side AI gateway with no keys in the app (Listly PRD v0.2 §7–9 still apply).
- **Data model:** one canonical item with many marketplace listings, sales and costs. A sale links to one
  or more items (R-28).
- **AI architecture:** one structured generation call per step plus a deterministic validator (title
  limits, flaw presence, no unstated attributes). The lead-agent and specialist-agent design is deferred.
- **Design system:** GO provides only GoButton and GoCard. About 15 components must be added (see the
  prototype's assumptions). That's design-system work in this release, not a one-off per screen.
- **Entitlements:** server-side receipt validation for both stores. Keep the plan model portable to a
  web checkout.
- **No scraping or browser automation.** Deep links, saved shop links (R-34), and for eBay only, a read-only OAuth connection to orders and listing status (R-35). OAuth tokens are encrypted on the server, never stored on the phone, and never passed to the AI.

### 9.5 Assumptions

| Assumption | How it's tested | Source |
|---|---|---|
| Resellers will pay $12.99/month without auto-delisting | Founding-member pre-sale; go at ≥ 15 per ~1,000 visits | Recommendation |
| Haul mode is faster than their current method | Prototype test with 6–8 resellers | Recommendation |
| "3 free listings, then pay" converts at least as well as a 7-day trial | Split in the pre-sale | Recommendation |
| AI grouping is accurate enough that checking beats tagging | Eval set (§9.3) and the prototype test | Prototype [H] |
| Resellers will answer by voice | Prototype test | Prototype [H] |
| Sellers will keep the ledger true by hand | 2-week diary study | Strategy review §7 #3 |
| Copy-and-paste overhead is under 60 s per listing | Timing on real devices | Strategy review §7 #5 |
| "Ask, don't fill" is more accurate than the native AI | Eval set comparison | Strategy review §7 #6 |
| AI cost is ≤ $0.01 per listing | 50 items through 2 model tiers | Strategy review §4 (estimate) |

### 9.6 PM decisions (v8)

Made while writing stories, 2026-11-13, by the PM. Each one marked [H] is checked in the Phase 0 prototype test.

| ID | Decision | Changes |
|---|---|---|
| D-1 | The 3 free listings are the first 3 items drafted. The rest of a haul is captured and kept, locked until a plan is chosen. The counter shows listings left. [H] | R-1, R-2 |
| D-2 | Clear-out Pass users get the sold-everywhere checklist. It's a safety feature, and closet clearers, who aren't used to listing in several places, are the sellers most likely to sell one item twice. | R-15, R-18, R-30, §6 |
| D-3 | New R-41, Save photos for posting, P0. [H] | R-41 |
| D-4 | New R-42, Item detail, P0: the one place to edit, revert or delete an item. [H] | R-42, R-13, R-30 |
| D-5 | Shipping is recorded on Mark sold; the bin is entered on the facts step. | R-6, R-14, R-16, R-31 |
| D-6 | A 10-second Undo follows Mark sold, Mark traded and "I removed it"; later, a status can be changed back to listed from item detail. | R-14, R-15, R-40, R-42 |
| D-7 | Smaller fixes: a purchase mid-haul returns to the haul; a fallback when no listing link was saved; notification permission asked on the first reminder; condition is a required slot; onboarding shows step n of 4; M-10 and M-11 added; M-08 and M-09 reordered. | R-15, R-32, R-33, §9.3c, §9.3e |
| D-8 | The README, one-pager and personas are updated to match D-2 in the same change. | Other docs |
| D-9 | Shipping is a three-way choice (buyer paid, I paid, free shipping I paid). If skipped, profit is an estimate flagged "shipping not entered", never a silent $0. | R-14, R-16 |
| D-10 | The 10-second Undo reverts everything, ticks included. A later change back to listed keeps the "I removed it" ticks and offers to relist (M-13). A sale eBay recorded can be undone after a confirmation (M-12), logged as a manual change and marked in the CSV. | R-17, R-42 |
| D-11 | Bin is an optional typed field with suggestions from bins used before. It's never sent to the AI or put in a draft, and it's in the seller's CSV. Whether resellers label bins is checked in the haul-mode prototype test. [H] | R-6, R-13, R-17 |

## 10. Data, compliance, and governance

- **Data held:** account email; photos (which may show the user's home, face or address labels); voice
  answers; item facts; where items are listed; sale prices, costs and profit. No PHI and no patient or
  health data. Sales and profit are personal financial data.
- **Image editing provider (R-38):** photos sent for background replacement go to a second AI provider, which needs the same disclosure. Edited photos must meet each marketplace's photo rules; Etsy requires disclosure of AI-modified images [S3]. To Legal.
- **Third-party processing:** photos and answers go to an AI provider. This needs consent and disclosure
  (R-23) and app-store privacy labels. Retention of audio: [TBD — Legal]. The default proposal is to
  transcribe and then delete it.
- **Location metadata** is stripped before processing and before any photo is saved or shared.
- **CSV export:** labeled as a record, not tax advice. Wording to Legal.
- **Trades (R-40):** in the US, bartering is taxable income at fair market value ([IRS Topic 420](https://www.irs.gov/taxtopics/tc420)). Listly only
  records the user's own estimate and labels it as one. Hosting or brokering trades (GC-001) could bring reporting duties, so it needs a legal
  review before any build. To Legal.
- **Billing:** auto-renewal disclosure, restore purchases, and US web checkout for the Reseller plan
  (Apple's commission on link-outs is before a court; Google charges a service fee) go to Legal.
- **Marketplace terms:** copy-and-paste, deep links and saved shop links only, plus the read-only eBay connection (R-35), which needs a check of eBay's current API licence, including its 2026 restricted-API and AI-content rules. Listly never collects marketplace passwords. Any automation needs a terms review first.
- **Retention and deletion:** a full export and deletion path (R-23). The retention period for AI logs
  (R-21) is [TBD — Legal].

## 11. Commercial and delivery context

- **Packaging:** 3 free listings, then the Reseller plan ($12.99/month or $99/year) or the Clear-out Pass
  ($6.99 for 30 days).
- **Price check:** $12.99 sits between Flyp (about $9) and Vendoo's Starter plan (about $14.99), which
  both auto-delist. Don't price higher until the speed and profit tracking are proven.
- **Channel:** a founding-member pre-sale in reseller communities, then micro-creators with a revenue
  share (strategy review §3). App-store search is crowded and isn't relied on for the first 1,000 users.
- **Image edits:** generative background edits cost far more per use than listing text, an estimated $0.006–$0.21 each [S5]. They need a separate monthly allowance, and must not be unlimited on the $6.99 Clear-out Pass.
- **Margin:** after the 15% store fee, both plans keep most of their revenue on a small model. A mid-tier
  model would erase the Clear-out Pass margin under heavy use (strategy review §4).

## 12. Success metrics

Baselines don't exist yet because nothing has launched. Every metric depends on R-22.

| Metric | Type | Baseline | Target | Stretch | How measured | When |
|---|---|---|---|---|---|---|
| Pre-sale reservations per ~1,000 visits | Leading | n/a | ≥ 15 | [TBD — PM] | Landing page and payments | End of pre-sale |
| First listing copied within 3 min of install | Leading | n/a | [TBD — PM] | — | R-22 events | 30 days after launch |
| Items in first haul | Leading | n/a | ≥ 10 for resellers | — | R-22 | 30 days |
| Trial-to-paid conversion | Leading | n/a | [TBD — PM] after the pre-sale | — | R-22 and store reports | 30 and 90 days |
| AI cost per listing | Leading | Estimate $0.003–$0.006 | ≤ $0.01 | — | R-21 logs | Weekly |
| Eval: flaw recall / unstated attributes | Quality | n/a | 100% / 0 | — | Eval set | Every model or prompt change |
| Sales confirmed on the checklist within 1 h | Leading | n/a | [TBD — PM] | — | R-22 | 60 days |
| Paying sellers | Lagging | 0 | [TBD — owner] | — | Store and server entitlements | 90 days |
| Reseller plan retention after first renewal | Lagging | n/a | [TBD — PM] | — | Entitlements | 60 and 90 days |
| Clear-out Pass → Reseller upgrades | Lagging | n/a | [TBD — PM] | — | Entitlements | 90 days |

## 13. Release plan

| Phase | Scope | Gate to move on |
|---|---|---|
| 0. Tests (2–3 weeks) | Pre-sale, prototype test, survey, diary study, paste timing, eval set, AI cost check, name clearance | KR1 met, and haul mode faster for at least half the testers |
| 1. Closed beta | All P0 requirements (including the tips and the how-to video), with 20–50 hand-recruited resellers | Eval pass thresholds met; no data-loss bugs; purchases verified on both stores |
| 2. Launch | Public on both stores | Legal sign-off (§10) |
| 3. Fast-follow (about 30–45 days after launch) | R-25, R-26, R-28, R-38 (after R-25), other P1 requirements; R-39's own PRD starts | R-38: the photo-edit eval passes and the edit allowance is set. R-39: the Phase 0 demand test supports it |
| Later | R-27 web companion; decisions on auto-delisting and a sourcing scanner; a Listly trade-board test, then a Listly marketplace (backlog GC-001) | Terms review; sold-price data source; for GC-001, the trade-demand survey results and enough active users in one category [TBD — PM] |

There are no hard dates. Dates follow the Phase 0 results.

## 14. Risks

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Resellers won't pay without auto-delisting | Medium–High | High | Pre-sale before building; price below Vendoo; terms review for an extension | [TBD — owner] |
| Marketplaces add cross-listing or profit tools | Low–Medium | High | Cross-marketplace features no single marketplace will build; move fast on the profit tracker | [TBD — owner] |
| Manual ledger goes stale, so the checklist is wrong | Medium | High | Diary study; sale-email forwarding fast-follow (R-26) | [TBD — PM] |
| Hard paywall after 3 listings cuts sign-ups | Medium | Medium | Trial-format split test; "Not now" keeps the 3 listings | [TBD — PM] |
| Fee rates go stale, so profit is wrong | Medium | Medium | Server-maintained fee table with an effective date; shown as estimates | [TBD — owner] |
| AI states a flaw-free item, causing returns and trust loss | Low | High | R-10 validator and eval gate | [TBD — eng lead] |
| The design system lacks about 15 components | High | Medium | Plan design-system work into Phase 1 | [TBD — design] |
| App-store rejection over billing or link-outs | Low–Medium | Medium | Legal review; store billing as the fallback | [TBD — Legal] |
| eBay restricts the API access R-35 needs | Medium | Medium | P1, not P0; manual sale entry still works | [TBD — eng lead] |
| An AI-edited photo misrepresents an item, leading to returns, disputes or a marketplace penalty | Medium | High | Masked, background-only edits; original kept first; refusal of item edits; eval gate (R-38) | [TBD — eng lead] |
| Listly app in ChatGPT or Claude is rejected or gets little use | Medium | Low | Its own PRD, gated on the Phase 0 demand test; MVP only avoids precluding it (R-39) | [TBD — PM] |
| Sellers expect "connect" to mean Listly posts for them | Medium | Medium | Connection screen states what each connection can and can't do (R-34, R-35) | [TBD — design] |

## 15. Open questions

| Question | Owner | Blocking? | Needed by |
|---|---|---|---|
| Trial format: 3 free listings, or a 7-day trial that renews automatically? | PM | No (the split test decides) | End of Phase 0 |
| Paying-seller target at 90 days | Founder | Yes, for KR2 | End of Phase 0 |
| Is sale entry by hand, plus email forwarding later, enough? Or is an auto-delist extension needed? | Founder + Legal | No | Before Phase 3 |
| Verified fee rates and title limits per marketplace, and who keeps them current | Eng lead | Yes, for R-8 and R-16 | Phase 1 |
| Onboarding asks for an account before the first photo (R-33). Does that cost too many sign-ups compared with creating it after the first draft? | Design | No (prototype test decides) | Phase 0 |
| Do eBay's current API terms allow reading a seller's orders for this use (R-35)? | Eng lead + Legal | Yes, for R-35 | Phase 1 |
| Is a linked shop (username only) worth the setup step, or should linking wait until sale-email matching (R-26) ships? | PM | No | Before stories |
| Is there real demand for listing from inside ChatGPT or Claude? Test with the founding-member pre-sale and the survey before writing R-39's PRD | PM | No | End of Phase 0 |
| Which image provider for R-25 (background removal) and R-38 (replacement), and what's the edit allowance per plan? | Eng lead + PM | No | Before R-38 |
| Do resellers trade, and would they trade with other Listly users? Add to the survey and pre-sale: traded items in the last 90 days (yes or no, how many), where (Facebook groups, in person, apps), what categories, and "would you trade with other Listly users?". Results set R-40's priority and GC-001's trigger | PM | No | End of Phase 0 |
| Who makes the how-to video, and who updates it when flows change? | Founder | Yes, for R-37 (P0) | Phase 1 |
| Retention of voice audio and AI logs | Legal | Yes, for R-21 and R-23 | Phase 1 |
| US web checkout for the Reseller plan at launch | Legal | No (store billing is the fallback) | Phase 2 |
| Is `advisory` the right side-effect type, given that grouping proposes the item records the user then saves? | Eng lead + PM | No | Before stories |
| "Listly" name clearance | Founder | Yes, for store submission | Phase 2 |
| Home section order (R-29): is "Needs action" first right for resellers, or do they want this month's numbers first? | Design | No (prototype test decides) | Phase 0 |
| Does Profit stay a tab, or move into Home for both plans? | Design + PM | No | Before stories |

**Closed in v8:** whether Clear-out Pass users get the sold-everywhere checklist. They do (D-2, §9.6).

## Sources added in v5

All accessed 2026-11-13. Most are third-party reports; confirm on the providers' own pages before relying
on prices or policies.

- **[S1]** eBay background swap tool: eBay Innovation, "Background swap tool turns any photo into a studio quality product image" — https://innovation.ebayinc.com/stories/background-swap-tool-turns-any-photo-into-a-studio-quality-product-image/ ; TechCrunch — https://techcrunch.com/?p=2595113
- **[S2]** Photoroom with Mercari and Depop (vendor case studies) — https://www.photoroom.com/customer-stories/mercari , https://www.casestudies.com/company/photoroom/case-study/depop-boosts-listings-15-with-photoroom ; Vendoo (vendor page) — https://vendoo.co/cross-listing-app
- **[S3]** eBay picture policy and AI photos (third-party summary) — https://nightjar.so/help-desk/does-ebay-allow-ai-generated-product-photos-in-listings ; Etsy's October 2026 photo rules: Digital Commerce 360, 2026-10-26 — https://www.digitalcommerce360.com/2026/10/26/etsy-ai-policy/amp/ ; Value Added Resource — https://www.valueaddedresource.net/etsy-bans-ai-patterns/
- **[S4]** Claude doesn't generate or edit images (third-party, July 2026) — https://claudemarket.ai/blog/can-claude-generate-images
- **[S5]** OpenAI image model pricing (third-party estimates) — https://wavespeed.ai/blog/posts/gpt-image-2-pricing-2026/ , https://yingtu.ai/en/blog/gpt-image-2-cost-per-image
- **[S6]** ChatGPT app directory and Apps SDK — https://www.eweek.com/news/chatgpt-app-store-developers-neuron/ , https://www.digitalcitizen.life/chatgpt-gets-an-app-store/
- **[S7]** Claude connector directory with consumer apps, 2026 — https://claude.com/connectors?invite=1 ; PYMNTS — https://www.pymnts.com/news/artificial-intelligence/2026/anthropic-turns-claude-into-a-front-door-for-daily-apps/
