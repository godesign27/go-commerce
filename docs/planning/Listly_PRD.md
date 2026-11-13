# Listly — Product Requirements Document

**Version:** 0.2 (consolidated draft)  
**Date:** 2026-11-11  
**Status:** Proposed for review  
**Project:** `go-commerce/listly`  
**Working product name:** Listly (name/trademark clearance pending)  
**Platform:** iPhone-first; web and Android later  
**Product family:** GO Commerce

## 1. Executive summary

Listly is a conversational AI selling assistant for independent sellers, makers, artists, resellers, and small shops. A seller creates a canonical product record once, uses photos and conversation to generate accurate channel-specific listing content, and exports or publishes to multiple sales channels. As integrations become available, Listly monitors verified sales and inventory events and helps keep listings synchronized to reduce overselling.

**Positioning:** Create once. Sell everywhere. Stay in sync.

The first release validates listing creation, brand consistency, product records, and exports. Direct marketplace publishing and inventory sync are phased additions, not MVP launch blockers.

## 2. Problem and opportunity

Sellers duplicate product details and imagery across marketplaces; struggle with descriptions, tone, and format requirements; and risk selling one-of-a-kind products more than once when inventory is not synchronized. Existing tools may be too complex, channel-specific, or expensive for occasional sellers.

Listly's differentiation hypothesis is a simple chat-first workflow, portable brand/style rules, verified product facts, shared media assets, and eventually trustworthy multichannel coordination. This is a hypothesis to validate, not an established competitive advantage.

## 3. Target users and jobs to be done

1. **Independent maker / artist:** Create polished listings reflecting personal style and preserve accurate material, dimensions, and provenance; sell unique items across a shop and marketplaces.
2. **Casual reseller:** Photograph an item, capture brand/condition/measurements, prepare channel-ready listings quickly, and avoid duplicate sales.
3. **Small ecommerce shop:** Reuse product records, images, and brand guidelines across channels with reliable status visibility.

Core jobs: capture item; verify attributes; produce copy and imagery; review; export/publish; monitor sales; reconcile stock and listing status.

## 4. Product principles

- **One canonical product, many channel listings.** Each channel may have its own title, description, price, categories, and listing ID.
- **Facts before fluency.** AI must not invent brand, materials, dimensions, condition, authenticity, or provenance. Unknown facts are explicitly unknown or clarified.
- **Human control.** Users approve listing publication and irreversible actions; optional advance authorization for rapid protective delisting is explicit and revocable.
- **Deterministic inventory.** Webhooks, APIs, and durable jobs—not an LLM—detect verified sales and update stock.
- **Honest status.** Never claim a channel was updated until the API confirms; show pending, failed, and unsupported states.
- **Portable style and assets.** Users can import/export `style.md`, `visual-style.md`, and their listing packages.
- **Cross-app reuse.** Listly and SellerStudio share approved products, assets, and brand profiles, with independent app experiences.

## 5. Core user experience

### 5.1 Create a listing
1. User starts a chat or taps New Product; takes or imports photos.
2. Product Intelligence extracts candidate attributes with confidence and source evidence; user confirms essential facts.
3. User selects marketplace(s), shop, and brand voice profile.
4. Listing Agent creates channel-specific drafts with titles, descriptions, keywords, and required-field checks.
5. User edits via chat or structured fields; Quality Agent validates claims and channel rules.
6. User approves and saves draft; exports a package or publishes to a supported connected channel in later releases.

### 5.2 Brand voice and style
- Import Markdown/text `style.md`; edit profile in UI; support voice/tone controls, prohibited phrases, examples, length, and SEO preferences.
- Multiple profiles per user/shop; version history; preview and explicit approval before profile updates suggested by AI.
- Shared visual profile `visual-style.md` used by SellerStudio, with constraints for product fidelity.
- Treat uploaded style documents as untrusted instructions; enforce system, safety, factual, and marketplace constraints.

### 5.3 Export
- Export original and approved edited images, listing text, and structured product metadata in a clear folder/package.
- MVP: user-initiated save via iOS Files/document picker to iCloud Drive and other Files-enabled providers, such as Google Drive or Dropbox when configured on device.
- Later: OAuth-based direct cloud connectors with scoped permissions, destination selection, and confirmed upload results.

### 5.4 Multichannel publishing (post-MVP)
1. User connects a supported seller account using platform-approved OAuth/authorization.
2. Listly checks channel permissions, required attributes, categories, shipping policies, and listing restrictions.
3. User previews per-channel differences and approves publishing.
4. Channel connector publishes and returns an external listing ID, URL, and confirmed state.
5. Listly tracks subsequent updates and failures; unsupported channels use assisted export/manual tracking.

