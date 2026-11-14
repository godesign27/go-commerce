---
type: design
product: go-commerce-listly
feature: listly-mvp-1
status: draft
author: ux-lead (ux-copy)
created: 2026-11-14
updated: 2026-11-14
source:
  - docs/prd/listly-mvp-1.md (v8 §9.3e M-01 to M-13; honesty rules §9.3, R-10, R-11)
  - docs/stories/listly-mvp-1-stories.md ([copy — ux-lead] markers; G-07)
  - docs/design/listly-mvp-1/ux-flows.md (states)
  - zaidyn-pm-os shared/design-context/voice-and-tone.md §1–3, §8, §11 (general voice and failure rules only; Listly isn't a ZDS product)
---

# Listly MVP 1 — UX copy deck

The wording for every message, label and state in MVP 1. **M-01 to M-13** are the PRD's AI and item messages
(§9.3e), which set the intent; this deck sets the words. **C-01 to C-57** are new IDs for everything else,
which closes **G-07** (non-AI messages had no IDs). Stories that say `[copy — ux-lead]` can now cite a C-ID.

The prototype ([initial-prototype.html](initial-prototype.html), v3) uses this wording. Where a string has
`{braces}`, it's a variable.

## 1. Voice for Listly

Listly talks to a seller who is busy, often holding an item, and sometimes anxious about a sale. So:

- **Plain and short.** Lead with what happened or what to do. One idea per sentence. "Copy", not "Copy to
  clipboard".
- **Seller's words, not ours.** Item, listing, haul, bin, marketplace, sold, still live, removed. Never SKU,
  channel listing, entity, delist, sync. (Maya's persona: "Items" not "SKUs", "Sold" not "Ended".)
- **Listly speaks as "Listly" or in the second person**, never "I" or "we" in product UI. "We" is allowed
  only for company actions outside the app (email delivery, support). The seller's own first person is fine
  where the PRD uses it: "I removed it", "I paid".
- **Calm about money and mistakes.** No exclamation marks. No celebration on a sale beyond confirming it. No
  blame ("You entered an invalid…").
- **Numbers in figures**, money as `$12.99`, dates as "Dec 13". Sentence case for every label and title.

### Honesty rules (PRD §9.3 guardrails, R-10, R-11) — every string checked against these

1. **The price estimate is always "a guess, not based on sold prices".** It's never called a value, worth,
   recommended price or "should sell for".
2. **No claim the seller didn't make.** Copy never says an item is authentic, genuine, vintage, new or flawless
   unless the seller said so, and then only as their statement.
3. **Flaws are always kept.** Copy never offers to hide, soften or remove a stated flaw. It may offer to change
   the wording.
4. **Listly never claims a listing is down** until the seller ticks "I removed it" (R-15). "Removed" is always
   "You removed it", never "Removed" alone.
5. **Listly never claims to post, remove or change anything on a marketplace.** It opens the marketplace; the
   seller acts.
6. **Fees and profit are estimates**, and say so where they're shown.

### What every failure message says (voice §8)

**What happened · what's saved (and that nothing was lost or charged, where true) · what to do next.** In that
order, in at most three short sentences, with the action as a button, not a sentence.

---

## 2. AI and item messages (M-01 to M-13, PRD §9.3e)

| ID | Trigger | Type | Wording | Actions | Screen reader / notes |
|---|---|---|---|---|---|
| **M-01** | Drafting running (N-07) | Progress | **Title:** Drafting {n} listing(s) · **Body:** For {m} marketplace(s). This takes a few seconds. You can cancel. Your answers are kept. · **Trial line:** These use your free listings. A listing only counts once it's drafted. | Cancel | Announced once on start: "Drafting {n} listings." Progress bar labelled "Drafting listings". Shown within 1 s (R-7) |
| **M-02** | Speech not understood, or ambiguous (N-05) | Clarification | **Not understood:** Didn't catch that. Nothing was filled in. Try again somewhere quieter, or type the answers. · **Ambiguous:** Did you say {value A} or {value B}? | Try again · Type the answers · (ambiguous) {A} · {B} · Type it | role=alert. The ambiguous form names the field: "Size: did you say M or L?" |
| **M-03** | Drafting failed (N-09) | Failure | **Title:** Couldn't draft these listings · **Body:** Drafting stopped before it finished. Your photos and answers are saved, and none of your free listings were used. Try again in a moment. | Try again · Back to the answers | role=alert. "Free listings" sentence only on the trial; on a plan: "…and nothing counted toward your plan." |
| **M-04** | Some items failed (N-09) | Partial success | **Banner:** {k} of {n} items drafted. · **Body:** {Item names} are ready. Item {x}, {name}, didn't draft. Its photos and answers are saved, and it used none of your free listings. · **On the failed item:** Couldn't draft this item. Its photos and answers are saved. | Try this item again | Banner is role=status (not blocking); the failed item's notice is role=alert when selected |
| **M-05** | Grouping proposed (N-03) | Validation warning | Grouped automatically from your photos. Check that each item's photos belong together before you continue. · **Header:** {n} items found in {p} photos | Move a photo · Split · Merge with item {x} · Looks right — add details | Announced: "{n} items found." The note stays visible; it's the explainability label (§9.3) |
| **M-06** | Limit or AI cap reached (N-06) | Failure | **Plan limit — title:** You've reached this month's limit · **Body:** Listly can draft {limit} listings a month on the Reseller plan. Everything you entered is saved, and your drafted listings can still be copied. Drafting starts again on {date}. · **AI cap:** Listly can't draft more this month. Everything you entered is saved, and your drafted listings can still be copied. Drafting starts again on {date}. · **Pass limit:** You've used all 100 listings on your Clear-out Pass. Your items are saved. Pick a plan to draft more. | Back to my haul · (Pass) See plans | role=alert. The reset date comes from the server; never "soon". Final limits `[TBD — after the AI cost test]` |
| **M-07** | A stated flaw stays in (N-07), or the seller's edit drops one | Validation warning | **Tag:** Flaw left out · **Body:** You said "{flaw}". Buyers can return items when a flaw isn't mentioned. Keep it, or change how it's worded. · **When a request asked to hide it:** Listly keeps every flaw you mention in the listing. You can change how it's worded. | Keep it (back to editing) · Save anyway (PQ-05) | role=status. Never "remove" or "hide" as an offered action |
| **M-08** | Drafts shown (N-08) | Final summary | **Title:** Ready to post · **Toast on arrival:** {n} listings ready to post for {m} marketplaces. · **Trial counter alongside:** see C-16 | — | Announced: "{n} listings ready to post." (R-24 "drafting done") |
| **M-09** | Photo edit would change the item (P-05, P1) | Validation warning | That edit would change the item itself, so it wasn't made. Your photo is unchanged. You can change the background only. | Change the background · Cancel | role=alert. P1 (R-38) |
| **M-10** | Grouping failed (N-02, N-09) | Failure | **Title:** Couldn't group your photos. · **Body:** All {p} photos are saved. Try again, or continue with them as one item and split it yourself. · **Retry fails again (toast):** Still couldn't group them. Your photos are saved. | Try again · Continue as one item | role=alert. After "Continue as one item": "All {p} photos are in one item. Use Split to separate them." |
| **M-11** | Photo-edit allowance used (P-05, P1) | Failure | You've used this month's photo edits. Your photo is unchanged. Edits start again on {date}.{ Upgrade line if any } | OK · (Pass) See the Reseller plan | P1 (R-38) |
| **M-12** | Changing back an eBay-recorded sale (R-42) | Confirmation | **Title:** eBay recorded this sale · **Body:** Only change it back if the sale was cancelled or the item was returned. Listly doesn't change anything on eBay. · **Small:** This is logged in the item's history as a change you made, and marked in your export. | It was cancelled or returned · Keep it sold | Bottom sheet, focus starts on the title. Default focus is never the confirm button |
| **M-13** | Item changed back to listed (R-42) | Clarification | **Title:** {Item} is listed again · **Body (removed somewhere):** You removed it from {marketplaces}. Relist it there? · **Body (nowhere live):** It isn't live anywhere yet. Copy the listing to post it again. · **Small:** It shows as live on a marketplace once you mark it listed there again. | Per marketplace: Open the old listing (link saved) · Copy the listing (no link) · Done | Status after Done (C-40) |

---

## 3. Everything else (C-01 to C-57)

### Onboarding (R-33, S-01 to S-03)

| ID | Where | Wording |
|---|---|---|
| **C-01** | Welcome | **Title:** List a whole haul from your phone. · **Body:** Sell it on eBay, Poshmark, Mercari, Depop and Facebook Marketplace. Always know what's sold, where it is and what you made. · **Card:** Your first 3 listings are free. No card needed. Photograph a few items and see the listings before you decide. · **Actions:** Get started · I already have an account |
| **C-02** | Step indicator and marketplaces | **Indicator:** Step {n} of 4 (announced as "Step {n} of 4"). · **Title:** Where do you sell? · **Body:** Listly drafts a listing for each marketplace you pick. You can change this later in Profile. · **None picked:** Pick at least one marketplace, or skip to draft for all five. · **Actions:** Continue · Skip — draft for all five |
| **C-03** | Create an account | **Title:** Save your listings · **Body:** Create an account so your items, listings and sales are kept if you change phones. · **Small:** Still free: your first 3 listings need no card. · **Actions:** Continue with Apple · Continue with Google · Use email instead · **In progress:** Signing you in… · **Failed:** **Couldn't create your account.** Nothing was saved. Check your connection and try again. · **Cancelled at Apple or Google:** Sign-in was cancelled. Nothing was saved. · **Email invalid (inline):** Enter an email address like name@example.com. |
| **C-04** | Camera and microphone + AI notice | **Title:** Camera and microphone · **Body:** Listly uses the camera to photograph your haul, and the microphone so you can say each item's brand, size, measurements, flaws and condition. · **Card title:** How your photos and answers are used · • They're sent to an AI service to group photos and draft listings. • Location data is removed from photos first. • Listly only writes facts you give it. Nothing is posted for you. · **Link:** How your data is used · **Actions:** Allow and start my first haul · Not now — I'll use my photo library and type · **Legal:** notice wording to Legal before launch (§10) |
| **C-56** | Returning seller sign-in failed | **Couldn't sign you in.** Your items are safe. Check your connection and try again, or use a different sign-in method. |

### Haul (R-4 to R-7, S-05 to S-13)

| ID | Where | Wording |
|---|---|---|
| **C-05** | Camera denied (capture) | **Camera access is off.** Turn it on in Settings, or add photos from your library. · **Action:** Open Settings · **Toast after a denied prompt:** Camera and microphone are off. Add photos from your library and type the answers. |
| **C-06** | Microphone denied (facts) | **Microphone is off.** Type the answers, or turn the microphone on in Settings. · **Prompt line:** Type the brand, size, measurements, any flaws and the condition. |
| **C-07** | Photo limit per haul | You've reached {max} photos for this haul. Finish this one and start another for the rest. `[max: NFR TBD — eng lead]` |
| **C-08** | Close the haul | **Action:** Close — save for later · **Toast:** Saved. Continue this haul from Home. · **With no photos:** Haul closed. Nothing to save. |
| **C-09** | Discard an unfinished haul | **Title:** Discard this haul? · **Body:** This deletes its {p} photos and your answers from Listly. It can't be undone. · **Actions:** Discard haul · Keep it |
| **C-10** | Grouping edits (toasts) | Moved a photo to item {x}. · Split item {x} into two. · Merged items {x} and {y}. · **Move sheet:** Move a photo from item {x} · Moves its last photo. Pick where it goes. · To item {y} · Cancel |
| **C-11** | Facts screen | **Header:** Item {i} of {n} · **Prompt:** Say the brand, size, measurements, any flaws and the condition. · **Mic:** Tap to talk · Talk again · Try again · **Source line:** Heard: "{transcript}" · Typed by you · **Footer note:** Listly never fills these in on its own. Anything you don't give stays blank. · **Blank optional field:** Not given — left out of the listing · **Waiting:** Answer for this item to continue. · Answer the flaws and condition to continue. · **Cancel drafting (announcement):** Drafting cancelled. Your answers are saved. |
| **C-12** | Missing flaws, asked once (S-11) | **Any flaws?** Buyers return items when a flaw wasn't mentioned. Say or type them, or tell Listly there are none. · **Actions:** No flaws · Type the flaws |
| **C-13** | Missing condition, asked once (DD-04) | **What condition is it in?** Pick the closest. Listly uses each marketplace's own wording. · **Choices:** New with tags · Like new · Good used · Fair · Poor `[H — mapping per marketplace, eng lead]` |
| **C-14** | Bin field (DD-05) | **Label:** Bin (optional) · **Helper:** Only for you, to find the item when it sells. Never in a listing. · **Suggestions label (screen reader):** Bins you've used |
| **C-15** | Item past the free 3, during facts (D-1) | **Tag:** Locked after drafting · **Body:** Your 3 free listings cover items 1–3. This item will be saved, ready to draft when you pick a plan. · **Final button on the trial:** Draft my {k} free listings |
| **C-57** | Department and size (DD-30) | **Label:** Men's, women's or unisex · **Choices:** Men's · Women's · Unisex · **When not said:** Not said. Pick one, or leave it out of the listing. · **Size label:** Size · **Empty option:** Not given (clothing) · No size (not clothing) · **Other option:** Other… · **Other field placeholder:** Type the size on the tag |
| **C-54** | Upload interrupted (G-08) | **Upload paused.** Your photos are on this phone and will finish uploading when you're back online. |

### Copy listings, photos and listing records (R-8, R-9, R-12, R-41, S-15 to S-17, S-57)

| ID | Where | Wording |
|---|---|---|
| **C-16** | Trial counter (R-1) | **Visible:** Free listings: {n} of 3 left · **Screen reader:** "{n} of your 3 free listings left." |
| **C-17** | Locked item (D-1) | **Tag:** Locked · **Title:** Ready to draft · **Body (trial):** Your 3 free listings are used. Pick a plan to draft this item{ and {k} other(s)}. Its photos and answers are saved. · **Action:** Draft this item · **Chip suffix:** · locked (screen reader: "{n}, {name}, locked") · **Finish-haul hint:** {k} item(s) still to draft. Finishing asks you to pick a plan for them. |
| **C-18** | Copy | **Action:** Copy (screen reader: "Copy {field}") · **Confirmation toast and announcement:** {Field} copied. · **If the clipboard fails** `[H]`: Couldn't copy. Press and hold the text to copy it instead. |
| **C-19** | Edit a drafted field (R-9) | **Action:** Edit · **Field label:** Edit {field} for {marketplace} · **Count:** {x} of {limit} characters · **Over:** {x} of {limit} characters — over the limit. The marketplace may cut it short. · **Saved toast:** {Field} saved for {marketplace}. Listly's draft is kept. · **Marker:** Edited · **Restore:** Restore Listly's draft · **Restored toast:** Listly's draft restored. Your edit is kept as an earlier version. · **Source line on unedited fields:** Drafted from your answers |
| **C-20** | A field the seller didn't give (G-16) | Not given — left out of this listing · **Size on clothing, blank:** See measurements |
| **C-21** | Price (G-17, R-11) | **Label:** Your price · **Placeholder:** Add your price · **Estimate (P1, always together):** Estimate from similar items: {range}. A guess, not based on sold prices. · **Copy disabled until a price is typed** |
| **C-22** | Save photos (R-41) | **Action:** Save {n} photos to my phone · **Done:** ✓ {n} photos saved to the "Listly – {item name}" album. · **Button after:** Photos saved · **Only new ones added:** ✓ {k} new photos saved. The other {j} were already on your phone. · **Limited or add-only access:** ✓ {n} photos saved to Recents. Listly can only add photos, so it couldn't make an album. · **Phone storage full:** Saved {k} of {n} photos. Your phone is out of space. Free some up, then tap Save again. The ones already saved won't be added twice. · **System prompt usage string (iOS):** So you can attach an item's photos when you post it. |
| **C-23** | Photo access denied | **Listly can't save to your photos.** Photo access is off. Turn it on in Settings to save these photos for posting. · **Action:** Open Settings |
| **C-24** | Open the marketplace and record the listing (R-12) | **Action:** Open {marketplace} · **Toast:** Opens the {marketplace} app. · **Link label:** Listing link (after you post) · **Placeholder:** Paste the link from {marketplace} · **Action:** Mark as listed on {marketplace} · **Done:** ✓ Listed on {marketplace} · **Link not for that marketplace** `[rule TBD — eng lead]`: That link doesn't look like a {marketplace} listing. Check it, or save it anyway. |

### Plans (R-1 to R-3, R-18 to R-20, S-18 to S-22)

| ID | Where | Wording |
|---|---|---|
| **C-25** | Paywall variants | **Finish haul with undrafted items:** Your 3 free listings are ready to post — Pick a plan to draft the other {k} items in this haul. They're saved and ready. · **Drafting item 4:** Your 3 free listings are used — Pick a plan to draft the other {k} items. They're saved and ready. · **Exactly 3 drafted (proposed, A-19):** Your 3 free listings are ready to post — Copy them whenever you like. To list more, pick a plan. · **Pass ended:** Your Clear-out Pass has ended — Your items and listings are kept. Pick a plan to draft new ones. · **Upgrade from the Pass:** The Reseller plan — Everything you have now, plus the item ledger and profit tracker. · **Reseller card:** For regular sellers · Reseller plan · Monthly / Yearly · $12.99 a month · $99 a year (About $8.25 a month) · Up to 500 listings a month · Sold-everywhere checklist · Profit tracker with CSV export · Every item, where it's listed and its bin · **Renewal:** Renews every month (year) until you cancel in your App Store settings. · Start Reseller plan · **Pass card:** Clear-out Pass · $6.99 once · 30 days, up to 100 listings · Copy for every marketplace · Mark sold and the sold-everywhere checklist · No subscription. It doesn't renew. · Get Clear-out Pass · **Footer:** Paid through the App Store (Google Play). Restore purchases · **Not now:** Not now — back to my haul (mid-haul) · Not now (elsewhere) · **Legal:** renewal wording to Legal (§10, S-19) |
| **C-26** | Purchase failed, restore | **Failed:** **The purchase didn't go through.** You haven't been charged. Try again, or check your payment details in the App Store (Google Play). · **Cancelled by the seller:** No toast; back to the plans. · **In progress:** Waiting for the App Store… · **Restore found nothing:** No purchases to restore for this App Store account. · **Restored:** Your {plan} is back. |
| **C-27** | Back in the haul after buying (R-32) | **Toast:** Reseller plan started. Draft your other {k} items. · Clear-out Pass active for 30 days. Draft your other {k} items. · **Locked card on a plan:** Your plan is active. Draft the other {k} items now. · **Action:** Draft {k} more items · **After Not now (toast):** Your {n} drafted listings stay ready to copy. The other {k} are saved. |
| **C-52** | Pass ended on Home (DD-27) | **Your Clear-out Pass has ended** · Your items and listings are kept. You can still copy listings, mark items sold and remove them everywhere else. To draft new items, pick a plan. · See plans |
| **C-55** | Upgrade suggestion (R-19, P1) | **Selling more?** The Reseller plan adds a ledger of every item and its bin, and profit after fees. · See the Reseller plan · **Dismiss:** Not now (shown once per pass) |

### Home (R-29, S-23, S-24)

| ID | Where | Wording |
|---|---|---|
| **C-28** | Home sections | **Needs action** — {Item} sold on {marketplace}. It's still live on {A} and {B}. · (traded) {Item} was traded. It's still live on {A}. · **Action:** Remove it now · **After Remind me:** Reminder set for 1 hour. · **Unfinished haul** — {p} photos of {n} items, not drafted yet. · Continue · Discard · **This month** — {n} active listings · {n} sold · {$} net profit (Reseller) · **This clear-out** — {n} listed · {n} sold · {$} made (Pass) · **Estimate marker:** Net profit (estimate) when any sale lacks cost or shipping · **Stale** — {n} item(s) listed 30+ days. Reprice or relist it. · **Plan line** — Reseller plan · renews {date} · {n} of 500 listings used this month · Clear-out Pass · {d} days left · **Trial used (proposed):** 0 of 3 free listings left. Your 3 listings are yours to copy and post. Pick a plan to list more. · See plans · **Action, always:** Start a haul |
| **C-29** | New user's Home (S-24) | **Start your first haul** · Photograph a few items, answer a few questions, and get listings for every marketplace you sell on. Your first 3 listings are free. · Start a haul · Watch how Listly works (2 min) |

### Sold, checklist, reminders and Undo (R-14, R-15, R-40, D-6, D-9, D-10)

| ID | Where | Wording |
|---|---|---|
| **C-30** | Reminder pre-prompt (DD-15) | **Get a reminder in 1 hour?** Listly can remind you to remove {item} from {A} and {B}. You'll be asked to allow notifications. · Allow reminders · Not now · **Not now toast:** No reminder set. It stays in Needs action on Home. · **Allowed toast:** Reminder set for 1 hour. It still shows as live. |
| **C-31** | Notifications denied or off | **Toast after denying:** Reminders are off, so no reminder will come. It stays in Needs action. · **Home line:** Reminders are off for Listly, so it stays here until you remove it. · **Remind me again while off:** Reminders are off for Listly. Turn them on in Settings to get one. · Open Settings |
| **C-32** | Reminder notification (S-29) | **Title:** {Item} is still live on {A} and {B} · **Body:** It sold on {marketplace}. Remove it before someone else buys it. · Never includes sale price or profit (lock-screen privacy, S-29 `[H]`) |
| **C-33** | Checklist (R-15) | **Banner title:** Still live on {A} and {B}. Remove it now. · **Body:** {Item} sold on {marketplace} for {$}. A buyer could still pay for it until you remove it. · (traded) You traded {item} for {received}. · **All done:** All done. You removed it everywhere. · **Bin line:** Bin {bin} · **Row tag:** Still live · You removed it · **Row action:** Open the {marketplace} listing · **No link saved:** No link saved. Open {marketplace} and search your listings for "{item}". · Open {marketplace} · **Tick:** I removed it on {marketplace} · **Footer:** Listly can't remove listings for you. It shows them as live until you confirm. · **Actions:** Done (disabled until all ticked) · Remind me in 1 hour · **Announcements:** each tick: "Marked removed from {marketplace}. {n} left. Undo is available." |
| **C-34** | Undo bar (DD-14) | Marked sold on {marketplace}. · Marked traded. · Marked removed from {marketplace}. · **Countdown:** · {n} s (visual only) · **Announced at 3 s:** Undo closes in 3 seconds. · **Actions:** Undo · Undo sale (after a tick) · Dismiss (✕, screen reader "Dismiss") · **After Undo (toast):** Undone. {Item} is listed again. · **After Undo of a tick:** Undone. {Marketplace} shows as still live. · **After Undo sale:** Undone. {Item} is listed again, and your ticks are cleared. |
| **C-35** | Mark sold (R-14, D-9) | **Title:** Mark as sold · **Bin tag:** Bin {bin} · **Where:** Where did it go? (marketplaces · Traded) · **Price label:** Sale price · **Shipping legend:** Shipping · Buyer paid · I paid · Free shipping (I paid) · **Amount label:** What you paid for shipping · **Skip:** Add shipping later · **Skipped flag:** Shipping not entered — Profit for this sale will be an estimate until you add it from the item. · **Action:** Mark sold · **Validation:** Enter the sale price in dollars, like 38.00. · Enter what you paid for shipping, or choose Buyer paid. · **Already sold elsewhere (PQ-22, proposed):** Already sold on {marketplace}. Change it from the item. |
| **C-36** | Sold confirmation | **Title:** Sold on {marketplace} · **Bin card:** Find it in · Bin {bin} · **Breakdown:** Sale price · {Marketplace} fees (estimate) · Shipping (Buyer paid · $0.00 / −{$} / Not entered) · What you paid (−{$} / Not entered) · **Net profit** / **Net profit (estimate)** · **Pass:** Money made · **Estimate line:** Shipping not entered, so this profit is an estimate. Add shipping · **Footer:** Removed from {A} and {B} — you confirmed each one. Fee rates are estimates; check them against your payout. · **Actions:** See profit · Back to listings |
| **C-37** | Mark traded (R-40, P1) | **Title:** Mark as traded · Where did you trade it? · What did you get? · What's it worth? (your estimate) · Add what I got to my items, with this value as its cost · **Note:** Listly records trades you make elsewhere. The value is your estimate and counts as the sale in your profit. · Mark traded · **Done:** Traded · Take it from · Bin {bin} · Trade value (your estimate) · Marketplace fees $0.00 · Net profit (estimate) · Added to your items — {received}, cost {$}. List it when you're ready. · Trades count as income for tax. Your export lists them as trades. Not tax advice. (Legal, §10) |

### Item detail (R-42, S-58, S-59)

| ID | Where | Wording |
|---|---|---|
| **C-38** | Item detail | **Status line:** Listed · {d} days · Sold on {marketplace} · Sold on {marketplace} · still live elsewhere · Sold on eBay · recorded by eBay · Traded · **Sections:** Where it's listed · Sale · Facts · Bin · What you paid · History · More · **Listing tags:** Live · Sold here · You removed it · No link saved · **Not listed yet:** Not listed anywhere yet. Copy the listings, post them, then mark each one as listed. · **Sale flags:** Not entered · Add shipping · Add what you paid · Profit for this sale is an estimate until {shipping / what you paid} {is/are} added. · **Fact edit saved:** Saved. Earlier versions are kept in the history. Your drafts weren't changed. · Update the drafts (PQ-13) · **Shipping saved toast:** Shipping added. Profit updated. · **Cost saved toast:** Cost saved. Profit updated. · **Validation:** Enter what you paid. $0 is fine. · **Footer actions:** Copy listings · Mark sold · Remove it everywhere else (sold, still live) · **More:** Mark traded · Change back to listed · Delete item · **History entries:** {date} · Drafted for {marketplaces} · Listed on {marketplace} · Marked sold on {marketplace} · You removed it on {marketplace} · Edited {field} · Added shipping · Added what you paid · Changed back to listed (a change you made) |
| **C-39** | Delete item (DD-23) | **Title:** Delete {item}? · **Body:** This deletes the item, its listings record, sales and photos from Listly. It can't be undone. · • Your listings on the marketplaces aren't changed. Remove them there if they're still live. • Photos you saved to your phone stay there. • (trial) It doesn't give back a free listing. · **Actions:** Delete {item} · Keep it · **Toast:** {Item} deleted. |
| **C-40** | Changed back to listed | **Status:** Changed back to listed. Logged as a change you made. · **History:** Changed back to listed (a change you made) · Changed back to listed after eBay recorded a sale (a change you made) |

### Listings and ledger (R-13, R-30, S-25, S-26)

| ID | Where | Wording |
|---|---|---|
| **C-41** | Listings | **View:** By listing · By item · **Filters:** All {n} · {Marketplace} {n} · Active · Stale (30+ days) · Sold, still live {n} · Sort: days listed / price · **Row:** {item} · {marketplace} · {$} · {d} days listed · Bin {bin} / No bin · Sold on {marketplace} — still live here · **Row actions:** Open listing · Mark sold · Remove it · **Empty:** Nothing live yet — When you post a listing and mark it as listed, it shows here with its marketplace and price. Start a haul · **No match:** No listings match — Nothing {on {marketplace}} matches this filter. Show all active listings · **Filter announcement:** "{n} listings shown." |
| **C-42** | Ledger (By item) | **Intro:** One row per item, with every marketplace it's on. · **Status tags:** Listed · Stale · Sold · Sold · still live · Traded · **Empty:** No items yet — Start a haul to add your first items. Start a haul |

### Profit (R-16, R-17, S-30 to S-32)

| ID | Where | Wording |
|---|---|---|
| **C-43** | Profit | **Total:** Net profit this month · Net profit this month (estimate) · {n} sold · {$} in sales · {d} days to sell on average · **No cost flag:** {n} sold item(s) have no cost. Their profit is an estimate that counts the cost as $0 until you add it. · Add costs `[H — S-31: PM to confirm $0 vs excluded]` · **No shipping flag:** {n} sale(s) have no shipping. Their profit is an estimate. Shipping isn't counted as $0 unless the buyer paid. · Add shipping · **Fee unknown:** Fee unknown for {marketplace} — profit leaves it out until the rate is added. · **Sections:** By marketplace · Recent sales · **Row tag:** Estimate · **Export:** Export CSV · **Footer:** Fees are worked out from each marketplace's published rates and are estimates. Check them against your payouts. The export is a record, not tax advice. (Legal, §10) · **Empty:** No sales yet — When you mark an item sold, Profit shows what you made after each marketplace's fees, shipping and what you paid. See your listings |
| **C-44** | Add costs (S-30) | **Title:** Add what you paid · **Progress:** {i} of {n} sold items with no cost · **Label:** What you paid · **Placeholder:** $0.00 · **Helper:** $0 is fine if it cost you nothing. Leave it blank to skip it for now. · **Actions:** Save and next / Save · Skip this item · **Done toast:** Costs saved. Profit updated. · **Nothing to add:** Every sold item has a cost. |

### Profile, marketplaces, data (R-23, R-31, R-34, R-35, S-33 to S-36)

| ID | Where | Wording |
|---|---|---|
| **C-45** | Profile | **Groups:** Account · Plan · Marketplaces · Selling defaults · Accessibility · Notifications · Privacy and data · Help · **Plan (trial):** Free trial · {n} of 3 free listings left · See plans · **Plan (Pass):** Clear-out Pass · {d} days left / Ended {date} · Listings used {n} of 100 · See the Reseller plan · **Plan (Reseller):** Reseller plan · monthly · $12.99 · Renews {date} · Listings this month {n} of 500 · Manage subscription · Restore purchases · **Defaults:** Shipping, usually: Buyer pays · I pay · Free shipping · Default bin — Filled in on each new item. You can change it there. · **Accessibility:** Keep Undo until I dismiss it — Undo normally closes after 10 seconds. It pauses while you're touching it. · **Toasts:** Undo stays until you dismiss it. · Undo closes after 10 seconds. · **Notifications:** Remind me about sold items still live elsewhere · **Off in Settings:** Off in your phone's Settings — Listly can't send reminders about sold items until you turn notifications on. Open Settings · **Privacy:** Photos and spoken answers are processed by an AI service to draft listings. Location data is removed first. Bins, costs and sales are never sent to it. · **Help:** How-to video and steps · Show tips again · Contact us and send feedback · Listly {version} · **Sign out:** Sign out |
| **C-46** | Marketplaces and connections | **Intro:** Pick where you sell, and link your shops so Listly can open your listings. · **Notice:** Poshmark, Mercari, Depop and Facebook Marketplace don't let apps post or remove listings, so you'll still paste listings in and remove them yourself. Listly never asks for your marketplace passwords. · **Switch:** Draft listings for {marketplace} · **Status:** Linked · Not linked · Connected · Not connected · **Link:** Link your shop so Listly can open your listings there. · Your {marketplace} username or shop link (e.g. yourshop) · Save · Cancel · **Linked:** Linked as @{username}. Listly opens your listings there. · Unlink · **Toasts:** {Marketplace} shop linked. · {Marketplace} unlinked. · **Last switch off:** Keep at least one marketplace on, so Listly knows what to draft. |
| **C-47** | eBay (R-35, P1) | **Before:** Connect to have your eBay sales show up in Listly on their own. · Connect with eBay · **Screen:** Connect your eBay account — You'll sign in on eBay's own page. Listly never sees or stores your eBay password. · Listly will be able to: See your eBay orders, so sales show up on their own · See whether each listing is still live · Listly won't: Post, change or end listings · See your payment or bank details · You can disconnect at any time in Profile. · Continue to eBay · Cancel · **Failed:** **The eBay connection didn't finish.** Nothing was changed. Try again, or keep using copy and paste. · **Connected:** Signed in as {username}. Sales on eBay show in Listly automatically. Listly can't post or end eBay listings. · Disconnect eBay · **Disconnected toast:** eBay disconnected. Mark eBay sales by hand again. · **Before S-54 ships (proposed, PQ-20):** Coming soon: connect eBay so your eBay sales show up on their own. |
| **C-48** | Export all data (S-35) | **Action:** Export all my data · **Started:** We're preparing your export. We'll email you a download link when it's ready. · **Failed:** Your export didn't finish. Nothing was shared. Try again. `[delivery method TBD — eng lead]` |
| **C-49** | Delete account (S-36) | **Title:** Delete your account? · **Body:** This deletes your items, listings, sales and photos from Listly. It can't be undone. · Your listings on the marketplaces aren't affected, and photos you saved to your phone stay there. · (Reseller) Deleting doesn't cancel your subscription. Cancel it in the App Store first. · (Pass) Your Clear-out Pass ends now. · Export my data first · **Actions:** Delete my account · Keep my account · **Done toast:** Your account and data were deleted. · **Failed:** Your account wasn't fully deleted. Listly will keep trying, and you can't sign in to it meanwhile. `[rule TBD — eng lead, S-36]` · **Legal:** to Legal (§10) |

### Help (R-36, R-37, S-37, S-38)

| ID | Where | Wording |
|---|---|---|
| **C-50** | First-run tips (R-36, PQ-19) | **Frame:** Tip {n} of {N} · Next · Got it (last) · Skip tips · **Home 1 (Needs action):** When something sells, it shows here until you've removed it from your other marketplaces. · **Home 2 (Start a haul):** Start a haul to photograph a batch of items in one go. · **Home 3 (Listings tab):** Listings shows everything that's live, on every marketplace. · **Copy 1 (Copy):** Tap Copy on each field, then paste it into the marketplace app. · **Copy 2 (Save photos):** Save the photos to your phone so you can add them when you post. · **Copy 3 (Open):** Open the marketplace app from here. Paste the listing link back when it's live. · **Listings 1 (filters):** Filter by marketplace to see what's live where. Tap a row to open the item. · **Skip toast:** Tips off. Turn them back on in Profile → Help. · **Reset toast:** Tips will show again the next time you open each screen. |
| **C-51** | How-to (R-37) | **Home card:** New to Listly? · Watch a 2-minute how-to, or read the steps. · Watch the video · Read the steps · Dismiss (✕) · **Dismissed toast:** Find the how-to any time in Profile → Help. · **Screen:** How to use Listly · How-to video · 2:00 · captions · Read the transcript · Step by step: 1. Photograph a haul · 2. Answer by voice · 3. Copy to your marketplaces · 4. When something sells · 5. See what you made · You can find this any time in Profile → Help. · **Offline:** The video needs a connection. The steps below work offline. |

### Cross-cutting

| ID | Where | Wording |
|---|---|---|
| **C-53** | Can't reach Listly (G-08) | **Load failed:** Couldn't load your {listings / profit}. Showing what was saved at {time}. · Try again · **Save failed:** Couldn't save that. Your change is still here. Try again when you're back online. · **AI step offline:** Listly needs a connection to {group your photos / draft listings}. Your photos and answers are saved on this phone. |

---

## 4. Voice checklist (voice-and-tone §11, applied to Listly)

| Check | Result |
|---|---|
| Uses the product's own terms (item, listing, haul, bin, still live, free listings, Reseller plan, Clear-out Pass) | Pass, by review |
| No first-person "I" from Listly | Pass. "I" appears only as the seller's own words where the PRD uses them ("I removed it", "I paid", "I already have an account") |
| Outcome or answer first | Pass |
| Concise and scannable; bullets where they help | Pass |
| Uncertainty stated where it affects a decision (estimates, fees, grouping) | Pass: M-05, C-21, C-36, C-43 |
| Actions observable and controllable | Pass: every AI step has Cancel, edit or restore (R-7, R-9) |
| Irreversible actions confirmed | Pass: C-39, C-49, M-12; C-09 for discard |
| Every failure says what happened, what's saved, and how to recover | Pass: M-03, M-04, M-06, M-10, M-11, C-03, C-23, C-26, C-47, C-48, C-49, C-53, C-54 |
| Honesty rules 1–6 (§1) | Pass, by review. Re-check whenever drafts or the estimate change |

**Needs Legal before launch:** C-04 (AI notice), C-25 (auto-renewal disclosure), C-37 (trade tax line), C-43
(export footer), C-49 (deletion). **Needs eng lead:** the values in braces that come from the server (limits,
reset dates, fee table), and C-24's link rule.

**Handoff:** this deck is source material for the help-centre steps and any user guide (`content-lead`); it
isn't the guide.
