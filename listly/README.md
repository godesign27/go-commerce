# Listly

The Listly mobile app (Expo, iOS first). Screens follow the detailed design in
`docs/design/listly-mvp-1/` and use **shadcn/ui for React Native** (React Native Reusables, NativeWind,
Lucide icons). Components live in `components/ui/` and are owned by this app: edit them, don't wrap them.

From this folder: `npm ci`, copy `.env.example` to `.env.local` and fill it in, then `npx expo start --ios`.

- `app/` — routes (Expo Router): onboarding, the haul (full screen), tabs, item detail, sold, checklist, paywall.
- `components/ui/` — shadcn components, tuned for touch (44 pt minimum, 48–56 pt main buttons).
- `components/listly/` — Listly's shared pieces built on them (screen layout, list rows, chips, Undo bar).
- `global.css` — the theme: shadcn slate neutrals, blue as the only action colour, green and red for status.
- `src/` — app state, permissions, the Supabase sync (`backend.ts`), and the AI stand-ins (`ai.ts`).
- `supabase/migrations/` — the database: profiles, items, the server-enforced trial, private photo storage.
- `DEV_ACCOUNTS.md` — how to sign in during development.

## Backend (Supabase)

Every table uses row-level security: a seller can only read and change their own rows. The plan and the trial
count can't be written from the app; drafting goes through `draft_items()`, which spends free listings on the
server. Photos go to a private bucket, one folder per seller.

**Before launch:** drop `prototype_start_plan()` (it lets a signed-in seller start a plan without paying) and
replace it with server-verified App Store and Google Play purchases.

Still stand-ins: speech recognition, AI grouping and drafting, purchases, Google sign-in. Each is marked
`STAND-IN` or `PROTOTYPE` in the code.
