---
type: stories
product: go-commerce-listly
feature: listly-mvp-1
feature_type: agentic # inherited verbatim from the PRD; side-effect type advisory (PRD §9.3)
aliases: [Listly reseller-first MVP 1 stories, Listly haul to paid stories]
status: draft
author: product-lead (story-generator)
created: 2026-11-13
updated: 2026-11-13
epics: 15
stories: 59 # P0 47 (S-01 to S-44, S-57 to S-59) · P1 11 (S-45 to S-55) · P1 separate-PRD enabler 1 (S-56) · P2 0
source:
  - docs/prd/listly-mvp-1.md (version 8, R-1 to R-42, M-01 to M-13, PM decisions D-1 to D-11 in §9.6, feature_type agentic, side-effect type advisory)
  - docs/design/listly-mvp-1/initial-prototype.html (used for state coverage only, not as the spec)
  - docs/personas/part-time-reseller.md
  - docs/personas/closet-clearer.md
  - docs/ideas/listly.md
  - docs/BACKLOG.md (GC-001 parked, no stories)
published: []
---

# Listly MVP 1: story set

**Product:** Listly (GO Commerce, not a ZAIDYN product) · **Source:** [PRD v8](../prd/listly-mvp-1.md) ·
**Prototype:** [initial-prototype.html](../design/listly-mvp-1/initial-prototype.html) · **Target release:**
Phase 1 closed beta (all P0), Phase 3 fast-follow (P1), Later (P2), per PRD §13. There are no hard dates.

## How to read this set

- **Epics follow feature areas, tagged with their PRD §13 phase.** Epics E-01 to E-10 are Phase 1 (P0).
  E-11 to E-14 are Phase 3 fast-follow (P1). E-15 is the P2 placeholder.
- **Every story traces to R-n IDs**, plus the P-xx prompts, M-xx messages and N-xx nodes from §9.3 where it
  touches AI.
- **No UI copy is invented here.** Messages are cited by M-ID (M-01 to M-13 in PRD §9.3e). Every other
  message is described by intent and marked `[copy — ux-lead]`. Where a criterion names a control or label
  in quotation marks, it's the PRD's own requirement term, used so the criterion is testable. It isn't final
  wording; ux-lead writes the wording and the detailed design from these stories.
- **PM decisions D-1 to D-11** (PRD v8 §9.6) are cited where they change a story. Decisions marked [H] are
  checked in the Phase 0 prototype test.
- **Side-effect type is `advisory`** (PRD §9.3). So there are no gates, no commit boundary and no
  traceability spine (§9.3d and §9.3f say these don't apply). The *AI states, state-changing only* block of
  the story template is deliberately left out of every story. The non-state-changing *AI states* block is
  kept on AI stories. The PRD asks in §15 whether `advisory` is right; see Q-10.
- **Performance numbers.** The plugin's system-limits reference covers ZAIDYN products only. Every number
  here comes from the PRD, or it's `[NFR TBD — eng lead]`.
- **`[H]`** marks a hypothesis carried from the PRD or prototype. **`[rule TBD — owner]`** marks a business
  rule the PRD doesn't settle. Don't build a guess in its place.
- **Estimates are blank** throughout. The team's scale isn't known yet.
- **Story IDs are durable.** Keep an ID with its story through splits and merges, and give a new story the
  next unused ID. Never renumber.

### Criteria that apply to every UI story (referenced, not repeated)

- **A11Y-BASE (R-24):** every control has a VoiceOver and TalkBack label and role. Text scales with Dynamic
  Type up to the largest size without truncating values or overlapping controls. Touch targets are at least
  44 × 44 pt. Status changes are announced. Each UI story lists only the announcements it adds.
- **EVT (R-22):** the events a story owns are listed in its criteria. Their payload and the analytics tool
  are defined once in S-41.
- **SYNTH:** all test data is synthetic. Use the prototype's sample items (denim trucker jacket, 90s band
  tee, "Brand C" leather crossbody bag) or new invented ones. Never use real seller accounts, real
  marketplace listings, real photos of people or homes, or real addresses.

### Entitlement matrix (the decision table several stories depend on)

What each plan state can do. Cells marked TBD are not settled in the PRD; see G-09, G-10 and A-03.

| Capability | Trial (no plan) | Reseller plan | Clear-out Pass, active | Clear-out Pass, expired or at its limit |
|---|---|---|---|---|
| Capture, group and give facts | Every item in a haul (R-1, D-1) | Yes | Yes | `[rule TBD — PM]` |
| Draft new items | The first 3 items drafted; the rest stay locked until a plan is chosen (R-1, D-1) | Up to the fair-use limit (R-20) | Up to 100 listings (R-18) | No. The paywall shows (R-18) |
| Copy already-drafted listings | Yes, including after "Not now" (R-2) | Yes | Yes | `[rule TBD — PM]` |
| Save photos (R-41) | `[rule TBD — PM]` | Yes | Yes (R-18) | `[rule TBD — PM]` |
| Item detail (R-42) | `[rule TBD — PM]` | Yes | Yes (R-18) | `[rule TBD — PM]` |
| Home (R-29) | New-user Home, then `[rule TBD — PM]` | Full | Pass version: Needs action, no net profit, no stale | `[rule TBD — PM]` |
| Listings (R-30) | `[rule TBD — PM]` | Full | Active and sold-but-still-live; no stale filter (R-18, R-30, D-2) | `[rule TBD — PM]` |
| Item ledger and stale filter (R-13) | `[rule TBD — PM]` | Yes | Hidden, data kept (R-18) | Hidden |
| Mark sold (R-14) and Undo (D-6) | `[rule TBD — PM]` | Yes | Yes | `[rule TBD — PM]` |
| Sold-everywhere checklist (R-15) | `[rule TBD — PM]` | Yes | Yes (R-15, R-18, D-2) | `[rule TBD — PM]` |
| Profit tab and tracker (R-16, R-32) | `[rule TBD — PM]` | Yes | Hidden; "money made" on Home | Hidden |
| Profile (R-31) | Yes | Yes | Yes | Yes |

---

## Epic overview

| Epic | Name | Phase | Priority | Stories |
|---|---|---|---|---|
| E-01 | Onboarding, sign-in and navigation | 1 | P0 | S-01 to S-04 |
| E-02 | Haul capture and item facts | 1 | P0 | S-05 to S-11 |
| E-03 | Drafting, copy and photos for every marketplace | 1 | P0 | S-12 to S-17, S-57 |
| E-04 | Trial, plans and entitlements | 1 | P0 | S-18 to S-22 |
| E-05 | Home, Listings, the item ledger and item detail | 1 | P0 | S-23 to S-26, S-58 |
| E-06 | Mark sold, the sold-everywhere checklist and Undo | 1 | P0 | S-27 to S-29, S-59 |
| E-07 | Profit tracker | 1 | P0 | S-30 to S-32 |
| E-08 | Profile, marketplaces, privacy and data | 1 | P0 | S-33 to S-36 |
| E-09 | Help: first-run tips and the how-to | 1 | P0 | S-37 to S-38 |
| E-10 | Platform: AI gateway, logging, instrumentation, evals, accessibility, design system | 1 | P0 | S-39 to S-44 |
| E-11 | Selling extras (fast-follow) | 3 | P1 | S-45 to S-49 |
| E-12 | Photo tools (fast-follow) | 3 | P1 | S-50 to S-52 |
| E-13 | Automatic sale detection (fast-follow) | 3 | P1 | S-53 to S-55 |
| E-14 | Don't preclude Listly for ChatGPT and Claude | 1 (design constraint) | P1 (separate PRD) | S-56 |
| E-15 | Deferred: web companion | Later | P2 | none (placeholder) |

**Sequencing (the real dependencies):**
1. **Foundations first:** S-39 (AI gateway), S-44 (design-system components), S-02 (accounts) and S-20
   (entitlements) unblock most of the others.
2. **The haul chain is sequential:** S-05 → S-07 → S-08 → S-09/S-10/S-11 → S-12 → S-13/S-15 → S-16 → S-17.
   S-57 (Save photos) follows S-15. S-14 (validator) and S-42 (eval harness) must land before S-15 can be
   accepted.
3. **Inventory needs items:** S-23 to S-26 need S-17 (listed records). S-58 (item detail) follows S-17 and
   is the entry point S-25, S-26, S-30 and S-59 open. S-27 → S-28 → S-29; S-59 (Undo and revert) follows
   S-27, S-28 and S-58.
4. **Profit:** S-32 (fee table) → S-31. S-30 (cost entry) can be built in parallel.
5. **Fast-follow:** S-52 (photo-edit eval) gates the release of S-51. S-50 ships before S-51 (§13).
   S-54 → S-55.

**Traceability spine:** not applicable. The PRD's side-effect type is `advisory` and §9.3f says the spine
doesn't apply at this capability type.

---

## Scope gaps identified

Things the PRD doesn't settle. They're surfaced here for the PM to decide, not silently added as stories.
Gaps that PRD v8 resolved are kept, marked **Resolved** with the D-ID, so their history is clear.

| ID | Gap | Affects | Suggested owner |
|---|---|---|---|
| G-01 | **Resolved by D-3 (R-41, S-57).** **Photo hand-off to marketplaces is undefined.** R-8 copies text fields only. Nothing says how the seller gets the item's photos (originals or R-25/R-38 edits) into each marketplace app: saving to the phone's photo library, the share sheet, or something else. Photos taken with the in-app camera may not be in the seller's camera roll at all. | S-05, S-15, S-17, S-50, S-51 | PM + ux-lead |
| G-02 | **Resolved by D-4 (R-42, S-58).** **There's no item detail screen requirement.** R-30 says "a row opens the item", and R-1 mentions deleting a drafted item, but no requirement defines the item screen: re-opening drafts later, copying to another marketplace after the haul, editing facts, entering cost or bin, or deleting. | S-16, S-17, S-26, S-27, S-30, S-47 | PM |
| G-03 | **Partly resolved by D-4:** R-42 makes facts editable and versioned. **Still open:** do the drafts regenerate? Does a re-draft use up a trial or plan listing? | S-12, S-16, S-18 | PM |
| G-04 | **Resolved by D-5 and D-9 (R-14, R-16; S-27, S-31).** **Shipping cost has no place to be entered.** R-16's formula subtracts "shipping paid by the seller", but R-14 records only the marketplace and sale price, and Selling defaults (R-31) records only *who* usually pays, not how much. | S-27, S-31, S-33 | PM |
| G-05 | **Resolved by D-5 and D-11 (R-6, R-42; S-10, S-58).** **Bin has no place to be entered per item.** R-13 says "Bin is a free-text field in MVP", and R-31 has a default bin, but nothing says where an item's bin is set or changed. | S-05/S-09 or item detail, S-26 | PM |
| G-06 | **Resolved by D-7 (R-15; S-29).** **Notification permission is never requested.** R-15's "Remind me in 1 hour" and R-31's Notifications need push permission, but onboarding (R-33) asks only for camera and microphone. | S-03, S-29, S-33 | ux-lead + PM |
| G-07 | **Still open.** v8 added M-12 and M-13 for two non-AI messages, but most still have none. **Non-AI messages have no IDs.** §9.3e covers AI messages only. Purchase failed, permission denied, the paywall, the checklist banner, the "Remind me" toast, Pass expiry, the delete confirmation, eBay connection failure, export ready and the tips all need copy. This set marks them `[copy — ux-lead]`. Suggest a UX copy table (for example `C-xx` IDs) that these stories can cite. | Most UI stories | ux-lead |
| G-08 | **Offline and lost-connection behaviour is undefined** for capture, upload, drafting and copy. Only R-37 says the written steps work offline. | S-05, S-12, S-15 | Eng lead + ux-lead |
| G-09 | **What a trial user can see and do** beyond drafting 3 items: Listings, mark sold, the checklist, Profit. See the TBD cells in the entitlement matrix. | S-18, S-21, S-23 to S-31 | PM |
| G-10 | **Clear-out Pass after expiry:** can the seller still view and copy drafted listings, and mark items sold? R-18 says only "the paywall shows again" and "data is kept". Buying a second Pass while one is active, and what happens to the remainder of a Pass on upgrade, are also unspecified. | S-21, S-20 | PM |
| G-11 | **"Money made" for Clear-out Pass users isn't defined.** Is it the sum of sale prices, or something net of fees? | S-23, S-21 | PM |
| G-12 | **eBay order to Listly item matching rule** (R-35) and **sale email to item matching rule** (R-26) aren't specified. Wrong matches would mark the wrong item sold. | S-53, S-55 | Eng lead + PM |
| G-13 | **"Days listed" and "stale at 30+ days" have no start point.** Is it the date the item or listing was marked listed (R-12), per listing (R-30) or per item (R-13)? | S-25, S-26, S-23 | PM |
| G-14 | **Resolved by D-6 and D-10 (R-14, R-15, R-40, R-42; S-59).** **No requirement to undo a mistaken "Mark sold" or "Mark traded".** These are user-reversible data changes, so a correction path is expected, but none is specified. | S-27, S-49 | PM |
| G-15 | **No requirement to unmark a listing as listed**, or to record that the seller ended a listing for a reason other than a sale. | S-17, S-25 | PM |
| G-16 | **Copy rows for fields the user didn't give.** §9.3c says a blank brand is omitted and a blank size becomes "see measurements", but R-8 says every draft has title, description, brand, size, condition and price fields. Is an empty field's copy row shown, hidden or disabled? | S-15 | ux-lead |
| G-17 | **Price field in Phase 1.** R-8 gives every draft a price field. R-11 (the estimate) is P1, and the estimate is never put into a field without the user's action. So in Phase 1, where does the price value come from: user entry, or blank? | S-15, S-45 | PM |

**Foundational concepts check:** not applicable. Listly has no `product-*.md` in the ZAIDYN product-context
pack, by design. The equivalent here is the PRD's §9.4 data model (one canonical item, many listings, sales
and costs; a sale can link to several items). S-05, S-17, S-27 and S-48 account for it.

---

# E-01 Onboarding, sign-in and navigation (Phase 1 · P0)

**Goal:** a first-time seller gets from install to their first haul with marketplaces chosen, an account,
and the AI notice seen, without being asked to pay. KR3 (first listing copied within 3 minutes of install)
depends on this epic.
**Out of scope:** the paywall (E-04); payment of any kind during onboarding (R-33).
**Sequencing:** S-01 → S-02 → S-03 → handoff to S-05. S-04 can be built in parallel.

## [S-01] Choose where I sell during onboarding

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a new seller opening Listly for the first time, I want to see what Listly
does and pick the marketplaces I sell on, so that my drafts are made for the places I actually use.
**Design:** prototype states `welcome` and `obMarkets`
**Traces to:** R-33 steps 1–2 · R-34 (drafting set) · R-22 (onboarding step events) · Flow 0
**Applicable for:** first launch on iOS and Android, before an account exists. Not shown to a returning user
who signs in (S-02).
**Impact areas:** drafting set used by S-12 and S-15 · Marketplaces and connections (S-34) · instrumentation

**Acceptance Criteria**

*Functional Requirements*
1. Given a first launch, when the app opens, then the Welcome step shows the promise and the "your first 3
   listings are free, no card needed" message, with "Get started" and "I already have an account" actions.
   `[copy — ux-lead]` for the promise.
2. Given Welcome, when the seller taps "Get started", then the Where-do-you-sell step lists eBay, Poshmark,
   Mercari, Depop and Facebook Marketplace, each selectable, with a progress indicator showing step n of 4
   (R-33, D-7).
3. Given one or more marketplaces are selected, when the seller continues, then the selection is saved as the
   drafting set and carried to the account once it's created in S-02.
4. Given no selection, when the seller chooses Skip, then the drafting set is all five marketplaces.
5. Given Welcome, when the seller taps "I already have an account", then sign-in (S-02) opens and
   onboarding is skipped after a successful sign-in.
- [ ] Validation: Continue is unavailable with zero marketplaces selected. Skip is the only way forward
  without a selection.
- [ ] Edge: if the app is closed during onboarding, it reopens at Welcome with the selection kept on the
  device until the account exists `[H — confirm with eng lead]`.
- [ ] Must not: no step asks for payment or card details (R-33).
- [ ] Must not: the generic format is not offered as a choice here. Whether it's always drafted is Q-15.
- [ ] Events: each onboarding step completed or skipped (EVT).
- [ ] Rest of the functionality should remain As-Is: this is a new app; nothing existing changes.

*Non-Functional Requirements*
- [ ] A11Y-BASE. The progress indicator announces the current step and the total of 4 `[copy — ux-lead]`.
- [ ] NFR: Welcome is interactive within `[NFR TBD — eng lead]` of a cold start. KR3's 3-minute budget
  starts at install.

**Out of scope (this story):** account creation (S-02); permissions (S-03); changing the set later (S-34).
**Optional engineering subtasks:** local persistence of the selection before sign-up; migrate it to the
account on creation.
**Dependencies:** S-44 (selection chips, progress dots).
**Open questions:** Q-15 (generic format), Q-11 (account before first photo is [H]; prototype test decides).
**Test data needs:** fresh install, no account.
**Labels / components:** phase-1 · onboarding · **Estimate:** —

## [S-02] Create an account or sign in

**Format:** User story · **Dimensions:** UI · Backend · Integration · Data
**Story Summary (Description):** As a new seller, I want to create an account with Apple, Google or email,
so that my items, trial count and settings are kept across phones.
**Design:** prototype state `obAccount`
**Traces to:** R-33 step 3 · R-31 (Account: email, sign-in method, sign out) · R-1 (trial bound to the
account) · R-36 (tips seen state saved to the account) · R-27 and R-39 (don't preclude other clients in auth)
**Applicable for:** iOS and Android. Continue with Apple on iOS; whether it's offered on Android is
`[TBD — eng lead]`.
**Impact areas:** auth · trial counter (S-18) · entitlements (S-20) · row-level security on every table ·
sign-out in Profile (S-33)

**Acceptance Criteria**

*Functional Requirements*
1. Given the Create-an-account step, when the seller picks "Continue with Apple", "Continue with Google" or
   email, then an account is created through that method and onboarding moves to S-03.
2. Given an account is created, then the drafting set from S-01 is saved to it, and the trial counter starts
   at 3 free listings (S-18).
3. Given a returning seller who signs in, when sign-in succeeds, then onboarding is skipped and Home (S-23)
   opens with their existing items.
4. Given sign-in or sign-up fails (cancelled, network error, provider error), then the seller stays on this
   step, sees what failed and can try again `[copy — ux-lead]`. No partial account is created.
5. Given a signed-in seller, when they choose Sign out in Profile, then local data is cleared from the device
   and Welcome shows.
- [ ] Validation: email sign-up validates the address format and shows an inline error `[copy — ux-lead]`.
  Password or magic-link rules: `[TBD — eng lead]`.
- [ ] Edge: an Apple sign-in with a hidden relay email works the same as any other email.
- [ ] Edge: the same person signing in with a second method creates a second account unless the emails match
  `[rule TBD — eng lead]`.
- [ ] Must not: no trial reset by creating a new account on the same device is detectable or prevented in
  the PRD. Whether to prevent it is `[rule TBD — PM]`.
- [ ] Must not: one account can never read another account's items, photos, sales or settings (row-level
  security).
- [ ] Rest of the functionality should remain As-Is: no existing auth to change.

*Non-Functional Requirements*
- [ ] NFR: auth tokens are issued in a form a future web client (R-27) and an OAuth consent flow for
  assistant access (R-39) can reuse. See S-56.
- [ ] NFR: account isolation is verified by an automated test that attempts cross-account reads on every
  table and storage bucket.
- [ ] A11Y-BASE.

**Out of scope (this story):** account deletion (S-36); plan purchase (S-20).
**Optional engineering subtasks:** Supabase auth providers; RLS policies; session refresh.
**Dependencies:** Supabase project; Apple and Google sign-in configuration.
**Open questions:** Q-11 (account timing [H]); trial abuse rule above.
**Test data needs:** synthetic test accounts per provider.
**Labels / components:** phase-1 · auth · **Estimate:** —

