# Persona: Maya, the Closet Clearer

> **Status:** Proto-persona (hypothesis). Built from the Listly PRD v0.2 and secondary market research, not from interviews with sellers. Validate it before treating it as fact. See "Research gaps" at the end.
>
> **App:** Listly, "Simple" mode
> **Role in the product:** Top of the funnel. A free-tier user who drives volume and word of mouth and may later become a Part-Time Reseller.

---

## Snapshot

**Maya Torres, 27**: marketing coordinator, rents a one-bedroom apartment and sells online a few times a year.

*Photo description:* Sitting cross-legged on her bedroom floor next to an overflowing donation bag, phone held up to photograph a denim jacket laid flat on the duvet.

> "I know this stuff is worth something. I just don't want selling it to become a second job."

## Demographics and context

| | |
|---|---|
| **Age range** | 20–38 (skews Gen Z and Millennial) |
| **Occupation** | Full-time job or student; selling is not income she depends on |
| **Tech comfort** | High on her phone, low patience for "business" tools |
| **Devices** | Phone only for selling. Has a laptop but never uses it to list |
| **Marketplaces** | Usually one: Poshmark, Depop, Mercari or Facebook Marketplace. Sometimes eBay for a "valuable" item |
| **Volume** | 5–30 items per clear-out, 2–4 clear-outs a year. Rarely more than 15 active listings at once |
| **Motivation** | Declutter, recover some money, feel less guilty about waste |

## Behavioral variables

Where Maya sits on the dimensions that separate the two personas:

| Variable | Maya (Closet Clearer) | Part-Time Reseller |
|---|---|---|
| Listing frequency | Bursts, a few times a year | Weekly or daily |
| Active inventory | < 15 | 50–500+ |
| Marketplaces used | 1 | 2–4 |
| Item sourcing | Her own closet | Bought to resell (thrift, estate sales) |
| Time per listing tolerated | < 2 minutes or she quits | Will invest time if it pays back |
| Selling is... | A chore | A business |
| Willingness to pay | Low; maybe a one-off pack | Already pays for tools |

## Goals

**End goals (what she wants done)**
- Get clothes out of the apartment and turned into some cash.
- List an item in about a minute, from her phone, while she's already holding it.
- Know roughly what to ask for it so it actually sells.

**Experience goals (how she wants it to feel)**
- Effortless and a little satisfying, like clearing an inbox.
- Not intimidating. No inventory jargon, SKUs or dashboards.

**Life goals (why it matters)**
- A tidier, calmer home. Spending more sustainably. A bit of extra money for something she wants.

## Frustrations

- **The blank description box.** She doesn't know what to write, what details buyers want or which words help search.
- **Measuring and describing condition.** It's tedious, and getting it wrong leads to returns and awkward messages.
- **Pricing guesswork.** Too high and it sits for weeks; too low and she feels robbed.
- **Abandoned drafts.** She photographs 20 things, lists 6, and the rest sit in her camera roll for months.
- **Lowball offers and buyer questions** that need replies at inconvenient times.
- **Feeling like the apps are made for "real" resellers** with jargon and features she doesn't need.

## Current behavior

1. Decides to clear out, usually on a weekend or before a move.
2. Takes a burst of photos on the bed or floor in uneven light.
3. Opens one marketplace app and creates listings one by one, copying titles from similar listings.
4. Gives up partway through and puts the rest in a donation bag.
5. Checks the app now and then for offers, and ships from home or drops off at the post office.

**Workarounds today:** eBay's free AI listing tool if she's on eBay; copying other sellers' descriptions; asking friends what to charge.

## Scenario: a Sunday clear-out

It's Sunday afternoon and Maya's closet door won't close. She pulls out a pile: two pairs of jeans, a barely worn pair of boots, a vintage-ish jacket and some going-out tops. She opens Listly, which she picked as "I'm clearing out my closet" when she signed up.

She snaps three photos of the jacket. Listly asks two quick questions: *"What brand does the tag say?"* and *"Any flaws or wear?"* She types "Levi's, small mark on left cuff." Listly drafts a title and description that mention the mark honestly, and suggests a price range. She taps "Copy for Depop," switches apps, pastes and posts. It takes about 90 seconds.

She does four more items. Listly keeps the rest in a "Still to list" tray with the photos already attached, so next weekend she can pick up where she stopped instead of starting over. On Wednesday the boots sell; she taps "Sold" in Listly, and it gives her a small win screen and the total she's made so far.

## What Maya needs from Listly

1. **Photo → paste-ready listing in under 2 minutes**, without leaving the flow.
2. **Two or three plain-language questions** to capture brand, size and flaws. Nothing made up by the AI.
3. **One marketplace, one tap to copy.** Formatted for the app she uses.
4. **A price suggestion** (validate the data source; see open questions).
5. **A "Still to list" tray** so her half-finished clear-outs survive.
6. **A light sense of progress:** items listed, items sold, money made.
7. **Help selling several items to one buyer.** Bundle-friendly listing copy, a reminder to turn on the marketplace's bundle discount, and a quick way to mark a bundle as sold with one total.

## Design implications

- **Simple mode is the default experience for her.** Hide the inventory ledger, cross-marketplace mapping, brand profiles and bulk actions. Keep them in the data model so nothing is lost if she upgrades.
- **Ask, don't fill.** Product Intelligence asks her the 2–3 facts that matter. It never fills in brand, size or condition on its own (PRD principle: facts before fluency).
- **One primary action per screen.** Big camera button, big "Copy" button, minimal text. Follow the GO Mobile Design System's 44×44 touch targets and Dynamic Type support.
- **No setup before value.** No brand-voice setup, connecting accounts or choosing marketplaces before her first listing. Ask her marketplace on first copy, then remember it.
- **Plain language everywhere.** "Items" not "SKUs", "Sold" not "Ended", "Where it's listed" not "Channel listings".
- **Suggest switching modes when behavior shows it.** If she reaches about 10+ active items or copies to a second marketplace, offer: *"Looks like you're selling more. Want tools to track where things are listed?"* Never switch modes without asking.
- **Monetization:** free tier with a monthly listing allowance; optional one-off credit pack for a big clear-out. Don't put a subscription between her and her first listing.

## What success looks like for her

- First listing copied within 3 minutes of installing.
- Lists 5+ items in her first session.
- Comes back for her next clear-out instead of going straight to the marketplace app.
- Tells a friend.

## Risks with this persona

- **Low frequency.** She might open the app 2–4 times a year. That's good for reach but weak for retention and revenue.
- **Free alternatives are good enough for her.** eBay and others already offer free photo-to-listing AI. Listly must be quicker and work across marketplaces to matter.
- **She churns between clear-outs.** Re-engagement (for example "You have 8 items still to list") must feel helpful, not naggy.

## Research gaps

- How many clear-outs per year, and how many items per clear-out? (Assumed 2–4 and 5–30.)
- Which single marketplace she uses most, by age group.
- Whether a price suggestion is the feature that brings her back, and what sold-price data Listly can legally use.
- Whether she would ever pay, and in what form (credit pack vs. subscription).
- What share of closet clearers later become regular resellers (this drives the value of the upgrade path).

**Sources behind the assumptions:** Listly PRD v0.2; ThredUp 2026 Resale Report; secondary reporting that most resale sellers are monthly or quarterly sellers and much US resale is "closet clear-out" rather than income; eBay Magical Listing adoption data.
