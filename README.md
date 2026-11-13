# GO Commerce

AI seller tools for people who sell secondhand and handmade goods online. Two apps share one backend:

| App | What it does | Status |
|---|---|---|
| **Listly** | Turns photos and a few plain answers into honest, paste-ready marketplace listings, and tracks what's listed and sold. | **Building first.** Simple mode MVP 1 is defined; the Expo scaffold and design system exist. |
| **SellerStudio** | Conversational product-photo editing that never misrepresents the item. | Second. PRD only. |

## Where things stand (2026-11-13)

- **Platform:** Listly is one **Expo (React Native) app for iOS and Android**. Desktop or web comes later if research supports it. This **supersedes** the "SwiftUI, iPhone-first" choice in the planning docs.
- **One app, two modes:** at signup, users pick how they sell.
  - **Simple mode** is for Maya, the closet clearer. **It ships first.**
  - **Reseller mode** is for Dre, the part-time reseller. It comes next.
  - Both modes share one data model: a canonical product with many marketplace listings.
- **No marketplace API access yet.** MVP 1 hands listings off by copy and paste. Buyer bundles are supported around the marketplaces, not inside them.
- **Success target:** paying sellers within 90 days of launch.

## Repository map

```text
go-commerce/
├── README.md                  ← you are here
├── docs/
│   ├── planning/              Original planning docs (v0.1–0.2, 2026-11-11)
│   │   ├── Listly_PRD.md
│   │   ├── SellerStudio_PRD.md
│   │   ├── ARCHITECTURE.md
│   │   └── GO_Commerce_Shared_Services.md
│   ├── ideas/
│   │   └── listly.md          Current Listly Simple-mode MVP 1 one-pager
│   └── personas/
│       ├── README.md          One app, two modes; build order
│       ├── closet-clearer.md  Maya: Simple mode, top of funnel
│       └── part-time-reseller.md  Dre: Reseller mode, paying core
└── listly/                    Expo app (SDK 58, React Native 0.88, Tamagui 3)
    ├── App.tsx                Design-system preview screen
    └── packages/go-mobile-design-system/   GO Mobile Design System (tokens, themes, components)
```

## Which doc wins

The documents were written at different times. When they disagree, use this order:

1. **`docs/ideas/listly.md`** and **`docs/personas/`**: the latest decisions.
2. **`docs/planning/`**: the original PRDs and architecture. They're still the reference for principles, the data model, agent architecture, security and later phases. Their platform choice (SwiftUI) and MVP scope are out of date.

## Running Listly

```sh
cd listly
npm ci
npm run web        # browser preview
npm run ios        # iOS simulator (Mac with Xcode)
npm run typecheck
npm run validate
```

See [listly/README.md](listly/README.md) for the acceptance checks.

> **iCloud note:** if this folder lives on an iCloud-synced Desktop, set it to **Keep Downloaded**. Otherwise iCloud can replace files with placeholders, which breaks git, TypeScript and the bundler.

## Next steps

- Validate the personas with 10–15 seller interviews, and test a clickable prototype with 6–8 closet clearers.
- Write the Listly Simple-mode PRD and stories from the one-pager.
- Run an independent strategy review. Its output goes to `docs/strategy/`.