## [S-03] Explain camera, microphone and AI processing before asking

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a new seller, I want to know why Listly needs my camera and microphone,
and that a third-party AI processes my photos and answers, before my phone asks me, so that I can decide
with the facts in front of me.
**Design:** prototype state `obPerms`; the "Denies camera and mic" branch in Flow 0
**Traces to:** R-33 step 4 · R-23 (AI notice before first upload) · R-4, R-6 (denied fallbacks) · R-22
(permission outcome events) · §10
**Applicable for:** first launch; again from a denied state when the seller tries the camera or microphone.
**Impact areas:** capture (S-05) · voice (S-09) · Profile → Privacy and data (S-33) · app-store privacy labels

**Acceptance Criteria**

*Functional Requirements*
1. Given the Camera-and-microphone step, then it shows why each permission is needed and the AI processing
   notice, before any system permission prompt appears `[copy — ux-lead; notice wording to Legal]`.
2. Given the seller accepts, when they continue, then the system camera prompt and then the microphone
   prompt appear, and onboarding ends in a new haul (S-05).
3. Given the seller taps "Not now", then no system prompt appears, and the haul opens with the photo library
   and typing as the input methods.
4. Given the seller denies either system prompt, then the haul still works with the library (camera denied)
   or typing (microphone denied), and says how to turn access on, with a link to the phone's Settings.
5. Given the notice has been shown, then the acknowledgement is recorded on the account with a timestamp, and
   no photo or answer is uploaded for AI processing before it.
- [ ] Edge: camera allowed and microphone denied (and the reverse) each give the matching single fallback.
- [ ] Edge: permission granted later in Settings is picked up when the seller returns to the app, without a
  restart.
