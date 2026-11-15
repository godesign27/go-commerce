---
type: design
product: go-commerce-listly
feature: listly-mvp-1
status: draft
author: ux-lead (ux-design)
created: 2026-11-14
updated: 2026-11-14
source:
  - docs/prd/listly-mvp-1.md (v8 §9.1, §9.2, §9.3e)
  - docs/stories/listly-mvp-1-stories.md (S-01 to S-59, entitlement matrix)
  - docs/design/listly-mvp-1/ux-listly-mvp-1-design.md (DD-nn decisions)
  - docs/design/listly-mvp-1/initial-prototype.html (v3; state IDs in backticks)
---

# Listly MVP 1 — flows and states

The flows, navigation and full state inventory for MVP 1. Each state names its **prototype state ID** (in
backticks; open it from Prototype controls → Go to any state), its copy (**M-xx** from PRD §9.3e, **C-xx**
from [ux-copy.md](ux-copy.md)) and what it traces to. Design decisions are **DD-nn** in the
[design doc](ux-listly-mvp-1-design.md) §9.

`[H]` marks an assumption nobody has validated; `[TBD — owner]` marks an unknown. "Proposed" marked design
answers to the PM's questions; the PM agreed all of them on 2026-11-14 (DD-26 and DD-27 "for now").

## 1. Navigation

### 1.1 Tab bar (R-32, S-04, DD-25)

| Plan state | Tabs | Notes |
|---|---|---|
| Reseller plan | Home · Listings · **New haul** · Profit · Profile | New haul is the central, raised action |
| Clear-out Pass (active or ended) | Home · Listings · **New haul** · Profile | No Profit tab (R-18) |
| Trial | Same as the Reseller plan (**proposed**, DD-26, G-09) | Profit shows its empty state until a sale |
| Test variant "Profit inside Home" (Q-14) | Home · Listings · **New haul** · Profile for every plan | Home's This month card opens Profit |

