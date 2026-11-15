# Listly

The Listly mobile app (Expo, iOS first). Screens follow the detailed design in
`docs/design/listly-mvp-1/` and use **shadcn/ui for React Native** (React Native Reusables, NativeWind,
Lucide icons). Components live in `components/ui/` and are owned by this app: edit them, don't wrap them.

From this folder: `npm ci`, then `npx expo start --ios`.

- `app/` — routes (Expo Router): onboarding, the haul (full screen), tabs, paywall.
- `components/ui/` — shadcn components, tuned for touch (44 pt minimum, 48–56 pt main buttons).
- `components/listly/` — Listly's shared pieces built on them (screen layout, list rows, chips, thumbnails).
- `global.css` — the theme: shadcn slate neutrals, blue as the only action colour, green and red for status.
- `src/` — app state, permissions, and the AI stand-ins (`src/ai.ts`) until the backend exists.
- `DEV_ACCOUNTS.md` — the test sign-in for development builds.

Not built yet: the backend (proposed: Supabase, with Resend for email), real speech recognition, drafting
and purchases. Each stand-in is marked `STAND-IN` in the code.
