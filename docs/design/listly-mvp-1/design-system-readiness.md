---
type: design
product: go-commerce-listly
feature: listly-mvp-1
status: draft
author: ux-lead (design-system)
created: 2026-11-14
updated: 2026-11-14
source:
  - listly/packages/go-mobile-design-system 0.1.0 (contracts/components.json, src/tokens, src/themes, src/components/GoCard.tsx)
  - docs/design/listly-mvp-1/initial-prototype.html (v3)
  - docs/design/listly-mvp-1/ux-listly-mvp-1-design.md (§9b composition, DD-29)
  - docs/stories/listly-mvp-1-stories.md (S-44)
---

# Listly MVP 1 — design-system readiness

**System of record:** the GO Mobile Design System, `@go-commerce/mobile-design-system` 0.1.0 (not ZDS). It
provides tokens (space, radius, size, z-index, one body font), light and dark themes with 7 colour roles, and
two components, **GoButton** and **GoCard**, with contracts for coding agents.

> **Self-review warning.** The same agent session composed this design and wrote this check. Checking your own
> work in the same context is the weakness the separate completeness check exists to avoid. **Run this check
> again in a fresh session** (or have a designer or the design-system owner run it) before S-44 is groomed.

## Verdict: **FAIL** — expected at this stage

| Result | Count |
|---|---|
| Pass | 8 (one with notes) |
| Fail | 5 |
| Not checked | 3 |

The failures aren't one-off styling. They're the gaps S-44 exists to close: GO has 2 components and the
design needs about 19 component families, a few type sizes, and 3 colour roles. Everything the prototype draws
outside GO is **declared and labelled as a gap**, styled from GO tokens. Nothing is a silent one-off.

## Rules

