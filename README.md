# GO Commerce

AI seller tools for people who sell secondhand and handmade goods online.

| Product | What it does | Status |
|---|---|---|
| **Listly** | Keeps one honest record of everything you're selling, wherever you sell it, from your phone. Photos and a few plain answers become paste-ready marketplace listings, and Listly tracks what's listed and sold. | **Building.** Simple mode MVP 1 is defined; the Expo scaffold and design system exist. |
| **SellerStudio** | Product-photo cleanup that never misrepresents the item. | **Now a Listly Reseller-mode feature** ("fix photo" step), not a separate app. Its PRD is kept for principles. |

## Where things stand (2026-11-13)

Updated after the [strategy review](docs/strategy/strategy-review-2026-11.md) on 2026-11-13.

- **Platform:** Listly is one **Expo (React Native) app for iOS and Android**, mobile-first. This **supersedes** the "SwiftUI, iPhone-first" choice in the planning docs. A **web companion** built from the same Expo codebase ships with the Reseller beta: a ledger view, bulk copy and CSV export. A browser extension is on hold (see open decisions).
- **One app, two modes:** at signup, users pick how they sell.
  - **Simple mode** is for Maya, the closet clearer. **It ships first** as the free front door.
  - **Reseller mode** is for Dre, the part-time reseller. A **paid Reseller beta opens about 45 days after launch** for 20–50 hand-recruited resellers: multi-marketplace copy, an inventory ledger and the "Sold → still live on X, Y" checklist. It adds screens, not new AI.
  - Both modes share one data model: a canonical product with many marketplace listings.
- **Positioning:** every target marketplace now drafts listings from a photo for free in its own app, so listing generation is the input to Listly, not the product. The product is the honest, phone-first record of what's listed where.
- **No marketplace API access yet.** MVP 1 hands listings off by copy and paste. Buyer bundles are supported around the marketplaces, not inside them.
- **Success target:** paying sellers within 90 days of launch, **from the Reseller beta**. Simple mode's 90-day target is activation and return rate, not revenue (see the [one-pager](docs/ideas/listly.md)).

### Open decisions

- **Pricing:** proposed Reseller subscription of about $9.99–$12.99 a month with a 30-day trial, sold through a US web checkout where the rules allow it. Confirm after 30 days of measured AI cost and a legal check of the current Apple and Google link-out terms.
- **Browser automation:** the architecture rules it out, which also rules out automatic delisting. Decide after a marketplace terms-of-service review and the reseller survey.
- **Architecture size for MVP 1:** the review recommends one generation call plus a validator, deferring the lead agent and specialists. Engineering to confirm.

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
│   ├── strategy/
│   │   └── strategy-review-2026-11.md  Independent strategy review (2026-11-13)
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

1. **This README**, **`docs/ideas/listly.md`** and **`docs/personas/`**: the latest decisions.
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

Run these tests in the next 2–4 weeks, before more production code. The strategy review (§7) has the details and the signals that would change the plan.

1. **Listly against the marketplaces' own free AI:** a clickable prototype with 8 closet clearers and 5 resellers, each listing 3 items both ways on their own phone.
2. **Founding-reseller pre-sale:** a landing page with a refundable pre-sale, promoted in 3 reseller communities.
3. **Manual ledger diary:** 6–8 resellers for 2 weeks, using a shared sheet and a forward-your-sale-email address processed by hand.
4. **Reseller survey (100 responses):** marketplaces used, tools used, double sales in the last 30 days, tool spend, phone versus desk.
5. **Copy-and-paste timing** on 4 marketplace apps, an accuracy evaluation set of 30 items with known flaws, an AI cost check on 50 items, and a "Listly" name clearance.

Then write the Listly Simple-mode PRD and stories from the one-pager, and the Reseller beta scope.
