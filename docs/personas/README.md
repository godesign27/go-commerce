# GO Commerce Personas

Proto-personas for **Listly** (built first) and **SellerStudio** (built second). They are hypotheses built from the PRDs and secondary market research and need validating with 10–15 seller interviews.

| Persona | File | Listly mode | Role |
|---|---|---|---|
| Maya, the Closet Clearer | [closet-clearer.md](closet-clearer.md) | Simple | Top of the funnel; free tier; future upgrade path |
| Dre, the Part-Time Reseller | [part-time-reseller.md](part-time-reseller.md) | Reseller | Weekly or daily use; paying core |

## One app, two modes

- **One Listly app** for iOS and Android. At signup, one question ("How do you sell?") sets the starting mode.
- **The mode is a default, not an account type.** It can be changed in settings, and the app suggests switching when behavior shows it (for example 10+ active items or a second marketplace).
- **One data model underneath.** Every item is a canonical product record that can have many marketplace listings. Simple mode hides the inventory tools; it doesn't remove the data. Switching modes never loses anything.

## Build order

**Simple mode (Maya) ships first**, decided 2026-11-13. Reseller mode (Dre) follows. The data model supports both from day one, so Reseller mode adds interface rather than requiring a migration.

## Not yet covered

- **Makers and artists** (Etsy and own-shop sellers of originals). Planned as the next persona, mostly for SellerStudio and brand-voice features.
- **Small shops with repeat SKUs.** Out of scope until marketplace API access exists.