| ID | Rule | Source | Result | Evidence | Fix |
|---|---|---|---|---|---|
| DS-01 | Colours come only from GO theme roles | GO `src/themes`, S-44 | **Pass** | Scan of the prototype's feature CSS and JS (2026-11-14): 0 hex values outside the `--go-*` token block; every colour is a `var(--go-*)` | — |
| DS-02 | No transparency or shadow values outside the system | GO themes (no overlay, elevation roles) | **Fail** | 2 instances: the sheet scrim (`color` at opacity .45) and the tip's shadow `rgba(0,0,0,.25)`, carried over from v2 | Add GO `overlay` (scrim) and `elevation.1` tokens (gap T-4, T-5) |
| DS-03 | Spacing uses GO `space` | GO `metrics.space` | **Pass with notes** | Layout spacing uses `space.1–5`. Raw px values remain for **component dimensions** (shutter 72, mic 88, viewfinder 300, video 190, thumbnail 44, photo 72, borders 1–3, tag padding 6, grab handle 36×4) | Each belongs in its gap component's spec below, not in the token scale |
| DS-04 | Type sizes come from GO `body.size` (14, 16, 20) | GO `fonts.body` | **Fail** | 12 px (helper text, tags), 24 px (welcome title), 28 px (money figures), 48 px (lock-screen clock, platform mock only) are outside the scale. Each is commented `GAP` | Add `size.0` 12/16 and a display size 28/34 (gap T-2, T-3). The 48 px clock is platform UI and needs nothing |
| DS-05 | Only GO components, or declared gaps | S-44 "Must not: one-offs" | **Pass** | Every non-GO part carries `data-mf="Gap / {Name}"` (Component labels); platform parts carry `System /` | — |
| DS-06 | GoButton follows its contract: label, onPress, disabled; states default, pressed, disabled; role button; 44 min | `contracts/components.json` | **Pass** | All GoButtons have a visible verb label and use only those states; 0 below 44 × 44 (measured) | — |
| DS-07 | GoButton's visual spec matches `GoButton.tsx` | `src/components/GoButton.tsx` | **Not checked** | The source file was cloud-only (iCloud evicted it) and couldn't be read this session. The prototype's GoButton follows the theme roles (`actionBackground`, `actionPressed`, `actionColor`) and `size.4` | Re-check against the file when it's back on disk |
| DS-08 | GoCard matches `GoCard.tsx`: `$surface`, 1 px `$borderColor`, radius `$3`, padding `$4`, gap `$3` | `src/components/GoCard.tsx` | **Pass** (after fix) | v2 drew GoCard with no border and an 8 pt gap. **Fixed in v3** to the source values | — |
| DS-09 | GoCard is used to group content, with a labelled control inside when it needs an action | GoCard contract | **Fail** | Two cards are themselves pressable (Home's This month tile; v2 carried this too). The contract has no pressable card | Add a `GoCard pressable` variant with role button and a visible affordance (C-1 below), or put a labelled "See profit" control inside the card |
| DS-10 | One primary (GoButton) action per screen | §9b VC-1 (design rule, not a GO rule) | **Fail** | The paywall has two GoButtons (one per plan card), plus Try again when a purchase fails; the Mark sold and item-detail footers pair a GoButton with a secondary | Accept on the paywall (two equal plan choices), or make the Pass card's button secondary; **decision for design-system owner + PM** |
| DS-11 | Minimum touch target 44 × 44 | GO `size.4`, R-24 | **Pass** | Measured across 66 states after the v3 fix: 0 controls under 44 × 44 (v2 had 236 at 32 pt) | — |
| DS-12 | No status by colour alone | S-43, DD-28 | **Pass** | Status is always words; GO has no status colours | — |
| DS-13 | Text contrast ≥ 4.5:1 with GO roles | WCAG 1.4.3, R-24 | **Pass** (after fix) | Helper text moved from `borderColor` (4.44:1 / 4.13:1, fail) to `color` (14.56:1 / 13.56:1). See accessibility review F-01 | Add `colorMuted` (T-1) so helper text can be quieter and still pass |
| DS-14 | Light and dark themes both work | GO themes | **Not checked** | The prototype shows light only (PQ-16). GO's dark values pass contrast on paper (accessibility review §2) | Check the composed screens in dark mode once components exist |
| DS-15 | Every gap component has a contract before it's built | GO `contracts/components.json`, S-44 | **Fail** | None of the gaps has a contract yet; specs below are proposals | Write a contract per family as part of S-44 |
| DS-16 | Components behave per platform (HIG on iOS, Material on Android) | DD-29 | **Not checked** | Can't be checked in an HTML prototype | Check in the Expo build |

## Gap list — proposed specs

Consolidated into **19 component families** (the PRD expected about 15) plus **5 token gaps**. **Built on**
says what each can wrap (DD-29: Tamagui primitives styled with GO tokens, or a native control); every Tamagui
name is `[H — verify against tamagui 3.3.2]`. Priority **P0** means a Phase 1 screen can't ship without it.

### Components

| ID | Family (prototype labels) | Proposed spec | States | Accessibility | Built on | Used on | P |
|---|---|---|---|---|---|---|---|
| C-1 | **GoButton variants** (SecondaryButton, TextButton, DestructiveButton) + **GoCard pressable** | Add `variant: 'primary' \| 'secondary' \| 'text' \| 'destructive'` and `size: 'md' \| 'sm'` to GoButton. Secondary: 1 px `borderColor`, `background` fill, `color` text. Text: no border, underlined, min 44 × 44. Destructive: 2 px border in a new `danger` role (T-1), bold. `sm` keeps the 44 target, 12/16 text. GoCard `pressable` adds role button and a chevron | default, pressed, disabled, focused; destructive adds "confirming" | role button; label is a verb; destructive needs a confirmation step around it, not inside it | Extend GoButton (Pressable); GoCard + Pressable | Everywhere | P0 |
| C-2 | **TabBar** | 4 or 5 tabs; New haul centred, raised, `actionBackground` circle with "+" icon; icon above label; current tab marked with a 3 pt top rule and bold label; hides on haul, paywall, onboarding | default, selected, pressed | role tab in a tablist; "Listings, tab, 2 of 5, selected" | Expo Router / React Navigation bottom tabs, themed with GO | All top-level screens | P0 |
| C-3 | **Tabs and SegmentedControl** | Tabs: scrollable underline tabs for marketplaces (3 pt `actionBackground` underline). Segmented: 2–3 equal options, filled `color` when selected | default, selected, disabled | role tablist/tab (Tabs); radiogroup (segmented) | Tamagui Tabs; ToggleGroup | Copy listings, Listings, paywall billing | P0 |
| C-4 | **Chip** (ToggleChips, ChoiceChips, FilterChips, SortControl, Chip) | One component, `mode: 'multi' \| 'single' \| 'filter' \| 'action'`; pill, radius 4 (16), min 44 × 44, 12/16 text; selected = filled `color`; filter shows a count; `locked` adds a dashed border | default, selected, disabled, locked | multi: button + aria-pressed; single: radio; filter: announces the result count | ToggleGroup / RadioGroup | Onboarding, facts (condition, department, bins), Listings filters, Mark sold | P0 |
| C-5 | **Tag** (Tag, flag, lock) | 12/16 semibold, radius 1, `variant: 'default' \| 'strong' \| 'flag' \| 'lock'`: strong = filled `color`; flag = bold with 1 px `color` border; lock = dashed border | — | Text only; never colour alone; read inline | Tamagui Text in a bordered View | Status everywhere, trial counter | P0 |
| C-6 | **ListRow and KeyValueRow** | ListRow: thumbnail 44, title 14 bold, two meta lines, trailing tag or price, optional row actions; the row body opens detail, actions are separate buttons; `alarm` variant adds a 3 pt left rule. KeyValueRow: label left (semibold), value right, optional trailing action | default, pressed, alarm | Row body is one button with a combined label; actions reachable separately; swipe actions (if added) need visible equivalents | Tamagui ListItem | Listings, ledger, Home stale, Profit, item detail, Profile | P0 |
| C-7 | **TextField** (TextField, currency, TextArea, **Select**) | Label above (12/16 semibold), 44 min height, 1 px `borderColor`, radius 2; helper below; error text below with the field marked; optional count ("18 of 80 characters"); `type: 'text' \| 'currency' \| 'multiline' \| 'select'`. **Select** opens the native picker with option groups and an **Other…** option that reveals a text field (DD-30) | default, focused, filled, error, disabled, read-only | Visible label; error linked to the field; currency reads as currency; keyboard type matches content | Tamagui Input/TextArea; native Picker or `@expo/ui` | Facts, copy edit, price, Mark sold, costs, Profile, links | P0 |
| C-8 | **Selection controls** (Checkbox, Switch, RadioCards) | Checkbox 22 pt box in a 44 pt row with its label; Switch per platform; RadioCards: full-width 44 pt bordered options, selected = 2 px `color` border | default, checked, disabled, focused | Label in the hit area; switch announces on/off; radio cards in a radiogroup with a legend | Tamagui Checkbox, Switch, RadioGroup | Checklist, Mark sold shipping, Profile, connections | P0 |
| C-9 | **Progress** (ProgressBar, ProgressDots/Stepper, Spinner) | Bar: 6 pt, `surface` track, `actionBackground` fill, determinate or indeterminate. Stepper: 4 segments plus the text "Step n of 4". **Spinner** (added for onboarding, DD-31): 32 pt ring, `surface` track, `actionBackground` arc, always with a visible label ("Getting your items…"); stops spinning under reduced motion | — | progressbar with a label; stepper announces "Step n of 4"; spinner screen is `aria-busy` and announces its label once; respects reduced motion | Tamagui Progress; Spinner | Drafting, onboarding, sign-in | P0 |
| C-10 | **Feedback: Toast and Snackbar** | Toast: inverse surface, confirmation only, never the only place an action lives. **Snackbar (Undo):** inverse surface above the footer, message + visible countdown + Undo (+ Undo sale) + Dismiss; `duration` (10 s) that **pauses on focus or touch**, announces at 3 s, and is turned off by the app's Keep Undo setting (DD-14) | shown, dismissed | Polite live region; Undo reachable by screen readers; doesn't steal focus | `@tamagui/toast` for Toast; Snackbar is a GO component | Copy, saves; Mark sold, traded, "I removed it" | P0 |
| C-11 | **Notice** (InlineNotice, InlineError, AlarmBanner, PromptCard, InfoNote, AINote) | One component, `tone: 'info' \| 'error' \| 'alarm' \| 'prompt' \| 'ai'`: bold title + body + optional action; error and alarm use role alert; alarm has a 3 pt `color` border; ai/info use a 3 pt left rule. Colour roles optional once T-1 exists | — | alert for error/alarm/prompt; status for info | GO component (Tamagui stacks) | Every error, permission-denied and Needs action state | P0 |
| C-12 | **BottomSheet** | Rises from the bottom over the `overlay` scrim (T-4); grab handle; title; content; actions stacked; closes on scrim tap, swipe down or Back | open, closed | Modal: focus moves in, stays in, returns to the trigger on close | Tamagui Sheet | Move a photo, delete item, M-12, M-13, reminder pre-prompt | P0 |
| C-13 | **PlanCard** | GoCard composition: optional "For regular sellers" tag, plan name, price (display size T-3), billing segmented control, benefits list, renewal line, action. Recommended plan = 2 pt `actionBackground` border | default, recommended, purchasing, disabled | One announcement per card: name, price, period, limits (S-19) | GoCard + GoButton | Paywall | P0 |
| C-14 | **Capture controls** (MicButton, ShutterButton) | Mic: 88 pt circle, `actionBackground`, label below/inside ("Tap to talk" / "Listening…" / "Try again"). Shutter: 72 pt ring in `color`. Both announce state changes | idle, listening/capturing, disabled | Labelled ("Take photo"); announces count and recording start/stop | Pressable + expo-camera / expo-av | Capture, facts | P0 |
| C-15 | **Media** (Thumbnail, PhotoStrip, VideoPlayer) | Thumbnail 44 pt, radius 1. PhotoStrip: horizontal 72 pt photos, "Original" label on photo 1. VideoPlayer: poster, play button 52 pt, captions on by default, transcript link, no autoplay | loading, loaded, error, playing, paused | Photos labelled by item and number; player controls labelled; captions (R-37) | expo-image; expo-video | Haul, copy, item detail, how-to | P0 |
| C-16 | **CopyField** | Label, value (pre-line), source line ("Drafted from your answers" / "Edited" + Restore), title count, Copy + Edit actions; "Not given" state with no Copy | default, editing, edited, not given, over limit | Copy announces "{field} copied"; Edit opens an inline TextField | GO composition of C-1, C-5, C-7 | Copy listings | P0 |
| C-17 | **CoachMark** (first-run tip) | Inverse surface, pointer to the target, "Tip n of N", Next/Got it, Skip tips; placed beside the target, never over another control (accessibility F-02) | shown | Dialog that doesn't trap focus; Escape and tap outside close it; reduced motion | GO component on Tamagui Popover `[H]` | Home, Copy listings, Listings | P0 |
| C-18 | **MoneyBreakdown** | KeyValueRows with right-aligned money, a total row with a 2 pt top rule, and "(estimate)" in the label when any input is missing | complete, estimate | Each row read as "label, amount"; flags read in words | GO composition | Sold confirmation, Profit | P0 |
| C-19 | **Accordion and SettingsGroup** | Accordion: 44 pt summary with a chevron. SettingsGroup: heading + rows separated by `surface` rules | open, closed | Headings for groups; accordion announces expanded/collapsed | Tamagui Accordion; stacks | How-to, Profile | P0 |


**Platform components added by the onboarding design (2026-11-14), not GO gaps:** `System / AppleSignInButton` — Apple's own Sign in with Apple button (`expo-apple-authentication`), which Apple's rules say not to restyle as a GoButton `[H — check Apple's current button rules]`; and the camera and microphone permission prompts (`System / PermissionPrompt`), already listed as platform UI. Sign-in, email and setup screens otherwise reuse C-1, C-6, C-7, C-9 and C-11; no new gap families.

### Tokens

| ID | Token gap | Proposed | Why |
|---|---|---|---|
| T-1 | **Colour roles** `colorMuted`, `danger` (and optionally `caution`) | `colorMuted`: light #5A7269 (5.09:1 on background, 4.74:1 on surface), dark #79958A (6.27:1 / 4.94:1). `danger` and `caution` values to the design-system owner, each ≥ 4.5:1 as text and ≥ 3:1 as a border in both themes | Helper text failed contrast with `borderColor` (F-01); destructive buttons and the alarm have no role (PQ-17). Status stays in words either way |
| T-2 | Type `size.0` | 12/16, weight 400 and 600, scales with Dynamic Type | Helper text, tags, small actions |
| T-3 | Display size | 28/34 bold (money figures, plan prices); optionally 24/30 for onboarding titles | No display size in GO (max 20) |
| T-4 | `overlay` (scrim) | `color` at 45% (light) and 60% (dark), as a theme role | Sheets and system prompts |
| T-5 | `elevation.1` | One shadow level for floating surfaces (tips, sheets) per platform | v2's rgba shadow isn't a token |

### What doesn't need a GO component

System permission prompts, the lock-screen notification, the share sheet and the store purchase sheet are
platform UI. Listly provides only the usage strings (C-22, C-30) and its own pre-prompt and denied states.

## Not checked, and why

| Rule | Why not | What would close it |
|---|---|---|
| DS-07 GoButton visual spec | `GoButton.tsx` was evicted to iCloud and unreadable this session | Read the file once it's back on disk |
| DS-14 Dark theme | The prototype is light only (PQ-16) | Compose key screens in dark once components exist |
| DS-16 Platform behaviour | HTML can't show iOS vs Android behaviour | Check in the Expo build |

## Recommendation

1. **Keep GO** and build these 19 families in it (DD-29, PQ-15), most as thin wrappers on Tamagui primitives
   with GO tokens and a contract each. The tab bar comes from the router.
2. Do **C-1, C-2, C-4, C-7, C-10, C-11 and T-1 to T-3 first**. Every Phase 1 screen uses them.
3. **Re-run this check in a fresh session** after S-44 lands, against the real components rather than the
   prototype's stand-ins.
