# GO Commerce Personas

Proto-personas for **Listly**, including its photo-cleanup step (formerly the separate SellerStudio app). They are hypotheses built from the PRDs and secondary market research and need validating with 10–15 seller interviews.

| Persona | File | Listly plan | Role |
|---|---|---|---|
| Dre, the Part-Time Reseller | [part-time-reseller.md](part-time-reseller.md) | Reseller plan ($12.99/mo or $99/yr) | **Primary.** Weekly or daily use; the paying core |
| Maya, the Closet Clearer | [closet-clearer.md](closet-clearer.md) | Clear-out Pass ($6.99, one time, 30 days) | Secondary. Occasional, one-time purchases; may upgrade |

## One app, two plans

Updated 2026-11-13 after the [Listly recommendation](../strategy/listly-recommendation-2026-11.md).

- **One Listly app** for iOS and Android. Every new user gets **3 free listings**, then picks a plan at the paywall. There's no free tier and no "How do you sell?" question at signup.
- **The plan sets which screens show.** The Clear-out Pass shows haul mode, copy for every marketplace, mark sold, the sold-everywhere checklist and money made. The Reseller plan adds the ledger, the stale filter and the profit tracker. Both plans get the checklist because it prevents double sales, and occasional sellers are the most likely to make one (PRD D-2). A Clear-out Pass can be upgraded at any time, and Listly suggests it when behavior shows it (for example 10+ active items or a second marketplace).
- **One data model underneath.** Every item is a canonical record with many marketplace listings. Changing plans never loses anything.

## Build order

**Dre and Maya launch together, paid from day one**, with the Reseller plan as the headline. The "fix photo" step, bin labels, forward-your-sale-email and a web companion follow about 30–45 days after launch.

## Not yet covered

- **Makers and artists** (Etsy and own-shop sellers of originals). Planned as the next persona, mostly for photo editing and brand-voice features. Interviews with this group should also test whether anyone would pay for photo editing as a separate app.
- **Small shops with repeat SKUs.** Out of scope until marketplace API access exists.
