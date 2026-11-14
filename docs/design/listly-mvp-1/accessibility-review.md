---
type: design
product: go-commerce-listly
feature: listly-mvp-1
status: draft
author: ux-lead (accessibility-review)
created: 2026-11-14
updated: 2026-11-14
source:
  - docs/prd/listly-mvp-1.md (R-24; R-36 tip rules; R-37 captions)
  - docs/stories/listly-mvp-1-stories.md (A11Y-BASE; S-43; per-story announcements; A-20)
  - docs/design/listly-mvp-1/initial-prototype.html (v3)
  - listly/packages/go-mobile-design-system (themes, tokens, contracts)
---

# Listly MVP 1 — accessibility review

**What this is:** design-stage guidance against **R-24** and the stories' **A11Y-BASE**, mapped to WCAG 2.2 AA,
with what was measured on the v3 prototype. **What it isn't:** a compliance certification. The prototype is an
HTML stand-in for a React Native app, so VoiceOver, TalkBack, Dynamic Type and platform focus behaviour **must be
tested on devices** in the Expo build (S-43's "accessibility pass of every Phase 1 screen on both platforms
before beta"). A check with no recorded run is marked **NOT RUN**, never Pass.

## 1. The baseline (R-24, A11Y-BASE)

| Requirement | Design response | Status |
|---|---|---|
| Every control has a VoiceOver/TalkBack label and role | Every control in the prototype has visible text or an `aria-label` (icon buttons: "Take photo", "Dismiss", "New haul"; Copy and Edit name their field). Chips that act as single choice are `role=radio` with `aria-checked`; tabs are `role=tab`; switches `role=switch`. **Measured:** 0 unlabelled buttons or fields across 66 states | Designed. On-device: **NOT RUN** |
| Text supports Dynamic Type to the largest size without truncating values or overlapping controls | Layout is single-column, wraps, and has no fixed heights on text containers; footers stack. Money figures and tags wrap rather than truncate. Risks listed in §3 (F-05) | Designed. On-device at AX5: **NOT RUN** |
| Touch targets ≥ 44 × 44 pt | GO `size.4` (44) is the minimum on every control. **Measured, before:** v2 chips and small buttons were 32 pt (236 instances). **Fixed in v3:** chips, small buttons and text buttons have min 44 × 44. **Measured, after:** 0 controls under 44 × 44 across 66 states | Pass in the prototype (measured 2026-11-14). On-device: **NOT RUN** |
| Status changes are announced | A single polite live region plus `role=alert` for blocking failures. The announcement list is §4 | Designed. On-device: **NOT RUN** |

## 2. WCAG 2.2 AA review

| WCAG | Area | Finding | Result |
|---|---|---|---|
| 1.1.1 Non-text content | Photos, thumbnails | Thumbnails are decorative inside a labelled item (`aria-hidden`); the item detail photo strip labels each photo ("Photo 1, original"). In the app, item photos need a label naming the item and photo number, not the AI's description of it (a description could assert facts the seller didn't give, R-10) | Designed |
| 1.3.1 Info and relationships | Forms, groups | Visible labels on every field; required fields say "(required)" in the label; shipping is a `fieldset` with a `legend`; settings groups and item-detail sections have headings (S-33, S-58) | Designed |
| 1.3.2 Meaningful sequence | Home, item detail | Home's Needs action is first in reading order when present (S-23), including in the "This month first" variant, where it's first **after** the variant tag. **F-07** | Designed; see F-07 |
| 1.4.1 Use of colour | Status everywhere | GO has no status colours, so status is always text: "Still live", "You removed it", "Locked", "Not entered", "Estimate", "Stale" (DD-28, S-43 "Must not") | Pass by design |
| 1.4.3 Contrast (minimum) | Text | **Measured** with GO's hex values (WCAG formula). `color` on `background` 14.56:1, on `surface` 13.56:1. `actionColor` on `actionBackground` 6.88:1 (pressed 9.19:1). **`borderColor` used as helper text: 4.44:1 on background and 4.13:1 on surface — fails 4.5:1 for small text (F-01).** Dark theme: `color` 17.61:1 / 13.87:1; `actionColor` on action 9.55:1; `borderColor` 6.27:1 / 4.94:1 (passes) | v2 failed; **fixed in v3** (helper text uses `color`). Proposed GO role in readiness |
| 1.4.4 / 1.4.10 Resize and reflow | All screens | **Measured:** no horizontal overflow on any of 66 states at 375 pt width. Large-text reflow on device: **NOT RUN** | Partly measured |
| 1.4.11 Non-text contrast | Field borders, chips, focus | `borderColor` on background 4.44:1 and on surface 4.13:1 (≥ 3:1). Focus ring uses `actionBackground`: 6.75:1 on background | Pass (measured) |
| 1.4.13 Content on hover or focus | Tips | Tips are dismissible (Skip tips, Escape, tap outside), persistent until dismissed, and don't move on hover (R-36) | Designed |
| 2.1.1 Keyboard / switch access | Everything | Every action is a native button or form control. Moving a photo has a non-drag path ("Move a photo" → "To item n", S-08). No gesture-only actions; swipe actions on rows (if added from the HIG) must have a visible equivalent | Designed |
| 2.2.1 Timing adjustable | **Undo (A-20)** | The PM chose a 10-second timer (2026-11-14). A fixed limit with no adjustment would fail 2.2.1, so the design (DD-14) meets it three ways: **turn off** (Profile → Accessibility → Keep Undo until I dismiss it); the countdown **pauses** while the bar has focus or is touched; and a warning is announced at 3 seconds. Item detail's "Change back to listed" stays the recovery after it closes. Engineering should also pause it while VoiceOver or TalkBack is running `[H]`. **Measured in the prototype:** counts 10 → 0, pauses on focus, closes at 0, and the setting removes the timer | Designed; on-device: **NOT RUN** |
| 2.2.1 | Toasts | Toasts confirm only (copied, saved) and duplicate their text into the live region; no action is ever only in a toast. The 2.6 s toast isn't a time limit on an action | Pass by design |
| 2.4.3 Focus order | Sheets, prompts, edits | Opening a sheet moves focus into it (first control or title); closing returns focus to the control that opened it **[H — implement]**. Editing a field focuses the edit input. Ticking "I removed it" keeps focus on that checkbox after re-render | Designed; F-03 |
| 2.4.6 Headings and labels | All | One screen title per screen (h2), section h3s; labels name the marketplace when they repeat ("Open the Poshmark listing", "I removed it on eBay") | Designed |
| 2.4.11 Focus not obscured (2.2) | Footer, Undo bar, tips | The fixed footer and Undo bar can cover a focused field near the bottom. The app must scroll the focused control above the footer **[H — eng]**. Tips can cover nearby controls (F-02) | Risk; F-02, F-04 |
| 2.5.3 Label in name | Buttons | Accessible names start with the visible text ("Copy" → "Copy title") | Pass by design |
| 2.5.7 Dragging movements (2.2) | Grouping | Move, Split and Merge are buttons, not drags | Pass by design |
| 2.5.8 Target size (2.2) | All | 44 × 44 minimum (R-24 is stricter than AA's 24) | Pass (measured) |
| 3.2.2 On input | Filters, shipping | Changing a filter or shipping option updates the screen in place and announces the result count; it never navigates | Designed |
| 3.3.1 / 3.3.3 Error identification and suggestion | Forms | Errors name the field and the fix ("Enter the sale price in dollars, like 38.00."; C-35) and sit next to the field. Required-slot prompts name the missing fact (C-12, C-13) | Designed |
| 3.3.4 Error prevention (legal, financial, data) | Delete, purchase, revert | Delete item and delete account confirm, and say it can't be undone (C-39, C-49). Purchases go through the store's own confirmation. Changing an eBay sale back confirms (M-12) | Designed |
| 3.3.7 Redundant entry (2.2) | Facts, Mark sold | Default bin and shipping preselect; bins used before are offered; a spoken "men's medium" fills department and size once | Designed |
| 3.3.8 Accessible authentication (2.2) | Sign-in | Apple and Google sign-in; email path `[rule TBD — eng lead]` must support paste and password managers, or use a magic link | Open (S-02) |
| 4.1.3 Status messages | All | See §4 | Designed |

## 3. Findings

| ID | Severity | Finding | Fix | Status |
|---|---|---|---|---|
| F-01 | High | Helper text in GO `borderColor` fails 4.5:1 for small text (4.44 on background, 4.13 on cards) | v3 uses `color` for helper text. **Propose a GO role `colorMuted`** (light #5A7269: 5.09:1 on background, 4.74:1 on surface; dark #79958A: 6.27:1 / 4.94:1). The design-system owner sets the final value | Fixed in prototype; GO proposal open (PQ-17) |
| F-02 | Medium | A first-run tip overlays nearby content, for example the Description row on Copy listings, while pointing at Copy. R-36 forbids covering the target (met), but the tip still hides other controls | Place tips in the gap above or below the target, using a smaller width; never over another control; the screen behind stays scrollable and usable | Open (implementation) |
| F-03 | Medium | Focus after re-render: the prototype re-renders whole screens, so focus can return to the top after a tap | In the app, keep focus on the control acted on, or move it to the new state's heading or message on navigation. Undo moves focus to the restored item or row | Open (implementation) |
| F-04 | Medium | The fixed footer and Undo bar can obscure a focused field at large text sizes (2.4.11) | Scroll the focused control into the visible area above the footer; at the largest text sizes the footer becomes part of the scroll | Open (implementation) |
| F-05 | Medium | At the largest Dynamic Type sizes, the copy row (value + Copy + Edit) and the tab bar's five labels will wrap or crowd | Copy and Edit stack below the value at large sizes; the tab bar shows icons with labels and lets labels wrap to two lines rather than truncate. Tab icons are a gap (no icon set in GO) | Open; NOT RUN on device |
| F-06 | Low | The 12 px small text (not a GO size) is used for helper text and tags | Add a GO `size.0` (12/16), which scales with Dynamic Type like the rest | Gap (type scale) |
| F-07 | Low | In the "This month first" test variant (Q-09), Needs action isn't the first thing reached | If the variant wins the test, Needs action must still be announced on Home load as an alert when an item is live elsewhere | Open (depends on the test) |
| F-08 | Low | The system permission prompt mocks are drawn by the prototype | In the app they're the OS's own dialogs; only Listly's pre-prompt (C-30) and denied states (C-05, C-06, C-23, C-31) are Listly UI | Note |
| F-09 | Medium | The how-to video (R-37) needs captions on by default, a transcript, labelled controls, and no autoplay | Designed (C-51). Caption accuracy and audio description of on-screen steps: `[TBD — video owner, Q-05]` | Open |
| F-10 | Low | Reduced motion: the drafting progress bar and the guide pulse animate | Both respect `prefers-reduced-motion` in the prototype; the app must respect iOS Reduce Motion and Android "Remove animations" for the progress fill, sheets and the Undo bar's entrance | Designed |

## 4. Announcements (4.1.3, R-24 "status changes are announced")

| Event | Announcement | Politeness | Story |
|---|---|---|---|
| Onboarding step | "Step {n} of 4" | Read with the screen | S-01 |
| Photo taken | "{n} photos" | Polite | S-05 |
| Grouping done | "{n} items found" | Polite | S-07 |
| Field filled from speech | "Heard: …", then each filled field | Polite | S-09 |
| Missing slot asked | "Any flaws?" / "What condition is it in?" | Alert | S-11 |
| Drafting started / done | "Drafting {n} listings." / "{n} listings ready to post." | Polite | S-12, R-24 |
| Drafting failed / partly | M-03 / M-04 | Alert / polite | S-13 |
| Copied | "{Field} copied." | Polite | S-15, R-24 |
| Photos saved / denied | C-22 / C-23 | Polite | S-57 |
| Trial counter | "{n} of your 3 free listings left" | Read with the element | S-18 |
| Locked item | "{n}, {name}, locked" | Read with the element | S-18 |
| Marked sold / traded | "Marked sold on {marketplace}. Undo is available." | Polite | S-27, S-59 |
| Checklist banner | Banner text | Alert | S-28 |
| Each tick | "Marked removed from {marketplace}. {n} left. Undo is available." | Polite | S-28 |
| Undo used | "Undone. {item} is listed again." | Polite | S-59 |
| Filter changed | "{n} listings shown." | Polite | S-25 |
| Limit reached | M-06 | Alert | S-22 |
| Tip shown | "Tip {n} of {N}: {text}" | Polite | S-37 |

## 5. What must be tested on devices (S-43)

1. VoiceOver (iOS) and TalkBack (Android) through Flow 1 (first haul to paid) and Flow 2 (sold, with Undo), with
   the screen off. That includes reaching the Undo bar and using Undo sale after a tick.
2. Dynamic Type at the largest accessibility size on Copy listings, Mark sold, item detail and the tab bar.
3. Switch Control or keyboard on the grouping step (Move a photo without dragging).
4. Reduce Motion on drafting and sheets.
5. Contrast of the final themes (light and dark) with GO's real values, once any new roles (colorMuted, danger,
   caution) are added.
6. The how-to video's captions and transcript.

Record each run with the tool, scope, date and evidence; until then each stays **NOT RUN**.