### 5.5 Sale detection and cross-channel synchronization (post-MVP)
1. Verified webhook or polling detects an order/stock event on a connected channel.
2. Sync service validates authenticity, deduplicates events, reconciles order state, and atomically updates the canonical inventory ledger.
3. Service identifies other active listings for the same SKU/item and computes required channel actions.
4. **Ask mode:** notify seller and request confirmation before ending/pausing other listings.
5. **Auto-protect mode:** after explicit, revocable advance authorization, promptly attempt permitted stock-zeroing/delisting and notify seller of outcomes.
6. Each action is persisted, retried safely, and reported as confirmed, pending, failed, or unsupported.
7. Cancellations/returns do not automatically relist without the user's configured policy and appropriate verification.

**Important:** Marketplace events and updates can be delayed. Listly must never promise zero overselling or guaranteed immediate synchronization.

## 6. Release scope and acceptance criteria

### MVP 1 — Conversational listing creation
**P0 requirements**
- iOS photo capture/import and text chat; voice dictation as an input method.
- AI-assisted product extraction with user-confirmed factual fields and missing-data questions.
- Draft generation for Etsy, eBay, Shopify, and generic formats (export only, not direct publishing).
- Multiple brand profiles, `style.md` import, style controls, and editable generated copy.
- Saved product catalog and draft versions; original photos retained.
- Package export via Files picker; show success only after completed user-directed save.
- Secure backend AI gateway, basic usage limits, privacy disclosures, deletion/export controls.

**Acceptance criteria**
- A tester can create a product from photo + conversation, confirm facts, generate and edit a draft, save it, and export it without leaving the primary flow.
- No generated listing presents unverified attributes as confirmed facts.
- A style profile meaningfully changes output while retaining verified facts.
- Exports include the approved text, metadata, and selected images.
- API secrets are not shipped in the iOS binary; users cannot access each other's records or assets.

### MVP 2 — First direct channel integration
- Connect one approved channel (candidate: Shopify), create/update listing, and display confirmed channel status.
- Record channel listing ID, URL, permissions, and errors.
- Manual inventory adjustment and reconciliation view.
- Publishing requires explicit review and approval.

**Acceptance criteria:** A connected seller can publish one approved product and see the actual external listing status; failed requests are actionable and never marked successful.

### V1.5 — Second channel + sale sync
- Add second approved channel (candidate: eBay), verified sale events, inventory ledger, cross-channel mapping, Ask mode, and optional Auto-protect mode.
- Durable queue, idempotency keys, event deduplication, retries/backoff, and sync audit trail.
- Alerts for conflicts, disconnected channels, and stale inventory.

**Acceptance criteria:** A test sale on one channel produces one canonical inventory event; the system initiates authorized actions on other channels, records outcomes, and surfaces any failures. Replayed events cannot double-decrement inventory.

### V2 and beyond
- Additional approved marketplace connectors (Etsy subject to API access), advanced inventory allocation, returns/relisting workflows, direct Google Drive/Dropbox connectors, batch operations, analytics, SellerStudio editing workflows, and web dashboard.
- Facebook Marketplace, Poshmark, and Depop remain research candidates; do not promise API-based publishing without approved access.

## 7. Shared GO Commerce architecture

### 7.1 Lead and specialist agents
- **Commerce Lead Agent:** understands user intent and app context, selects a workflow, delegates, and composes a response. Simple deterministic requests bypass LLM orchestration.
- **Product Intelligence Agent:** extracts candidate product facts and asks for verification.
- **Brand Agent:** interprets style guides and returns constrained writing/visual guidelines.
- **Listing Agent:** generates marketplace-specific structured drafts.
- **Image Director Agent:** plans SellerStudio image transformations; actual edits run in image services.
- **Quality Agent:** evaluates factual consistency, brand compliance, and missing marketplace requirements.
- **Channel Publishing Agent (later):** prepares publishing plans and explains failures; never bypasses connector authorization.
- **Inventory Intelligence Agent (later):** explains stock discrepancies and suggests resolutions; never serves as the inventory source of truth.

### 7.2 Deterministic shared services
- Identity/accounts and app-specific entitlements
- AI gateway and tool authorization
- Product catalog and channel listing records
- Brand profiles and versioning
- Asset library and image processing
- Channel connector framework
- Inventory ledger, sync engine, durable job queue, event ingestion, reconciliation
- Cloud export connectors and iOS Files integration
- Audit logs, notifications, observability, metering, and billing

