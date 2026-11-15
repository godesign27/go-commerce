---
type: design
product: go-commerce-listly
feature: listly-mvp-1            # inherited verbatim from the PRD
aliases: [Listly reseller-first MVP 1]
status: draft
author: ux-lead (detailed design)
created: 2026-11-14
updated: 2026-11-14
source:
  - docs/prd/listly-mvp-1.md (version 8)
  - docs/stories/listly-mvp-1-stories.md (S-01 to S-59)
  - docs/personas/part-time-reseller.md
  - docs/personas/closet-clearer.md
  - docs/design/listly-mvp-1/initial-prototype.html (v2, before this pass)
  - listly/packages/go-mobile-design-system (0.1.0)
published: []
ticket: ""                       # [TBD — PM] no Jira epic exists for Listly; this repo is the system of record
release: "Phase 1 closed beta"   # per PRD §13; no version number yet
---

# UX feature design: Listly MVP 1 — haul to paid

**Product:** Listly (GO Commerce; not a ZAIDYN product) · **Ticket:** [TBD — PM] · **Release:** Phase 1
closed beta · **Designer:** ux-lead (agent) for [TBD — owner]
**Status:** Draft · **Last updated:** 2026-11-14

This is the working design doc for detailed design. It's updated by every later step: flows (§8, and
[ux-flows.md](ux-flows.md)), composition (§9), copy ([ux-copy.md](ux-copy.md)), accessibility
([accessibility-review.md](accessibility-review.md)) and the design-system check
([design-system-readiness.md](design-system-readiness.md)).

**Conventions.** `[H]` marks an assumption nobody has validated yet. `[TBD — owner]` marks an unknown. Every
decision cites the R- (PRD requirement), S- (story), D- (PM decision), A- (story-set ambiguity) or G-
(scope gap) ID it rests on. **DD-nn** IDs are design decisions made in this doc. **PQ-nn** IDs are open
questions raised here (§11).

---

## 1. Source

| Artifact | Path | Used for |
|---|---|---|
| PRD v8 | [docs/prd/listly-mvp-1.md](../../prd/listly-mvp-1.md) | Flows (§9.1), R-1 to R-42 (§9.2), the AI design (§9.3), messages M-01 to M-13 (§9.3e), PM decisions D-1 to D-11 (§9.6), open questions (§15) |
| Story set | [docs/stories/listly-mvp-1-stories.md](../../stories/listly-mvp-1-stories.md) | Acceptance criteria for S-01 to S-59, the entitlement matrix, A11Y-BASE, ambiguities A-01 to A-22, gaps G-01 to G-17 |
| Personas | [part-time-reseller.md](../../personas/part-time-reseller.md) (Dre), [closet-clearer.md](../../personas/closet-clearer.md) (Maya) | Who each screen is for; plan differences |
| Initial prototype (v2) | [initial-prototype.html](initial-prototype.html) | The starting point. Its assumptions are tested in §5b, and it's refined in place (§10) |
| Design system | [listly/packages/go-mobile-design-system](../../../listly/packages/go-mobile-design-system) | Tokens, light and dark themes, GoButton, GoCard, component contracts |
| README and BACKLOG | [README.md](../../../README.md), [docs/BACKLOG.md](../../BACKLOG.md) | "Which doc wins"; GC-001 (trade space) is parked and not designed here |
| JTBD | None | There's no JTBD for Listly. The PRD's §7 value table stands in for one |
| Confluence / Jira | None | Listly isn't in Atlassian. The repo is the system of record |

**Which doc wins** (README): the README, the PRD, the one-pager and the personas sit at the same tier. Where
the personas and the PRD disagree, this doc follows the PRD (the build spec) and raises the conflict in §11.

## 2. Problem

Part-time resellers list the same item on 2–4 marketplaces, lose track of where it's live, and sometimes
sell it twice (PRD §4). Listly MVP 1 turns a whole haul into ready-to-paste listings for every
marketplace, then tracks where each item is, what sold and what it made. It's paid from launch: 3 free
listings, then the Reseller plan or the Clear-out Pass (PRD §1, R-1 to R-3).

