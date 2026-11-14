# GO Commerce

AI seller tools for people who sell secondhand and handmade goods online.

| Product | What it does | Status |
|---|---|---|
| **Listly** | A paid, phone-first selling app: list a whole haul from your phone, sell it on every marketplace you use, and always know what's sold, where it is and what you made. | **Building.** MVP 1 is defined (reseller-first, paid from launch); the Expo scaffold and design system exist. |
| **SellerStudio** | Product-photo cleanup that never misrepresents the item. | **Now a Listly feature** (the "fix photo" step, shortly after launch), not a separate app. Its PRD is kept for principles. |

## Where things stand (2026-11-13)

Updated after the [strategy review](docs/strategy/strategy-review-2026-11.md) and the [Listly recommendation](docs/strategy/listly-recommendation-2026-11.md), both 2026-11-13.

- **Platform:** Listly is one **Expo (React Native) app for iOS and Android**, mobile-first. This **supersedes** the "SwiftUI, iPhone-first" choice in the planning docs. A **web companion** from the same Expo codebase follows about 30–45 days after launch for desk work. A browser extension is on hold (see open decisions).
- **Who it's for:** Dre, the part-time reseller, first. Maya, the closet clearer, is served by a one-time pass in the same app.
- **Paid from launch:** every new user gets **3 free listings, no card needed**, then picks a plan:
  - **Reseller plan:** $12.99 a month or $99 a year.
  - **Clear-out Pass:** $6.99 one time, for 30 days and up to 100 listings.
  - There's no free monthly allowance and no separate Simple mode chosen at signup.
- **What it charges for:** haul mode with voice answers, copy for every marketplace from one item record, the sold-everywhere checklist, and a profit tracker. Every target marketplace now drafts listings from a photo for free, so listing generation is the way in, not the product.
- **One data model:** a canonical item with many marketplace listings.
- **No marketplace API access yet.** MVP 1 hands listings off by copy and paste.
- **Success target:** paying sellers within 90 days of launch, counted from launch day. The target number is set after the pre-sale (see the [one-pager](docs/ideas/listly.md)).

### Open decisions

- **Trial format:** 3 free listings, or a 7-day App Store trial that renews automatically. The pre-sale trial test decides.
- **Price and billing:** $12.99 sits between Flyp (about $9) and Vendoo's Starter plan (about $14.99), which both delist automatically. Confirm after the pre-sale and the AI cost test, plus a legal check of US web checkout for the Reseller plan.
- **Browser automation:** the architecture rules it out, which also rules out automatic delisting, the feature competitors charge most for. Decide after a marketplace terms-of-service review.
- **Architecture size for MVP 1:** one generation call plus a validator, deferring the lead agent and specialists. Engineering to confirm.

## Repository map

```text
go-commerce/
├── README.md                  ← you are here
├── docs/
│   ├── BACKLOG.md             Parked ideas and deferred work (GC-nnn)
│   ├── planning/              Original planning docs (v0.1–0.2, 2026-11-11)
│   │   ├── Listly_PRD.md
│   │   ├── SellerStudio_PRD.md
│   │   ├── ARCHITECTURE.md
│   │   └── GO_Commerce_Shared_Services.md
│   ├── ideas/
│   │   └── listly.md          Current Listly MVP 1 one-pager (reseller-first, paid from launch)
│   ├── prd/
│   │   └── listly-mvp-1.md    Listly MVP 1 PRD (draft, 2026-11-13)
│   ├── design/
│   │   └── listly-mvp-1/initial-prototype.html  Clickable MVP 1 prototype (not production)
│   ├── strategy/
│   │   ├── strategy-review-2026-11.md     Independent strategy review (2026-11-13)
│   │   └── listly-recommendation-2026-11.md  Product, pricing and trial recommendation (2026-11-13)
│   └── personas/
│       ├── README.md          One app, two plans; build order
│       ├── closet-clearer.md  Maya: Clear-out Pass
│       └── part-time-reseller.md  Dre: Reseller plan, primary persona
└── listly/                    Expo app (SDK 58, React Native 0.88, Tamagui 3)
    ├── App.tsx                Design-system preview screen
    └── packages/go-mobile-design-system/   GO Mobile Design System (tokens, themes, components)
```

## Which doc wins

The documents were written at different times. When they disagree, use this order:

1. **This README**, **`docs/prd/listly-mvp-1.md`**, **`docs/ideas/listly.md`** and **`docs/personas/`**: the latest decisions. The PRD is the build spec; the one-pager is the summary.
2. **`docs/strategy/`**: the reasoning and evidence behind the 2026-11-13 changes. It's a review, not a decision record; where it and the docs above disagree, the docs above win.
3. **`docs/planning/`**: the original PRDs and architecture. They're still the reference for principles, the data model, security and later phases. Their platform choice (SwiftUI), MVP scope, SellerStudio-as-a-separate-app plan and MVP agent architecture are out of date.

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

Run these tests in the next 2–3 weeks, before more production code. The [one-pager](docs/ideas/listly.md) lists the go signals.

1. **Founding-member pre-sale:** a landing page with the promise and both plans, posted in 3 reseller communities, with visitors split between "3 free listings" and a 7-day trial.
2. **Haul-mode prototype:** 6–8 resellers list 10 items with a clickable prototype against their current method.
3. **Reseller survey:** marketplaces used, tools used, double sales in the last 30 days, tool spend, how they track profit today, and whether they trade items (where, how often, and whether they'd trade with other Listly users).
4. **Manual ledger diary:** 6–8 resellers for 2 weeks, using a shared sheet and a forward-your-sale-email address processed by hand.
5. **Copy-and-paste timing** on 4 marketplace apps, an accuracy evaluation set of 30 items with known flaws, an AI cost check on 50 items, and a "Listly" name clearance.

Then break the [Listly MVP 1 PRD](docs/prd/listly-mvp-1.md) into stories. Ideas parked for later, such as a Listly trade space and marketplace, are in the [backlog](docs/BACKLOG.md).