**Architecture constraint:** Agents have narrow typed tool contracts and least-privilege access. External publishing, billing, inventory changes, and export operations execute through validated services with explicit authorization policies.

## 8. Conceptual data model

- `users`, `organizations`, `shops`, `memberships`
- `brand_profiles` (voice and visual style; versions; active profile)
- `products` (canonical ID, SKU, item type, verified attributes, quantity policy)
- `product_assets` (source/derived, hash, dimensions, edit lineage, review status)
- `listing_drafts` (marketplace format, generated text, revisions, approvals)
- `channel_connections` (provider, authorized scopes, health, token references)
- `channel_listings` (product ID, channel, external ID/URL, status, price, quantity, last sync)
- `inventory_events` (event ID, source, type, quantity delta, order reference, dedupe key)
- `inventory_balances` (available, reserved, sold; canonical authoritative state)
- `sync_operations` (target listing, requested action, idempotency key, attempts, outcome)
- `agent_runs`, `tool_calls`, `approvals`, `notifications`, `usage_events`

Use tenant-scoped row-level security, encrypted tokens, restricted storage policies, and an immutable audit trail for consequential changes.

## 9. Nonfunctional requirements

- **Reliability:** webhook signature validation; event replay safety; transactional inventory updates; idempotent channel actions; reconciliation polling when supported; alert on stale sync.
- **Security:** OAuth with minimum necessary scopes, encrypted secrets, no client API keys, access control, rate limits, abuse prevention, deletion controls.
- **Privacy:** explicit consent for uploads and third-party sharing; clear AI processing disclosure; data retention and deletion policy.
- **Performance:** async generation with visible progress; resumable tasks; graceful failure when external APIs are unavailable.
- **Accessibility:** Dynamic Type, VoiceOver, high contrast, accessible controls and error states.
- **Compliance:** marketplace API terms, App Store review and purchase rules, user ownership/rights to images, no unsupported scraping.
- **Cost control:** usage metering, bounded AI calls, credit accounting, image processing limits, model routing by task.

## 10. Monetization hypotheses

- Free trial: limited listing generations.
- Creator: proposed $9.99/month for brand profiles, drafts, and recurring listing creation.
- Seller Pro: proposed $19.99/month for connected channels and inventory synchronization, once available.
- Business: proposed $39.99/month for higher volume/multiple shops, subject to validation.
- Occasional sellers: optional listing credit packs.

Prices and quotas are test hypotheses. Confirm Apple purchase/entitlement design, AI unit economics, connector costs, and willingness to pay before launch.

## 11. Metrics

**Activation:** time to first approved listing; percent completing photo-to-export flow.  
**Quality:** percent of generated claims requiring correction; user satisfaction with style matching.  
**Engagement:** weekly listings per active seller; repeat creation and export rates.  
**Commerce:** successful channel publication rate; sync latency; failed sync rate; unresolved discrepancies; oversell incidents.  
**Business:** conversion to paid, revenue per active seller, churn, AI cost per listing, gross margin.

## 12. Dependencies, risks, and open decisions

1. Confirm legal clearance for **Listly** as public name.
2. Validate Shopify/eBay API access and permitted automation before committing to release dates.
3. Decide whether unique items default to Ask or Auto-protect; recommendation: Ask until users explicitly opt into Auto-protect.
4. Define inventory allocation rules for multi-quantity SKUs and partially fulfilled orders.
5. Decide whether the first direct connector is Shopify or eBay based on target user interviews and approval requirements.
6. Define the shared catalog's tenant/shop ownership model before adding SellerStudio.
7. Validate App Store monetization and whether cross-app entitlements require a specific account/subscription structure.
8. Research competitors and interview 10–15 target sellers before expanding beyond MVP 1.

## 13. Proposed repository placement

Current folder `go-commerce/listly/` remains valid. Suggested future organization:

```text
go-commerce/
  listly/                   # existing app folder; do not move yet
  seller-studio/            # future app
  packages/                 # shared schemas, design tokens, agent contracts
  agents/                   # lead and specialized agents
  services/                 # gateway, catalog, assets, sync, connectors
  docs/                     # shared platform specifications
```

## 14. Immediate next actions

1. Review this PRD and settle first target audience and first marketplace integration.
2. Write `ARCHITECTURE.md` with typed agent/tool contracts, event lifecycle, and canonical inventory invariants.
3. Define initial schema and acceptance tests for the photo-to-export workflow.
4. Scaffold the SwiftUI app and secure AI backend without prematurely implementing all integrations.
5. Conduct seller validation while building the narrow MVP.