The current tab is marked as selected for screen readers, with its name and position ("Listings, tab, 2 of 5,
selected"). **The tab bar is hidden** during onboarding, the whole haul flow (capture to Finish haul), the
paywall, drafting, and full-screen system states (DD-02; S-04 `[H]`).

### 1.2 Where each screen is reached from

| Screen | Reached from | Returns to |
|---|---|---|
| Onboarding (4 steps) | First launch; after Sign out or Delete account (Welcome) | New haul (step 4). Photo-first variant: Copy listings (DD-41) |
| Sign in | Welcome → I already have an account; session expired `[H]` | Home for the seller's plan (DD-31); step 2 if they choose to create an account (DD-32) |
| Camera and mic on a new phone | The first New haul after signing in on a new phone (DD-38) | New haul |
| Finish setting up | A card on Home after the first haul (DD-42) | Home; each row opens its screen, which returns to Home |
| Restore purchases | Profile → Plan; the paywall | The same screen, with the outcome shown there (DD-39) |
| New haul (capture → grouping → facts → drafting → copy) | Tab bar New haul; Home Start a haul; Home Unfinished haul → Continue; empty states' Start a haul | **The tab it started from** (R-32), on Finish haul or Close |
| Paywall | Drafting item 4 on the trial; Finish haul with undrafted items; Finish haul with exactly 3 drafted (proposed, DD-08); New haul on an ended Pass; Profile → See plans or See the Reseller plan; Home's plan card | **The haul**, if opened mid-haul (R-32, D-7); otherwise where it was opened from |
| Item detail | A row in Listings, the ledger, Profit's recent sales; Home's Needs action (via the checklist) | Where it was opened from (back label names it) |
| Mark sold / traded | Listings row → Mark sold; item detail → Mark sold, Mark traded | Checklist (if listed elsewhere), else the sold confirmation |
| Checklist | After Mark sold or traded; Home Needs action → Remove it now; Listings sold-but-still-live row → Remove it; item detail footer; the reminder notification | Sold confirmation on Done; Home on Remind me |
| Profit | Profit tab; Home This month; sold confirmation → See profit | — |
| Add costs | Profit → Add costs | Profit |
| Marketplaces and connections | Profile → Marketplaces | Profile |
| How-to | Home's How-to card; new-user Home link; Profile → Help | Where it was opened from |

## 2. Flows

Each flow is in the prototype's Key task flows, step by step, with the same IDs.

### Flow 0 — Onboarding (R-33, R-23, R-34; S-01 to S-03; DD-31 to DD-37)

1. **Welcome**: step 1 of 4 (C-01, C-02). Get started · I already have an account (→ Flow 10).
2. **Where do you sell?**: step 2 of 4. Marketplace chips; Continue (disabled with none picked) · Skip — draft
   for all five.
3. **Create an account**: step 3 of 4. Continue with Apple (Apple's own button) · Continue with Google · Use
   email instead.
4. **Camera and microphone**: step 4 of 4, with the AI processing notice (C-04). Allow and start my first haul
   · Not now — I'll use my photo library and type.
5. **Camera system prompt**, then **microphone system prompt** (C-68, C-69). → New haul (Flow 1).

| Branch | What happens | State | Copy |
|---|---|---|---|
| Skips marketplaces | Drafting set is all five | `obAccount` | — |
| Email (DD-33) | Email address → "Check your email": link or 6-digit code → step 4 | `obEmail`, `obEmailSent` | C-62, C-64 |
| Not a valid email | Error under the field when Continue is tapped; focus returns to the field | `obEmailInvalid` | C-63 |
| Code not 6 digits | Error under the code field | `obEmailSent` | C-65 |
| Link expired or used | "That link has expired" → Send a new link | `obEmailExpired` | C-66 |
| Apple or Google sheet cancelled (DD-34) | Stays on step 3; nothing on screen; "Sign-in cancelled" announced | `obAccount` | C-67 |
| Sign-up fails | Stays on step 3 with the error; no partial account | `obAccountFail` | C-03 |
| Both prompts allowed | Camera and voice | `capture` | — |
| Camera denied, microphone allowed | Photo library; voice still on; Open Settings | `captureCamDenied` | C-05, C-72 |
| Microphone denied, camera allowed | Camera; facts are typed; Open Settings on the facts step | `factsMicDenied` | C-06, C-72 |
| Both denied | Library and typing | `captureBothDenied` | C-05, C-06, C-72 |
| Not now (DD-36) | Nothing is asked. The haul shows **Turn on camera**, and the facts step **Turn on microphone**, each of which shows the system prompt there and then | `captureNotNow` | C-70, C-71 |
| Access turned on in Settings later (DD-37) | Picked up on return, without a restart; "Camera is on" announced | `captureCamBack` | C-73 |
| Already has an account | Flow 10 | `signIn` | C-58 |

### Flow 1 — First haul to paid (R-1 to R-12, R-18, R-32, R-41; S-05 to S-20, S-57)

1. **Capture** (`capture`): camera or library, Next item markers, running count. Done · Close — save for later.
2. **Check grouping** (`group`): proposed items with M-05; Move a photo (non-drag), Split, Merge. Looks right.
3. **Facts per item** (`facts`): speak or type; "Heard: …"; editable fields; **Men's / Women's / Unisex** and a
   **size dropdown with Other…** (DD-30, PQ-23); **condition required** (DD-04); **bin** optional and typed (DD-05). Items past the trial's 3 carry the locked note (C-15).
4. **Drafting** (`drafting`): M-01 with Cancel. A trial seller drafts only the first 3 (D-1).
5. **Copy listings** (`draft`): item chips (locked ones marked), marketplace tabs, Copy and Edit per field,
   your price, Save photos, Open marketplace, listing link, Mark as listed. Trial counter "Free listings: 0 of
   3 left" (C-16).
6. **Draft item 4** (`draftLocked`) or **Finish haul** → **paywall** (`paywall`).
7. **Buy** → **back to the haul** (`draftAfterBuy`) → Draft 2 more items → drafting → copy (all drafted).
8. **Finish haul** → the tab the haul started from (Home after onboarding).

Branches:

| Condition | State | Copy | Recovery |
|---|---|---|---|
| Grouping call fails | `groupFail` | M-10 | Try again · Continue as one item, then Split |
| A required slot is missing | `factsMissing` | C-12, C-13 | Answer it; can't continue without flaws and condition |
| Voice not understood or ambiguous | `factsRetry` | M-02 | Try again · Type the answers |
| Drafting fails | `draftFail` | M-03 | Try again; inputs kept; no free listing used |
| Drafting fails for some items | `draftPartial` | M-04 | Try this item again |
| Plan limit or AI cost cap reached | `limitReached` | M-06 | Back to my haul; drafted listings still copyable |
| Purchase fails | `payFail` | C-26 | Try again; "you haven't been charged" |
| Not now on the paywall | `draft` | C-27 | Back to the haul; locked items stay saved |
| Trial seller drafts exactly 3 and finishes (A-19) | `trialDone` → `homeTrial` | C-25 (trialDone) | **Proposed** (DD-08): plans shown, Not now equal weight |
| Photo access prompt, denied, limited | `photoAsk`, `photoDenied`, `photoLimited` | C-22, C-23 | Open Settings; limited saves to Recents |
| Cancel during drafting | `facts` | C-11 | Back to facts, answers kept |

### Flow 2 — Sold → remove it everywhere else (R-13 to R-16, R-40, R-42; S-27 to S-29, S-49, S-59)

1. **Listings** row → **Mark sold** (or item detail → Mark sold).
2. **Mark sold** (`sold`): where it went (marketplaces + Traded), sale price, **shipping: Buyer paid · I paid · Free
   shipping (I paid)** with an amount for the last two, preselected from Selling defaults; Add shipping later;
   the item's bin at the top (DD-13).
3. → **Checklist** (`soldCheck`) with the **Undo bar** (DD-14): "Marked sold on Poshmark · 10 s. Undo". The countdown pauses while it's touched or focused.
4. Tick **I removed it** on each marketplace; each tick brings its own Undo, plus **Undo sale** (`soldUndo`;
   D-10: undoing the sale reverts the ticks too).
5. **Done** (enabled when every one is ticked) → **sold confirmation** (`soldDone`): bin and net profit.

Branches:

| Condition | State | Copy |
|---|---|---|
| Listed on only the marketplace it sold on | `soldDone` directly, with Undo | C-36 |
| Shipping skipped or "I paid" left empty | `soldDoneEst` | C-35 (flag), C-36 |
| No listing link saved for a marketplace | checklist row with Open {marketplace} and a search prompt (DD-22) | C-33 |
| Remind me in 1 hour, first time | `notifAsk` → `notifSystem` | C-30 |
| Notifications allowed | Home with Needs action; reminder an hour later (`reminderNotif`) | C-32 |
| Notifications denied, or reminders off | `homeFlagged`; no reminder; stays in Needs action | C-31 |
| Remind me again while notifications are off | Home with C-31 and Open Settings (once a session; DD-15) | C-31 |
| Traded instead (R-40, P1) | `traded` → checklist → `tradeDone` | C-37 |
| Clear-out Pass (D-2) | `soldCheckPass`; confirmation shows money made, no fees | C-36 |
| Undo | back to where Mark sold started; "Undone. {item} is listed again." | C-34 |

### Flow 3 — Check profit (R-16, R-17; S-30, S-31)

Profit tab (or Home → This month) (`profit`) → totals, flags for missing costs and missing shipping, by
marketplace, recent sales → **Add costs** (`addCosts`, one sold item at a time) or a sale → item detail to add
shipping → Export CSV. Empty: `profitEmpty`.

### Flow 4 — Occasional seller (R-18, R-19, R-32; S-19, S-21)

Haul and copy → paywall → **Clear-out Pass** → back to the haul → Finish haul → **Pass Home** (`passHome`).
Something sells → checklist (D-2). Pass ended or at 100 listings → `passEnded`; New haul opens the paywall
(passEnded variant); everything else keeps working (**proposed**, DD-27).

### Flow 5 — Open the app (R-29, R-30, R-32; S-23, S-24, S-06)

Home → Needs action → checklist · Unfinished haul → Continue (resumes at the furthest step) · This month →
Profit · Stale → Listings filtered to stale · Start a haul. New user: `homeNew`. **Test variant**: This month
first (`homeMonthFirst`, Q-09).

### Flow 6 — Manage my account (R-31, R-23; S-33, S-35, S-36)

Profile → Account · Plan · Marketplaces · Selling defaults (shipping, default bin) · Notifications · Privacy and
data (export, delete) · Help (how-to, Show tips again, contact).

### Flow 7 — Connect marketplaces (R-34, R-35; S-34, S-54)

Profile → Marketplaces and connections → drafting switch per marketplace · Link your shop (username) · Connect
with eBay → what Listly will and won't do → eBay's sign-in → Connected. Fails → `ebayFail`.

### Flow 8 — Learn Listly (R-36, R-37; S-37, S-38)

First visit to Home, Copy listings or Listings → tips (up to 3, PQ-19). How-to card on Home, or Profile → Help →
video and steps. Skip tips → Profile → Show tips again.

### Flow 9 — Look after one item (R-42, R-9, R-13, R-30; S-58, S-59, S-30, S-16)

Listings or the ledger → **item detail** (`itemDetail`) → any of:

| Action | Result | State | Copy |
|---|---|---|---|
| Edit a fact (Edit beside it) | Saved as a new version; drafts not changed; "Update the drafts" offered (PQ-13) | `itemEdit` | C-38 |
| Add shipping or cost (sold item) | Profit's estimate flag clears for that sale | `itemDetailSold` | C-38 |
| Copy listings | The copy screen for this item | `draft` | — |
| Mark sold / Mark traded | Flow 2 | `sold`, `traded` | — |
| Change back to listed | Logged as a change you made; profit recalculates; **M-13** offers to relist where it was removed | `relist` → `itemRevertDone` | M-13, C-40 |
| …when eBay recorded the sale | **M-12** first: only if cancelled or returned | `revertEbay` | M-12 |
| Delete | Confirmation: can't be undone; marketplaces unchanged; photos on the phone stay; no free listing back | `itemDelete` | C-39 |

Item not listed anywhere yet → `itemNoListings`. Clear-out Pass → `itemDetailPass` (no cost).

### Flow 10 — Sign in on a new phone (R-33, R-3, R-1, R-36; S-02, S-03, S-20; DD-31, DD-32, DD-38 to DD-40)

1. **Welcome** → I already have an account.
2. **Sign in** (C-58): Continue with Apple · Continue with Google · Sign in with email · New to Listly? Get started.
3. **Getting your items** (C-61): a spinner and words, a few seconds at most `[H]`.
4. **Home for the seller's plan**, with tips already seen staying seen (R-36). Their plan comes from the server;
   nothing to restore by hand (R-3).
5. **First New haul on this phone** → **Camera and microphone on this phone** (C-74), without the AI notice
   block → the two system prompts → New haul.

| Branch | What happens | State | Copy |
|---|---|---|---|
| No Listly account for that sign-in (DD-32) | Try another way (primary) · Create a new account → step 2, with the sign-in kept, so step 3 is skipped | `signInNoAccount` | C-60, C-86 |
| Sign-in fails | Stays on Sign in with the error | `signInFail` | C-56 |
| Email | Same link-and-code screens as Flow 0, with no step dots | `obEmailSent` | C-62 to C-66 |
| Trial seller (DD-40) | Home shows what's left, e.g. "1 of 3 free listings left"; never reset | `homeReturnTrial` | C-85 |
| AI notice changed since they agreed (DD-38) | The full notice shows in place of the short screen; nothing is uploaded until they agree | `newPhoneNotice` | C-75 |
| Restore purchases (DD-39) | Checking… → restored, already active, nothing found, or on another account | `profileRestored`, `profileRestoreNone`, `profileRestoreOther` | C-83 |
| Session expired `[H — eng lead]` | Sign in, with "You've been signed out" | — (not prototyped) | C-59 |

### Flow 11 — Onboarding, photo first (test variant; PQ-14, Q-11; DD-41)

Compared with Flow 0 in Phase 0. Prototype: Simulate → Test variants → Onboarding: photo first.

1. **Welcome** (C-76), no step dots: Photograph my first items · I already have an account.
2. **Camera, microphone and the AI notice**: the same screen as step 4, without step dots. The notice must come
   before the first upload (R-23).
3. **Capture → grouping → facts**, as Flow 1. The drafting set is all five.
4. **Save your 5 items** (C-77): Apple · Google · email. This is the account step, just before drafting, because
   the trial counter belongs to an account (R-1). Grouping before this needs an anonymous session (PQ-28).
5. **Drafting**, then **Copy listings** with a one-time sheet, **Where will you post these?** (C-78): pick
   marketplaces → Show these listings, or Show all five. The choice becomes the drafting set.

Measure against Flow 0: time from install to first listing copied (KR3), and how many start sign-up and
finish it.

### Flow 12 — Finish setting up, and the plan welcome (R-31, R-34, R-3, R-18; DD-42, DD-43; agreed, PQ-24, PQ-29)

- **After the first haul is finished**, Home shows **Finish setting up** (C-79), below Needs action and an
  unfinished haul: Link your shops → Marketplaces and connections (back goes to Home) · Set selling defaults →
  **Selling defaults** (C-80) → Save → Home, with the row marked Done · eBay sales tracked for you: Coming soon
  (no action). Dismissing it says where the settings live. It goes away when both rows are done.
- **After buying**, Home shows a one-time welcome card. Bought mid-haul: back to the haul first (DD-09); the card
  waits for Home. **Reseller plan** (C-81): Profit, By item, stale items, 500 a month; Add what you paid →
  Add costs. **Clear-out Pass** (C-82): when it ends, 100 listings, reminders still on; no cost prompt.

## 3. State inventory

Every screen against the six state types. "—" means the state can't occur on that screen, with the reason.

| Screen (state) | Empty | Loading | Error | Permission denied | Partial data | Entitlement |
|---|---|---|---|---|---|---|
| **Welcome** (`welcome`) | — (static) | — | — | — | — | — (no payment in onboarding, R-33) |
| **Where do you sell?** (`obMarkets`) | No marketplace picked: Continue disabled, hint (C-02) | — | — | — | — | — |
| **Create account** (`obAccount`) | — | Signing in: buttons disabled, "Signing you in…" (C-03) | Sign-up failed (`obAccountFail`, C-03) | — (cancelling the Apple or Google sheet isn't an error: nothing on screen, "Sign-in cancelled" announced, DD-34) | — | — |
| **Email** (`obEmail`, `obEmailSent`, `obEmailExpired`) | Empty field: Continue checks on tap | Sending: button shows "Sending…" `[H]` | Not a valid address (`obEmailInvalid`, C-63); code not 6 digits (C-65); link expired (C-66); can't send `[H]` (C-03 wording) | — | — | — |
| **Sign in** (`signIn`) | — | Signing in, then **Getting your items** (`signInLoading`, C-61) | Failed (`signInFail`, C-56); no account for it (`signInNoAccount`, C-60) | — (cancel as above) | — | Plan comes from the server (DD-39) |
| **Camera and mic on a new phone** (`newPhonePerms`) | — | — | — | Outcomes as Flow 0 | Notice changed: full notice (`newPhoneNotice`, C-75) | All plans |
| **Camera and mic** (`obPerms`, `obCamPrompt`, `obMicPrompt`) | — | — | — | Each prompt answered separately; four outcomes plus Not now (DD-36, C-70 to C-72) | — | — |
| **Capture** (`capture`) | 0 photos: Done disabled; "Add from library" highlighted | Uploading after Done: count and progress `[H]` | Upload interrupted (C-54, G-08); photo limit (C-07) | Camera denied (C-05): library, Open Settings; **not asked yet** (`captureNotNow`, C-70): Turn on camera; turned on in Settings → picked up (`captureCamBack`, C-73) | — | Trial with 0 free listings left can still capture `[H]` (S-05) |
| **Check grouping** (`group`) | — (≥1 photo) | Grouping: "Finding your items…" with activity over 3 s, Cancel over 5 s (§9.3 governance) | Grouping failed (`groupFail`, M-10) | — | One photo or one item: still confirmable | — |
| **Facts** (`facts`) | Before answering: fields "Not answered yet" | Transcribing and extracting: "Listening…" then "Filling in what you said…" | Voice not understood (`factsRetry`, M-02); ambiguous value (M-02) | Mic denied (`factsMicDenied`, C-06): typing, Open Settings; **not asked yet** (C-71): Turn on microphone | Missing flaws or condition (`factsMissing`, C-12, C-13); blank brand or size (C-20) | Items past the free 3 carry C-15 (D-1) |
| **Drafting** (`drafting`) | — | M-01 with progress and Cancel | → `draftFail` (M-03), `draftPartial` (M-04) | — | — | Limit or cap (`limitReached`, M-06); trial drafts only the first 3 (D-1) |
| **Copy listings** (`draft`) | Fields not given (C-20); no price yet: Copy disabled (C-21) | Switching item or marketplace: instant `[NFR TBD — eng lead]` | Copy failed to clipboard (C-18 error) `[H]`; a failed item (`draftPartial`) | Photo access denied (`photoDenied`, C-23); limited (`photoLimited`, C-22) | Fields the seller didn't give (G-16, DD-12); title over the limit after an edit (C-19) | Trial: locked items (`draftLocked`, C-17), counter (C-16); after a plan: Draft n more (`draftAfterBuy`, C-27) |
| **Paywall** (`paywall`) | — | Purchase in progress: plan buttons disabled, "Waiting for the App Store…" | Purchase failed (`payFail`, C-26); restore found nothing (C-26) | — | — | Variants: finish, draft4, trialDone (proposed), passEnded, upgrade (C-25) |
| **Home** (`home`) | New user (`homeNew`, C-29); empty sections hidden (R-29) | Skeleton cards for 1 s `[H]` | Couldn't load (C-53): last known figures with "Updated {time}" | Reminders off (`homeFlagged`, C-31) | "This month" net profit marked "(estimate)" if any sale has no cost or shipping | Trial used (`homeTrial`, proposed); Pass (`passHome`): money made, no stale, no net profit; Pass ended (`passEnded`, C-52) |
| **Listings** (`listings`) | Nothing live (`listingsEmpty`, C-41); filter no match (C-41) | Skeleton rows | Couldn't load (C-53) | — | Row without a saved link: no Open listing; checklist uses the fallback | Pass (`listingsPass`): no By item, no stale filter; sold-but-still-live kept (D-2) |
| **Ledger** (`ledger`) | No items (C-42) | Skeleton rows | Couldn't load (C-53) | — | Item with no bin: "No bin" (S-26) | Reseller only (R-18); trial `[TBD — PM]` (DD-26 proposes yes) |
| **Item detail** (`itemDetail`) | Not listed yet (`itemNoListings`, C-38) | Opening: photo strip placeholders | Couldn't save an edit (C-53, edit kept in the field) | — | Sold with no shipping or cost (`itemDetailSold`, flags) | Pass (`itemDetailPass`): no cost section (PQ-08); ended Pass keeps everything but re-drafting (DD-27) |
| **Mark sold** (`sold`) | — | Saving: button busy | Sale price not a number (C-35 validation); couldn't save (C-53) | — | Shipping skipped (C-35 flag) | Second sale before the checklist is done (PQ-22, proposed block) |
| **Checklist** (`soldCheck`) | — | — | Couldn't save a tick (C-53): tick reverts and says so | Notifications denied (C-31) | No saved link (C-33 fallback) | Same on both plans (D-2); trial yes (DD-26, proposed) |
| **Sold confirmation** (`soldDone`) | — | — | — | — | Shipping or cost missing (`soldDoneEst`): "Net profit (estimate)"; fee unknown (C-43) | Pass: money made only, no fees or net (R-18) |
| **Profit** (`profit`) | No sales (`profitEmpty`, C-43); a month with no sales shows $0.00 (S-31 `[H]`) | Skeleton | Couldn't load (C-53) | — | Missing cost and missing shipping flags (C-43); fee unknown for a marketplace (C-43) | Reseller only; hidden for the Pass (R-18) |
| **Add costs** (`addCosts`) | Nothing to add: toast "Every sold item has a cost." | — | Not a number (C-44 validation) | — | — | Pass: not reachable (PQ-08) |
| **Profile** (`profile`) | — | — | Restore found nothing (C-26) | Notifications off in Settings (C-45) | — | Plan section by plan (trial, Reseller, Pass, Pass ended) |
| **Marketplaces and connections** (`connectors`) | No shops linked: Link your shop on each | Saving a link | eBay failed (`ebayFail`, C-47); bad shop link (C-46) `[rule TBD — eng lead]` | — | At least one drafting marketplace must stay on (S-34 `[H]`) | All plans; eBay Connect is "Coming soon" before S-54 ships (PQ-20) |
| **Connect eBay** (`ebayConnect`) | — | Waiting for eBay | Cancelled or failed (C-47) | — | — | P1 (R-35) |
| **How-to** (`howTo`) | — | Video buffering | Offline: video needs a connection; steps still work (C-51) | — | — | All plans |
| **Delete account** (`deleteConfirm`) | — | Deleting… | Deletion failed partway (C-49) | — | — | Copy varies: subscription vs Pass (C-49) |
| **Reminder notification** (`reminderNotif`) | — | — | — | Not sent when denied | — | Both plans |
| **Save your items** (`pfAccount`, test variant) | — | Signing in | Failed (`pfAccountFail`, C-03 wording, "Your photos and answers are still here") | — | — | Trial counter starts here (R-1) |
| **Where will you post these?** (`pfMarkets`, sheet) | None picked: Show these listings disabled; Show all five | — | — | — | — | — |
| **Finish setting up** (card on Home) | Every row done: card gone | — | — | — | One row done: marked Done | Trial, Reseller, active Pass. Not on an ended Pass |
| **Selling defaults** (`setupDefaults`) | Bin blank: allowed | Saving | Couldn't save `[H]` | — | — | All plans |
| **Plan welcome** (card on Home) | — | — | — | — | — | Reseller card or Pass card; one per purchase (DD-43) |
| **Restore purchases** (Profile, paywall) | — | "Checking…" | Nothing found (C-83); on another account (C-83); store unavailable `[H]` | — | — | Restored or already active (C-83) |
| **First-run tips** (overlay) | Control not on screen: skip that tip (S-37 open question; proposed) | — | — | — | — | Not on onboarding or the paywall (R-36) |

## 4. Reseller plan vs Clear-out Pass vs trial

From the stories' entitlement matrix. **Bold** cells are this design's proposals for the matrix's
`[rule TBD — PM]` cells (DD-26, DD-27). The PM's decision replaces them.

| Capability | Trial | Reseller plan | Clear-out Pass, active | Clear-out Pass, ended or at its limit |
|---|---|---|---|---|
| Capture, group, facts | Every item (R-1, D-1) | Yes | Yes | **Yes; drafting shows the paywall** |
| Draft new items | First 3 drafted; rest locked | Up to 500/month (R-20) | Up to 100 (R-18) | No → paywall (R-18) |
| Copy drafted listings | Yes (R-2) | Yes | Yes | **Yes** |
| Save photos (R-41) | **Yes** | Yes | Yes | **Yes** |
| Item detail (R-42) | **Yes** | Yes | Yes, **no cost** (PQ-08) | **Yes, no re-drafting** |
| Home (R-29) | New-user Home, then **trial Home with plan card** (DD-08) | Full | Needs action, This clear-out (money made), no stale | **Pass Home with "has ended" card** |
| Listings (R-30) | **Yes** | Full, By listing and By item | By listing only; no stale filter; sold-but-still-live kept | **Same as active Pass** |
| Ledger and stale (R-13) | **Yes** | Yes | Hidden, data kept | Hidden |
| Mark sold, Undo (R-14, D-6) | **Yes** | Yes | Yes | **Yes** |
| Checklist and reminders (R-15) | **Yes** | Yes | Yes (D-2) | **Yes** (safety) |
| Profit tab and tracker (R-16) | **Tab, empty until a sale** | Yes | Hidden; money made on Home | Hidden |
| Profile (R-31) | Yes, plan shows the counter | Yes | Yes | Yes |
| Upgrade suggestion (R-19, P1) | — | — | 10+ active items or a second marketplace, once per pass | Paywall instead |
| Finish setting up card (DD-42) | **After the first haul** | **After the first haul** | **After the first haul** | Not shown |
| Plan welcome card (DD-43) | — | **Reseller card, once** | **Pass card, once** | — |
| Restore purchases (R-3) | Yes | Yes | Yes | Yes |

**What changes on screen between plans** (for the same item and action):

| Surface | Reseller plan | Clear-out Pass |
|---|---|---|
| Sold confirmation | Sale − fee (estimate) − shipping − cost = net profit | Sale price = money made; no fees, no net |
| Item detail | Cost section; profit flags | No cost section; no profit flags |
| Home This month | Active listings · sold · net profit | Listed · sold · made |
| Listings filters | Active · Stale · Sold, still live · By item | Active · Sold, still live |
| Profile Plan | Renewal date, listings this month, Manage subscription | Days left, listings used of 100, See the Reseller plan |

## 5. Cross-cutting behaviour

- **Undo (DD-14, A-20, decided 2026-11-14):** an Undo bar after Mark sold, Mark traded and each "I removed it", with a
  visible 10-second countdown. It pauses while the bar has focus or is being touched, announces "Undo closes in 3 seconds",
  and closes early if the seller leaves the screen or takes another action with its own Undo. **Profile → Accessibility →
  Keep Undo until I dismiss it** turns the timer off (WCAG 2.2.1). After a
  tick, the bar offers **Undo** (that tick) and **Undo sale** (everything since the sale, D-10). After the bar
  is gone, recovery is item detail → Change back to listed (M-13; M-12 for eBay-recorded sales).
- **Permissions (DD-36 to DD-38):** camera and microphone are asked one at a time, each with its own fallback.
  "Not now" means not asked yet: Turn on camera or Turn on microphone shows the system prompt where the seller is.
  "Denied" means only Settings can turn it on, so the copy says Open Settings. Access turned on in Settings is
  picked up when the seller comes back. Permissions belong to the phone; the AI notice acknowledgement belongs to
  the account, with its version. Photo library (R-41) and notifications (R-15) are asked on first use, not here.
- **Sign-in and session:** a cancelled Apple or Google sheet is never an error (DD-34). No partial account is ever
  created. Tips, the trial counter, the plan and the AI notice acknowledgement come from the account, so a new
  phone doesn't reset any of them (DD-38 to DD-40).
- **Status never by colour alone (DD-28):** text tags ("Still live", "You removed it", "Sold here", "Locked",
  "Not entered", "Estimate", "Stale") plus weight and borders. GO has no status colours.
- **Offline (G-08, `[TBD — eng lead + ux-lead]`):** proposed: capture works offline and uploads on reconnect;
  grouping, extraction and drafting need a connection and say so (C-53); copying already-drafted listings works
  offline from cache `[H]`; ticks and sales queue and sync, shown as "Saved on this phone — will sync" `[H]`.
- **Announcements (R-24):** step changes in onboarding, "Sign-in cancelled", "Getting your items", email sent, each permission outcome, "Camera is on" after Settings, restore outcomes, photo count, items found, each filled field, drafting
  done, copied (with the field name), every Undo, each tick with the remaining count, and filter result counts.
  See [accessibility-review.md](accessibility-review.md).
- **Unfinished hauls (S-06):** Close in the haul saves; Home lists each unfinished haul with Continue, which
  resumes at the furthest step without re-running grouping or extraction. Discard is a separate, confirmed
  action (C-09).
