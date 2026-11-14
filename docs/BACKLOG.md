# GO Commerce backlog

Ideas and work that are parked on purpose: not in the current PRD's scope, but not dropped. Each item has an
ID (`GC-nnn`), an owner, a status, and the trigger that brings it back. When something is deferred, add it
here in the same change. Never delete or reuse an ID; mark items `Done` or `Dropped` instead.

| ID | Item | Owner | Status | Added |
|---|---|---|---|---|
| GC-001 | Listly trade space, then a Listly marketplace | PM | Parked | 2026-11-13 |

## GC-001 — Listly trade space, then a Listly marketplace

**The idea.** Listly users list items they're willing to swap, and other Listly users offer trades. Later,
this grows into a fuller Listly marketplace where users also buy and sell with each other.

**What's in MVP 1 instead.** Listly records trades made elsewhere: **Mark traded** (PRD R-40, P1). It
doesn't host, match or broker trades.

**Why it's parked (PM decision, 2026-11-13):**

- **It needs both sides at once.** A trade needs two users who want each other's items and are nearby or
  willing to ship. At launch scale, most listings would get no offers, and an empty board makes the app look
  dead.
- **It's a different business.** Hosting trades or sales means trust and safety, scam reports, moderation,
  shipping, disputes, prohibited-item rules and, for a marketplace, payments.
- **Tax and legal.** US bartering is taxable income at fair market value
  ([IRS Topic 420](https://www.irs.gov/taxtopics/tc420)), and a platform that organises trades could have
  reporting duties. It needs a legal review before any build.
- **Positioning.** Listly's promise is one tool for the marketplaces sellers already use. Becoming a
  marketplace competes with them, which could hurt later API or partnership talks.
- **Fit.** Part-time resellers mostly need cash. Trading may matter more to collectors (sneakers, cards,
  vintage) and to closet clearers [H].

**Trigger to revisit.** All three:

1. The Phase 0 survey and pre-sale show resellers trade and would trade with other Listly users (questions
   in PRD §15).
2. R-40 usage shows trades being recorded (share of items leaving as trades [TBD — PM]).
3. Enough active users in one category, or one area for in-person trades, to make a board feel alive
   [TBD — PM].

**First step when it's revived.** A small, time-boxed trade-board test in that one category, with its own
PRD, before any marketplace work. That PRD needs trust and safety, a legal and tax review, and a decision on
whether Listly ever handles payment.

**Sources:** strategy discussion in this repo, 2026-11-13; [Listly MVP 1 PRD](prd/listly-mvp-1.md) R-40,
§8 non-goals, §10, §13 and §15.