The detailed-design problem is narrower: **bring the clickable prototype and its specification up to PRD v8,
so the Phase 0 prototype test can run, and the stories can be groomed against designed screens** (PRD §9.1:
"the prototype must be updated to follow v8 before the Phase 0 prototype test"; stories "Definition of
ready").

## 3. Users

| Persona | Role in this feature | Plan | Evidence |
|---|---|---|---|
| **Dre**, part-time reseller ([file](../../personas/part-time-reseller.md)) | Primary. Lists 10–50 items a week on 2–4 marketplaces; pays for the ledger, the checklist and profit | Reseller plan | Proto-persona `[H]`. No seller interviews yet (PRD §3) |
| **Maya**, closet clearer ([file](../../personas/closet-clearer.md)) | Secondary. Clears out a few times a year, mostly on one marketplace; wants it to be a quick chore | Clear-out Pass | Proto-persona `[H]` |
| **Trial seller** (either of the above, before paying) | Every new account starts here: 3 free listings, no card | Trial | R-1, D-1. What a trial seller can see beyond drafting is G-09 `[TBD — PM]` |

Both personas are hypotheses. The Phase 0 prototype test (6–8 resellers, PRD §9.5) is the first evidence.

## 4. Jobs and use cases

| ID | Use case | Traces to | Priority |
|---|---|---|---|
| UC-1 | Set up: pick marketplaces, create an account, hear how photos and voice are used | R-33, R-23, S-01 to S-03 | Must |
| UC-2 | Photograph a whole haul, check the grouping, give each item's facts by voice or typing | R-4 to R-6, S-05 to S-11 | Must |
| UC-3 | Draft every item for every marketplace; recover from failures | R-7, R-8, R-10, S-12 to S-14 | Must |
| UC-4 | Copy each field, edit a field, save the photos, open the marketplace and record the listing | R-8, R-9, R-12, R-41, S-15 to S-17, S-57 | Must |
| UC-5 | Use the 3 free listings, then pick a plan at the moment of value, and get back to the haul | R-1 to R-3, R-32, D-1, D-7, S-18 to S-20 | Must |
| UC-6 | Open the app to what needs doing | R-29, S-23, S-24 | Must |
| UC-7 | See every live listing and every item; open one | R-13, R-30, S-25, S-26 | Must |
| UC-8 | Look after one item: edit, copy, change its status back, delete | R-42, D-4, S-58 | Must |
| UC-9 | Record a sale (or a trade) with shipping; remove it everywhere else; undo a mistake | R-14, R-15, R-40, D-6, D-9, D-10, S-27 to S-29, S-49, S-59 | Must (R-40 is P1) |
| UC-10 | Enter what I paid; see net profit, with gaps flagged | R-16, D-9, S-30, S-31 | Must (Reseller) |
| UC-11 | Manage account, plan, marketplaces, defaults, notifications, data and help | R-31, R-34, R-35, S-33 to S-36 | Must (R-35 is P1) |
| UC-12 | Learn the app: first-run tips, the how-to video and steps | R-36, R-37, S-37, S-38 | Must |

## 5. Hypotheses

The design encodes these. Each is checked in the Phase 0 prototype test unless another method is named.

| ID | Hypothesis `[H]` | Source | Validation method | Status |
|---|---|---|---|---|
| H-1 | Checking an automatic grouping is quicker than tagging every photo | R-5, PRD §9.5 | Prototype test; eval set | Open |
| H-2 | Resellers will answer facts by voice in a normal home | R-6, PRD §9.5 | Prototype test | Open |
| H-3 | Facts for every item first, then drafting all at once, beats item by item | Prototype | Prototype test | Open |
| H-4 | The first 3 items drafted are the free ones; locking the rest of the haul converts without feeling like a trap | D-1 | Prototype test; pre-sale split | Open |
| H-5 | An account before the first photo doesn't cost too many sign-ups | R-33, PRD §15 (Q-11) | Prototype test (both orders can be walked) | Open |
| H-6 | Home's order (Needs action first) suits resellers | R-29, Q-09 | Prototype test, with the toggle in DD-24 | Open |
| H-7 | Profit earns a tab, rather than a Home section | R-32, Q-14 | Prototype test, with the toggle in DD-25 | Open |
| H-8 | Sellers save photos to their library to post them (copy-and-paste posting needs them) | D-3, R-41 | Prototype test | Open |
| H-9 | Resellers label bins, and will type one per item | D-11, R-6 | Haul-mode prototype test | Open |
| H-10 | A 10-second Undo (pausable, can be turned off) is enough recovery for a mis-tap, with item detail for later fixes | D-6, A-20, DD-14 | Prototype test; screen-reader test | Open |
| H-11 | Sellers tick "I removed it" reliably enough to keep the ledger true | R-15, PRD §9.5 | 2-week diary study | Open |
| H-12 | A "Remind me in 1 hour" plus a flag on Home is enough when the seller can't remove a listing straight away | R-15 | Prototype test | Open |
| H-13 | A three-way shipping choice preselected from a default is fast enough that sellers don't skip it | D-9, R-14 | Prototype test (count skips) | Open |
| H-14 | First-run tips help rather than get dismissed unread | R-36 | Prototype test | Open |

### 5b. What the initial prototype (v2) assumed, against PRD v8

The v2 prototype's own "Assumptions to validate" list, plus what its screens assumed without saying so.
**Confirmed:** PRD v8 or the stories say the same. **Contradicted:** v8 says otherwise, so the prototype
changes. **Unaddressed:** v8 is silent; it stays `[H]` or becomes a question in §11.

| # | v2 prototype assumed | Against v8 | Action in this pass |
|---|---|---|---|
| P-1 | Photos group into items automatically; "Next item" is the fallback | **Confirmed** (R-5, P-01; markers override the AI) | Keep. Add Move, Split and Merge (S-08) and grouping failed (M-10) |
| P-2 | Resellers answer by voice; typing is the fallback | **Confirmed** (R-6) | Keep |
| P-3 | Facts for every item first, then draft all at once | **Confirmed** (R-7, Flow 1) | Keep |
| P-4 | The fact screen asks for brand, size, measurements and flaws | **Contradicted**: condition is required (R-6, D-7, A-12), and there's a bin field (R-6, D-11) | Add condition (required) and bin (typed, optional) — DD-04, DD-05 |
| P-5 | The 3 free listings are full quality; the paywall shows at Finish haul | **Contradicted in part**: the free listings are the first 3 items drafted; items after them are locked; the paywall shows on a 4th draft or at Finish haul with undrafted items (R-1, R-2, D-1) | 5-item sample haul with 2 locked items; paywall on both triggers — DD-07. A-19 raised (DD-08) |
| P-6 | The counter reads "Free listings: n of 3" (used) | **Contradicted**: "Free listings: n of 3 left" (R-1, D-1, A-01) | Counter shows listings left — DD-07 |
| P-7 | After buying, the seller goes to Home | **Contradicted**: a purchase mid-haul returns to the haul (R-32, D-7, A-06) | Return to the haul; draft the locked items; Finish haul returns to the starting tab — DD-09 |
| P-8 | Onboarding is "step n of 3" | **Contradicted**: step n of 4 (R-33, D-7, A-13) | Welcome counts as step 1 — DD-01 |
| P-9 | The account comes before the first photo | **Unaddressed** (still `[H]`, Q-11) | Keep; the prototype test decides. Maya's persona disagrees (PQ-14) |
| P-10 | Home's order: Needs action, unfinished haul, this month, stale, plan | **Confirmed** (R-29), still `[H]` (Q-09) | Keep as default; add a toggle for "This month first" — DD-24 |
| P-11 | Listings defaults to one row per listing, with a By item view | **Confirmed** (R-30, R-13) | Keep. Rows now open item detail (R-42) |
| P-12 | Clear-out Pass users see only the Active filter, and sold items drop out of their Listings | **Contradicted**: the Pass gets the checklist, and sold-but-still-live rows stay in Listings (D-2, R-15, R-18, R-30, A-04) | Pass Listings shows sold-but-still-live; Pass Home shows Needs action — DD-17 |
| P-13 | The Pass hides the ledger, **checklist** and profit tracker | **Contradicted**: the checklist is included (D-2). Ledger and profit stay hidden (R-18) | DD-17 |
| P-14 | Upgrade nudge after 10+ items or a second marketplace | **Confirmed** (R-19, P1) | Keep. Copy updated, because the Pass now has the checklist |
| P-15 | Shops link by username; eBay connects with eBay's sign-in | **Confirmed** (R-34, R-35) | Keep |
| P-16 | Listly never asks for marketplace passwords | **Confirmed** (R-34) | Keep |
| P-17 | Tips on Home, Copy listings and Listings, 1–3 each | **Confirmed** (R-36) | Keep; add an Undo-aware rule (tips never cover the Undo bar) |
| P-18 | A 2-minute captioned how-to video plus written steps | **Confirmed** (R-37); video owner open (Q-05) | Keep |
| P-19 | Both plans side by side, Reseller marked for regular sellers | **Confirmed** (R-2) | Keep |
| P-20 | Sellers will paste listing links back and tick "I removed it" | **Confirmed** as `[H]` (R-12, R-15) | Keep. Add the no-link fallback row (D-7, A-07) |
| P-21 | The checklist is enough without auto-delisting | **Confirmed** as `[H]` (R-15, non-goals) | Keep |
| P-22 | Fee rates and title limits are placeholders | **Confirmed** (R-8, R-16, Q-04 blocking) | Keep the placeholder label |
| P-23 | A price estimate labelled as a guess is useful | **Confirmed** as P1 (R-11). **Contradicted** as the Phase 1 price field: the estimate can't be the price (G-17) | Phase 1 price field is the seller's own price; the estimate appears only behind a P1 marker — DD-12, PQ-07 |
| P-24 | Bin labels, sale-email forwarding and photo fixes are deferred, shown as text only | **Contradicted** for bins: the bin is a typed field in P0 (D-11). **Confirmed** for email (R-26, P1) and photo fixes (R-25, P1) | Bin becomes real — DD-05 |
| P-25 | Shipping is "who paid" only, always $0 in profit | **Contradicted**: three-way choice with an amount; skipped shipping is a flagged estimate, never a silent $0 (R-14, D-9, G-04) | DD-13 |
| P-26 | There's no item detail; ledger rows open Mark sold | **Contradicted**: R-42 item detail is P0 (D-4, G-02) | New screen and Flow 9 — DD-16 |
| P-27 | No Undo after Mark sold, traded or "I removed it" | **Contradicted**: Undo follows each (D-6, D-10) | DD-14 (designed to meet WCAG 2.2.1 — A-20) |
| P-28 | "Remind me in 1 hour" just sets a reminder | **Contradicted in part**: the first time asks for notification permission; if denied, the item stays flagged and no reminder is sent (R-15, D-7, G-06) | DD-15 |
| P-29 | Drafted fields can only be copied | **Contradicted**: any field can be edited before copying; the AI version can be restored (R-9, S-16) | DD-11 |
| P-30 | There's no way to get the photos to the marketplace app | **Contradicted**: Save photos (R-41, D-3, G-01) | DD-10 |
| P-31 | "Add costs" on Profit is a stub | **Contradicted**: cost entry is P0 (R-16, S-30) | DD-18 |
| P-32 | Grouping can't fail | **Contradicted**: M-10 (R-5, D-7, A-11) | DD-03 |
| P-33 | Light theme only | **Unaddressed** (S-43 leaves dark theme `[TBD — ux-lead]`) | Stays light in the prototype; the dark-theme decision is PQ-16 |
| P-34 | Design-system gaps are styled from GO tokens and labelled | **Confirmed** (§9.4, S-44) | Keep; the gap list is in [design-system-readiness.md](design-system-readiness.md) |

### 5c. AI experience (from PRD §9.3; not re-decided here)

| Field | Value |
|---|---|
| Maturity level | AI Assisted |
| Experience mode and behaviors | Assist · Generate (drafts), Suggest (grouping, price estimate) |
| Patterns | AI Assisted Outputs (Simple) · Processing (Simple) · Recommendation Prompt (Simple, P1 estimate) · Escalation (mandatory) |
| Accountability mechanisms | Traceability ("Heard: …", R-21 logs) · Explainability (grouping labelled automatic, price labelled a guess) · Reversibility (drafts versioned and restorable, R-9; grouping editable, R-5) · Escalation (§9.3e) |
| Surfaces | Inside the standard screens. There's no chat or AI panel. GO has no AI components (PRD §9.3) |

**How the AI shows in the UI** (DD-06, DD-11): an AI-produced value is never styled as the seller's own. The
grouping carries M-05. Each drafted field carries a "Drafted from your answers" source line, which opens
the "Heard: …" text. An edited field says "Edited", with "Restore Listly's draft".

## 6. Constraints

- **Technical:** one Expo (React Native) app for iOS and Android, phone-first (PRD §9.4). Supabase, with a
  server-side AI gateway and server-side entitlements. There's no API to post or remove listings on Poshmark,
  Mercari, Depop or Facebook Marketplace, so every post and every removal is the seller's own action.
- **Design system:** the GO Mobile Design System (`@go-commerce/mobile-design-system` 0.1.0) is the system of
  record, **not ZDS**. It provides tokens (space 4–24, radius 4–16, size 24–52 with 44 as the minimum target,
  body type 14/16/20), light and dark themes with 7 colour roles, and two components: **GoButton** (default,
  pressed, disabled) and **GoCard**. Everything else is a gap, listed with a proposed spec in
  [design-system-readiness.md](design-system-readiness.md). GO has **no error, warning, success or
  helper-text colour role**. So status is carried by text, weight, borders and icons, never by colour alone
  (S-43).
- **Regulatory and data:** no PHI. Photos have location metadata stripped (R-23, §10). Sale prices, costs,
  profit and bins never reach the AI (§9.3 data boundaries). The CSV is "a record, not tax advice"
  (R-17, Legal). Trades are taxable income at fair market value in the US; Listly records only the seller's
  estimate (§10, Legal). Auto-renewal disclosure on the paywall needs Legal sign-off (S-19).
- **Synthetic data only** (SYNTH): the prototype's sample items, no real sellers, listings, photos of
  people or homes, or addresses.

## 7. Scope

- **In:** PRD flows 0–9 plus Mark traded (R-40, P1, already in the prototype). Every P0 requirement R-1 to
  R-24 and R-29 to R-37, R-41, R-42. The entitlement states for trial, Reseller plan, active Pass, and
  expired or capped Pass. Messages M-01 to M-13 and every non-AI message (as C-xx in
  [ux-copy.md](ux-copy.md)).
- **Out:** GC-001 trade space (parked, BACKLOG). R-25 photo fix, R-26 sale email, R-28 bundle, R-38 AI
  backgrounds, R-39 assistant connector (P1/P2; shown at most as a "later" note). R-27 web companion (P2).
  Dark theme in the prototype (PQ-16). Production code: this is design, not the Expo build.

## 8. Key flows

The full flows, states and entitlement variants are in [ux-flows.md](ux-flows.md). Summary:

| ID | Flow (PRD §9.1) | Entry → steps → exit | Alternate / failure |
|---|---|---|---|
| F-0 | Onboarding | Welcome (1 of 4) → Where do you sell? (2) → Create account (3) → Camera, mic and AI notice (4) → camera prompt → microphone prompt → New haul | Skip marketplaces → all five; email → link or code (DD-33); sign-up cancelled or failed (DD-34); camera denied, microphone denied, both denied, or Not now (DD-36); turned on later in Settings (DD-37); returning user → sign in (F-10); photo-first test variant (F-11) |
| F-1 | First haul to paid | Capture → check grouping → facts for each item (condition and bin) → draft the first 3 → copy, edit, save photos → draft item 4 or Finish haul → paywall → buy → **back to the haul** → draft the rest → Finish haul → starting tab | Grouping failed (M-10); voice not understood (M-02); missing slot asked once; drafting failed (M-03) or partly (M-04); limit (M-06); purchase failed; Not now → haul with locked items |
| F-2 | Sold → remove it everywhere | Listings or item detail → Mark sold (marketplace, price, shipping) → Undo bar → checklist → "I removed it" on each (Undo each) → bin and net profit | Listed on one marketplace only → straight to bin and profit; Remind me in 1 hour (permission first time; denied → flagged on Home); no saved link → open the marketplace and search; Traded instead (R-40) |
| F-3 | Check profit | Profit tab (or Home → This month) → by marketplace → flags → add costs or shipping | No sales yet; fee unknown |
| F-4 | Occasional seller | Haul and copy → paywall → Clear-out Pass → back to the haul → Finish haul → Pass Home | Pass at its limit or expired → paywall on the next draft |
| F-5 | Returning user | Home → Needs action, an unfinished haul, This month, Stale, or Start a haul | New user → one card |
| F-6 | Manage my account | Profile → plan, marketplaces, defaults, notifications, data, help | Delete account → confirm |
| F-7 | Connect marketplaces | Profile → Marketplaces and connections → link a shop, or connect eBay | eBay sign-in cancelled or failed |
| F-8 | Learn Listly | First visit → tips; Home card or Profile → Help → video and steps | Skip tips → Show tips again |
| F-9 | Look after one item | Listings, ledger, Home or Profit → item detail → edit photos, facts, bin, cost or shipping; copy listings; mark sold or traded; change back to listed (M-12, M-13); delete | Item with no listings; Pass version without cost |
| F-10 | Sign in on a new phone | Welcome → I already have an account → Sign in (Apple, Google or email) → Getting your items → Home for their plan → first haul: camera and microphone again (DD-38) | No account for that sign-in (DD-32); failed or cancelled; trial seller sees what's left (DD-40); Restore purchases: restored, nothing found, on another account (DD-39); AI notice changed → full notice again |
| F-11 | Onboarding, photo-first (test variant) | Welcome → camera, mic and AI notice → capture → grouping → facts → Save your items (account) → drafting → Where will you post these? → Copy listings | Same failure branches as F-0 and F-1 (DD-41) |
| F-12 | Finish setting up, and plan welcome | First haul finished → Home with Finish setting up → link shops, selling defaults → Done; after buying → Home with the plan's welcome card | Dismissed → Profile has every setting; Pass seller gets the Pass card (DD-42, DD-43) |

## 9. Design decisions

All decided 2026-11-14 by ux-lead unless marked **PM decision**, which means it's proposed here and needs
the PM's call (also in §11).

| ID | Decision | Why (traces to) | Alternatives rejected |
|---|---|---|---|
| DD-01 | Onboarding counts Welcome as **step 1 of 4**. The indicator shows both dots and the text "Step n of 4", and announces "Step n of 4" | R-33 lists four steps; D-7; S-01 (announce step and total) | Not counting Welcome (v2's "of 3"), which A-13 flagged |
| DD-02 | The haul is a full-screen flow without the tab bar, from capture to Finish haul. It has a **Close** that saves an unfinished haul (S-06), and returns to the tab it started from | R-32, S-04 ("doesn't show during onboarding, the paywall or drafting" `[H]`), S-05 criterion 5 | Showing the tab bar mid-haul invites leaving half-done. Discarding on Close (S-05 rule is `[rule TBD — PM]`; this design keeps the haul, PQ-11) |
| DD-03 | **Grouping failed (M-10)** is a full-screen state with two equal actions: Try again, and Continue as one item (then Split by hand). The photo count stays visible, to show nothing was lost | R-5, M-10, S-07 criterion 5, D-7 | A toast (too easy to miss for a blocking failure) |
| DD-04 | **Condition is a required slot, and blocks like flaws.** Next item stays disabled until flaws (listed or "none") and condition are answered. The missing slot is asked once, inline, as a prompt card above the fields (C-12, C-13) | R-6, D-7, S-11; resolves A-18 as S-11 assumes | "Ask once, then continue with a blank" (§9.3c's wording). That would let a draft go out with no condition, against "facts before fluency" |
| DD-05 | **Bin** is an optional typed field at the bottom of the facts step, below the AI-extracted fields and visually separate ("Only for you — never in a listing"). It's prefilled with the default bin and offers chips of bins used before. It's never voice-filled | R-6, D-5, D-11, S-10 criterion 5, S-09 "Must not" | Inside the AI field group, which would imply it's extracted or sent to the AI |
| DD-06 | Extracted facts show as **editable fields** with "Heard: …" above them. A field the seller edits directly is marked "Edited by you" and isn't re-extracted | R-6, S-09, S-10 criterion 4, §9.3 Explainability | Read-only fields (v2), which gave no way to fix a mis-heard value |
| DD-07 | The trial counter reads **"Free listings: n of 3 left"**. The sample haul has 5 items. Items 4 and 5 show "Ready to draft" with a lock, keep their photos and answers, and say why they're locked | R-1, D-1, S-18 (counter read as a sentence; locked items announce why) | A 3-item haul, where locking could never be shown |
| DD-08 | **A-19 — agreed by the PM 2026-11-14.** When a trial seller with 0 free listings left taps Finish haul and has nothing undrafted, show a **"Your 3 free listings are ready"** moment: the same plan cards as the paywall, with the drafted listings named and **"Not now"** given the same weight as the plans. It never blocks or hides anything. Home's plan status then shows "0 of 3 free listings left · Pick a plan to keep listing" | R-2's intent, "paywall at the moment of value"; A-19; S-19 edge case | (a) Strict R-2 as written: no paywall until the next draft, so the conversion moment is lost. (b) A blocking paywall, which R-2 forbids for drafted listings |
| DD-09 | **After buying mid-haul, the seller lands back on the haul's copy screen**, where locked items now read "Draft 2 more items". Finish haul returns to the tab the haul started from | R-32, D-7, S-04 criterion 4, S-19 criterion 4 | Home (v2), which A-06 flagged |
| DD-10 | **Save photos** is a secondary action on the copy screen, beside the item's photo strip, labelled with the count ("Save 4 photos"). Saved photos go to an album called **"Listly – {item name}"**; a duplicate name adds the item number. iOS asks for **add-only** library access first. If access is limited or add-only, the photos go to Recents without an album, and the copy says so. After saving, the button becomes "Photos saved" with a check, and only new photos are added on a later tap | R-41, D-3, S-57; album naming and limited access are S-57's `[rule TBD — ux-lead]` | Share sheet (not in the PRD). An album named by date (harder to find when posting) |
| DD-11 | **Editing a drafted field (R-9):** every copy row has Edit. Editing opens the field in place with Save and Cancel. A title edit shows the live count against the limit. **Over the limit is warned, not blocked** (`[H]`, PQ-05), because the seller knows their marketplace. A saved edit shows "Edited", with "Restore Listly's draft". Restoring keeps the seller's edit as a version (`[H]`, PQ-05). Removing a stated flaw shows M-07 but doesn't block | R-9, S-16, M-07, §9.3 Reversibility | A separate edit screen (loses context). Blocking over-limit titles (the marketplace will reject it anyway) |
| DD-12 | **Fields the seller didn't give (G-16)** stay on the copy screen as "Not given — left out of this listing", with no Copy button, so the gap is visible. A blank size on clothing reads "See measurements" and can be copied (§9.3c). **The Phase 1 price field (G-17) is the seller's own price**, typed on the copy screen. The R-11 estimate shows only with the P1 marker, labelled as a guess | G-16 (ux-lead), G-17 (PQ-07), R-8, R-11, §9.3c | Hiding empty rows (the seller can't tell what's missing). Using the estimate as the price (R-11 forbids filling a field with it) |
| DD-13 | **Shipping on Mark sold** is one three-way choice: **Buyer paid · I paid · Free shipping (I paid)**. The two "I paid" options reveal an amount field. The choice is preselected from Selling defaults. A text button, "Add shipping later", skips it. A skipped or empty amount is recorded as **not entered**: profit says "Estimate — shipping not entered", and Profit's flag counts it. The item's bin shows at the top of the screen | R-14, D-5, D-9, S-27 (decision table; empty amount treated as skipped `[H]`) | A silent $0. A required field, which would slow down the seller who hasn't bought a label yet |
| DD-14 | **Undo (A-20) — decided by the PM, 2026-11-14: keep a timer.** After Mark sold, Mark traded and each "I removed it", an **Undo bar** appears above the screen's actions with a **visible 10-second countdown** ("· 8 s"). To meet WCAG 2.2.1 (Timing adjustable): the countdown **pauses while the bar has focus or the seller is touching it**; "Undo closes in 3 seconds" is announced; and **Profile → Accessibility → "Keep Undo until I dismiss it"** turns the timer off (2.2.1's "turn off" option). Each tick brings its own Undo; after a tick the bar also offers **Undo sale**, which reverts the sale and every tick since (D-10). After the bar closes, item detail's "Change back to listed" is the recovery path. `[H — engineering: also turn the timer off automatically while VoiceOver or TalkBack is running]` | D-6, D-10, S-59, A-20, R-24 | No timer (the earlier proposal; the PM chose a timer). A fixed 10 s with no way to adjust it (fails 2.2.1) |
| DD-15 | **Notification permission (R-15).** The first "Remind me in 1 hour" shows a short in-app explanation first ("Get a reminder in 1 hour?"), then the system prompt. If it's denied, the item stays under Needs action and the seller is told no reminder will come (C-31). **Asking again:** never the system prompt (iOS won't show it twice). When a later "Remind me" is tapped while access is off, the same notice offers **Open Settings**, at most once a session. Profile → Notifications shows "Off in your phone's Settings" with Open Settings | R-15, D-7, S-29 criteria 5–6; the re-ask is S-29's open question for ux-lead | Asking during onboarding (D-7 moved it to first use). Repeating the pre-prompt every time (nagging) |
| DD-16 | **Item detail (R-42)** is one scrolling screen: photo strip (original first, labelled), a status line, then sections in this order: **Where it's listed** (each marketplace, its status and Open), **Facts** (each with Edit), **Bin**, **Cost** (Reseller only), **Sale** (when sold: price, shipping, flags), **History**. Actions sit in a footer: the primary action changes with status (Copy listings when listed; Mark sold is a secondary) — and a "More" group holds Mark traded, Change back to listed, Delete item | R-42, D-4, S-58; G-15 still open | Tabs inside item detail (hides the history). Actions at the top (scrolls the status out of view) |
| DD-17 | **Clear-out Pass** sees the sold-everywhere checklist, Needs action on Home, and sold-but-still-live rows in Listings, exactly as the Reseller plan does. It doesn't see the ledger (By item), the stale filter, the Profit tab, or **cost** on item detail (`[H]` PQ-08) | D-2, R-15, R-18, R-30, S-21, S-58; resolves A-04 in the design | Hiding the checklist (v2), which A-04 showed was a double-sale risk |
| DD-18 | **Cost entry (R-16)** in two places: item detail's Cost section (any time, before or after a sale), and Profit's **"Add costs"**, which steps through sold items with no cost one at a time ("1 of 3"), with Save and next and Skip. **$0 is a valid cost and is shown as "$0.00", distinct from "Not entered"** (`[H]`, S-30) | R-16, R-42, S-30 | One long form (harder at large text sizes) |
| DD-19 | **Change back to listed** (R-42): from item detail on a sold or traded item. If eBay recorded the sale, **M-12** asks first. Then the item is listed again, and **M-13** lists each marketplace the seller removed it from, with **Relist** (the saved link, or the copy screen where no link was saved) and "Not now". Nothing is marked live until the seller marks it listed again (S-59 "Must not") | R-42, D-10, M-12, M-13, S-59 | Marking the old listings live again automatically (S-59 forbids it) |
| DD-20 | **A-21 — agreed by the PM 2026-11-14.** Reverting a trade whose received item was added to items: ask "Also remove {received item} from your items?" If the received item has since been drafted, listed or sold, it isn't removed, and the copy says why. A bundle sale (R-28, P1) reverts as one sale, listing every item in it | A-21, R-40, R-28, S-59 criterion 6 | Removing it silently. Keeping it silently |
| DD-21 | **A-22 — agreed by the PM 2026-11-14.** A sale reverted by hand stays in the CSV's sales sheet with status "Reverted (manual change)" and its date, and is excluded from totals. Sales eBay recorded are marked the same way (R-17) | A-22, R-17, D-10 | Dropping it from the CSV (the record would disagree with the item's history) |
| DD-22 | **The checklist's no-link row** names the marketplace, shows "No link saved", and offers **Open {marketplace}** plus "Search for '{item name}' in your listings". If the seller linked their shop (R-34), Open goes to their shop instead | R-15, D-7, S-28 criterion 5 and its ux-lead question | A row with no action, which leaves the seller to work out where to go |
| DD-23 | **Deleting an item** asks for confirmation. The copy says it can't be undone, that it doesn't give back a free listing (trial, R-1), and that **photos already saved to the phone stay there** (S-58 `[H]`). The confirm button names the item | R-42, R-1, S-58 criterion 5 | An Undo bar for delete (R-42 asks for confirmation instead) |
| DD-24 | **Home order is testable.** The prototype has a toggle: "Needs action first" (R-29, default) or "This month first". Needs action is always the first thing a screen reader reaches when it's present (S-23) — `[H]` until the test | R-29, Q-09, PRD §15 | Picking one without the test |
| DD-25 | **Profit as a tab is testable.** The prototype has a toggle: Profit tab (R-32, default), or **Profit inside Home** (4 tabs for everyone; Home's This month card opens the full Profit screen) | R-32, Q-14, PRD §15 | Picking one without the test |
| DD-26 | **Trial sellers (G-09) — agreed by the PM 2026-11-14 (for now).** Trial sellers see the Reseller tab set and screens, with real data from their drafts; Profit shows its empty state until a sale. Mark sold and the checklist work on the trial. Rationale: the checklist is a safety feature (D-2's reasoning), and a trial seller who lists 3 items can still sell one twice | G-09, D-2, entitlement matrix | Hiding Listings and Profit until they pay (less to evaluate before the paywall) |
| DD-27 | **Expired or capped Clear-out Pass (G-10) — agreed by the PM 2026-11-14 (for now).** Drafting new items shows the paywall. Everything else stays: view and copy drafted listings, Save photos, Mark sold, the checklist and item detail. Home shows "Your Clear-out Pass has ended" with the plans | G-10, R-18 ("data is kept"), D-2 | Locking the checklist at expiry (a Pass seller would lose double-sale protection while their items are still live) |
| DD-28 | **Status never relies on colour** (GO has no status colours). "Still live", "Sold", "Locked", "Estimate" and "Stale" are text tags. The alarm banner uses a 3 pt border, a bold title and the word "Needs action". Errors use an inline notice with a bold title and role="alert" | S-43 "Must not", R-24, GO themes | Inventing red or amber hex values (not GO tokens) |
| DD-29 | **Superseded by DD-44 (2026-11-14).** ~~The design system stays GO~~ (agreed by the PM 2026-11-14), and its gaps are filled by GO components built on Tamagui's own primitives, styled with GO tokens, with platform behaviour from Apple's Human Interface Guidelines on iOS and Material on Android. See "Design-system choice" below | §9.4, S-44, the user's question 2026-11-14 | Switching to another system (below) |
| DD-30 | **Department and a size picker on the facts step** (requested and agreed 2026-11-14). A single-choice **Men's · Women's · Unisex** for clothing, shoes and accessories, optional. **Size** is a native dropdown, grouped Letter (XXS–3XL) · One size · Numeric (0–20) · Waist (26–40) · Shoe US (5–13), plus **Other…**, which opens a text field for the size on the tag. For items that aren't clothing, the empty option reads "No size (not clothing)". Both are filled **only from what the seller said or typed** (or picked); a spoken "men's medium" preselects Men's and M. They're never inferred from the photo, and Listly never guesses a department. A blank department is left out of the listing | R-6, R-10, §9.3c "never filled from the photo"; marketplaces ask for department and size in their own forms `[H]` | A free-text size only (v2: slower and inconsistent). Inferring department from the photo or item type (breaks R-6 and R-10) |
| DD-44 | **The production app uses shadcn/ui for React Native** (React Native Reusables on NativeWind, Lucide icons), decided by the PM 2026-11-14. **This replaces GO for the app and reverses DD-29.** shadcn/ui itself is web-only, so its React Native port is used: the same components, tokens and API. Components are copied into `listly/components/ui/` and owned by the app, tuned for touch: 44 pt minimum, 48 pt default and 56 pt main buttons, 48 pt fields. The HTML prototype stays as it is, as the feature and flow reference | The PM's instruction 2026-11-14; R-24 (target size) | GO on Tamagui (DD-29, now superseded). Rendering shadcn's web components in a web view (not native, fails platform conventions) |
| DD-45 | **Blue is the only action colour; green and red are status only** (PM decision 2026-11-14: "green is a semantic colour"). Primary actions, links, selection and focus are blue. Green means done, sold or copied; red means danger or error. Warnings use words and borders, not a fourth hue. Neutrals are shadcn's slate. Every text pairing is AA in light and dark; two shadcn defaults were changed to pass (muted text, and red text in dark mode) | WCAG 1.4.3, 1.4.1; DD-28 (status never by colour alone) | GO's emerald green as the action colour (reads as "success") |

**DD-30 is a scope addition, agreed 2026-11-14.** PRD §9.3c has no department slot, and size is free text there, so the
PRD and P-02 extraction and drafting need updating by the PM (PQ-23). The size lists per category are `[H — eng
lead + PM]`, and how an item is classed as clothing, shoes or an accessory is still S-11's
`[rule TBD — eng lead]`.

### Design-system choice (DD-29)

You asked whether a better iOS design system should replace GO. **Recommendation: keep GO, and fill its gaps
from Tamagui's primitives, not from a second system.** That's a recommendation, and it needs your
agreement, because PRD §9.4 and S-44 name GO.

- **Listly ships on Android too.** An iOS-only system (SwiftUI, an HIG kit) would need a second system for
  Android. A cross-platform RN library with its own look would make one platform look foreign: React Native
  Paper is Material, so it looks like Android on an iPhone.
- **GO already sits on Tamagui** (`tamagui` 3.3.2 in the app, a peer dependency of GO). Tamagui ships
  unstyled or themeable primitives for most of the ~20 gaps: Sheet, Switch, Checkbox, RadioGroup,
  ToggleGroup, Tabs, Input, TextArea, Progress, Separator, ListItem, plus Toast in `@tamagui/toast`
  `[H — verify each against the installed version before building]`. A GO component can be a thin wrapper
  that takes GO tokens and a GO contract. That keeps one theme (light and dark), one set of tokens and one
  contract file for coding agents.
- **Some pieces should be native, not drawn:** the tab bar (Expo Router or React Navigation bottom tabs give
  platform-correct behaviour and screen-reader semantics), system permission prompts, the share sheet,
  and the date picker. `@expo/ui` (native SwiftUI and Jetpack Compose controls in Expo) is worth an
  engineering spike for switches and menus `[H — eng lead; check its stability in Expo SDK 58]`.
- **Use Apple's HIG as the behaviour reference on iOS:** tab bar, sheets, swipe actions on rows,
  Dynamic Type, haptics. Use Material on Android. GO supplies the look; the platform supplies the behaviour.

What it costs to switch instead: GO's tokens, themes and contracts would be thrown away, and S-44's
"no one-offs" rule would have to be restated against a library the team doesn't control.

## 9c. Onboarding, sign-in and setup (all paths)

Asked for 2026-11-14 ("the set up and onboarding for all"). Covers every way a seller gets into Listly and
ready to use it: new sellers (both personas, including the PQ-14 test variant), returning sellers on the same
or a new phone, every camera and microphone outcome, sign-in edge cases, the optional setup after the first
haul, and what changes after buying a plan. Traces to R-33, R-23, R-1, R-3, R-31, R-34, R-36, R-37 and
S-01 to S-03, S-19, S-20, S-33, S-34. Flows are in [ux-flows.md](ux-flows.md) (F-0, F-10 to F-12). Wording is in
[ux-copy.md](ux-copy.md) (C-58 onward).

### Every way into Listly

| Situation | What the seller sees | Lands on | Traces to |
|---|---|---|---|
| First launch, default order | Welcome (1 of 4) → Where do you sell? (2) → Create account (3) → Camera, mic and AI notice (4) → system prompts | New haul | R-33, S-01 to S-03 |
| First launch, **photo-first test variant** (Phase 0) | Welcome → Camera, mic and AI notice → photograph, group, facts → **Save your items** (account) → drafting → **Where will you post?** on the first copy | Copy listings | PQ-14, Q-11, DD-41 |
| Returning seller, same phone, still signed in | Nothing: the app opens on Home | Home for their plan | R-29 |
| Returning seller, new phone or reinstall | Welcome → "I already have an account" → Sign in → Getting your items | Home for their plan; permissions asked on the first haul (DD-38) | R-33, S-02 c3, DD-31 |
| Signed in with a method that has no Listly account | "No Listly account for {email}" | Create one (step 2) or try another way | S-02 edge, DD-32 |
| Signed out from Profile | Welcome | Welcome | S-02 c5 |
| Session expired or revoked | Sign in, with "You've been signed out" | Home after sign-in | `[H — eng lead]` |
| Closed the app mid-onboarding | Welcome again, with the marketplace choice kept on the phone; after the account exists, it reopens at step 4 | The same step | S-01 edge `[H]` |

### The two personas through onboarding

| | Dre (part-time reseller) | Maya (closet clearer) |
|---|---|---|
| Order | Default R-33 order. Picking marketplaces up front suits him: he sells on 3–4 | Tested both ways (DD-41). Her persona asks for "no setup before value", so the photo-first variant is built for her |
| Plan moment | Paywall mid-haul on item 4 → Reseller plan → back to the haul (DD-09) | Same paywall → Clear-out Pass → back to the haul |
| After the first haul | "Finish setting up" card: link shops, selling defaults (DD-42) | Same card, all optional. Ignoring it changes nothing |
| Plan welcome | Reseller card: Profit, By item, stale items; suggests adding what he paid (DD-43) | Pass card: when it ends, the 100-listing cap, and the sold-everywhere reminder. No cost prompt (DD-17) |

### Decisions

| ID | Decision | Why (traces to) | Alternatives rejected |
|---|---|---|---|
| DD-31 | **Sign in is its own screen, not an onboarding step.** No step dots. The same three methods, in the same order as step 3 (Apple, Google, email), and "New to Listly? Get started", which goes back to Welcome. After success, a short **"Getting your items"** screen (a spinner with the words, at most a few seconds `[H — eng lead]`), then Home for the seller's plan. Tips the seller already saw stay seen (R-36). Onboarding is skipped entirely | R-33 ("a returning user who signs in skips onboarding and lands on Home"), S-01 c5, S-02 c3, R-36 | Signing in from step 3 (a returning seller would wade through Welcome and marketplaces first) |
| DD-32 | **A sign-in that finds no Listly account doesn't silently create one.** If Apple or Google returns an identity with no account behind it, show "No Listly account for {email}" with **Create an account** (goes to step 2, with the identity held, so step 3 is skipped) and **Try another way** (back to Sign in, for a seller who used a different method last time) | S-02 edge (a second method makes a second account unless the emails match); the rule is `[TBD — eng lead]` (PQ-25) | Creating the account silently (a seller who used Google last time ends up with an empty second account and thinks their items are gone) |
| DD-33 | **Email is passwordless: a link and a 6-digit code.** Enter the email → "Check your email" with the address shown, the link, and a code field for when the email opens on another device. **Resend** is available after 30 seconds, with the wait shown. "Use a different email" goes back. An expired or used link shows "That link has expired" with **Send a new link**. The format is checked when the seller taps Continue, not on every keystroke, and the error sits under the field | S-02 validation (password or magic link `[TBD — eng lead]`, PQ-26); R-24 (an inline error, identified in text) | A password (one more thing to forget, and a reset flow to build). Validating while typing (an error before the seller has finished) |
| DD-34 | **Cancelling isn't failing.** Closing the Apple or Google sheet returns to the same step with no message on screen; a screen reader hears "Sign-in cancelled." A real failure (network or provider) shows the inline error and keeps the seller on the step. No partial account is created in either case | S-02 c4, R-24 (status announced) | An error banner on cancel (scolds a seller who changed their mind) |
| DD-35 | **Apple's hidden email** works like any email. Profile → Account shows the relay address with "Hidden by Apple — emails still reach you". A seller who signed up with Apple is pointed back to Apple if they try email with a relay address `[H — eng lead]` | S-02 edge, R-31 Account | Asking the seller for a "real" email (Apple's rules forbid requiring it) |
| DD-36 | **Camera and microphone: one explanation, then two system prompts, four outcomes.** Step 4's main button ("Allow and start my first haul") shows the camera prompt, then the microphone prompt (S-03 c2). Each outcome gets its own fallback: **both allowed** → camera and voice; **camera denied** → photo library, voice still on; **microphone denied** → camera, typing; **both denied** → library and typing. **"Not now" is different from "denied"**: nothing has been asked, so the haul shows **Turn on camera** and **Turn on microphone**, which bring up the system prompt there and then. After a denial, iOS won't ask again, so the only route is **Open Settings** | R-33 step 4, S-03 c2–c4 and the single-fallback edge, R-4, R-6 | One combined "camera and mic off" state (v2, and the old Simulate toggle), which can't show the two single fallbacks S-03 asks for |
| DD-37 | **Access turned on later in Settings is picked up when the seller comes back**, without a restart: the capture screen swaps the notice for the camera, and announces "Camera is on." The microphone works the same way on the facts step | S-03 edge | Asking the seller to restart the app |
| DD-38 | **On a new phone, permissions are asked again, but the AI notice isn't.** Permissions belong to the device. The AI notice acknowledgement belongs to the account, with its version (S-03 c5 and NFR). So the first haul on a new phone shows a short camera-and-microphone screen without the notice block, plus a link to it. **If the notice has changed since the seller acknowledged it**, the full notice shows instead, and nothing is uploaded until they acknowledge it | S-03 c5, S-03 NFR (notice version), R-23 | Repeating the whole notice on every new phone (noise). Skipping the explanation (the system prompt would arrive with no context) |
| DD-39 | **Plans come back on sign-in without tapping anything**, because entitlements are checked on the server (R-3). **Restore purchases** (Profile and the paywall) is for a store purchase the account doesn't know about yet. Its states: **checking** (the button shows "Checking…"), **restored** ("Reseller plan restored", and the plan row updates), **nothing found** ("No Listly purchases found for this Apple ID"), and **on another Listly account** ("This purchase belongs to another Listly account. Sign in with that account to use it"). It never moves a plan between accounts `[H — eng lead + Legal]` (PQ-27) | R-3 ("restore purchases works on reinstall"), R-31 Plan, S-20 | A single "Done" toast whatever happened (the seller can't tell whether it worked) |
| DD-40 | **The trial counter comes from the account**, so a reinstall or a new phone shows what's left ("Free listings: 1 of 3 left") and never resets it. Home for a returning trial seller shows what's left and their drafted listings. Whether a new account on the same phone gets a new trial is still S-02's `[rule TBD — PM]` | R-1 (trial bound to the account), S-02, S-18 | Storing the counter on the phone |
| DD-41 | **Photo-first is a test variant, not the default** (PQ-14 decided: follow R-33, test both). Order: Welcome (no step dots) → camera, microphone and the AI notice (the notice must come before the first upload, R-23) → photograph, group and answer facts as normal → **"Save your 5 items"**: the account step, just before drafting, because the trial counter belongs to an account (R-1) → drafting for all five marketplaces → on the first visit to Copy listings, a one-time sheet **"Where will you post these?"** sets the drafting set and hides the other tabs (Maya's "ask her marketplace on first copy"). Compare the variants on time to first listing copied (KR3) and sign-up completion | PQ-14, Q-11, R-33, R-23, R-1, closet-clearer.md | Making photo-first the default (contradicts R-33, the build spec). Asking for the account after drafting (the trial counter would have no account to sit on) |
| DD-42 | **"Finish setting up" on Home after the first haul** (agreed by the PM 2026-11-14, PQ-24). A card with up to three rows: **Link your shops** (R-34), **Set selling defaults** (shipping and default bin, R-31), and **eBay: coming soon** (text only, PQ-20). Each row shows "Done" when done. It appears only after the first haul is finished, below Needs action and an unfinished haul, never during onboarding. It can be dismissed ("Find these any time in Profile"), and it goes away when every row is done. Notifications aren't in it: they're asked on first use (D-7, DD-15) | R-31, R-34, R-29 order, D-7; Maya's "no setup before value" | Setup steps inside onboarding (more steps before the first listing, against KR3). Nothing at all (sellers never find shop linking, which R-26 matching will need) |
| DD-43 | **After buying, a one-time welcome card on Home**, not a screen in the way (agreed by the PM 2026-11-14, PQ-29). Bought mid-haul: the seller goes back to the haul (DD-09), and the card waits for Home. Bought from Home or Profile: the card shows straight away. **Reseller plan:** what's now theirs (the Profit tab, Listings by item, stale items, 500 listings a month) and one suggestion, "Add what you paid, so profit is right". **Clear-out Pass:** when it ends, the 100-listing cap, and that Listly still reminds them to remove sold items everywhere else. No cost suggestion (DD-17). Dismissible | R-3, R-18, R-29, DD-09, DD-17 | A full-screen welcome (interrupts the haul DD-09 returns them to). Nothing (sellers who bought never find Profit or By item) |

### Gaps this adds

No new GO gaps beyond those in [design-system-readiness.md](design-system-readiness.md): the sign-in buttons
use GoButton (Apple) and the SecondaryButton gap (Google); the email and code fields use the TextField gap;
the progress screen uses the Progress gap; the setup card is a GoCard with ListRow-gap rows. **One new
platform piece:** Apple requires its own "Sign in with Apple" button style (`ASAuthorizationAppleIDButton`, or
`expo-apple-authentication`'s button), which GoButton must not imitate. It's labelled `System /
AppleSignInButton` in the prototype `[H — check Apple's current button rules]`.

## 9b. Visual composition (ui-design)

Composed from GO tokens and components only. The prototype maps every GO value 1:1 into `--go-*` CSS variables
(GO `src/tokens/index.ts`, `src/themes/index.ts`, light theme). Anything else is a **GO gap**, styled from GO
tokens and labelled `Gap / {Name}` under Prototype controls → Component labels. The full gap list with proposed
specs is in [design-system-readiness.md](design-system-readiness.md).

### Tokens used

| Role | GO token | Value (light) | Used for |
|---|---|---|---|
| Page background | `background` | #FCFDFD | Screen background, sheet background |
| Raised surface | `surface` | #F0F6F4 | GoCard, photo placeholders, dividers |
| Text | `color` | #232925 | All text; alarm and notice borders; selected chips; Undo bar background |
| Secondary text and borders | `borderColor` | #627C72 | Field borders, helper text (GO has no helper-text role — gap), unselected chips |
| Primary action | `actionBackground` / `actionPressed` / `actionColor` | #006840 / #005333 / #FFFFFF | GoButton, mic button, progress fill, focus ring, current tab marker, New haul tab |
| Spacing | `space.1–5` | 4 · 8 · 12 · 16 · 24 | Screen padding 16; gaps 8–12; section gaps 12–16 |
| Radius | `radius.1–4` | 4 · 8 · 12 · 16 | Tags 4; fields and buttons 8; cards 12; sheets and the phone frame 16 |
| Size | `size.4` / `size.5` | 44 / 52 | Minimum touch target 44; list rows and tab bar 52 |
| Type | `body.size.1–3`, `weight.1–3` | 14/20 · 16/24 · 20/28; 400 · 600 · 700 | Body 14; buttons and card titles 16; screen titles 20 |

**Values not in GO, used and flagged:** 12 px small text (no `size.0` in GO's type scale), a 24 px welcome
title, and 28 px money figures and a 48 px lock-screen clock (no display size). Each is commented `/* GAP */` in
the prototype and listed as a type-scale gap.

### Composition rules applied

| ID | Rule | Why |
|---|---|---|
| VC-1 | **One GoButton per screen**, in the footer, for the primary action. Everything else is a secondary, text or destructive button (gaps) | GO has one button variant; Maya's persona: "One primary action per screen" |
| VC-2 | Footer actions sit in a fixed bottom area (`scr-foot`) above the tab bar; content scrolls above it | Thumb reach on a phone; actions stay visible with large text |
| VC-3 | GoCard groups one idea (an item, a plan, a marketplace row, a summary). Cards don't nest | GO contract: "group related content" |
| VC-4 | Screen title 20/28 bold; section titles 16/24 semibold; body 14/20; helper text 12/16 in `borderColor` | GO type scale, plus the 12 px gap |
| VC-5 | Status is a **text tag** (bordered, 12 px, semibold); "strong" tags (filled `color`) mark a settled state ("You removed it", "Sold here"); **flags** (bordered, bold) mark something missing ("Not entered") | DD-28: no status colours in GO |
| VC-6 | The **alarm banner** (Needs action, the checklist) is a 3 px `color` border, bold title, role=alert. It's the only 3 px border in the app | The double-sale alarm "must be impossible to miss" (Dre's persona) without a warning colour |
| VC-7 | **Undo bar** is the inverse surface (`color` background, `background` text) above the footer, so it reads as transient system feedback, distinct from content | DD-14 |
| VC-8 | **Sheets** (move a photo, delete, M-12, M-13, reminder pre-prompt) rise from the bottom over a scrim of `color` at 45%; system prompts are centred and labelled `System /` | iOS and Android conventions (DD-29); scrim colour has no GO token — gap |
| VC-9 | Locked items use a **dashed** border and the word "Locked"; AI-produced notes use a 3 px left rule (`ai-note`) | Distinguishes AI output and entitlement state without colour |
| VC-10 | Item detail order: photos → name → status → where it's listed → sale → facts → bin → cost → history → more; primary action in the footer | DD-16 |
| VC-11 | Forms: visible label above every field; helper text below; required fields say "(required)" in the label, not with an asterisk alone | R-24, S-10 ("visible labels") |

### Screen-by-screen component map (summary)

| Screen | GO components | Gap components |
|---|---|---|
| Onboarding | GoButton, GoCard | ProgressDots, TextButton, ToggleChips, SecondaryButton |
| Capture | GoButton | ShutterButton, SecondaryButton, Thumbnail, Tag, InlineNotice, TextButton |
| Grouping | GoButton, GoCard | AINote, Thumbnail, Chip, BottomSheet |
| Facts | GoButton | MicButton, TextField, Select, ChoiceChips, PromptCard, InlineError, Tag |
| Drafting | — | ProgressBar, SecondaryButton |
| Copy listings | GoButton, GoCard | SegmentedControl, Tabs, CopyField, TextField, Thumbnail, SecondaryButton, TextButton, Tag, System / PermissionPrompt |
| Paywall | GoButton | PlanCard, SegmentedControl, Tag, InlineError, SecondaryButton |
| Home | GoButton, GoCard | AlarmBanner, ListRow, Tag, TabBar, CoachMark |
| Listings and ledger | GoCard | SegmentedControl, FilterChips, SortControl, ListRow, Tag, TabBar |
| Item detail | GoButton, GoCard | PhotoStrip, KeyValueRow, Tag, DestructiveButton, BottomSheet, Snackbar |
| Mark sold | GoButton | ChoiceChips, TextField, RadioCards, Checkbox, Tag |
| Checklist | GoButton, GoCard | AlarmBanner, Checkbox, SecondaryButton, Snackbar, BottomSheet |
| Profit and add costs | GoButton, GoCard | MoneyBreakdown, InlineNotice, ListRow, Chip, TextField |
| Profile and connections | GoButton, GoCard | SettingsGroup, Switch, ChoiceChips, TextField, DestructiveButton, InfoNote |
| How-to | GoCard | VideoPlayer, Accordion |

## 10. Design sources

| Source | Location | Notes |
|---|---|---|
| Prototype (PM-facing, refined in place) | [docs/design/listly-mvp-1/initial-prototype.html](initial-prototype.html) | v3 after this pass. Serve with `python3 -m http.server 8795 --directory docs/design`, then open `/listly-mvp-1/initial-prototype.html`. Every state is in Prototype controls → Go to any state, and every flow in Key task flows |
| Figma file | None | There's no Figma file. **The prototype isn't a handoff design source** (ux-lead rule): a designer's final design, in Figma or a coded prototype, is needed before `/ux-handoff` [TBD — designer] |
| Design system | `listly/packages/go-mobile-design-system` 0.1.0 | Tokens and light theme mapped 1:1 into the prototype's `--go-*` variables. GoButton and GoCard only |
| Flows and states | [ux-flows.md](ux-flows.md) | Every screen × empty, loading, error, permission-denied, partial-data and entitlement states |
| Copy deck | [ux-copy.md](ux-copy.md) | M-01 to M-13 and C-01 onward |

## 11. Open questions

Raised to the PM (or the named owner). **The PM answered PQ-01 to PQ-23 on 2026-11-14** (the "Proposed answer" column now starts with
the decision). **PQ-24 to PQ-30 came from the onboarding design (§9c); the PM accepted every proposal on 2026-11-14.** None of these edits the PRD or the stories: the PM carries the decisions into PRD v9 and the story set.

| # | Question | IDs | Proposed answer | Blocking? | Owner |
|---|---|---|---|---|---|
| PQ-01 | **A trial seller who drafts exactly 3 items and taps Finish haul never sees the plans.** Show the "free listings are ready" moment (DD-08)? | A-19, R-2, S-19 | **Decided 2026-11-14: yes (DD-08).** Yes, as DD-08: not blocking, Not now equal weight | No (decided) | PM |
| PQ-02 | **D-6 says a "10-second" Undo.** May it stay, with no timer, until the seller leaves the screen or dismisses it, to meet WCAG 2.2.1? | A-20, D-6, R-24, S-59 | **Decided 2026-11-14: keep a 10 s timer, made adjustable (DD-14).** Yes, as DD-14 | No (decided) | PM |
| PQ-03 | Does a blank condition block like flaws? | A-18, R-6, §9.3c, S-11 | **Decided: yes.** Yes (DD-04) | No (decided) | PM |
| PQ-04 | Trade and bundle reverts; manual reverts in the CSV | A-21, A-22, S-59, S-46 | **Decided: as DD-20, DD-21.** DD-20, DD-21 | No (decided) | PM |
| PQ-05 | Draft edits: is an over-limit title warned or blocked? On restore, is the seller's edit kept as a version? May a seller delete a stated flaw by hand? | S-16 | **Decided: as proposed.** Warn; keep; allow with M-07 (DD-11) | No (decided) | PM |
| PQ-06 | Is the generic format always drafted? The design shows it as a sixth tab, "Other", only when switched on in Marketplaces | A-05, Q-15 | **Decided: as proposed.** Off by default; on in Profile `[H]` | No (decided) | PM |
| PQ-07 | Where does the Phase 1 price come from? | G-17, A-17 | **Decided: the seller types it.** The seller types it on the copy screen (DD-12) | No (decided) | PM |
| PQ-08 | Do Clear-out Pass users see and enter cost on item detail? | S-58, S-30, R-18 | **Decided: hidden.** Hidden, data kept (DD-17) | No (decided) | PM |
| PQ-09 | What can a trial seller do beyond drafting 3 items? | G-09, entitlement matrix | **Decided for now: DD-26.** DD-26 | No (decided) | PM |
| PQ-10 | What can an expired or capped Pass do? | G-10 | **Decided for now: DD-27.** DD-27 | No (decided) | PM |
| PQ-11 | Cancelling a haul: keep it as unfinished, or discard? | S-05 criterion 5 | **Decided: as proposed.** Close keeps it (DD-02); Discard is a separate, confirmed action on Home | No (decided) | PM |
| PQ-12 | Items drafted before Cancel: kept or discarded? | S-12 criterion 3 | **Decided: as proposed.** Kept, and counted (they finished) `[H]` | No (decided) | PM |
| PQ-13 | Re-drafting after editing facts: offered? Does it use a listing? | G-03, S-58 | **Decided: as proposed.** Offer "Update the drafts" on item detail after a fact edit; doesn't use a listing `[H]` | No (decided) | PM |
| PQ-14 | **Persona conflict:** Maya's persona says "no setup before value… ask her marketplace on first copy"; R-33 asks for marketplaces and an account before the first photo | R-33, Q-11, closet-clearer.md | **Decided: follow R-33; test both.** Follow R-33 (the build spec); test both orders in Phase 0 | No (decided) | PM |
| PQ-15 | **Design system:** keep GO and build its gaps on Tamagui primitives (DD-29), or switch? | §9.4, S-44 | **Decided: keep GO.** Keep GO | No (decided) | PM + eng lead |
| PQ-16 | Dark theme in MVP 1? GO has one; nothing in the PRD asks for it | S-43, S-44 | **Decided: as proposed.** Support it from day one, because GO components get it for free, but test the prototype in light only `[H]` | No (decided) | PM |
| PQ-17 | GO has no error, warning or success colour role. Add them to GO, or keep status colour-free? | S-44 criterion 2 | **Decided: as proposed.** Add `danger` and `caution` roles to GO for the destructive button and alarm border only, each checked for contrast in both themes; status text stays text | No (decided) | Design-system owner [TBD] |
| PQ-18 | Repeat reminders after the first? | S-29 | **Decided: as proposed.** None in MVP; the Home flag stays | No (decided) | PM |
| PQ-19 | Which tips show on which controls? | R-36, S-37 | **Decided: as proposed; test.** Home: Needs action, Start a haul, Listings tab. Copy listings: Copy, Save photos, Open marketplace. Listings: filters, row actions `[H]` | No (decided) | ux-lead (proposed) → prototype test |
| PQ-20 | eBay before S-54 ships (Phase 1): hide Connect, or mark it "Coming soon"? | S-34 criterion 3 | **Decided: as proposed.** "Coming soon" text, no button `[H]` | No (decided) | PM |
| PQ-21 | Sale marketplace not one the item was listed on: allowed? | S-27 edge | **Decided: as proposed.** Allowed, with an "Other" choice `[H]` | No (decided) | PM |
| PQ-23 | **Add a department slot (Men's / Women's / Unisex) and a size picker with Other to the facts step?** Not in §9.3c; P-02 and the drafts would use it. Required, or optional as designed? | R-6, §9.3c, DD-30 | **Decided: yes, optional.** Optional; seller-given only; left out of the listing when blank | No (decided) | PM |
| PQ-22 | An item that sells on a second marketplace before the first checklist is done | S-28 edge | **Decided: as proposed.** The second Mark sold is blocked with "Already sold on {marketplace}. Change it from item detail" `[H]` | No (decided) | PM |
| PQ-24 | **Add a "Finish setting up" card to Home after the first haul?** Not in R-29's Home sections. Rows: link shops, selling defaults, eBay coming soon | R-29, R-31, R-34, DD-42 | **Decided 2026-11-14: as proposed.** yes**, below Needs action and an unfinished haul, dismissible, gone when done | No (decided) | PM |
| PQ-25 | **A sign-in that finds no Listly account:** offer "Create an account" (DD-32), or create one silently? And do two methods with the same email join one account? | S-02 edges | **Decided 2026-11-14: as proposed.** offer, never silent**; same verified email → same account `[H]` | No (decided); eng lead confirms the S-02 rule | Eng lead + PM |
| PQ-26 | **Email sign-in: passwordless link plus a 6-digit code** (DD-33), or a password? | S-02 validation | **Decided 2026-11-14: as proposed.** link and code**, resend after 30 s, link lifetime `[TBD — eng lead]` | No (decided); eng lead confirms the S-02 rule | Eng lead |
| PQ-27 | **Restore purchases when the purchase is on another Listly account:** tell the seller and stop (DD-39), or move the plan across? | R-3, S-20 | **Decided 2026-11-14: as proposed.** tell and stop**; moving plans is a support case | No (decided) | Eng lead + Legal |
| PQ-28 | **The photo-first variant uploads photos for grouping before an account exists.** Is an anonymous session that becomes the account feasible, and does it still meet R-23 (notice first) and deletion rules? | DD-41, R-23, R-1 | **Decided 2026-11-14: as proposed.** an anonymous session, upgraded on "Save your items"**; anonymous data deleted after 7 days if no account is made `[H]` | No (decided); the anonymous session still needs eng lead and Legal to confirm it works before the Phase 0 test | Eng lead + Legal |
| PQ-29 | **A one-time plan welcome card on Home after buying?** Not in the PRD | R-3, R-18, DD-43 | **Decided 2026-11-14: as proposed.** yes**, dismissible, one per purchase | No (decided) | PM |
| PQ-30 | **An unfinished haul on a new phone:** is it on the account (photos already uploaded for grouping), or only on the old phone? | S-06, DD-38 | **Decided 2026-11-14: as proposed.** on the account once grouping has run; before that, only on the phone it started on** `[H]` | No (decided) | Eng lead |

**Related open questions owned elsewhere** (not design decisions, but the design waits on them): Q-04 title
limits and fee rates (eng lead, blocking for real numbers); Q-05 the how-to video's maker (founder); Q-07
voice and log retention (Legal); auto-renewal disclosure wording (Legal); deep-link support per marketplace
(eng lead).