- [ ] Must not: no photo or audio leaves the device before the notice is acknowledged (R-23).
- [ ] Events: camera and microphone permission outcome (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.
- [ ] NFR: the notice acknowledgement is stored with the notice version, so a changed notice can be shown
  again `[H — confirm with Legal]`.

**Out of scope (this story):** notification permission, asked on the first "Remind me in 1 hour" (S-29,
D-7); photo-library permission, asked on the first Save photos (S-57); the second AI provider notice for
R-38 (S-51).
**Optional engineering subtasks:** permission-state hook shared by S-05 and S-09.
**Dependencies:** Legal wording for the notice (§10).
**Open questions:** audio retention (Q-07).
**Test data needs:** device with permissions reset.
**Labels / components:** phase-1 · onboarding · privacy · **Estimate:** —

## [S-04] Move around the app with the main tab bar

**Format:** User story · **Dimensions:** UI
**Story Summary (Description):** As a part-time reseller, I want a tab bar with Home, Listings, New haul,
Profit and Profile, with New haul most prominent, so that I can start a haul or check my inventory from
anywhere in one tap.
**Design:** tab bar on `home`, `listings`, `profit`, `profile`, `passHome`
**Traces to:** R-32 · R-18 (Profit hidden for the Clear-out Pass) · §9.1 main navigation
**Applicable for:** Reseller plan (5 tabs); Clear-out Pass (4 tabs, no Profit); trial (`[rule TBD — PM]`,
see G-09).
**Impact areas:** every top-level screen · haul flow return path

**Acceptance Criteria**

*Functional Requirements*
1. Given a Reseller plan seller, then the tab bar shows Home, Listings, New haul, Profit and Profile, with New
   haul as the central, most prominent action.
2. Given a Clear-out Pass seller, then the tab bar shows Home, Listings, New haul and Profile, and Profit is
   not shown.
3. Given a haul started from any tab, when the haul is finished or cancelled, then the seller returns to the
   tab they started from.
4. Given a plan is bought from the paywall in the middle of a haul, then the seller returns to that haul,
   not to Home; finishing it then returns them to the starting tab (R-32, D-7).
5. Given any tab, then the current tab is marked as selected for screen readers.
- [ ] Edge: a seller whose plan changes (trial → Pass, Pass → Reseller, Pass expiry) sees the tab set update
  on the next screen load, without a restart.
- [ ] Must not: the tab bar doesn't show during onboarding, on the paywall, or during drafting
  `[H — confirm with ux-lead]`.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Each tab announces its name, its position and its selected state.

**Out of scope (this story):** whether Profit stays a tab or moves into Home (Q-14, open).
**Dependencies:** S-44 (tab bar is a GO design-system gap).
**Open questions:** Q-14. (A-06 resolved by D-7.)
**Test data needs:** one account per plan state.
**Labels / components:** phase-1 · navigation · **Estimate:** —

---

# E-02 Haul capture and item facts (Phase 1 · P0 · AI: P-01, P-02)

**Goal:** a seller photographs a whole haul, confirms how the photos group into items, and gives each item's
facts by voice or typing, with nothing filled in that they didn't say.
**Out of scope:** photo editing (E-12); drafting (E-03).
**Sequencing:** S-05 → S-07 → S-08 → S-09, S-10, S-11. S-06 can follow S-05.

## [S-05] Photograph a haul with the camera or library

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to shoot a whole haul in one session, adding
library photos and tapping "Next item" between items, so that I capture everything before I start
describing anything.
**Design:** prototype state `capture` (and its camera-denied variant)
**Traces to:** R-4 · R-23 (location metadata stripped) · §10 · N-01 · Flow 1
**Applicable for:** all plan states. A trial seller with no free listings left can still capture
`[H — confirm with PM]`; the entitlement check happens at N-06 (S-12).
**Impact areas:** photo storage · unfinished hauls (S-06) · grouping (S-07) · data export and deletion
(S-35, S-36)

**Acceptance Criteria**

*Functional Requirements*
1. Given haul mode, when the seller takes photos with the camera and adds photos from the library, then all
   of them join one haul session, in capture order, with a running photo count.
2. Given photos in the session, when the seller taps "Next item", then a marker is placed after the last
   photo. Markers are kept with the haul and used by S-07.
3. Given at least one photo, when the seller taps Done, then the photos and markers are uploaded and grouping
   (S-07) starts. With zero photos, Done is unavailable.
4. Given camera permission is denied, then the camera is unavailable, the screen says how to enable it (link
   to Settings) and offers the library `[copy — ux-lead]`.
5. Given the seller cancels the haul, then they're asked whether to keep or discard the photos
   `[rule TBD — PM: keep as an unfinished haul (S-06) or discard]`, and they return to the starting tab
   (S-04).
- [ ] Data: originals are kept unaltered. Location metadata is stripped before upload and before any photo is
  saved or shared (R-23, §10). Other metadata: `[TBD — eng lead]`.
- [ ] Data: photos are stored in private object storage scoped to the account (RLS).
- [ ] Edge: the maximum photos per haul is `[NFR TBD — eng lead]`; at that maximum, the seller is told and
  can finish the haul `[copy — ux-lead]`.
- [ ] Edge: a library photo already used in another haul can be added again `[H]`.
- [ ] Edge: an upload interrupted by lost connection resumes or retries without duplicating photos
  (see G-08).
- [ ] Must not: no photo is sent to the AI provider before S-03's notice is acknowledged.
- [ ] Must not: location metadata never reaches storage, logs (S-40) or the AI provider.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. The shutter announces each photo taken and the running count.
- [ ] NFR: shutter-to-ready time and upload throughput `[NFR TBD — eng lead]`.
- [ ] NFR: an automated test confirms GPS EXIF fields are absent from every stored photo.

**Out of scope (this story):** saving photos to the phone for posting (S-57, R-41); photo fixes (S-50).
**Optional engineering subtasks:** EXIF stripping on device before upload; resumable upload.
**Dependencies:** S-03 (permissions); S-44 (shutter, Next item, photo count).
**Open questions:** G-08; cancel-haul rule above.
**Test data needs:** synthetic photos with GPS EXIF present, to prove stripping.
**Labels / components:** phase-1 · haul · **Estimate:** —

## [S-06] Pick up an unfinished haul where I left off

**Format:** Job story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** When I stop partway through a haul, I want my photos, grouping and answers
kept, so I can continue later without starting again.
**Design:** prototype `home` "Unfinished haul" card → `group`
**Traces to:** R-29 (Unfinished hauls section) · R-7 (Cancel keeps photos and answers) · R-22 (unfinished haul
resumed) · Maya's "Still to list" need (persona)
**Applicable for:** all plan states.
**Impact areas:** Home (S-23) · haul flow state · trial counting (an undrafted item uses nothing)

**Acceptance Criteria**

*Functional Requirements*
1. Given a haul with items photographed but not yet drafted, or drafted but not yet copied, when the seller
   leaves the flow (app closed, tab change, cancel at drafting), then the haul's state is saved on the
   server: photos, markers, confirmed grouping, and answers so far.
2. Given a saved unfinished haul, when the seller taps Continue on Home, then the flow reopens at the furthest
   step reached (grouping, facts for item n, or drafts).
3. Given several unfinished hauls, then each is listed separately on Home with its item count
   `[H — confirm with ux-lead]`.
4. Given an unfinished haul, when the seller discards it, then its photos and answers are deleted after a
   confirmation `[copy — ux-lead]`.
- [ ] Edge: an unfinished haul started on one phone can be continued on another signed into the same account.
- [ ] Edge: "drafted but not yet copied" ends for an item when any field is copied or it's marked listed
  (S-17) `[H — R-29 doesn't define the end condition]`.
- [ ] Must not: resuming never re-runs grouping or extraction on its own; confirmed grouping and answers are
  kept as they were.
- [ ] Must not: saving or resuming uses no trial or plan listing.
- [ ] Edge: a trial seller's items after the third stay in the haul as ready to draft, locked, until a plan
  is chosen (R-1, D-1). They show on Home as unfinished and resume at the locked drafting step.
- [ ] Events: unfinished haul resumed (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: haul state is saved within `[NFR TBD — eng lead]` of each step change, so a crash loses at most
  the current answer.
- [ ] A11Y-BASE.

**Out of scope (this story):** reminders about unfinished hauls (not in the PRD).
**Dependencies:** S-05, S-08, S-09.
**Open questions:** how long an unfinished haul is kept `[rule TBD — PM]`.
**Test data needs:** synthetic hauls stopped at each step.
**Labels / components:** phase-1 · haul · **Estimate:** —

## [S-07] Propose how my photos group into items

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want Listly to propose which photos belong to
which item, labeled as automatic, so that checking the grouping is quicker than tagging every photo myself.
**Design:** prototype state `group`
**Traces to:** R-5 · P-01 · N-01, N-02, N-03, N-09 · M-05, M-10 · §9.3c (item boundaries slot) · §9.3e
failure rows "no result", "ambiguous" and "grouping call fails"
**Applicable for:** all plan states.
**Impact areas:** AI gateway (S-39) · logging (S-40) · grouping eval (S-42)

**Acceptance Criteria**

*Functional Requirements*
1. Given a haul's uploaded photos and markers, when grouping runs (P-01), then the system proposes items, each
   with its photos, and shows M-05 (the grouping is automatic and should be checked).
2. Given "Next item" markers, then every marker is an item boundary in the proposal. The AI only splits
   further within a marked group, and never merges across a marker.
3. Given the photos can't be grouped (no result), then all photos are proposed as one item, with M-05, and
   the seller can split it (S-08).
4. Given an ambiguous grouping, then the system still proposes one grouping with M-05; it doesn't ask the
   seller to choose between alternatives.
5. Given grouping fails (timeout or provider unavailable), then M-10 shows: the photos are kept, and the
   seller can try again, or continue with the whole haul as one item and split it by hand (S-08). (D-7.)
- [ ] Must not: no facts are extracted and no drafts generated until the seller confirms the grouping (S-08).
- [ ] Must not: grouping never looks anything up on the web (P-01 near-miss).
- [ ] Must not: grouping uses no trial or plan listing.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: grouping accuracy meets the eval threshold `[TBD — eng lead]` on the 10-haul eval set (S-42)
  before Phase 1 release.
- [ ] NFR: if grouping takes over 3 s, activity is visible; over 5 s, Cancel is available (§9.3 governance).
  Latency target `[NFR TBD — eng lead]`.
- [ ] A11Y-BASE. The count of items found is announced when grouping completes.

*AI states* — Pattern: AI Assisted Outputs (Simple); Escalation (mandatory). PRD §9.3.
- [ ] Wait state: processing shown while P-01 runs.
- [ ] Reasoning visible for operations over 3 s; cancel available for operations over 5 s.
- [ ] Escalation: on failure, M-10 says what happened, confirms the photos are kept, and offers retry or a
  manual path.
- [ ] Sources: the grouping is labeled as automatic (M-05). Data freshness: not applicable.
- [ ] Every AI action logged with timestamp, user, and input and output references (S-40).

**Out of scope (this story):** editing the grouping (S-08).
**Optional engineering subtasks:** P-01 structured output schema; marker pre-segmentation in deterministic
code before the model call.
**Dependencies:** S-39 (gateway), S-40 (logging), S-05.
**Open questions:** grouping accuracy threshold (eng lead). (A-11 resolved by D-7: M-10.)
**Test data needs:** synthetic hauls of 1, 3, 10 and 30 items, with and without markers.
**Labels / components:** phase-1 · haul · ai · **Estimate:** —

## [S-08] Fix and confirm the grouping

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to move photos between items, split an item
and merge two items, then confirm, so that every item has exactly its own photos before I describe it.
**Design:** prototype state `group` (Move a photo and Split are stubs; Merge isn't in the prototype)
**Traces to:** R-5 · N-03 · M-05 · §9.3 Reversibility ("grouping editable before anything is drafted")
**Applicable for:** all plan states.
**Impact areas:** item records · unfinished hauls (S-06)

**Acceptance Criteria**

*Functional Requirements*
1. Given a proposed grouping, when the seller moves a photo from one item to another, then the photo appears
   under the target item and not the source.
2. Given an item, when the seller splits it at a chosen photo, then two items exist with the photos divided
   at that point.
3. Given two items, when the seller merges them, then one item exists with both items' photos.
4. Given the seller confirms the grouping, then item records are created with their photos, and fact
   collection (S-09) starts at item 1.
- [ ] Validation: an item can't be left with zero photos; moving its last photo removes the empty item
  `[H — confirm with ux-lead]`.
- [ ] Edge: a single-photo haul is one item, and the grouping step can still be confirmed.
- [ ] Edge: a seller-made edit always wins over the AI proposal. Re-running grouping after edits is not
  offered `[H]`.
- [ ] Must not: no facts or drafts are generated before confirmation (R-5).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Moving a photo has a non-drag alternative (for example a "Move to item n" action) that works
  with VoiceOver and TalkBack.
- [ ] NFR: confirming a 30-item grouping completes within `[NFR TBD — eng lead]`.

**Out of scope (this story):** reordering photos within an item `[H — not in the PRD]`.
**Dependencies:** S-07; S-44.
**Open questions:** none beyond the [H] above.
**Test data needs:** synthetic hauls where the proposal is deliberately wrong.
**Labels / components:** phase-1 · haul · **Estimate:** —

## [S-09] Answer an item's facts by voice

**Format:** User story · **Dimensions:** UI · Backend · Integration · Data
**Story Summary (Description):** As a part-time reseller, I want to say an item's brand, size, measurements,
flaws and condition out loud and see what Listly heard, so that I can describe a haul quickly with my hands
full.
**Design:** prototype states `facts` and `factsRetry`
**Traces to:** R-6 · P-02 · N-04, N-05 · M-02 · §9.3 Explainability ("Heard: …") · §9.3c · §10 (audio
retention)
**Applicable for:** all plan states, when microphone permission is granted.
**Impact areas:** item facts · AI gateway (S-39) · logs (S-40) · audio storage and deletion

**Acceptance Criteria**

*Functional Requirements*
1. Given item n's fact screen, when the seller speaks, then the transcript is shown as "Heard: …" and P-02
   fills brand, size, measurements, flaws and condition only from what was said.
2. Given a field the seller didn't mention, then it stays blank. It is never filled from the photos or from
   any other source.
3. Given speech isn't understood, then M-02 shows which fact wasn't understood, with Try again and typing.
   Affected fields stay blank.
4. Given an answer could be one of two values (for example two sizes), then M-02 shows both and the seller
   picks one or types.
5. Given the seller speaks again for the same item, then the new answer updates the fields it mentions and
   leaves the others as they were `[H — confirm with eng lead]`.
6. Given every required slot is resolved (S-11), when the seller taps Next item, then item n+1's facts open;
   after the last item, drafting can start (S-12).
- [ ] Edge: measurements are kept in the units spoken (§9.3c).
- [ ] Edge: "It's authentic" is recorded only as the seller's statement, if said as such, and never as a
  verified fact (ambiguity library).
- [ ] Data: audio is retained per Legal's decision. The PRD's default proposal is transcribe, then delete
  `[TBD — Legal, blocking]`.
- [ ] Must not: no field is filled from the photo.
- [ ] Must not: seller instructions inside an answer ("make it sound brand new") are treated as data, not
  instructions to the model.
- [ ] Must not: bin is never extracted from speech. It's a typed field (S-10), so it never reaches the AI
  (R-6, §9.3 data boundaries, D-11).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: extraction accuracy against the spoken answers meets the eval threshold `[TBD — eng lead]` (S-42).
- [ ] NFR: transcript shown within `[NFR TBD — eng lead]` of the seller stopping speaking.
- [ ] A11Y-BASE. Recording start and stop, and each filled field, are announced.

*AI states* — Pattern: AI Assisted Outputs (Simple); Escalation (mandatory).
- [ ] Wait state: processing shown while transcription and P-02 run.
- [ ] Reasoning visible for operations over 3 s; cancel available for operations over 5 s.
- [ ] Escalation: M-02 on not-understood or ambiguous; fields stay blank, nothing is lost.
- [ ] Sources: each field traces to the transcript ("Heard: …").
- [ ] Every AI action logged with timestamp, user, and input and output references (S-40). Audio is
  referenced, not copied into logs.

**Out of scope (this story):** typing (S-10); required-slot prompts (S-11).
**Optional engineering subtasks:** speech-to-text provider choice; P-02 schema.
**Dependencies:** S-08, S-39, S-40, S-03.
**Open questions:** Q-07 audio retention (blocking).
**Test data needs:** synthetic recorded answers, including noisy, mumbled and two-value cases.
**Labels / components:** phase-1 · haul · ai · voice · **Estimate:** —

## [S-10] Type an item's facts instead of speaking

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a seller who can't or won't use the microphone, I want to type the same
facts, so that I can finish a haul in a quiet place or with the microphone turned off.
**Design:** prototype `facts` with "Type the answers", and its microphone-denied variant
**Traces to:** R-6 · P-02 (typed answers go through the same extraction, N-04) · R-33 (Not now leads to
typing) · R-31 (default bin) · D-5, D-11 (bin)
**Applicable for:** all plan states; the only input when microphone permission is denied.
**Impact areas:** same as S-09.

**Acceptance Criteria**

*Functional Requirements*
1. Given item n's facts, when the seller chooses to type, then they can enter brand, size, measurements,
   flaws and condition.
2. Given typed text is entered as free text, then P-02 extracts fields from it with the same rules as voice:
   only what was typed; blanks stay blank.
3. Given microphone permission is denied, then typing is the offered input and the screen says how to turn
   the microphone on `[copy — ux-lead]`.
4. Given a seller edits an extracted field directly, then their edit wins and is not re-extracted.
5. Given the facts step, then it has an optional, typed bin field, prefilled with the default bin from
   Selling defaults (R-31) and suggesting bins the seller has used before. The bin is saved on the item and
   shown on item detail (S-58) and Mark sold (S-27). (R-6, D-5, D-11 [H]: the haul-mode prototype test
   checks whether resellers label bins.)
- [ ] Validation: field length default 255 characters (§9.3c); at the limit, further input is blocked and
  the remaining count is shown.
- [ ] Edge: no default bin and no bins used before. The bin field is empty with no suggestions; leaving it
  empty is allowed.
- [ ] Must not: typed answers are never filled from the photo.
- [ ] Must not: the bin is never sent to the AI and never appears in a draft or in copied listing text
  (R-6, §9.3 data boundaries). It does appear in the seller's CSV (S-46).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Fields have visible labels and keyboard types matching their content.

*AI states* — Pattern: AI Assisted Outputs (Simple).
- [ ] Wait state shown while P-02 runs on typed text, if over 3 s.
- [ ] Escalation: M-02 on ambiguous typed values.
- [ ] Every AI action logged (S-40).

**Out of scope (this story):** voice (S-09).
**Dependencies:** S-09 (shared fields and P-02).
**Open questions:** whether typed answers skip P-02 when typed directly into labeled fields `[TBD — eng
lead]`.
**Test data needs:** synthetic typed answers.
**Labels / components:** phase-1 · haul · ai · **Estimate:** —

## [S-11] Get asked once for a missing flaw, condition or size

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want Listly to ask me once for a fact it needs
and I didn't give, so that every listing has its flaws and condition stated and I avoid returns.
**Design:** prototype `facts` (condition isn't shown on the prototype's fact screen; the prototype must add
it, per R-6 and D-7)
**Traces to:** R-6 · §9.3c slots · N-05 · M-02 · §9.3b ambiguity library ("Like new" with no flaws) · R-10 ·
D-7 (condition required)
**Applicable for:** all plan states. Size is required only for clothing and shoes.
**Impact areas:** drafting readiness (N-06)

**Acceptance Criteria**

*Functional Requirements*
1. Given flaws weren't answered, then the seller is asked "Any flaws?" once, and can't continue until they
   list flaws or answer "none".
2. Given condition wasn't answered, then the seller is asked once. Condition is a required slot (R-6, D-7),
   so the seller can't continue until it's answered `[H — R-6 says required; §9.3c's "if unresolved" column
   still says only "ask once". Confirm with PM that this blocks like flaws do]`.
3. Given a clothing or shoe item with no size, then the seller is asked once. If still blank, the draft says
   "see measurements" (§9.3c).
4. Given "Like new" with no flaws mentioned, then the condition is recorded and the seller is asked "Any
   flaws?" once.
5. Given an ambiguous condition, size or brand, then M-02 asks the seller to pick.
- [ ] Decision table (from §9.3c):

| Slot | Required | Unanswered after one ask | Ambiguous |
|---|---|---|---|
| Brand | No | Blank; the draft omits it | M-02, pick |
| Size | Clothing and shoes | Draft says "see measurements" | M-02 |
| Measurements | No | Blank | M-02 |
| Flaws | Yes ("none" or a list) | Can't continue | n/a |
| Condition | Yes (R-6, D-7) | Can't continue `[H — see criterion 2]` | M-02 |

- [ ] Edge: how an item is classed as clothing or shoes is `[rule TBD — eng lead]`. It must not be inferred
  in a way that fills a fact.
- [ ] Must not: no slot is ever asked more than once per item, except by the seller's own choice.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. The prompt is announced when it appears.

*AI states* — Pattern: AI Assisted Outputs (Simple).
- [ ] Clarification shown as M-02 (blocks flow, requires user action).
- [ ] Every AI action logged (S-40).

**Out of scope (this story):** mapping condition to each marketplace's values (S-15).
**Dependencies:** S-09, S-10.
**Open questions:** confirm condition blocks like flaws (criterion 2); clothing classification rule.
**Test data needs:** synthetic answers missing each slot.
**Labels / components:** phase-1 · haul · ai · **Estimate:** —

---

# E-03 Drafting, copy and photos for every marketplace (Phase 1 · P0 · AI: P-03)

**Goal:** every item in the haul is drafted for every marketplace in the seller's drafting set, honestly,
within each marketplace's limits, and the seller copies, edits and records where it's listed.
**Out of scope:** the price estimate (S-45, P1); posting to any marketplace (non-goal).
**Sequencing:** S-14 and S-42 gate S-15's acceptance. S-12 → S-13 → S-15 → S-16 → S-17.

## [S-12] Draft every item for every marketplace, with progress and Cancel

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want every item drafted for all my marketplaces
in one go, with progress I can see and a Cancel, so that I can describe the whole haul first and get every
listing at once.
**Design:** prototype state `drafting`
**Traces to:** R-7 · P-03 · N-06, N-07 · M-01 · R-20 (cap checked at N-06) · R-1 (entitlement at N-06) ·
§9.3 governance (visible activity over 3 s, cancel over 5 s)
**Applicable for:** all plan states with drafting entitlement (see entitlement matrix).
**Impact areas:** trial counter (S-18) · usage limits (S-22) · AI gateway (S-39) · logs (S-40)

**Acceptance Criteria**

*Functional Requirements*
1. Given the last item's facts are complete, when the seller starts drafting, then N-06 checks facts,
   entitlement and the AI cost cap before any model call.
2. Given the checks pass, then drafting runs for every item × every marketplace in the drafting set, and M-01
   shows within 1 second, with the number of items and marketplaces, and Cancel.
3. Given the seller taps Cancel, then drafting stops, the seller returns to the facts, and all photos and
   answers are kept. Items already drafted before Cancel: `[rule TBD — PM: kept or discarded]`.
4. Given every item drafts, then the drafts screen (S-15) opens with M-08.
5. Given N-06 fails on entitlement or a limit, then M-06 (S-22) or the paywall (S-19) shows instead, and no
   model call is made for the items over the entitlement.
6. Given a trial seller with fewer free listings left than items in the haul, then only that many items are
   drafted, in the order the seller drafts them. The rest stay ready to draft, locked, with their photos and
   answers kept, until a plan is chosen (R-1, D-1).
- [ ] Edge: a drafting set of one marketplace and a haul of one item both work.
- [ ] Edge: the app is backgrounded mid-drafting; drafting continues on the server and the result is shown
  on return `[H — confirm with eng lead]`.
- [ ] Must not: a failed or cancelled item uses up no trial listing (R-7).
- [ ] Must not: account details, payment data, sale prices, costs or profit are never sent to the model
  (§9.3 data boundaries).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: progress (M-01) visible within 1 s of start (R-7).
- [ ] NFR: end-to-end drafting for a 10-item haul × 3 marketplaces completes within `[NFR TBD — eng lead]`
  at p95 (§9.3 cost and latency).
- [ ] NFR: AI cost per listing ≤ $0.01 (KR5), measured from S-40 logs.
- [ ] A11Y-BASE. "Drafting done" is announced (R-24).

*AI states* — Pattern: Processing (Simple); Escalation (mandatory).
- [ ] Wait state: processing (M-01) shown while P-03 runs.
- [ ] Reasoning visible for operations over 3 s; cancel available for operations over 5 s (R-7 meets both).
- [ ] Escalation: on failure, S-13.
- [ ] Sources: each drafted field traces to the seller's answers (S-15).
- [ ] Every AI action logged (S-40).

**Out of scope (this story):** failure display (S-13); the estimate (S-45).
**Optional engineering subtasks:** one structured generation call per item plus the deterministic validator
(S-14), per §9.4.
**Dependencies:** S-39, S-40, S-14, S-20 (entitlement check), S-22.
**Open questions:** drafting ceiling (eng lead); items drafted before Cancel.
**Test data needs:** synthetic hauls of 1, 10 and 30 items.
**Labels / components:** phase-1 · drafting · ai · **Estimate:** —

## [S-13] Recover when drafting fails for some or all items

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want to keep the items that drafted and retry the
ones that didn't, so that a provider hiccup never costs me my work or a free listing.
**Design:** prototype state `draftFail`
**Traces to:** R-7 · M-03, M-04 · N-09 · §9.3e failure table (timeout, provider unavailable, some items
fail) · terminal states partial and unavailable
**Applicable for:** all plan states.
**Impact areas:** trial counter (S-18) · logs (S-40)

**Acceptance Criteria**

*Functional Requirements*
1. Given every item fails (timeout or provider unavailable), then M-03 shows: drafting failed, photos and
   answers are saved, no trial listing was used, and Try again.
2. Given some items draft and some fail, then M-04 shows which items drafted and which didn't. Drafted items
   are kept and copyable. Each failed item offers Try again.
3. Given the seller retries failed items, then only those items are drafted again; successful drafts are not
   regenerated.
4. Given a retry succeeds, then that item counts against the trial or plan once, at that point.
- [ ] Edge: a failure for one marketplace of one item `[rule TBD — eng lead: is the item failed, or just that
  marketplace's draft?]`.
- [ ] Edge: repeated failures don't lock the seller out; Try again stays available.
- [ ] Must not: no failed item uses up a trial listing (R-7).
- [ ] Must not: no partial draft for a failed item is shown as if complete.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. M-03 and M-04 are announced as alerts.
- [ ] NFR: retry policy for provider errors (attempts, backoff) `[NFR TBD — eng lead]`.

*AI states* — Pattern: Escalation (mandatory).
- [ ] Escalation: says what happened, confirms nothing was lost and no listing was used, offers recovery.
- [ ] Every failure logged with cause (S-40).

**Out of scope (this story):** the limit-reached failure (S-22).
**Dependencies:** S-12.
**Open questions:** per-marketplace failure rule.
**Test data needs:** fault injection for timeout, provider down, and a single-item failure.
**Labels / components:** phase-1 · drafting · ai · **Estimate:** —

## [S-14] Block any draft that drops a flaw, adds a fact or breaks a title limit

**Format:** Technical enabler · **Dimensions:** Backend · Data
**Story Summary (Description):** A deterministic validator runs on every P-03 output before it's shown, so
that a part-time reseller never sees a draft that hides a stated flaw, states an attribute they didn't give,
or exceeds a marketplace's title limit.
**Design:** none (server-side)
**Traces to:** R-10 · R-8 (title limits) · M-07 · §9.3 guardrails · §9.4 (deterministic validator) · §9.3b
ambiguity library
**Applicable for:** every draft, every marketplace.
**Impact areas:** drafting (S-12) · eval (S-42) · edits (S-16, where the validator does not block the
seller's own edits)

**Acceptance Criteria**

*Functional Requirements*
1. Given a draft, when the validator runs, then every flaw the seller stated is present in that marketplace's
   description. If not, the draft is regenerated or failed (`[rule TBD — eng lead: regenerate once, then
   fail into S-13]`), and never shown without the flaw.
2. Given a draft, then it states no brand, material, measurement, authenticity or condition the seller didn't
   give (R-10). A violation is handled as in criterion 1.
3. Given a draft title longer than the marketplace's limit, then it's shortened or regenerated so it fits,
   and the count is available to S-15.
4. Given a seller's request that would remove a stated flaw (for example "don't mention the stain"), then the
   flaw stays in every draft and M-07 shows (ambiguity library).
5. Given an authenticity claim the seller made as their own statement, then the draft may attribute it to the
   seller and never asserts it as verified.
- [ ] Data: the title limit per marketplace and the description limit are read from configuration, not
  hard-coded `[values TBD — eng lead, blocking]`.
- [ ] Must not: the validator never edits the seller's own edits in S-16.
- [ ] Must not: no draft is shown to the seller before it passes.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: eval pass = 100% flaw recall, 0 unstated attributes, 100% title compliance (§9.3 evaluation),
  measured by S-42 before Phase 1 release and on every model or prompt change.
- [ ] NFR: validator adds no more than `[NFR TBD — eng lead]` per item to drafting time.

*AI states* — Pattern: AI Assisted Outputs (Simple).
- [ ] Every validator outcome (pass, regenerate, fail) logged against the AI run (S-40).

**Out of scope (this story):** the price estimate's label (S-45).
**Optional engineering subtasks:** flaw-presence matcher that tolerates rewording; attribute diff against the
confirmed facts.
**Dependencies:** verified title limits (Q-04).
**Open questions:** Q-04 (blocking); regenerate-or-fail rule.
**Test data needs:** the §9.3 eval set and near-misses (synthetic).
**Labels / components:** phase-1 · drafting · ai · quality · **Estimate:** —

## [S-15] See and copy each marketplace's draft, one field at a time

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want each item's draft laid out per marketplace,
with a one-tap Copy on every field and the title's character count, so that I can paste it straight into
each marketplace app.
**Design:** prototype state `draft` (item selector, marketplace tabs, Copy rows)
**Traces to:** R-8 · M-08 · M-07 · R-6 ("Heard: …" traceability) · R-1 (trial counter shown) · R-24
("copied" announced) · R-22 (first listing copied, with time since install) · R-41 (Save photos action,
S-57)
**Applicable for:** all plan states with drafted items.
**Impact areas:** clipboard · trial counter (S-18) · tips (S-37) · KR3

**Acceptance Criteria**

*Functional Requirements*
1. Given a drafted haul, then M-08 shows how many items are ready for how many marketplaces, and the trial
   counter for a trial seller.
2. Given the drafts screen, then the seller can switch item and marketplace. Each marketplace in the drafting
   set has title, description, brand, size, condition and price fields, plus the generic format
   `[see Q-15]`.
3. Given a title, then its character count and the marketplace's limit are shown.
4. Given any field, when the seller taps Copy, then the field's text is on the clipboard and a confirmation
   shows `[copy — ux-lead]`.
5. Given a drafted field, then the seller can see which of their answers it came from (R-6 traceability).
6. Given condition, then it's shown in that marketplace's condition values, mapped from the seller's answer
   `[mapping TBD — eng lead]`.
7. Given the copy screen for an item, then it offers Save photos (S-57).
8. Given a trial haul with locked items (D-1), then locked items show as ready to draft, with a lock, and
   aren't copyable until a plan is chosen.
- [ ] Edge: a field the seller didn't give (for example brand) is handled per G-16 `[TBD — ux-lead]`.
- [ ] Edge: the price field in Phase 1 is per G-17 `[TBD — PM]`.
- [ ] Edge: Depop's title limit is listed as "none" in the prototype placeholder; real limits come from
  Q-04.
- [ ] Must not: drafts already made are never hidden by the paywall (R-2).
- [ ] Events: first listing copied, with time since install (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Each Copy announces "copied" with the field name (R-24).
- [ ] NFR: switching item or marketplace renders within `[NFR TBD — eng lead]`.

*AI states* — Pattern: AI Assisted Outputs (Simple).
- [ ] Drafted content is marked as AI-drafted within the standard screen `[treatment — ux-lead]`.
- [ ] Sources: each field traces to the seller's answers.

**Out of scope (this story):** editing (S-16); marking listed (S-17); saving photos (S-57).
**Dependencies:** S-12, S-14, S-44 (copy row, tabs, segmented control).
**Open questions:** Q-04 (blocking for title limits); Q-15; G-16; G-17.
**Test data needs:** the three prototype sample items, drafted for all five marketplaces.
**Labels / components:** phase-1 · drafting · **Estimate:** —

## [S-16] Edit a drafted field before copying, and restore the AI version

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to edit any drafted field for a given
marketplace and get the AI's original back if I need it, so that I stay in control of what goes live.
**Design:** not in the prototype (§9.1 notes the gap)
**Traces to:** R-9 · §9.3 Reversibility ("AI drafts are versioned and restorable") · governance "Version AI
artifacts" · M-07
**Applicable for:** all plan states with drafted items.
**Impact areas:** draft storage · validator (S-14 doesn't block seller edits)

**Acceptance Criteria**

*Functional Requirements*
1. Given a drafted field, when the seller edits and saves it, then the edit is saved for that marketplace
   only, and Copy copies the edited text.
2. Given an edited field, then the AI's original draft is kept as a version, and the seller can restore it.
3. Given a restore, then the field shows the AI original, and the seller's edit is `[rule TBD — PM: kept as
   a version, or discarded]`.
4. Given the seller deletes a stated flaw from a description, then M-07 shows that the flaw is stated in
   their facts `[H — R-10 governs drafts, not seller edits; confirm whether a seller may remove a flaw by
   hand]`.
- [ ] Validation: title edits show the live count against the limit. Over the limit is `[rule TBD — PM:
  blocked, or warned]`.
- [ ] Edge: field length default 255 characters; descriptions follow each marketplace's limit (§9.3c).
- [ ] Must not: an edit to one marketplace's field never changes another marketplace's field.
- [ ] Must not: the AI original is never overwritten.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.
- [ ] NFR: edits are saved to the server within `[NFR TBD — eng lead]` and survive an app restart.

**Out of scope (this story):** regenerating a draft after editing facts (G-03).
**Dependencies:** S-15.
**Open questions:** restore and over-limit rules; whether sellers may remove flaws by hand.
**Test data needs:** synthetic drafts.
**Labels / components:** phase-1 · drafting · **Estimate:** —

## [S-17] Record where an item is listed and open the marketplace

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to mark an item as listed on a marketplace,
optionally paste its link, and jump to that marketplace's app, so that Listly knows where everything is live.
**Design:** prototype `draft` ("Open [marketplace]" and the listing-link field)
**Traces to:** R-12 · R-30, R-15 (both depend on these records) · R-34 (linked shop as a fallback target)
**Applicable for:** all plan states.
**Impact areas:** Listings (S-25) · ledger (S-26) · checklist (S-28) · days listed (G-13)

**Acceptance Criteria**

*Functional Requirements*
1. Given an item's draft for a marketplace, when the seller marks it listed there, then a listing record is
   saved with the marketplace and the date.
2. Given the seller pastes a listing link, then it's saved on that listing record.
3. Given "Open [marketplace]", when tapped, then the marketplace's app opens where a deep link exists,
   otherwise its website `[deep-link support per marketplace TBD — eng lead]`.
4. Given an item marked listed on several marketplaces, then each is its own listing record under the one
   item (§9.4 data model).
- [ ] Validation: a pasted link that isn't a URL for that marketplace's domain is `[rule TBD — eng lead:
  rejected or warned]`.
- [ ] Edge: marking listed without a link is allowed (R-12 "optionally").
- [ ] Edge: marking the same item listed twice on one marketplace `[rule TBD — PM]`.
- [ ] Must not: Listly never contacts the marketplace to post or check the listing.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.

**Out of scope (this story):** unmarking a listing (G-15); saving photos (S-57).
**Dependencies:** S-15.
**Open questions:** deep-link support; link validation; duplicate rule.
**Test data needs:** synthetic listing URLs on each marketplace's domain pattern; no real listings.
**Labels / components:** phase-1 · listings · **Estimate:** —

## [S-57] Save an item's photos to my phone for posting

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want to save an item's photos to my phone's
photo library in one tap, in order and in their own album, so that I can attach them when I paste the
listing into each marketplace app.
**Design:** not in the prototype (PRD §9.1 says the prototype must add it)
**Traces to:** R-41 · D-3 [H] · R-18 (included in the Clear-out Pass) · §10 (location metadata stripped) ·
R-25, R-38 (original stays first) · R-22 (photos saved; photo-library permission outcome)
**Applicable for:** Reseller plan and Clear-out Pass; trial `[rule TBD — PM]` (entitlement matrix). iOS and
Android.
**Impact areas:** copy screen (S-15) · device photo library · permissions

**Acceptance Criteria**

*Functional Requirements*
1. Given an item's copy screen, when the seller taps Save photos, then the item's photos are saved to the
   phone's photo library in the item's photo order, with the original first.
2. Given the save, then the photos go into an album named after the item `[naming when the item has no
   name, or two items share one: rule TBD — ux-lead]`.
3. Given the first Save photos on the device, then photo-library permission is asked.
4. Given permission is denied, then nothing is saved, and the screen explains how to turn access on, with a
   link to the phone's Settings `[copy — ux-lead]`.
5. Given photos already saved for that item, when the seller taps Save photos again, then those photos
   aren't saved again; only photos not yet saved are added `[H: e.g. a new edited copy from S-50]`.
6. Given the save completes, then the seller is told how many photos were saved and where
   `[copy — ux-lead]`.
- [ ] Data: saved files are Listly's stored copies, so location metadata is already stripped (§10).
- [ ] Edge: limited photo-library access (iOS "selected photos" or the Android equivalent) `[rule TBD — eng
  lead]`.
- [ ] Edge: the phone runs out of storage partway. The seller is told which photos were saved, and Save
  photos can be tried again without duplicating them.
- [ ] Edge: photos the seller deleted from their library after saving. Whether Listly saves them again is
  `[rule TBD — PM]`; Listly can't always detect the deletion.
- [ ] Must not: no photo leaves the device for any third party as part of this action.
- [ ] Must not: an edited copy (S-50, S-51) is never placed before the original.
- [ ] Events: photos saved; photo-library permission outcome (EVT).
- [ ] Rest of the functionality should remain As-Is: the copy screen's fields and Copy actions are unchanged.

*Non-Functional Requirements*
- [ ] NFR: saving 10 photos completes within `[NFR TBD — eng lead]`.
- [ ] A11Y-BASE. Completion and the denied state are announced.

**Out of scope (this story):** posting photos to a marketplace (non-goal); sharing photos by share sheet
`[not in the PRD]`.
**Optional engineering subtasks:** per-item record of which photo versions were saved to this device.
**Dependencies:** S-05 (stored photos), S-15 (copy screen).
**Open questions:** album naming; limited-access behaviour; re-save after deletion.
**Test data needs:** synthetic item with 4 photos, one of them an edited copy.
**Labels / components:** phase-1 · drafting · photos · **Estimate:** —

---

# E-04 Trial, plans and entitlements (Phase 1 · P0)

**Goal:** new sellers get 3 free full-quality listings, then pick a plan at the moment of value, and
purchases are verified on the server.
**Out of scope:** US web checkout (pending Legal, Q-13); the 7-day trial alternative (split-tested in Phase 0,
Q-01).
**Sequencing:** S-20 (entitlement service) first; S-18, S-19, S-21, S-22 build on it.

## [S-18] Track and show my 3 free listings

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a new seller on the free trial, I want to see how many of my 3 free
listings I've used, so that the paywall never surprises me.
**Design:** prototype `facts` and `draft` trial counter
**Traces to:** R-1 · D-1 [H] · R-2 · R-7 (failures don't count) · R-29 (plan status on Home) · R-42
(delete)
**Applicable for:** trial only.
**Impact areas:** drafting (S-12) · paywall (S-19) · Home (S-23) · item detail (S-58)

**Acceptance Criteria**

*Functional Requirements*
1. Given a new account, then the free listings are the first 3 items drafted. Each is counted when its draft
   finishes, once per item whatever the number of marketplaces.
2. Given the trial, then a counter shows the free listings left, as n of 3 left (R-1) `[copy — ux-lead]`.
3. Given a haul with more items than free listings left, then every item can still be photographed, grouped
   and given facts. Items beyond the free listings show as ready to draft, with a lock, until a plan is
   chosen, and nothing entered for them is lost.
4. Given a drafted item is deleted (from item detail, S-58), then the free listing is not refunded.
5. Given a draft fails or is cancelled, then no free listing is used.
- [ ] Data: the count is held on the server against the account, not on the device.
- [ ] Edge: re-drafting an already counted item `[rule TBD — PM, G-03]`.
- [ ] Must not: the trial never asks for a card (R-1, R-33).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. The counter is read as a sentence, not as a fraction. Locked items announce that they're
  locked and why.
- [ ] NFR: the count can't be reset by reinstalling or by clearing app data.

**Out of scope (this story):** the 7-day trial variant (Q-01).
**Dependencies:** S-20.
**Open questions:** G-03. (A-01 and A-02 resolved by D-1.)
**Test data needs:** accounts with 0, 1, 2 and 3 free listings used.
**Labels / components:** phase-1 · monetisation · **Estimate:** —

## [S-19] Choose a plan when my free listings run out

**Format:** User story · **Dimensions:** UI
**Story Summary (Description):** As a new seller who has used the trial, I want both plans side by side with
price, period, limits and renewal terms, and the option to keep copying what I've drafted, so that I can
decide without losing anything.
**Design:** prototype state `paywall`
**Traces to:** R-2 · D-1 · R-3 (plans) · R-18 (Pass limits) · R-32 and D-7 (return to the haul) · R-22
(paywall shown, plan chosen) · §10 (auto-renewal disclosure)
**Applicable for:** trial when used up; Clear-out Pass at expiry or limit (R-18); a Pass seller choosing to
upgrade (S-47, S-33).
**Impact areas:** purchase (S-20) · drafts (S-15)

**Acceptance Criteria**

*Functional Requirements*
1. Given the trial is used up, when the seller tries to draft a 4th item, or taps Finish haul with undrafted
   items, then the paywall shows the Reseller plan (monthly $12.99, yearly $99) and the Clear-out Pass
   ($6.99, 30 days, up to 100 listings), each with price, period, limits and renewal terms.
2. Given the paywall, when the seller chooses Not now, then they return to the haul: drafted listings stay
   copyable, and undrafted items stay saved and locked (D-1).
3. Given a plan is picked, then the store purchase (S-20) starts.
4. Given a successful purchase in the middle of a haul, then the seller returns to that haul, where the
   locked items can now be drafted (R-32, D-7).
- [ ] Edge: a trial seller with exactly 3 items taps Finish haul with nothing undrafted. The paywall doesn't
  interrupt; it shows next time they try to draft `[H — R-2 now triggers only on undrafted items; confirm
  the PM still wants a paywall at that moment]`.
- [ ] Must not: the paywall never hides listings already drafted (R-2).
- [ ] Must not: no plan is pre-selected for purchase without a tap `[H]`.
- [ ] Legal: auto-renewal disclosure text is approved by Legal before launch (§10).
- [ ] Events: paywall shown, plan chosen (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Each plan card reads its name, price, period and limits in one announcement.

**Out of scope (this story):** the purchase itself (S-20).
**Dependencies:** S-20, S-44 (plan card).
**Open questions:** Q-01; exactly-3-items edge above. (A-06 resolved by D-7.)
**Test data needs:** sandbox store accounts.
**Labels / components:** phase-1 · monetisation · **Estimate:** —

## [S-20] Buy, renew and restore plans through the app stores

**Format:** User story · **Dimensions:** UI · Backend · Integration · Data
**Story Summary (Description):** As a seller choosing a plan, I want to pay through the App Store or Google
Play and have my plan recognised on every phone I sign in on, so that I'm never charged twice or locked out.
**Design:** prototype `paywall` and `payFail`; Restore purchases (stub in the prototype)
**Traces to:** R-3 · R-31 (Manage subscription, Restore purchases) · §9.4 (server-side receipt validation;
portable plan model) · §10 (billing) · R-22 (purchase outcome)
**Applicable for:** iOS (App Store) and Android (Google Play).
**Impact areas:** entitlement service used by S-12, S-18, S-21, S-22, S-04 · Profile (S-33)

**Acceptance Criteria**

*Functional Requirements*
1. Given the Reseller plan is bought, then it's an auto-renewing subscription, monthly or yearly.
2. Given the Clear-out Pass is bought, then it's a one-time purchase whose entitlement lasts 30 days from
   purchase.
3. Given a purchase completes, then the receipt is validated on the server and the entitlement is granted
   there. The app reads its entitlement from the server.
4. Given a purchase fails or is cancelled, then the seller is told they weren't charged, with Try again
   `[copy — ux-lead]`.
5. Given a reinstall or a new phone, when the seller taps Restore purchases, then active entitlements are
   restored to their account.
6. Given a renewal, lapse, refund or cancellation notice from the store, then the server updates the
   entitlement `[timing TBD — eng lead]`.
- [ ] Edge: a purchase made while offline or interrupted is reconciled on the next launch.
- [ ] Edge: buying the Reseller plan while a Pass is active, and buying a second Pass while one is active,
  per G-10 `[rule TBD — PM]`.
- [ ] Must not: no entitlement is granted from a client-side receipt check alone.
- [ ] Must not: no payment data is stored by Listly or sent to the AI (§9.3 data boundaries).
- [ ] Events: purchase outcome (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: the plan model holds store and source as attributes, so a web checkout can be added without a
  migration (§9.4).
- [ ] NFR: purchases verified on both stores is a Phase 1 exit gate (§13).
- [ ] A11Y-BASE.

**Out of scope (this story):** US web checkout (Q-13); Pass upgrade suggestion (S-47).
**Optional engineering subtasks:** App Store Server Notifications and Google Real-time Developer
Notifications handlers.
**Dependencies:** store product configuration; "Listly" name clearance for store submission (Q-12).
**Open questions:** G-10; Q-12; Q-13.
**Test data needs:** sandbox purchasers on both stores, including refund and lapse.
**Labels / components:** phase-1 · monetisation · billing · **Estimate:** —

## [S-21] Get the Clear-out Pass experience, and keep everything when it ends

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a closet clearer on the Clear-out Pass, I want only the screens I need
for 30 days and up to 100 listings, and to keep my items if I upgrade, so that selling stays a quick chore,
not a business.
**Design:** prototype states `passHome`, `listings` (Pass variant), Profile (Pass variant)
**Traces to:** R-18 · D-2 · R-15 (checklist on both plans) · R-29 (Pass Home) · R-30 (Active listings on
both plans) · R-32 (no Profit tab) · R-41 · R-42 · Flow 4
**Applicable for:** Clear-out Pass, active and expired.
**Impact areas:** every screen gated by the entitlement matrix

**Acceptance Criteria**

*Functional Requirements*
1. Given an active Pass, then the seller has Home, haul mode, copy, Save photos (S-57), Active listings,
   item detail (S-58), mark sold, the sold-everywhere checklist (S-28), money made and Profile.
2. Given an active Pass, then the profit tracker and the stale filter are hidden, and their data is still
   recorded.
3. Given a Pass seller marks an item sold on one marketplace while it's listed on others, then the
   checklist runs (S-28), the item shows under Needs action on Home, and its other listings show as
   sold-but-still-live in Listings until each is confirmed removed (R-15, R-30, D-2).
4. Given the Pass reaches 30 days or 100 listings, when the seller tries to draft, then the paywall shows
   (S-19).
5. Given a Pass seller upgrades to the Reseller plan, then every item, listing and sale is kept, and the
   hidden screens appear with the data recorded so far.
- [ ] Decision: see the entitlement matrix for expired-Pass access (G-10, `[rule TBD — PM]`).
- [ ] Must not: hiding a screen never deletes or stops recording its data.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: the listing count and days left shown on Home and Profile match the server entitlement exactly.
- [ ] A11Y-BASE.

**Out of scope (this story):** the upgrade suggestion (S-47).
**Dependencies:** S-20.
**Open questions:** G-10; G-11. (Q-08 closed and A-04 resolved by D-2.)
**Test data needs:** Pass accounts at day 1, day 29, day 31, and at 99 and 100 listings.
**Labels / components:** phase-1 · monetisation · **Estimate:** —

## [S-22] Hit a usage or AI cost limit without losing work

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want to be told clearly when I reach my plan's
listing limit or the AI cost cap, with everything saved and when it resets, so that a limit never costs me a
haul.
**Design:** not in the prototype
**Traces to:** R-20 · M-06 · N-06, N-09 · §9.3 cost · terminal state "excluded by entitlement"
**Applicable for:** Reseller plan (fair-use limit, proposed 500 listings a month); all plans (AI cost cap);
Pass (100 listings, via S-21).
**Impact areas:** AI gateway (S-39) · drafting (S-12)

**Acceptance Criteria**

*Functional Requirements*
1. Given a Reseller plan seller at the fair-use limit `[final value TBD — after the AI cost test]`, when they
   start drafting, then M-06 shows what's saved, when the limit resets, and the upgrade option if any.
2. Given a seller at their monthly AI cost cap `[value TBD — eng lead]`, when any AI call is attempted, then
   the gateway refuses it and M-06 shows.
3. Given a limit is reached mid-haul, then items not yet drafted keep their photos and answers, and drafted
   items stay copyable.
- [ ] Edge: the reset date for the fair-use limit `[rule TBD — PM: calendar month, or billing cycle]`.
- [ ] Must not: reaching a limit never loses work (R-20).
- [ ] Must not: the cost cap is enforced in the server-side gateway, never only in the app.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: the cap check adds no more than `[NFR TBD — eng lead]` to each AI call.
- [ ] A11Y-BASE. M-06 is announced as an alert.

*AI states* — Pattern: Escalation (mandatory).
- [ ] Escalation: M-06 says what happened, what's saved and how to recover.

**Out of scope (this story):** the photo edit allowance (S-51).
**Dependencies:** S-20, S-39.
**Open questions:** final limits; reset rule.
**Test data needs:** accounts seeded at the limit and at the cap.
**Labels / components:** phase-1 · monetisation · ai · **Estimate:** —

---

# E-05 Home, Listings, the item ledger and item detail (Phase 1 · P0)

**Goal:** a returning seller opens the app to the one thing that needs doing, and can see every live listing
and every item.
**Out of scope:** the web ledger (R-27, P2).
**Sequencing:** needs S-17 (listing records) and S-27 (sales).

## [S-23] See what needs doing when I open the app

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want Home to show sold items still live
elsewhere, unfinished hauls, this month's numbers, stale items and my plan, in that order, so that I act on
the most urgent thing first.
**Design:** prototype states `home` and `passHome`
**Traces to:** R-29 · R-15 (Needs action) · R-6/S-06 (unfinished hauls) · R-13 (stale) · R-16 (net profit) ·
R-18 (Pass version) · R-22 (Home opened, Needs-action item opened) · Flow 5
**Applicable for:** Reseller plan (full); Clear-out Pass (Needs action included by D-2; no net profit, no
stale; money made instead); trial (`[rule TBD — PM]`, G-09).
**Impact areas:** Listings (S-25) · Profit (S-31) · checklist (S-28)

**Acceptance Criteria**

*Functional Requirements*
1. Given a signed-in seller with items, when the app opens, then Home shows, in order: Needs action, Unfinished
   hauls, This month, Stale, plan status. A Start a haul action is always visible.
2. Given a sold or traded item still marked live on another marketplace, on either plan, then it appears
   under Needs action and opens its checklist (S-28). This includes items flagged after "Remind me in 1 hour"
   when notification permission is denied (S-29).
3. Given unfinished hauls, then each shows with Continue (S-06).
4. Given This month, then a Reseller plan seller sees active listings, items sold and net profit. A Pass
   seller sees active listings, items sold and money made (G-11).
5. Given items listed 30+ days, then Stale shows their count and opens Listings filtered to stale (S-25).
6. Given plan status, then a trial seller sees the trial counter and a Pass seller sees days and listings
   left.
7. Given a section has nothing in it, then it's hidden, not shown empty.
- [ ] Must not: figures on Home differ from Listings or Profit. They're computed by the same query or
  service.
- [ ] Must not: a Pass seller never sees net profit or stale on Home.
- [ ] Events: Home opened; Needs-action item opened (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: Home renders within `[NFR TBD — eng lead]` for an account with 500 active items (Dre's upper
  range).
- [ ] NFR: an automated test compares Home's figures with Listings and Profit for the same account.
- [ ] A11Y-BASE. Needs action is reached first by screen-reader navigation.

**Out of scope (this story):** the new-user Home (S-24); the How-to card (S-38).
**Dependencies:** S-06, S-17, S-27, S-28, S-31.
**Open questions:** Q-09 (section order, prototype test decides); G-11; G-13.
**Test data needs:** synthetic accounts with each section populated and each empty.
**Labels / components:** phase-1 · home · **Estimate:** —

## [S-24] Start from an empty Home as a new seller

**Format:** User story · **Dimensions:** UI
**Story Summary (Description):** As a new seller with no items, I want Home to show one thing, start my first
haul, with the 3-free-listings note and a way to watch how Listly works, so that I know exactly what to do.
**Design:** prototype state `homeNew`
**Traces to:** R-29 (new-user card) · R-37 ("Watch how Listly works" link) · §9.1 empty states
**Applicable for:** any account with no items.
**Impact areas:** How-to (S-38)

**Acceptance Criteria**

*Functional Requirements*
1. Given an account with no items, when Home opens, then it shows one card to start the first haul, with the
   3-free-listings note, and the "Watch how Listly works" link.
2. Given the card, when the seller taps Start a haul, then haul mode (S-05) opens.
3. Given the link, when tapped, then the how-to (S-38) opens.
- [ ] Edge: a seller who discards their only haul returns to this empty state.
- [ ] Must not: no empty sections are shown.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.

**Out of scope (this story):** first-run tips on Home (S-37).
**Dependencies:** S-05, S-38.
**Open questions:** none.
**Test data needs:** fresh account.
**Labels / components:** phase-1 · home · **Estimate:** —

## [S-25] See every live listing, filter it and act on it

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want one row per item per marketplace, filterable
by marketplace and status and sortable by days or price, so that I can see what's live where and act on a row.
**Design:** prototype states `listings` (By listing)
**Traces to:** R-30 · R-12 (Open listing) · R-14 (Mark sold) · R-15 (never shown removed without
confirmation) · R-18 (no stale filter for the Pass) · R-42 (row opens item detail) · D-2, D-4 · R-22
(Listings filtered)
**Applicable for:** both plans. The Clear-out Pass sees active and sold-but-still-live, without the stale
filter (R-18, R-30, D-2).
**Impact areas:** Home Stale link (S-23)

**Acceptance Criteria**

*Functional Requirements*
1. Given listings marked live, then each shows item name, marketplace, price, days listed and bin, one row per
   item per marketplace, with Active as the default filter and a count per marketplace at the top.
2. Given filters, then the seller can filter by marketplace and by status: active, stale (30+ days),
   sold-but-still-live; and sort by days listed or price.
3. Given a row, then it opens item detail (S-58), offers "Open listing" when a link was saved, and offers
   "Mark sold" (S-27).
4. Given no live listings, then the empty state shows with Start a haul `[copy — ux-lead]`.
5. Given a filter with no matches, then a no-match state shows `[copy — ux-lead]`.
- [ ] Edge: an item listed on 5 marketplaces shows 5 rows.
- [ ] Edge: a listing without a saved link shows no "Open listing" action, or opens the linked shop
  (R-34) `[rule TBD — ux-lead]`.
- [ ] Must not: a listing is never shown as removed unless the seller confirmed it (R-15).
- [ ] Must not: a Clear-out Pass seller's sold-but-still-live listings never disappear from Listings before
  they're confirmed removed (D-2).
- [ ] Events: Listings filtered (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: Listings loads and filters within `[NFR TBD — eng lead]` for 500 items × 4 marketplaces.
- [ ] A11Y-BASE. Filter changes announce the result count.

**Out of scope (this story):** the per-item view (S-26).
**Dependencies:** S-17, S-27.
**Open questions:** G-13 (days listed). (A-04 resolved by D-2.)
**Test data needs:** synthetic ledger like the prototype's, scaled to 500 items.
**Labels / components:** phase-1 · listings · **Estimate:** —

## [S-26] See every item in a ledger with its status and bin

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want one row per item showing every marketplace
it's on, days listed, price, status and bin, filterable by status, so that I can find any item and know where
it is on the shelf.
**Design:** prototype state `ledger` (Listings → By item)
**Traces to:** R-13 · R-18 (hidden for the Pass) · R-42 (row opens item detail) · R-6 and D-11 (bin) ·
R-40 (traded status, P1, added by S-49)
**Applicable for:** Reseller plan. Hidden for the Clear-out Pass (R-18); trial `[rule TBD — PM]`.
**Impact areas:** Listings (S-25)

**Acceptance Criteria**

*Functional Requirements*
1. Given items, then each shows its marketplaces, days listed, price, status (listed, sold, traded once
   S-49 ships, stale at 30+ days) and bin (entered on the facts step, S-10).
2. Given the status filter, then the seller can filter to listed, sold, traded or stale.
3. Given a row, then it opens item detail (S-58).
4. Given no items, then the empty state shows with Start a haul `[copy — ux-lead]`.
- [ ] Edge: an item with no bin shows as unbinned `[treatment — ux-lead]`; bin is optional (D-11).
- [ ] Edge: "price" for an item listed at different prices on different marketplaces `[rule TBD — PM]`.
- [ ] Must not: a Pass seller can't reach this view.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: ledger loads within `[NFR TBD — eng lead]` for 500 items.
- [ ] A11Y-BASE.

**Out of scope (this story):** setting the bin (S-10, S-58).
**Dependencies:** S-17, S-27, S-58.
**Open questions:** G-13; per-item price rule. (G-05 resolved by D-5 and D-11.)
**Test data needs:** synthetic ledger.
**Labels / components:** phase-1 · listings · **Estimate:** —

## [S-58] Look after one item from its detail screen

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want one screen per item with its photos,
facts, bin, cost, listings and history, where I can edit, copy, mark sold or traded, change its status back,
or delete it, so that I can fix anything about an item in one place.
**Design:** not in the prototype (PRD §9.1 Flow 9; the prototype must add it)
**Traces to:** R-42 · D-4 [H] · R-9 (edits versioned) · R-13, R-30 (rows open it) · R-29 and R-16 (rows open
it) · R-1 (delete doesn't refund) · R-14, R-40 (actions) · R-22 (item deleted) · D-10 (revert rules, built
in S-59)
**Applicable for:** Reseller plan and Clear-out Pass (R-18); trial `[rule TBD — PM]`. The Pass sees no
profit figures here `[H — R-18 hides the profit tracker; confirm whether cost is shown]`.
**Impact areas:** Listings (S-25) · ledger (S-26) · Home (S-23) · Profit (S-31) · drafts (S-15, S-16) ·
cost (S-30) · undo and revert (S-59) · trial counter (S-18)

**Acceptance Criteria**

*Functional Requirements*
1. Given a row in Listings, the ledger, Home or Profit, when tapped, then that item's detail screen opens.
2. Given item detail, then it shows photos (original first), facts, condition and flaws, bin and cost; where
   the item is listed, with links; and its status history.
3. Given photos, facts, bin, cost or shipping, when the seller edits one and saves, then the change is saved
   as a new version, and earlier versions are kept (R-9).
4. Given the actions, then the seller can copy listings (opens S-15 for this item), mark sold (S-27), mark
   traded (S-49, once shipped), change status back to listed (S-59) and delete.
5. Given Delete, then a confirmation says it can't be undone `[copy — ux-lead]`. On confirm, the item and its
   listings, sales and photos are deleted, and a trial listing it used isn't refunded (R-1).
6. Given a sold item with shipping not entered (D-9) or no cost, then the seller can add it here, and the
   estimate flag on Profit clears for that sale (S-31).
- [ ] Edge: an item with no listings yet shows the empty listings state, with copy listings as the action
  `[copy — ux-lead]`.
- [ ] Edge: editing facts after drafting doesn't regenerate drafts on its own. Whether a re-draft is offered,
  and whether it uses a listing, is still open (G-03).
- [ ] Edge: deleting an item whose photos were saved to the phone (S-57) leaves those device copies alone;
  Listly can't delete them `[H — confirm with ux-lead that the confirmation says so]`.
- [ ] Edge: deleting a sold item removes it from Profit, and the totals recalculate (R-16).
- [ ] Must not: the bin is never sent to the AI, even when facts are edited here (D-11).
- [ ] Must not: no edit here changes a listing on any marketplace.
- [ ] Events: item deleted (EVT).
- [ ] Rest of the functionality should remain As-Is: the haul flow, Listings and the ledger are unchanged
  apart from rows now opening this screen.

*Non-Functional Requirements*
- [ ] NFR: item detail opens within `[NFR TBD — eng lead]` for an item with 10 photos and 5 listings.
- [ ] NFR: every status change and edit in the history records actor, timestamp, and before and after values.
- [ ] A11Y-BASE. The history is readable in order by screen readers.

**Out of scope (this story):** the Undo and change-back rules themselves (S-59); fixing photos (S-50);
unmarking a single listing (G-15).
**Optional engineering subtasks:** status-history table; per-field version records shared with S-16.
**Dependencies:** S-17, S-27, S-16.
**Open questions:** G-03; whether the Pass sees cost; device-copy wording on delete.
**Test data needs:** synthetic items in each status: listed, sold, sold with no shipping, traded.
**Labels / components:** phase-1 · listings · **Estimate:** —

---

# E-06 Mark sold, the sold-everywhere checklist and Undo (Phase 1 · P0)

**Goal:** when something sells, the seller sees every other marketplace where it's still live, with a link,
until they confirm each is removed. This is the double-sale protection Dre pays for.
**Out of scope:** automatic delisting (non-goal); automatic sale detection (E-13).
**Sequencing:** S-27 → S-28 → S-29.

## [S-27] Mark an item sold

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to record which marketplace an item sold on,
for how much, and who paid shipping, so that its status, date and profit are right.
**Design:** prototype state `sold` (the shipping choice and Undo aren't in the prototype yet)
**Traces to:** R-14 · D-5, D-9 (shipping) · D-6 (Undo, built in S-59) · D-11 (bin shown) · R-31 (shipping
default) · R-16 · R-22 (sale recorded; shipping entered or skipped) · §9.4 (sale links to one or more items)
**Applicable for:** Reseller plan and Clear-out Pass; trial `[rule TBD — PM]`.
**Impact areas:** checklist (S-28) · Profit (S-31) · Home (S-23) · Listings (S-25) · item detail (S-58)

**Acceptance Criteria**

*Functional Requirements*
1. Given an item, when the seller chooses Mark sold, picks the marketplace and enters the sale price, then the
   item's status changes to sold, with the date.
2. Given Mark sold, then shipping is a choice of three: buyer paid; I paid, with an amount; or free shipping
   (I paid), which also asks for the amount. The choice is preselected from Selling defaults (R-31), and the
   seller can change it (R-14, D-9) `[labels — ux-lead]`.
3. Given the seller skips shipping, then the sale is recorded, and its profit is an estimate flagged as
   shipping not entered (S-31), until shipping is added from item detail (S-58).
4. Given Mark sold, then the item's bin shows on the screen (R-14, D-11).
5. Given the item is listed on other marketplaces, then the seller goes to the checklist (S-28), on either
   plan (D-2).
6. Given the item is listed on only that marketplace, then the seller sees the confirmation with the bin and
   net profit (Reseller) or money made (Pass) `[copy — ux-lead]`.
7. Given Mark sold completes, then Undo is available for 10 seconds (S-59).
- [ ] Validation: sale price is required, numeric and greater than or equal to 0 `[H — confirm whether $0 is
  allowed]`. A shipping amount, when asked for, is numeric and greater than or equal to 0. Currency is USD
  in MVP `[H — PRD names US only]`.
- [ ] Decision table (shipping, D-9):

| Choice | Amount asked? | Shipping used in profit | Profit labelled an estimate for shipping? |
|---|---|---|---|
| Buyer paid | No | $0 | No |
| I paid | Yes | The amount entered | No |
| Free shipping (I paid) | Yes | The amount entered | No |
| Skipped | No | None | Yes, flagged as shipping not entered |

- [ ] Edge: the sale marketplace isn't one the item was marked listed on `[rule TBD — PM: allowed?]`.
- [ ] Edge: "I paid" or "free shipping" chosen and the amount left empty. Treated as skipped `[H — confirm
  with PM]`.
- [ ] Must not: shipping is never counted as $0 unless the buyer paid (R-14, D-9).
- [ ] Must not: no listing record is changed to removed by marking sold.
- [ ] Events: sale recorded; shipping entered or skipped (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.

**Out of scope (this story):** bundles (S-48); trades (S-49); Undo and changing status back (S-59).
**Dependencies:** S-17, S-33 (shipping default).
**Open questions:** sale-marketplace rule; empty amount rule. (G-04 resolved by D-5 and D-9; G-14 by D-6 and
D-10.)
**Test data needs:** synthetic items listed on 1 and on 3 marketplaces.
**Labels / components:** phase-1 · sales · **Estimate:** —

## [S-28] Remove a sold item from every other marketplace

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want a blocking banner naming every other
marketplace where a sold item is still listed, with a link to each, until I tick "I removed it", so that I
never sell the same item twice.
**Design:** prototype state `soldCheck`
**Traces to:** R-15 · D-2 (both plans) · D-6 (Undo on "I removed it", built in S-59) · D-7 (no-link
fallback; notification permission, S-29) · R-29 (Needs action) · R-30 (sold-but-still-live) · R-40 (also
for trades, S-49) · R-22 (checklist confirmed)
**Applicable for:** Reseller plan and Clear-out Pass (R-15 P0 on both plans, D-2). Trial `[rule TBD — PM]`.
**Impact areas:** Home Needs action · Listings · notifications (S-29)

**Acceptance Criteria**

*Functional Requirements*
1. Given an item sold on one marketplace and listed on others, then a blocking banner names each other
   marketplace, each showing "Still live" with a link to that listing.
2. Given a marketplace in the checklist, when the seller ticks "I removed it", then that listing is recorded
   as removed by the seller, with the date.
3. Given every marketplace is ticked, then the checklist completes and the item leaves Needs action.
4. Given the seller taps "Remind me in 1 hour", then the item stays flagged under Needs action and a reminder
   is scheduled (S-29).
5. Given a marketplace whose listing has no saved link, then the row offers to open that marketplace (its
   app, or its website where no app link exists) and prompts the seller to search for the item there
   (R-15, D-7) `[copy — ux-lead]`.
6. Given the seller ticks "I removed it", then Undo is available for 10 seconds (S-59).
- [ ] Decision: "blocking" means the seller can't leave the post-sale flow without either ticking every
  marketplace or choosing "Remind me in 1 hour" `[H — from the prototype, where Done is disabled until all
  are ticked; confirm with ux-lead]`.
- [ ] Edge: an item that sells on a second marketplace before the first checklist is complete
  `[rule TBD — PM]`.
- [ ] Must not: Listly never shows a listing as removed until the seller confirms it (R-15).
- [ ] Must not: Listly never contacts any marketplace to remove a listing.
- [ ] Events: checklist confirmed (EVT), per marketplace and on completion.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. The banner is announced as an alert; each tick announces the remaining count.
- [ ] NFR: the checklist shows within `[NFR TBD — eng lead]` of Mark sold.

**Out of scope (this story):** auto-delisting (non-goal).
**Dependencies:** S-27, S-17.
**Open questions:** second-sale rule; whether the search prompt also uses the seller's linked shop (R-34)
`[ux-lead]`. (Q-08 closed by D-2; A-07 resolved by D-7.)
**Test data needs:** synthetic item sold on Mercari, live on Poshmark and eBay (as in the prototype).
**Labels / components:** phase-1 · sales · **Estimate:** —

## [S-29] Get reminded about a sold item still live elsewhere

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want a reminder an hour after I choose "Remind me
in 1 hour", so that I don't forget to remove a sold item while a second buyer could still pay for it.
**Design:** not in the prototype (§9.1 notes the gap); Profile → Notifications switch
**Traces to:** R-15 ("sends a reminder"; permission on first use) · D-7 · R-31 (Notifications: sold-item
reminders) · R-22 (notification permission outcome)
**Applicable for:** Reseller plan and Clear-out Pass (D-2).
**Impact areas:** push notifications · Profile (S-33)

**Acceptance Criteria**

*Functional Requirements*
1. Given "Remind me in 1 hour" was chosen and sold-item reminders are on, when 1 hour passes and the checklist
   is still incomplete, then a push notification is sent `[copy — ux-lead]`.
2. Given the seller opens the notification, then that item's checklist (S-28) opens.
3. Given the checklist is completed before the hour, then no reminder is sent.
4. Given sold-item reminders are off in Profile, then no reminder is sent, and the item stays under Needs
   action.
5. Given the first "Remind me in 1 hour" on the device, then notification permission is asked before the
   reminder is scheduled (R-15, D-7).
6. Given notification permission is denied, then no reminder is sent, the item stays flagged under Needs
   action on Home, and the seller is told reminders can't be sent `[copy — ux-lead]`.
- [ ] Events: notification permission outcome (EVT).
- [ ] Edge: repeat reminders after the first `[rule TBD — PM]`.
- [ ] Must not: the notification text never includes sale price or profit `[H — lock-screen privacy]`.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: reminder sent within `[NFR TBD — eng lead]` of the 1-hour mark.

**Out of scope (this story):** reminders for unfinished hauls.
**Dependencies:** S-28; push service.
**Open questions:** repeat rule; whether permission is asked again later if denied `[ux-lead]`. (G-06
resolved by D-7.)
**Test data needs:** test devices with notifications allowed, denied and never asked.
**Labels / components:** phase-1 · sales · notifications · **Estimate:** —

## [S-59] Undo a sale, trade or removal, or change an item back to listed

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want a short Undo after marking something sold,
traded or removed, and a way to change an item back to listed later, so that a mis-tap or a cancelled sale
doesn't leave my inventory or profit wrong.
**Design:** not in the prototype (PRD §9.1 says the prototype must add Undo)
**Traces to:** D-6, D-10 [H] · R-14, R-15, R-40 (10-second Undo) · R-42 (change status back to listed;
revert rules) · R-16 (profit recalculates) · R-17 (manual change marked in CSV) · R-35 (eBay-recorded
sales) · M-12, M-13 · R-22 (Undo used; status changed back to listed)
**Applicable for:** Reseller plan and Clear-out Pass; trial `[rule TBD — PM]`. Trades once S-49 ships;
eBay-recorded sales once S-55 ships.
**Impact areas:** Mark sold (S-27) · checklist (S-28) · item detail (S-58) · Profit (S-31) · Home Needs
action (S-23) · Listings (S-25) · CSV (S-46)

**Acceptance Criteria**

*Functional Requirements*
1. Given Mark sold, Mark traded or "I removed it" completes, then Undo is available for 10 seconds.
2. Given Undo is used within the 10 seconds, then everything that action did is reverted, including any "I
   removed it" ticks recorded since (D-10). The item returns to its previous status, and profit recalculates.
3. Given the 10 seconds have passed, when the seller uses change status back to listed on a sold or traded
   item in item detail (S-58), then the item is listed again, the change is logged in the item's history as
   a manual change, the sale or trade drops out of profit, and the totals recalculate (R-16, R-42).
4. Given a change back to listed, then the "I removed it" ticks are kept, because those removals happened.
   For each marketplace the seller removed it from, M-13 asks whether to relist there, with the saved
   listing link, or the copy where no link was saved (R-42, D-10).
5. Given a sale that eBay recorded (S-55), when the seller changes it back to listed, then M-12 first asks the
   seller to confirm the sale was cancelled or returned. On confirm, the change is logged as a manual change
   and is marked as one in the CSV (S-46). On cancel, nothing changes.
6. Given a traded item where the seller added what they received to inventory (S-49), when the trade is
   undone or reverted, then whether the received item is also removed is `[rule TBD — PM]`.
- [ ] Edge: the app is closed or backgrounded during the 10 seconds. Undo is no longer offered; the change
  back from item detail remains `[H — confirm with ux-lead]`.
- [ ] Edge: an item reverted to listed with no remaining live listings (every one was removed). M-13 offers
  relisting; the item shows as listed with no live listings until relisted `[treatment — ux-lead]`.
- [ ] Must not: reverting never marks any listing as live again on its own. Relisting only happens if the
  seller relists and marks it listed (S-17).
- [ ] Must not: nothing is ever changed on a marketplace, including eBay.
- [ ] Must not: a reverted sale never leaves a stale figure on Home or Profit (S-23 and S-31 must agree).
- [ ] Events: Undo used; status changed back to listed (EVT).
- [ ] Rest of the functionality should remain As-Is: Mark sold, Mark traded and the checklist behave as
  today apart from Undo.

*Non-Functional Requirements*
- [ ] NFR: every revert is recorded in the item's history with actor, timestamp, previous status and whether
  it was an Undo or a manual change.
- [ ] NFR: profit totals reflect a revert within `[NFR TBD — eng lead]`.
- [ ] A11Y-BASE. Undo is reachable by screen readers within its 10 seconds, or its time limit can be
  extended `[H — 10 s may fail WCAG 2.2.1 Timing Adjustable; ux-lead to decide]`.

**Out of scope (this story):** bundle sales (S-48), whose revert rule is open; relisting itself (S-17).
**Optional engineering subtasks:** soft-revertible sale records; history entries shared with S-58.
**Dependencies:** S-27, S-28, S-58; S-55 for criterion 5; S-49 for trades.
**Open questions:** trade-received item on revert; bundle reverts; the 10-second accessibility check.
**Test data needs:** synthetic item sold on Mercari and removed from Poshmark and eBay; a synthetic
eBay-sandbox-recorded sale.
**Labels / components:** phase-1 · sales · **Estimate:** —

---

# E-07 Profit tracker (Phase 1 · P0)

**Goal:** a reseller sees net profit per item, month and marketplace, after each marketplace's fees.
**Out of scope:** CSV export (S-46, P1); tax advice of any kind.
**Sequencing:** S-32 → S-31. S-30 in parallel.

## [S-30] Enter what I paid for an item

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to enter what I paid for each item, from
the item or from the missing-costs prompt, so that my profit is real.
**Design:** not in the prototype (§9.1 notes the gap); the "Add costs" action on `profit`; item detail
(S-58)
**Traces to:** R-16 (cost per item; add-costs action) · R-42 (cost editable on item detail) · R-22 (cost
entered)
**Applicable for:** Reseller plan. Pass: cost data isn't shown (R-18); whether it can be entered is
`[rule TBD — PM]`.
**Impact areas:** Profit (S-31) · Home (S-23) · CSV (S-46)

**Acceptance Criteria**

*Functional Requirements*
1. Given an item's detail screen (S-58), when the seller enters what they paid, then the cost is saved on
   the item as a new version (R-9) and Profit updates.
2. Given the "Add costs" action on Profit, when tapped, then the seller can enter costs for each sold item with
   no cost, one after another `[H — layout to ux-lead]`.
3. Given a cost is changed, then every profit figure that uses it updates.
- [ ] Validation: cost is numeric and greater than or equal to 0. $0 is a valid cost and is distinct from
  "no cost" `[H — confirm with PM]`.
- [ ] Edge: entering cost before an item is sold is allowed.
- [ ] Must not: cost never reaches the AI (§9.3 data boundaries).
- [ ] Events: cost entered (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Currency fields read as currency.

**Out of scope (this story):** cost for traded-in items (set automatically by S-49).
**Dependencies:** S-58 (item detail).
**Open questions:** Pass rule. (G-02 resolved by D-4.)
**Test data needs:** synthetic sold items with and without costs.
**Labels / components:** phase-1 · profit · **Estimate:** —

## [S-31] See net profit per item, month and marketplace

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want net profit after each marketplace's fees,
shipping and my cost, by item, month and marketplace, with missing costs flagged, so that I know if this is
worth my evenings.
**Design:** prototype states `profit`, `soldDone`
**Traces to:** R-16 · R-14 and D-9 (shipping) · D-6, D-10 (reverts) · R-42 (rows open item detail) · R-29
(This month) · R-32 (Profit tab) · §9.1 partial-data state · Flow 3
**Applicable for:** Reseller plan only.
**Impact areas:** Home (S-23) · sold confirmation (S-27) · item detail (S-58) · Undo (S-59)

**Acceptance Criteria**

*Functional Requirements*
1. Given sold items, then net profit = sale − marketplace fee − shipping paid by the seller (from Mark sold,
   S-27) − cost, shown per item, per month and per marketplace. A sale where the buyer paid shipping uses $0.
2. Given the fee for a sale, then it's computed from the fee table (S-32) in effect on the sale date, and
   shown as an estimate.
3. Given sold items with no cost, then they're counted and flagged, with an action to add costs (S-30). Their
   profit is labeled as an estimate (R-16) `[copy — ux-lead]`. How the missing cost enters the estimate is
   `[rule TBD — PM: 0, as in the prototype, or excluded]`.
4. Given sales with shipping not entered (D-9), then they're counted and flagged the same way, with an
   action to add shipping from item detail (S-58). Their profit is labeled as an estimate, and shipping is
   never silently counted as $0. Once shipping is added, that sale's flag clears.
5. Given a sale that's undone or changed back to listed (S-59), then it drops out of profit, and every total
   recalculates (R-16).
6. Given a row for an item, then it opens item detail (S-58).
7. Given no sales yet, then the empty state shows `[copy — ux-lead]`.
8. Given a month with no sales, then that month shows zero, not empty `[H]`.
- [ ] Edge: a sale with both no cost and shipping not entered is counted in both flags, and its profit is
  one estimate.
- [ ] Edge: a fee table entry missing for a marketplace or date. Profit shows the sale as fee unknown
  `[treatment — ux-lead]` and never invents a rate.
- [ ] Must not: profit figures differ from Home's for the same period.
- [ ] Must not: no profit or sale data reaches the AI.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: Profit loads within `[NFR TBD — eng lead]` for 12 months of sales at 50 sales a week.
- [ ] NFR: rounding to the cent, half-up `[H — confirm with eng lead]`, applied once at display.
- [ ] A11Y-BASE.

**Out of scope (this story):** CSV (S-46); trades (S-49); bundles (S-48).
**Dependencies:** S-32, S-27.
**Open questions:** Q-04 (verified fee rates, blocking); how a missing cost or missing shipping enters the
estimate; Q-14 (Profit tab). (G-04 resolved by D-5 and D-9.)
**Test data needs:** synthetic sales across 3 months and 4 marketplaces; no real payouts.
**Labels / components:** phase-1 · profit · **Estimate:** —

## [S-32] Keep marketplace fee rates current on the server

**Format:** Technical enabler · **Dimensions:** Backend · Data
**Story Summary (Description):** A server-maintained fee table with effective dates, so that a part-time
reseller's profit uses the fee each marketplace charged on the day of the sale, and stale rates can be fixed
without an app release.
**Design:** none
**Traces to:** R-16 (server-maintained table with an effective date; shown as estimates) · §14 risk "fee
rates go stale"
**Applicable for:** all five marketplaces.
**Impact areas:** Profit (S-31) · CSV (S-46)

**Acceptance Criteria**

*Functional Requirements*
1. Given the fee table, then each marketplace has one or more entries, each with a percentage, a fixed amount
   and an effective date `[structure H — real fee rules may depend on category, price band or payment
   method; eng lead to confirm against verified rates]`.
2. Given a sale date, then the entry in effect on that date is used.
3. Given a new rate is added with a future effective date, then sales before that date keep the old rate.
- [ ] Data contract:

| Field | Required | Type | Sample value | Default when empty | Description |
|---|---|---|---|---|---|
| marketplace | Yes | enum | mercari | none, rejected | One of the five marketplaces |
| percent_fee | Yes | decimal | 0.10 | none, rejected | Fraction of sale price `[H placeholder]` |
| fixed_fee | Yes | decimal (USD) | 0.00 | 0.00 | Per-sale fixed amount |
| effective_from | Yes | date | 2026-12-01 | none, rejected | First date the rate applies |
| source_note | No | text | "verified against published rates" | empty | Who verified and where |

- [ ] Data: forward migration creates the table; seed values come only from verified rates (Q-04); rollback
  drops the table and Profit shows fee unknown.
- [ ] Must not: the placeholder rates in the prototype (Poshmark 20%, eBay 13.25%, Mercari 10%) are never
  shipped as seed data.
- [ ] Must not: the table isn't writable from the app.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: a rate change takes effect in the app within `[NFR TBD — eng lead]` without a release.
- [ ] NFR: every change is audited with who and when.

**Out of scope (this story):** an admin UI for the table `[H — not in the PRD]`.
**Dependencies:** Q-04: the fee table owner (blocking).
**Open questions:** Q-04.
**Test data needs:** synthetic rates with two effective dates.
**Labels / components:** phase-1 · profit · data · **Estimate:** —

---

# E-08 Profile, marketplaces, privacy and data (Phase 1 · P0)

**Goal:** a seller can see and change their account, plan, marketplaces, defaults, notifications and data,
and can export or delete everything.
**Out of scope:** eBay connection (S-54, P1).

## [S-33] Manage my account, plan and settings in Profile

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want one place to see and change my account,
plan, marketplaces, selling defaults, notifications, privacy and help, so that I can manage Listly without
hunting.
**Design:** prototype state `profile`
**Traces to:** R-31 · R-3 (Manage subscription, Restore purchases) · R-34 (Marketplaces summary) · R-36
(Show tips again) · R-37 (Help) · R-23 (Privacy and data) · Flow 6
**Applicable for:** all plan states. Plan section differs by plan.
**Impact areas:** S-20 · S-34 · S-35 · S-36 · S-37 · S-38 · S-29

**Acceptance Criteria**

*Functional Requirements*
1. Given Profile, then it shows Account (email, sign-in method, sign out), Plan, Marketplaces, Selling
   defaults, Notifications, Privacy and data, Help, and the app version.
2. Given Plan, then it shows the current plan, renewal or expiry date, listings used this month or this pass,
   "Manage subscription" (opens the store's subscription page), "Restore purchases" (S-20), and "Upgrade"
   where available.
3. Given Marketplaces, then it summarises which marketplaces Listly drafts for and which are linked or
   connected, and opens Marketplaces and connections (S-34).
4. Given Selling defaults, then the seller can set who usually pays shipping, which preselects the shipping
   choice on Mark sold (S-27), and a default bin, which prefills the bin on the facts step (S-10) (R-31,
   D-5).
5. Given Notifications, then the seller can turn sold-item reminders on or off (S-29).
6. Given Help, then it opens the how-to (S-38), "Show tips again" (S-37), and contact and feedback
   `[channel TBD — owner]`.
- [ ] Edge: a trial seller's Plan section shows the trial counter and Upgrade `[H]`.
- [ ] Must not: no plan change happens from Profile without the store's own flow.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Settings groups have headings for screen-reader navigation.

**Out of scope (this story):** export and delete (S-35, S-36).
**Dependencies:** S-20, S-34.
**Open questions:** contact channel. (A-08 resolved by D-5.)
**Test data needs:** accounts in each plan state.
**Labels / components:** phase-1 · profile · **Estimate:** —

## [S-34] Choose drafting marketplaces and link my shops

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to switch drafting on or off per
marketplace and save my shop username or link for each, so that drafts and links match where I sell, and I
know Listly can't post for me.
**Design:** prototype state `connectors`
**Traces to:** R-34 · R-33 (drafting set) · R-12, R-30 (open listings) · R-26 (matching forwarded emails,
P1) · R-22 (shop linked or unlinked) · §14 risk "sellers expect connect to mean Listly posts" · Flow 7
**Applicable for:** all plan states.
**Impact areas:** drafting set (S-12, S-15) · eBay row (S-54, P1)

**Acceptance Criteria**

*Functional Requirements*
1. Given Marketplaces and connections, then all five marketplaces are listed. Each has a "Draft listings for
   [marketplace]" switch, a status, and the action for that status.
2. Given Poshmark, Mercari, Depop or Facebook Marketplace, when the seller uses "Link your shop" and saves a
   username or shop link, then the status shows Linked; "Unlink" removes it and shows Not linked.
3. Given eBay in Phase 1 (before S-54), then its row shows the drafting switch and Not connected, with the
   connect action hidden or marked as coming `[rule TBD — PM]`.
4. Given the screen, then it states that these marketplaces don't let apps post or remove listings, and that
   Listly never asks for marketplace passwords `[copy — ux-lead]`.
5. Given a drafting switch is turned off, then new drafts skip that marketplace; existing drafts are kept.
- [ ] Validation: at least one marketplace must stay switched on `[H]`.
- [ ] Validation: a shop link that isn't for that marketplace's domain `[rule TBD — eng lead]`.
- [ ] Must not: no field ever asks for or stores a marketplace password.
- [ ] Must not: "Linked" never implies Listly can read, post or remove listings.
- [ ] Events: shop linked or unlinked (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Each switch announces its marketplace and state.

**Out of scope (this story):** eBay OAuth (S-54).
**Dependencies:** S-01.
**Open questions:** Q-06 (is linking worth it before R-26 ships; "before stories", still open).
**Test data needs:** synthetic usernames such as "yourshop".
**Labels / components:** phase-1 · profile · marketplaces · **Estimate:** —

## [S-35] Export all my data

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a seller, I want to export everything Listly holds about me, so that I
can keep my records or leave with them.
**Design:** prototype Profile → "Export all my data" (stub)
**Traces to:** R-23 · R-31 (Privacy and data) · §10 (retention and deletion)
**Applicable for:** all plan states.
**Impact areas:** storage · AI logs (S-40)

**Acceptance Criteria**

*Functional Requirements*
1. Given Privacy and data, when the seller requests an export, then an export is prepared with their account
   details, items, facts, drafts and versions, listings, sales, costs, settings and photos
   `[format TBD — eng lead]`.
2. Given the export is ready, then the seller is told how to get it `[delivery and copy TBD — ux-lead]`.
3. Given an export fails, then the seller is told and can try again.
- [ ] Edge: an account with 500 items and their photos `[size and time TBD — eng lead]`.
- [ ] Must not: an export never includes another account's data.
- [ ] Must not: the export link, if any, is not guessable and expires `[NFR TBD — eng lead]`.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: export completes within `[NFR TBD — eng lead]`.

**Out of scope (this story):** the tax CSV (S-46, P1).
**Dependencies:** Legal on what AI logs must be included (Q-07).
**Open questions:** Q-07 (blocking for R-23); format.
**Test data needs:** synthetic large account.
**Labels / components:** phase-1 · privacy · **Estimate:** —

## [S-36] Delete my account and all my data

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a seller, I want to delete my account and everything in it, knowing it
can't be undone and that my subscription is cancelled in the store, so that I'm in control of my data.
**Design:** prototype state `deleteConfirm`
**Traces to:** R-23 · R-31 (confirmation, can't be undone, cancel in store) · R-22 (account deleted)
**Applicable for:** all plan states.
**Impact areas:** every table and bucket · AI logs · eBay tokens (S-54)

**Acceptance Criteria**

*Functional Requirements*
1. Given Delete account, then a confirmation states that it can't be undone, and that an active subscription
   must be cancelled in the store `[copy — ux-lead]`.
2. Given the seller confirms, then the account, items, photos, audio, drafts, listings, sales, costs and
   settings are deleted, and the seller sees Welcome.
3. Given the seller cancels, then nothing is deleted and Profile shows.
4. Given an active Clear-out Pass, then the confirmation says the pass ends `[H — from the prototype]`.
- [ ] Data: AI logs are deleted or anonymised per Legal's retention decision `[TBD — Legal, blocking]`.
- [ ] Data: stored eBay tokens (if S-54 shipped) are revoked and deleted.
- [ ] Edge: deletion fails partway. The seller is told, and deletion is retried until complete; no partial
  account is left usable `[rule TBD — eng lead]`.
- [ ] Must not: no soft-deleted data remains readable after the retention window `[TBD — Legal]`.
- [ ] Events: account deleted (EVT), with no personal data in the event.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: deletion completes within `[NFR TBD — Legal and eng lead]`.

**Out of scope (this story):** cancelling store subscriptions on the seller's behalf (not possible).
**Dependencies:** Q-07.
**Open questions:** Q-07 (blocking).
**Test data needs:** synthetic account with every data type.
**Labels / components:** phase-1 · privacy · **Estimate:** —

---

# E-09 Help: first-run tips and the how-to (Phase 1 · P0)

**Goal:** a new seller learns the key controls in place, and can always find a short video and written steps.
Both are launch requirements for activation (KR3), by product decision on 2026-11-13.

## [S-37] See first-run tips on Home, Copy listings and Listings

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a new seller, I want short tips pointing at key controls on my first
visit to Home, Copy listings and Listings, that I can step through or skip, so that I learn the app without
a tutorial.
**Design:** prototype tip overlays (`showTip`)
**Traces to:** R-36 · R-31 (Show tips again) · R-22 (tip shown, advanced, skipped)
**Applicable for:** all plan states, first visit per account.
**Impact areas:** Home, drafts, Listings screens · account settings

**Acceptance Criteria**

*Functional Requirements*
1. Given the first visit to Home, Copy listings or Listings, then a tip appears next to one control at a time,
   with "Tip n of N", "Next" ("Got it" on the last) and "Skip tips".
2. Given a screen, then it has at most 3 tips. Which controls get tips is `[H — ux-lead]`.
3. Given a set has been seen, then it doesn't show again for that account, including on a new phone.
4. Given "Skip tips", then all remaining tips on every screen are turned off.
5. Given Profile → Help → "Show tips again", then all sets reset.
- [ ] Edge: a tip's control isn't on screen (for example an empty Listings) `[rule TBD — ux-lead]`.
- [ ] Must not: tips never cover the control they point at, never block the screen, and never show during
  onboarding or on the paywall.
- [ ] Events: tip shown, advanced, skipped (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Tips are announced to screen readers, close with Escape or a tap outside, and respect
  reduced motion.

**Out of scope (this story):** tips on other screens.
**Dependencies:** S-44 (coach-mark tip).
**Open questions:** which controls get tips [H].
**Test data needs:** fresh account; account with tips seen.
**Labels / components:** phase-1 · help · **Estimate:** —

## [S-38] Watch the how-to video or read the steps

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a new seller, I want a short captioned video and the same content as
written steps, from Home and from Profile, so that I can learn the whole loop in the way I prefer.
**Design:** prototype state `howTo`; How-to card on `home`
**Traces to:** R-37 · R-29/S-24 ("Watch how Listly works") · R-22 (how-to card dismissed, video played with %
watched, written steps opened)
**Applicable for:** all plan states.
**Impact areas:** Home · Profile → Help

**Acceptance Criteria**

*Functional Requirements*
1. Given Help, then it offers a how-to video of about 2 minutes [H], with captions on by default and a full
   transcript, and written steps in five sections: photograph a haul, answer by voice, copy to your
   marketplaces, when something sells, see what you made.
2. Given a new seller, then a How-to card on Home shows "Watch the video" and "Read the steps" until they
   dismiss it. Dismissing says where to find the how-to again `[copy — ux-lead]`.
3. Given Profile → Help, then the how-to is always reachable.
4. Given the video, then it plays in the app, can be paused and closed, and doesn't autoplay.
5. Given no connection, then the written steps open; the video shows that it needs a connection
   `[copy — ux-lead]`.
- [ ] Must not: the video never autoplays.
- [ ] Events: card dismissed, video played with % watched, written steps opened (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Video controls are labeled; the transcript is readable by screen readers.
- [ ] NFR: written steps are bundled with the app or cached so they work offline.

**Out of scope (this story):** producing the video.
**Dependencies:** **blocked by Q-05 (who makes the video, and who updates it), Founder, needed by Phase 1.**
The steps must be updated when flows change (R-37).
**Open questions:** Q-05 (blocking).
**Test data needs:** placeholder video with captions.
**Labels / components:** phase-1 · help · **Estimate:** —

---

# E-10 Platform: AI gateway, logging, instrumentation, evals, accessibility, design system (Phase 1 · P0)

**Goal:** the shared foundations the user-facing stories rely on, built once.

## [S-39] Route every AI call through a server-side gateway with data boundaries

**Format:** Technical enabler · **Dimensions:** Backend · Integration
**Story Summary (Description):** A server-side AI gateway, with no keys in the app, enforces the per-user cost
cap and §9.3's data boundaries, so that sellers' photos and answers reach the AI provider only as intended
and costs stay within the plan.
**Design:** none
**Traces to:** R-20 (cost cap in the gateway) · §9.3 data boundaries · §9.4 platform · R-23 (location
stripped) · P-01 to P-04 (P-05 uses a second provider, S-51)
**Applicable for:** all AI calls.
**Impact areas:** S-07, S-09, S-10, S-12, S-45

**Acceptance Criteria**

*Functional Requirements*
1. Given any AI call, then it goes through the gateway; the app holds no provider keys.
2. Given a call, then only photos (location metadata stripped), the seller's spoken or typed answers, and
   marketplace format rules are sent. Account details, payment data, sale prices, costs and profit never are.
3. Given the seller's monthly cost cap is reached, then the gateway refuses the call and returns the
   condition S-22 shows as M-06.
4. Given marketplace or imported text in a prompt, then it's passed as data, not instructions (§9.3
   guardrails).
5. Given a provider timeout or outage, then the gateway returns an error that S-07, S-09 and S-13 can show.
- [ ] Must not: no provider key is shipped in the app binary (verified by a build check).
- [ ] Must not: no call bypasses the gateway.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: AI cost per listing ≤ $0.01 (KR5).
- [ ] NFR: gateway overhead `[NFR TBD — eng lead]`; timeout and retry policy `[NFR TBD — eng lead]`.

*AI states*
- [ ] Every AI call logged (S-40).

**Out of scope (this story):** model choice (Phase 0 AI cost check).
**Dependencies:** Phase 0 AI cost test.
**Open questions:** model tier.
**Test data needs:** synthetic payloads including forbidden fields, to prove they're stripped.
**Labels / components:** phase-1 · platform · ai · **Estimate:** —

## [S-40] Log every AI run

**Format:** Technical enabler · **Dimensions:** Backend · Data
**Story Summary (Description):** Every AI call is logged with what's needed to trace and cost it, so that a
seller's complaint about a draft can be traced and AI cost per listing can be measured.
**Design:** none
**Traces to:** R-21 · §9.3 Traceability · governance "Log all AI actions" · KR5 · §10 (log retention)
**Applicable for:** grouping, extraction, drafting, estimate (and P-05 when S-51 ships).
**Impact areas:** export (S-35) · deletion (S-36)

**Acceptance Criteria**

*Functional Requirements*
1. Given an AI call, then a log entry records time, user, model, prompt version, input references, output,
   cost and latency.
2. Given photos and audio, then they're referenced, not copied into logs.
3. Given a validator outcome (S-14), then it's recorded against the run.
- [ ] Data: logs are retained for `[TBD — Legal, blocking]` and deleted with the account per S-36.
- [ ] Must not: logs never contain payment data, sale prices, costs or profit (they're never in a prompt).
- [ ] Must not: a seller can't read another seller's logs.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: logging failure never blocks the seller's AI call `[H — confirm with eng lead]`, and is alerted.

**Out of scope (this story):** a log viewer UI.
**Dependencies:** S-39; Q-07.
**Open questions:** Q-07 (blocking).
**Test data needs:** synthetic runs.
**Labels / components:** phase-1 · platform · ai · **Estimate:** —

## [S-41] Instrument every success metric

**Format:** Technical enabler · **Dimensions:** Backend · Integration
**Story Summary (Description):** Product events for every §12 metric, so that the PM can measure activation,
conversion and checklist use from launch day.
**Design:** none
**Traces to:** R-22 · §12 · KR3, KR4
**Applicable for:** iOS and Android.
**Impact areas:** every story that lists EVT

**Acceptance Criteria**

*Functional Requirements*
1. Given the event list in R-22, then each event is emitted once per occurrence by the story that owns it:

| Event (R-22) | Owning story |
|---|---|
| install; Home opened; Needs-action item opened | S-23 (install: app launch) |
| first listing copied (with time since install) | S-15 |
| items per haul; drafting outcome | S-12, S-13 |
| paywall shown; plan chosen; purchase outcome | S-19, S-20 |
| sale recorded; checklist confirmed | S-27, S-28 |
| cost entered; export | S-30, S-46 |
| Listings filtered | S-25 |
| unfinished haul resumed | S-06 |
| account deleted | S-36 |
| each onboarding step completed or skipped; camera and microphone permission outcome | S-01, S-03 |
| shop linked or unlinked | S-34 |
| eBay connection started, succeeded, failed or disconnected | S-54 |
| tip shown, advanced or skipped | S-37 |
| how-to card dismissed; video played (with % watched); written steps opened | S-38 |
| photos saved; photo-library permission outcome | S-57 |
| notification permission outcome | S-29 |
| shipping entered or skipped | S-27 |
| Undo used; status changed back to listed | S-59 |
| item deleted | S-58 |

2. Given an event, then it carries an account pseudonym, plan state, platform and app version.
- [ ] Must not: events never carry photos, transcripts, item text, sale prices, costs or email addresses.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: events queued offline and sent on reconnect.

**Out of scope (this story):** dashboards.
**Dependencies:** analytics tool `[TBD — eng lead]`.
**Open questions:** analytics tool; consent requirements for analytics `[TBD — Legal]`.
**Test data needs:** synthetic sessions.
**Labels / components:** phase-1 · platform · analytics · **Estimate:** —

## [S-42] Run the drafting eval set as a release gate

**Format:** Technical enabler · **Dimensions:** Backend · Data
**Story Summary (Description):** An automated eval harness runs §9.3's eval set before launch and on every
model or prompt change, so that sellers never get a draft that drops a flaw or invents a fact.
**Design:** none
**Traces to:** §9.3 Evaluation · R-10 · R-5 (grouping accuracy) · R-6 (extraction accuracy) · R-8 (title
compliance) · §13 Phase 1 gate ("eval pass thresholds met")
**Applicable for:** P-01, P-02, P-03.
**Impact areas:** release process

**Acceptance Criteria**

*Functional Requirements*
1. Given the eval set (30 items with known flaws and measurements, 10 hauls of 10+ items, and the §9.3b
   near-misses), when the harness runs, then it scores flaw recall, unstated-attribute rate, title-limit
   compliance, extraction accuracy, grouping accuracy, and a comparison with Poshmark's, Mercari's and eBay's
   own drafts.
2. Given results, then pass = 100% flaw recall, 0 unstated attributes, 100% title compliance, and grouping and
   extraction at `[thresholds TBD — eng lead]`.
3. Given a model or prompt change, then the harness runs, and a failed run blocks release of that change.
- [ ] Data: the eval items are owned by Listly and contain no personal data.
- [ ] Must not: no model or prompt version reaches sellers without a passing run.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: a full run completes within `[NFR TBD — eng lead]`.

**Out of scope (this story):** the photo-edit eval (S-52).
**Dependencies:** eval owner `[TBD — eng lead]`; Phase 0 eval set.
**Open questions:** thresholds; owner.
**Test data needs:** the eval set itself (synthetic or Listly-owned items).
**Labels / components:** phase-1 · platform · ai · quality · **Estimate:** —

## [S-43] Meet the accessibility baseline on every screen

**Format:** User story · **Dimensions:** UI
**Story Summary (Description):** As a seller who uses VoiceOver, TalkBack or large text, I want every control
labeled and every status change announced, so that I can run my whole selling loop.
**Design:** all screens
**Traces to:** R-24 · GO Mobile Design System standard
**Applicable for:** iOS and Android, all screens.
**Impact areas:** every UI story (A11Y-BASE)

**Acceptance Criteria**

*Functional Requirements*
1. Given any screen, then every control has a VoiceOver and TalkBack label and role.
2. Given the largest Dynamic Type size, then all text scales and no value or control is cut off or overlapped.
3. Given any control, then its touch target is at least 44 × 44 pt.
4. Given drafting done, copied, and every other status change named in a story, then it's announced.
- [ ] Must not: no information is conveyed by colour alone (the prototype notes GO has no error or warning
  colour role).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: an accessibility pass of every Phase 1 screen on both platforms before beta.

**Out of scope (this story):** dark theme (not in the prototype; `[TBD — ux-lead]`).
**Dependencies:** S-44.
**Open questions:** dark theme scope.
**Test data needs:** none.
**Labels / components:** phase-1 · accessibility · **Estimate:** —

## [S-44] Add the missing components to the GO Mobile Design System

**Format:** Technical enabler · **Dimensions:** UI
**Story Summary (Description):** The roughly 15 components the prototype styles as gaps are added to GO once,
so that every Listly screen is built from shared, accessible parts rather than one-offs.
**Design:** prototype "Component labels" control; assumptions list of gaps
**Traces to:** §9.4 design system · R-32 (tab bar is a GO gap) · §14 risk "design system lacks about 15
components"
**Applicable for:** all screens.
**Impact areas:** every UI story

**Acceptance Criteria**

*Functional Requirements*
1. Given the gap list in the prototype (secondary and text buttons, tabs, segmented control, chips and tags,
   list rows, text fields, checkbox, tab bar, progress bar, toast, plan card, mic and shutter buttons, inline
   error and alarm banner, progress dots, settings groups, switches, sort control, destructive button,
   coach-mark tip, video player, accordion), then each is added to GO with its states.
2. Given GO has no error or warning colour role and no helper-text colour, then the roles are added or the
   decision not to is recorded `[TBD — ux-lead]`.
- [ ] Must not: no screen ships a one-off version of a listed component.
- [ ] Rest of the functionality should remain As-Is: GoButton and GoCard are unchanged unless ux-lead decides
  otherwise.

*Non-Functional Requirements*
- [ ] NFR: each component meets A11Y-BASE on its own.

**Out of scope (this story):** dark theme.
**Dependencies:** ux-lead.
**Open questions:** colour roles.
**Test data needs:** none.
**Labels / components:** phase-1 · design-system · **Estimate:** — (likely needs splitting per component
group at grooming)

---

# E-11 Selling extras (Phase 3 fast-follow · P1)

**Goal:** the P1 requirements that improve selling once the core loop is live.
**Sequencing:** independent of each other; all need Phase 1.

## [S-45] See a price range labeled as a guess

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want a price range for each item, clearly
labeled as a guess, so that I have a starting point without being misled.
**Design:** prototype `draft` price row
**Traces to:** R-11 · P-04 · N-07 · §9.3 pattern Recommendation Prompt · §9.3 guardrails ("never present the
price as based on sold data")
**Applicable for:** all plan states with drafted items.
**Impact areas:** drafts (S-15) · cost (S-39)

**Acceptance Criteria**

*Functional Requirements*
1. Given a drafted item, then a price range shows, labeled "Estimate from similar items. A guess, not based on
   sold prices."
2. Given the estimate, then it's never put into a price field unless the seller copies or edits it.
3. Given P-04 fails, then the drafts still show, and the estimate is absent with a note `[copy — ux-lead]`.
- [ ] Must not: no wording presents the estimate as based on sold prices, or answers "what will it sell
  for?" with anything but the labeled guess (P-04 near-miss).
- [ ] Must not: P-04 receives confirmed facts and photos only, never sale prices or costs.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: the estimate adds no more than `[NFR TBD — eng lead]` to drafting, and its cost counts toward ≤
  $0.01 per listing.

*AI states* — Pattern: Recommendation Prompt (Simple).
- [ ] Wait state: shown while P-04 runs, if separate from drafting.
- [ ] Sources: labeled as an estimate from similar items.
- [ ] Every AI action logged (S-40).

**Out of scope (this story):** sold-price data (a later sourcing decision).
**Dependencies:** S-12, S-15; G-17.
**Open questions:** G-17.
**Test data needs:** synthetic items.
**Labels / components:** phase-3 · drafting · ai · **Estimate:** —

## [S-46] Export items and sales to CSV

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a part-time reseller, I want my items and sales as a CSV with cost, fees,
shipping and net, so that I can keep records for taxes.
**Design:** prototype `profit` export button
**Traces to:** R-17 · D-10 (manual changes marked) · D-11 (bin included) · R-40 (trades listed as trades) ·
R-42 · §10 (labeled as a record, not tax advice) · R-22 (export)
**Applicable for:** Reseller plan.
**Impact areas:** Profit (S-31)

**Acceptance Criteria**

*Functional Requirements*
1. Given Profit, when the seller exports, then a CSV of items and sales with bin, cost, fees, shipping and net
   is produced, and the seller can save or share it.
2. Given the export, then it's labeled as a record, not tax advice `[wording to Legal]`.
3. Given traded items (S-49), then they appear as trades.
4. Given a sale eBay recorded and the seller later changed by hand (S-59), then its row is marked as a manual
   change (R-17, D-10).
5. Given a sale with shipping not entered (D-9), then the shipping cell is empty and the net is marked as an
   estimate, not computed with $0 `[H — confirm with PM]`.
- [ ] Data contract `[columns H — confirm with PM]`:

| Field | Required | Type | Sample value | Default when empty | Description |
|---|---|---|---|---|---|
| item_name | Yes | text | Denim trucker jacket | none | Item record name |
| bin | No | text | B4 | empty | Seller's typed bin (D-11); never sent to the AI |
| status | Yes | enum | sold | none | listed, sold, traded |
| marketplace | No | text | Mercari | empty | Sale marketplace, or trade place |
| sale_date | No | date | 2026-11-20 | empty | Date sold or traded |
| sale_amount | No | decimal | 36.00 | empty | Sale price, or trade value (estimate) |
| fee | No | decimal | 3.60 | empty | Estimated fee from S-32 |
| shipping_choice | No | enum | buyer_paid | empty | buyer_paid, seller_paid, free_shipping, or empty when skipped (D-9) |
| shipping | No | decimal | 0.00 | empty | Shipping the seller paid; 0.00 only when the buyer paid |
| cost | No | decimal | 8.00 | empty | What the seller paid; empty means no cost |
| net | No | decimal | 24.40 | empty | Net profit |
| net_is_estimate | Yes | boolean | false | false | True when cost or shipping is missing, or for a trade |
| type | Yes | enum | sale | none | sale or trade |
| manual_change | Yes | boolean | false | false | True when an eBay-recorded sale was changed by hand (D-10) |

- [ ] Must not: no other account's data.
- [ ] Events: export (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: 12 months at 50 sales a week exports within `[NFR TBD — eng lead]`.

**Out of scope (this story):** the full data export (S-35).
**Dependencies:** S-31, S-59.
**Open questions:** Legal wording; whether reverted (non-eBay) sales appear in the CSV at all `[rule TBD —
PM]`.
**Test data needs:** synthetic sales and trades.
**Labels / components:** phase-3 · profit · **Estimate:** —

## [S-47] Be offered the Reseller plan when I'm selling more

**Format:** User story · **Dimensions:** UI · Backend
**Story Summary (Description):** As a closet clearer on the Clear-out Pass, I want to be offered the Reseller
plan once, when I have 10+ active items or copy to a second marketplace, so that I hear about tracking tools
when they'd help, without nagging.
**Design:** prototype `passHome` upgrade card
**Traces to:** R-19 · R-18
**Applicable for:** Clear-out Pass only.
**Impact areas:** Home (S-23) · paywall (S-19)

**Acceptance Criteria**

*Functional Requirements*
1. Given a Pass seller with 10+ active items, or who copies to a second marketplace, then the Reseller plan is
   offered once per pass `[copy — ux-lead]`.
2. Given the offer, then it's dismissible, and once dismissed it doesn't return during that pass.
3. Given the seller accepts, then the paywall (S-19) shows; the plan changes only if they buy.
- [ ] Edge: "active items" and "copies to a second marketplace" are counted per pass `[rule TBD — PM]`.
- [ ] Must not: the plan never changes without the seller choosing.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.

**Out of scope (this story):** pricing of the upgrade.
**Dependencies:** S-21, S-19.
**Open questions:** counting rule; G-02 (copying after the haul).
**Test data needs:** Pass accounts at 9 and 10 active items.
**Labels / components:** phase-3 · monetisation · **Estimate:** —

## [S-48] Mark several items sold as one bundle

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to select items sold together and enter one
total, so that each item's profit is split fairly.
**Design:** not in the prototype
**Traces to:** R-28 · §9.4 (a sale links to one or more items)
**Applicable for:** Reseller plan and Clear-out Pass.
**Impact areas:** checklist (S-28) for each item · Profit (S-31)

**Acceptance Criteria**

*Functional Requirements*
1. Given several items, when the seller selects them and enters one total and the marketplace, then one sale
   is recorded linking all of them.
2. Given the total, then it's split across the items in proportion to their list prices (see A-09 on which
   list price).
3. Given any bundled item is still listed elsewhere, then the checklist (S-28) runs for it.
- [ ] Edge: an item with no list price `[rule TBD — PM]`.
- [ ] Edge: the split doesn't add up to the total after rounding. The remainder goes to `[rule TBD — PM]`.
- [ ] Must not: the split never changes the total.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE. Multi-select is usable with screen readers.

**Out of scope (this story):** bundle discount helpers (non-goal).
**Dependencies:** S-27, S-28.
**Open questions:** A-09; rounding; no-price rule.
**Test data needs:** synthetic bundle of 3 items.
**Labels / components:** phase-3 · sales · **Estimate:** —

## [S-49] Mark an item traded

**Format:** User story · **Dimensions:** UI · Backend · Data
**Story Summary (Description):** As a part-time reseller, I want to record that an item left in a trade, what
I got and what it's worth, so that my inventory and profit stay true.
**Design:** prototype states `traded`, `tradeDone`
**Traces to:** R-40 · R-15 (checklist runs for trades) · R-13 (ledger filter) · R-17 (CSV) · R-42 (from
item detail; change back to listed) · D-6, D-10 (Undo, built in S-59) · §10 (trades)
**Applicable for:** Reseller plan; Pass `[rule TBD — PM]`.
**Impact areas:** checklist · Profit · ledger · CSV

**Acceptance Criteria**

*Functional Requirements*
1. Given an item, when the seller chooses "Traded", then they enter where the trade happened (free text), what
   they received, and its estimated value, and the item's status changes to traded, with the date.
2. Given a trade, then Profit counts the estimated value as the sale amount, with no marketplace fee, labeled
   "trade value (estimate)".
3. Given the seller chooses to add what they received to inventory, then a new item is created with the trade
   value as its cost.
4. Given the item is listed elsewhere, then the checklist (S-28) runs exactly as for a sale.
5. Given the ledger and the CSV, then traded items show as trades.
6. Given Mark traded completes, then Undo is available for 10 seconds, and later the trade can be changed
   back to listed from item detail (S-59).
- [ ] Validation: estimated value is numeric and greater than or equal to 0.
- [ ] Must not: Listly never suggests or computes the trade value; it's the seller's estimate.
- [ ] Must not: Listly never hosts, matches or brokers trades (GC-001 is parked).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] A11Y-BASE.

**Out of scope (this story):** GC-001 (trade space), parked.
**Dependencies:** S-27, S-28.
**Open questions:** Phase 0 trade survey sets R-40's priority (§15, non-blocking).
**Test data needs:** synthetic trade, for example a jacket traded for jeans valued at $30.
**Labels / components:** phase-3 · sales · **Estimate:** —

---

# E-12 Photo tools (Phase 3 fast-follow · P1 · AI: P-05)

**Goal:** sellers clean up photos without misrepresenting the item; the original is always kept and first.
**Sequencing:** S-50 ships first. S-51 ships only after S-52 passes and the edit allowance is set (§13).
**Out of scope:** saving photos to the phone for posting (S-57, R-41). Saved edited copies follow their
original (R-41).

## [S-50] Crop, straighten, brighten or clear a photo's background

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want quick photo fixes on a copy of my photo, with
a side-by-side compare, so that my photos look clean while the item stays exactly as it is.
**Design:** not in the prototype (text only)
**Traces to:** R-25 · §9.3 guardrails (photo edits)
**Applicable for:** Reseller plan and Pass; trial `[rule TBD — PM]`.
**Impact areas:** photo storage · drafts' photo order

**Acceptance Criteria**

*Functional Requirements*
1. Given an item photo, then the seller can crop, straighten, brighten, or remove the background to plain
   white or a neutral colour, on a copy.
2. Given background removal, then the item is cut out; no pixel of the item is redrawn, smoothed or
   recoloured.
3. Given an edit, then original and edited copies are shown side by side before the edited copy is used.
4. Given any edit, then the original is kept and stays the default first photo.
- [ ] Must not: no edit removes or hides a flaw.
- [ ] Must not: the original is never overwritten.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: an edit completes within `[NFR TBD — eng lead]`.
- [ ] A11Y-BASE. The compare view has text alternatives for each image.

**Out of scope (this story):** generative backgrounds (S-51).
**Dependencies:** background-removal vendor `[TBD — eng lead]` (Q-16).
**Open questions:** Q-16.
**Test data needs:** synthetic item photos with visible flaws.
**Labels / components:** phase-3 · photos · **Estimate:** —

## [S-51] Replace a photo's background with AI, never the item

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want to put an item on a chosen background, with
the item's pixels unchanged and the edit labeled, so that my photos look good and stay honest.
**Design:** not in the prototype
**Traces to:** R-38 · P-05 · M-09, M-11 · §9.3 guardrails and evaluation (photo edits) · §9.3 data
boundaries
(photos go to the image provider only after a tap) · §10 (second provider disclosure) · §11 (edit
allowance)
**Applicable for:** plans with an edit allowance `[TBD — PM; must not be unlimited on the Pass]`.
**Impact areas:** image provider · cost · disclosure (S-03)

**Acceptance Criteria**

*Functional Requirements*
1. Given an item photo, when the seller picks a background style or describes one, then the system replaces
   only the background, keeping the item's pixels unchanged (masked), and shows original and edited side by
   side.
2. Given an edited photo, then it's labeled "Edited background" in Listly.
3. Given drafts, then the unedited original stays the first photo by default.
4. Given a request that changes the item (for example removing a stain or making it look new), then it's
   refused with M-09, the photo is unchanged, and a background-only edit is offered.
5. Given an edit, then its cost against the plan's monthly edit allowance is shown before it runs.
6. Given the allowance is used up, then no edit runs, the photo is unchanged, and M-11 shows when the
   allowance resets and the upgrade option, if any (D-7).
- [ ] Legal: the second AI provider is disclosed before the first edit `[wording to Legal]`.
- [ ] Must not: edits never run in the background or without a tap.
- [ ] Must not: no item pixel changes outside the mask tolerance `[TBD — eng lead]`.
- [ ] Must not: the photo goes to the image provider only after the seller taps to edit.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: cost per edit `[TBD — eng lead]`, estimated $0.006–$0.21.
- [ ] NFR: if an edit runs over 3 s, activity is visible; over 5 s, Cancel is available.

*AI states* — Pattern: AI Assisted Outputs (Simple); Escalation (mandatory).
- [ ] Wait state: processing shown while P-05 runs.
- [ ] Reasoning visible for operations over 3 s; cancel available for operations over 5 s.
- [ ] Escalation: on failure, the original is unchanged and the allowance isn't used `[H — confirm]`.
- [ ] Sources: edited photos labeled "Edited background".
- [ ] Every AI action logged (S-40), with the photo referenced, not copied.

**Out of scope (this story):** Etsy disclosure (Etsy isn't a target marketplace).
**Dependencies:** S-50 shipped; S-52 passed; image provider and allowance (Q-16).
**Open questions:** Q-16; allowance per plan.
**Test data needs:** S-52's photo set.
**Labels / components:** phase-3 · photos · ai · **Estimate:** —

## [S-52] Gate AI photo edits on a flaw-preservation eval

**Format:** Technical enabler · **Dimensions:** Backend · Data
**Story Summary (Description):** An eval of background replacement that must pass before S-51 ships, so that
sellers never post an AI-edited photo that hides a flaw.
**Design:** none
**Traces to:** R-38 · §9.3 Evaluation (photo edits) · §13 Phase 3 gate · §14 risk (misrepresentation)
**Applicable for:** P-05.

**Acceptance Criteria**

*Functional Requirements*
1. Given 30 item photos with visible flaws, when the eval runs, then it measures changed item pixels outside
   the mask tolerance and, judged by a person, whether 100% of flaws stay visible.
2. Given every item-changing prompt in the ambiguity library, then each is refused (M-09).
3. Given pass = 0 changed item pixels outside tolerance, 100% of flaws visible, every item-changing prompt
   refused, then S-51 may be released.
- [ ] Must not: S-51 is never enabled for sellers without a passing run, and every model or prompt change
  re-runs it.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: human-judging protocol documented `[TBD — eng lead]`.

**Out of scope (this story):** the text eval (S-42).
**Dependencies:** image provider (Q-16).
**Open questions:** mask tolerance; owner.
**Test data needs:** 30 Listly-owned item photos with visible flaws.
**Labels / components:** phase-3 · photos · ai · quality · **Estimate:** —

---

# E-13 Automatic sale detection (Phase 3 fast-follow · P1)

**Goal:** fewer missed sales: forwarded sale emails propose "mark sold", and a read-only eBay connection
records eBay sales on its own.
**Sequencing:** S-54 → S-55. S-53 is independent.

## [S-53] Forward a sale email and confirm the proposed sale

**Format:** User story · **Dimensions:** UI · Backend · Integration
**Story Summary (Description):** As a part-time reseller, I want to forward a marketplace's sale email to my
Listly address and confirm the sale it proposes, so that recording a sale takes one tap.
**Design:** not in the prototype (text only)
**Traces to:** R-26 · R-34 (linked shops help matching) · §14 risk "manual ledger goes stale"
**Applicable for:** Reseller plan `[Pass TBD — PM]`.
**Impact areas:** checklist (S-28)

**Acceptance Criteria**

*Functional Requirements*
1. Given an account, then it has a per-user forwarding address shown in Profile `[location TBD — ux-lead]`.
2. Given a forwarded sale email, then the system proposes "mark sold" for the matching item, for the seller
   to confirm `[matching rule TBD — eng lead + PM, G-12]`.
3. Given the seller confirms, then the sale is recorded as in S-27, and the checklist runs.
4. Given no match, or several, then the seller is told and can pick the item or dismiss `[copy — ux-lead]`.
- [ ] Must not: nothing is marked sold without the seller confirming.
- [ ] Must not: email content is treated as data, never as instructions (§9.3 guardrails), whether or not it
  goes to the AI `[TBD — eng lead: is parsing AI-assisted?]`.
- [ ] Must not: email from addresses other than the seller's own is `[rule TBD — eng lead: rejected?]`.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: proposal appears within `[NFR TBD — eng lead]` of the email arriving.
- [ ] NFR: retention of forwarded emails `[TBD — Legal]`.

**Out of scope (this story):** reading the seller's inbox directly (not in the PRD).
**Dependencies:** S-27, S-28.
**Open questions:** G-12; email retention; whether parsing uses AI (would add a P-ID).
**Test data needs:** synthetic sale emails in each marketplace's format; no real buyer data.
**Labels / components:** phase-3 · sales · integration · **Estimate:** —

## [S-54] Connect and disconnect my eBay account

**Format:** User story · **Dimensions:** UI · Backend · Integration · Data
**Story Summary (Description):** As a part-time reseller who sells on eBay, I want to connect my eBay account
through eBay's own sign-in after seeing exactly what Listly can and can't do, so that I trust what I'm
granting.
**Design:** prototype states `connectors`, `ebayConnect`, `ebayFail`
**Traces to:** R-35 · R-34 · §9.4 (tokens encrypted on the server, never on the phone, never to the AI) ·
§10 (eBay API licence) · R-22 (eBay connection events) · Flow 7
**Applicable for:** all plans `[H]`.
**Impact areas:** S-55 · deletion (S-36)

**Acceptance Criteria**

*Functional Requirements*
1. Given eBay isn't connected, when the seller taps "Connect with eBay", then a screen first says what Listly
   will be able to do (see orders and listing status) and won't (post, change or end listings, see payment
   details) `[copy — ux-lead]`, then sends them to eBay's own sign-in.
2. Given success, then the status shows Connected, with the eBay username.
3. Given cancel or failure, then nothing changes and the seller can try again.
4. Given "Disconnect", then automatic sale detection stops, the seller is told eBay sales must be marked by
   hand again, and the token is revoked and deleted.
- [ ] Data: tokens are stored encrypted on the server, never on the phone, never passed to the AI.
- [ ] Edge: token expiry or revocation on eBay's side shows the status as needing reconnection
  `[copy — ux-lead]`.
- [ ] Must not: Listly never requests eBay scopes beyond reading orders and listing status.
- [ ] Must not: Listly never asks for the eBay password.
- [ ] Events: eBay connection started, succeeded, failed, disconnected (EVT).
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: token refresh and rotation per eBay's rules `[TBD — eng lead]`.

**Out of scope (this story):** recording sales (S-55).
**Dependencies:** **blocked by Q-03 (do eBay's current API terms allow this?), Eng lead + Legal, needed by
Phase 1.**
**Open questions:** Q-03 (blocking).
**Test data needs:** eBay sandbox accounts only.
**Labels / components:** phase-3 · marketplaces · integration · **Estimate:** —

## [S-55] Record eBay sales automatically

**Format:** User story · **Dimensions:** Backend · Integration · Data
**Story Summary (Description):** As a part-time reseller with eBay connected, I want eBay sales recorded as
sold on their own, which starts the checklist for my other marketplaces, so that I never miss an eBay sale.
**Design:** none beyond S-28
**Traces to:** R-35 · R-15 · R-42 and D-10 (reverting a recorded sale) · M-12 · §14 risk (eBay restricts
access)
**Applicable for:** sellers with eBay connected.
**Impact areas:** checklist · Profit · Needs action

**Acceptance Criteria**

*Functional Requirements*
1. Given a new eBay order for an item Listly can match `[matching rule TBD — G-12]`, then the item is recorded
   as sold on eBay with the sale price and date, and the checklist (S-28) starts for its other marketplaces.
2. Given an order that matches no item, then `[rule TBD — PM: ignored, or offered to the seller]`.
3. Given eBay is unreachable, then detection retries `[policy TBD — eng lead]`, and the seller can still mark
   sales by hand.
- [ ] Edge: the same order seen twice records one sale (idempotent on the eBay order ID).
- [ ] Edge: an item already marked sold by hand before the order arrives isn't sold twice.
- [ ] Edge: a recorded eBay sale can be changed back to listed only after M-12's confirmation, and is then
  logged as a manual change (S-59, R-42, D-10).
- [ ] Must not: Listly never changes or ends anything on eBay.
- [ ] Rest of the functionality should remain As-Is.

*Non-Functional Requirements*
- [ ] NFR: a sale is detected within `[NFR TBD — eng lead]` of the order (the checklist's 1-hour goal in §12
  depends on it).
- [ ] NFR: alerting on detection failure.

**Out of scope (this story):** other marketplaces (no API).
**Dependencies:** S-54; Q-03.
**Open questions:** G-12; A-10 (auto-recording without confirmation).
**Test data needs:** eBay sandbox orders.
**Labels / components:** phase-3 · sales · integration · **Estimate:** —

---

# E-14 Don't preclude Listly for ChatGPT and Claude (P1, separate PRD)

**Goal:** MVP 1's server API can later expose reads and a draft-haul create to an assistant, with the
seller's OAuth consent, without a rebuild. Only the "don't preclude it" requirement applies here.
**Out of scope:** the MCP server, the ChatGPT app, the Claude connector, any assistant UI, any write through
an assistant. All belong to R-39's own PRD, which needs gates and a traceability spine.

## [S-56] Shape the server API so assistant access and a web client can be added later

**Format:** Technical enabler · **Dimensions:** Backend
**Story Summary (Description):** The server API separates the reads (what's live, what sold, what needs
action, what I made) and the draft-haul create behind scoped, consented access, so that a part-time reseller
can later use Listly from ChatGPT or Claude, and from a web companion, without Listly rebuilding its backend.
**Design:** none
**Traces to:** R-39 ("not preclude it" only) · R-27 note ("don't preclude it in auth or the API", P2) ·
§9.4
**Applicable for:** server API and auth only.
**Impact areas:** S-02 (auth), S-23, S-25, S-31 (the reads), S-05/S-06 (draft haul)

**Acceptance Criteria**

*Functional Requirements*
1. Given the server API, then the four reads (live listings, sales, needs action, profit summary) are
   available as server endpoints, not only as app-side computations.
2. Given haul creation, then a draft haul can be created by a server endpoint that takes photos and leaves the
   haul for review in the app (the S-06 unfinished-haul state).
3. Given auth, then access tokens can carry scopes, so a future OAuth consent can grant read-only or
   draft-create access separately.
- [ ] Must not: no assistant-facing endpoint, MCP server or OAuth consent screen is built or exposed in MVP 1.
- [ ] Must not: no endpoint added for this story can mark sold, remove anything or reach payment data.
- [ ] Rest of the functionality should remain As-Is: the app uses the same endpoints.

*Non-Functional Requirements*
- [ ] NFR: an architecture review records that the reads and draft-create can be exposed with scoped tokens
  `[reviewer TBD — eng lead]`.

**Out of scope (this story):** everything else in R-39 and R-27.
**Dependencies:** S-02.
**Open questions:** Phase 0 demand test (§15, non-blocking for this story).
**Test data needs:** none.
**Labels / components:** phase-1 · platform · future-proofing · **Estimate:** —

---

# E-15 Deferred: web companion (Later · P2)

**Placeholder only. No stories written.**

| Req | What it is | Why deferred | Trigger |
|---|---|---|---|
| R-27 | A read-mostly web view of the ledger, bulk copy and CSV export, from the same Expo codebase | P2; §13 "Later" | Decide after launch. The "don't preclude it" constraint is carried by S-02 and S-56 |

**Not written, on purpose:** GC-001 (Listly trade space and marketplace), parked in docs/BACKLOG.md.

---

## Requirement coverage

| Req | Priority | Stories |
|---|---|---|
| R-1 | P0 | S-18, S-02, S-06, S-12, S-13, S-15, S-58 |
| R-2 | P0 | S-19, S-15 |
| R-3 | P0 | S-20, S-19, S-33 |
| R-4 | P0 | S-05, S-03 |
| R-5 | P0 | S-07, S-08 |
| R-6 | P0 | S-09, S-10, S-11, S-03, S-15 |
| R-7 | P0 | S-12, S-13, S-06 |
| R-8 | P0 | S-15, S-14 |
| R-9 | P0 | S-16, S-58, S-30 |
| R-10 | P0 | S-14, S-42, S-11 |
| R-11 | P1 | S-45 |
| R-12 | P0 | S-17, S-25 |
| R-13 | P0 (Reseller) | S-26, S-23 |
| R-14 | P0 | S-27, S-25, S-59, S-58 |
| R-15 | P0 (both plans) | S-28, S-29, S-59, S-21, S-23, S-25 |
| R-16 | P0 (Reseller) | S-30, S-31, S-32, S-59 |
| R-17 | P1 | S-46 |
| R-18 | P0 | S-21, S-04, S-23, S-25, S-57, S-58 |
| R-19 | P1 | S-47 |
| R-20 | P0 | S-22, S-39, S-12 |
| R-21 | P0 | S-40 |
| R-22 | P0 | S-41 (and the EVT lines it maps) |
| R-23 | P0 | S-03, S-05, S-35, S-36, S-39 |
| R-24 | P0 | S-43 (and A11Y-BASE in every UI story) |
| R-25 | P1 | S-50 |
| R-26 | P1 | S-53 |
| R-27 | P2 | Deferred (E-15); constraint carried by S-56, S-02 |
| R-28 | P1 | S-48 |
| R-29 | P0 | S-23, S-24, S-06 |
| R-30 | P0 | S-25, S-21 |
| R-31 | P0 | S-33, S-36, S-02, S-29, S-10, S-27 |
| R-32 | P0 | S-04, S-19 |
| R-33 | P0 | S-01, S-02, S-03 |
| R-34 | P0 | S-34, S-01 |
| R-35 | P1 | S-54, S-55 |
| R-36 | P0 | S-37 |
| R-37 | P0 | S-38, S-24 |
| R-38 | P1 | S-51, S-52 |
| R-39 | P1 (separate PRD) | S-56 (enabler only) |
| R-40 | P1 | S-49, S-59 |
| R-41 | P0 | S-57, S-15 |
| R-42 | P0 | S-58, S-59, S-25, S-26, S-30 |

**Uncovered:** none. R-27 is deliberately deferred.

**PM decisions applied (PRD v8 §9.6):** D-1 → S-18, S-19, S-12, S-15, S-06 · D-2 → S-21, S-25, S-28, S-29,
S-23 · D-3 → S-57 · D-4 → S-58 · D-5 → S-27, S-10, S-33 · D-6 → S-59, S-27, S-28, S-49 · D-7 → S-01, S-04,
S-07, S-11, S-19, S-28, S-29, S-51 · D-8 → no story (other docs) · D-9 → S-27, S-31, S-46 · D-10 → S-59,
S-46, S-55 · D-11 → S-10, S-09, S-26, S-46, S-58.

**Stories not traced to an R-n:** S-44 traces to §9.4 and §14 (design-system work named in the PRD as part
of this release). S-42 traces to §9.3 Evaluation and the §13 Phase 1 gate. Both are kept, not cut.

**AI trace:** P-01 → S-07 · P-02 → S-09, S-10, S-11 · P-03 → S-12, S-14 · P-04 → S-45 · P-05 → S-51, S-52.
M-01 → S-12 · M-02 → S-09, S-10, S-11 · M-03 → S-13 · M-04 → S-13 · M-05 → S-07, S-08 · M-06 → S-22 ·
M-07 → S-14, S-16 · M-08 → S-15 · M-09 → S-51, S-52 · M-10 → S-07 · M-11 → S-51 · M-12 → S-59, S-55 ·
M-13 → S-59.

---

## Open questions that block stories (from PRD §15, plus story-level)

| ID | Question | Owner | Blocks | Needed by |
|---|---|---|---|---|
| Q-03 | Do eBay's current API terms allow reading a seller's orders (R-35)? | Eng lead + Legal | S-54, S-55 | Phase 1 (per §15) |
| Q-04 | Verified fee rates and title limits per marketplace, and who keeps them current | Eng lead | S-14, S-15, S-31, S-32 | Phase 1 |
| Q-05 | Who makes the how-to video, and who updates it when flows change? | Founder | S-38 | Phase 1 |
| Q-07 | Retention of voice audio and AI logs | Legal | S-09, S-35, S-36, S-40 | Phase 1 |
| Q-12 | "Listly" name clearance | Founder | S-20 (store submission) | Phase 2 |
| Q-02 | Paying-seller target at 90 days (KR2) | Founder | No story; blocks KR2 only | End of Phase 0 |

**§15 items marked "Before stories" that are still open.** Stories are written to the current PRD text, and
each is flagged where it applies:
- Q-06 (is shop linking worth it before R-26?): S-34.
- Q-10 (is `advisory` right?): the whole set.
- Q-14 (Profit tab or Home): S-04, S-31.

Q-08 (Pass checklist) is closed in PRD v8 by D-2.

**Question index.** These Q-IDs are local to this story set. The PRD's §15 rows aren't numbered.

| ID | §15 question (short form) | Blocking in §15? |
|---|---|---|
| Q-01 | Trial format: 3 free listings or a 7-day trial | No |
| Q-02 | Paying-seller target at 90 days | Yes (KR2 only) |
| Q-03 | eBay API terms for R-35 | Yes |
| Q-04 | Verified fee rates and title limits, and their owner | Yes |
| Q-05 | How-to video owner | Yes |
| Q-06 | Is a linked shop worth it before R-26? | No, "before stories" |
| Q-07 | Retention of voice audio and AI logs | Yes |
| Q-08 | Checklist for Clear-out Pass users | **Closed in v8 by D-2** |
| Q-09 | Home section order | No |
| Q-10 | Is `advisory` the right side-effect type? | No, "before stories" |
| Q-11 | Account before the first photo | No |
| Q-12 | "Listly" name clearance | Yes (store submission) |
| Q-13 | US web checkout at launch | No |
| Q-14 | Profit as a tab or in Home | No, "before stories" |
| Q-15 | Is the generic format always drafted? (raised by this set, see A-05; not in §15) | n/a |
| Q-16 | Image provider for R-25 and R-38, and the edit allowance | No |

Not referenced by any story: the auto-delist extension question, demand for ChatGPT and Claude (gates
R-39's own PRD, not S-56), and the trade survey (sets R-40's priority).

---

## Ambiguities and contradictions found in the PRD

Rows that PRD v8 resolved are kept, marked **Resolved** with the D-ID.

| ID | Where | Issue |
|---|---|---|
| A-01 | R-1 | **Resolved by D-1.** "Free listings: n of 3": is n the count used or the count left? |
| A-02 | R-1, R-2, Goal 1, §12 | **Resolved by D-1.** Goal 1 and the "≥ 10 items in first haul" metric describe a 10-item first haul, but the trial is 3 items. R-2 triggers the paywall at "Finish haul or starts a 4th item", while R-1 says "drafting a 4th item requires a plan". When exactly does the paywall interrupt a first haul of 10, and which 3 items are free? S-18 assumes the first 3 in haul order [H]. |
| A-03 | R-18 vs §6 | §6 says the Pass sees "Active listings, mark sold, money made"; R-18 lists the same. Neither defines what an *expired* Pass or a trial user can still do (G-09, G-10). |
| A-04 | R-18 vs R-30 and R-15 | **Resolved by D-2.** A Pass user's item that sells on one marketplace stays live on others, but the checklist is hidden. R-30 says Listings never shows a listing as removed without confirmation, yet the prototype drops sold-but-still-live rows from the Pass user's Active view. That is a silent double-sale risk for exactly the case §15 asks about. |
| A-05 | R-8 vs R-33, R-34 | R-8 drafts for five marketplaces plus a generic format. R-33's skip drafts "for all five" and R-34 has switches for the five only. Is generic always drafted? |
| A-06 | R-32 vs §9.1 Flow 1 | **Resolved by D-7.** R-32: a haul returns to the tab it started from. Flow 1 and the prototype: paywall → Home. These conflict for a haul started from Listings that ends in a purchase. |
| A-07 | R-15 vs R-12 | **Resolved by D-7.** R-15 promises "a link to that listing", but R-12 makes the link optional. The fallback when there's no link isn't stated. |
| A-08 | R-31 | **Resolved by D-5.** Selling defaults are "used by R-16", but the default bin isn't a profit input, and "who usually pays shipping" gives no amount (G-04). |
| A-09 | R-28 | "In proportion to their list prices": an item can be listed at a different price on each marketplace. Which price? |
| A-10 | R-35 vs R-26 and §9.3 | R-26 proposes a sale for the seller to confirm. R-35 records eBay sales automatically without confirmation. That's deterministic, so it doesn't break `advisory`, but the two sale-detection paths have opposite confirmation rules. |
| A-11 | §9.3e | **Resolved by D-7 (M-10, M-11 added; M-08 and M-09 reordered).** No M-ID for a grouping failure (P-01 timeout or provider down), or for an edit allowance being used up (R-38). §9.3e also lists M-09 before M-08. |
| A-12 | R-6 vs prototype | **Resolved by D-7.** R-6 and §9.3c make condition a required slot, but the prototype's fact screen shows only brand, size, measurements and flaws. |
| A-13 | R-33 | **Resolved by D-7.** "A progress indicator shows step n of 3", but there are four steps including Welcome. Presumably Welcome isn't counted. |
| A-14 | §9.3 table | The Guardrails, Evaluation, Cost and latency, and Data boundaries rows have an extra cell (the photo-edit notes) beyond the table's two columns, so they render inconsistently. |
| A-15 | §9.3 side-effect type vs §15 | The PRD types the feature `advisory` yet asks in §15 whether that's right, "before stories". Grouping proposes records that the seller then saves through deterministic code. This set follows `advisory`. If it changes to `write`, gates, a commit boundary and a traceability spine must be added to S-07, S-08 and S-12. |
| A-16 | R-37 | "About 2 minutes [H]" is both a hypothesis and a P0 launch requirement with no named producer. |
| A-17 | R-11 vs R-8 | R-8 gives every draft a price field; R-11 (P1) supplies the only price source and forbids auto-filling it. Phase 1's price field has no defined source (G-17). |
| A-18 | R-6 vs §9.3c (new in v8) | R-6 now says condition is required, but §9.3c's "if unresolved" column for condition still says only "ask once". Does a blank condition block like flaws? S-11 assumes it does [H]. |
| A-19 | R-2 (new in v8) | The paywall now triggers only on a 4th draft, or on Finish haul *with undrafted items*. A trial seller who drafts exactly 3 items and finishes sees no paywall at the moment of value. Intended? (S-19.) |
| A-20 | R-14, R-15, R-40 vs R-24 (new in v8) | A fixed 10-second Undo may fail WCAG 2.2.1 (Timing Adjustable) for screen-reader users. (S-59.) |
| A-21 | R-42 (new in v8) | The revert rules don't cover a trade whose received item was added to inventory (R-40), or a bundle sale (R-28). (S-59.) |
| A-22 | R-17 (new in v8) | Only eBay-recorded sales are marked as manual changes in the CSV. Whether a sale reverted by hand (non-eBay) still appears in the CSV isn't stated. (S-46.) |

---

## Definition of ready (for grooming)

- [ ] Every blocking question for the story is answered, or the story is explicitly accepted with its
  `[TBD]` as a spike.
- [ ] ux-lead has written copy for every `[copy — ux-lead]` and M-ID the story cites.
- [ ] The prototype gaps the story depends on are designed: R-9 editing (S-16), the R-15 reminder and its
  permission request (S-29), cost entry (S-30), merge (S-08), condition and bin on the fact screen (S-10,
  S-11), Save photos (S-57), item detail (S-58), Undo and change back to listed (S-59), the shipping choice
  (S-27), locked items and the return to the haul after purchase (S-18, S-19), the Pass checklist (S-21,
  S-28), and "step n of 4" (S-01). PRD v8 §9.1 says the prototype must follow v8.
- [ ] The G-xx scope gaps that touch the story are decided or deferred by the PM.
- [ ] Every NFR marked `[NFR TBD — eng lead]` has a number, or is accepted as unmeasured for beta.
