# GO Commerce — Shared Services & Agent Architecture

**Version:** 0.1 | **Status:** Proposed for review | **Date:** 2026-11-11

## 1. Architectural decision
Build **independent iOS applications with a shared, server-side commerce platform**. Listly owns listing creation, channel publishing, and inventory workflows. SellerStudio owns photo editing and visual asset workflows. Both share product records, brand profiles, asset storage, identity, authorization, AI gateway, orchestration, and export capabilities. Future products may reuse the same contracts.

**Principle:** Agents reason and coordinate; deterministic services execute transactions, persist state, enforce permissions and provide auditability.

## 2. Logical architecture
```text
Listly iOS             SellerStudio iOS          Future web/Android
     |                        |                         |
     +------------------------+-------------------------+
                              |
                  Authenticated API / BFF
                              |
                Commerce Orchestrator
              (lead agent + workflow engine)
                   /         |          \
           Product/Brand  Listing     Image Director
           specialists   specialist    specialist
                   \         |          /
                 Shared tool contracts
                              |
  +---------------------------+-----------------------------+
  | Identity/RBAC | Catalog | Assets | Profiles | AI Gateway |
  | Export        | Usage   | Audit  | Jobs     | Approvals  |
  +---------------------------+-----------------------------+
                              |
       Channel Adapters / Event Ingestion / Inventory Sync
                              |
           Shopify / eBay / Etsy / future channels
```

## 3. Service ownership and boundaries
| Service | Responsibilities | Critical constraint |
|---|---|---|
| Identity & tenancy | Accounts, shops, memberships, roles | Strict tenant isolation |
| Catalog | Canonical products, variants, SKUs, verified attributes | Source of truth for product identity |
| Asset library | Immutable originals, derivatives, signed URLs, versions | Never silently overwrite original |
| Brand profiles | Versioned `style.md` and `visual-style.md` | User approves updates |
| AI gateway | Model routing, provider credentials, quotas, usage metering | Secrets server-side; cost ceilings |
| Orchestrator | Route intent, compose tasks, track state and retries | Least-privilege tool invocation |
| Export | Assemble packages, issue download URLs, connector actions | Approval and destination validation |
| Entitlements | App-specific purchases, plans, credits | Apple policy-aware; server verification |
| Channel adapters | OAuth, publish/update/end, fetch orders/status | Platform-specific scopes and limits |
| Inventory engine | Verified order events, stock ledger, reconciliation | Deterministic and idempotent |
| Notifications | User approval requests, failures, sale alerts | Do not claim success prematurely |
| Audit/observability | Event history, job tracing, cost, error reports | Minimize sensitive data in logs |

## 4. Lead agent delegation model
1. Receive `user_id`, `tenant_id`, `app_id`, current product/shop context, message and authorized capability manifest.
2. Classify intent and choose a bounded workflow. Simple deterministic actions bypass model reasoning.
3. Request specialist output as typed JSON with explicit confidence and missing facts.
4. Validate schemas, permissions, quotas, product versions, and approval gates before tool execution.
5. Execute tasks through a durable workflow engine with idempotency keys and retries.
6. Return user-facing result including completed, pending and failed operations.

### Specialist agents
- **Product Intelligence:** extract candidate facts from images/text; require confirmation of uncertain details.
- **Brand:** normalize approved style guides; apply tone and visual rules; never override platform policy.
- **Listing:** channel-specific copy from verified product facts and profile.
- **Image Director:** constrained editing plans; invokes image services and quality review.
- **Quality:** factual consistency, product fidelity, listing-policy checks and actionable warnings.
- **Channel Publishing:** prepares required channel fields and previews changes; adapter performs API call.
- **Inventory Intelligence:** explains conflicts and proposes recovery, but does not mutate stock directly.

Agents are reusable capabilities with explicit contracts, not necessarily separate deployed processes or separate model calls. Start with one orchestrator and a small set of tools; split services only when justified by complexity or load.

## 5. Example contracts
### `CreateListingDraft`
```json
{
  "tenant_id": "uuid",
  "product_id": "uuid",
  "product_version": 3,
  "channel": "etsy",
  "brand_profile_version_id": "uuid",
  "verified_attributes": {"material": "ceramic", "quantity": 1},
  "requested_changes": "Concise, warm tone"
}
```
Returns `draft_id`, `channel_fields`, `missing_required_fields`, `warnings`, `review_required=true`. Never publish as a side effect.

### `CreateImageEditJob`
Inputs: asset ID/version, approved edit plan, visual profile version, provider constraints, credit budget, idempotency key. Returns job ID, estimated/actual cost, derivative asset IDs, review flags. Never overwrites original.

### `PublishChannelListing`
Inputs: reviewed draft version, channel connection ID, user approval token, idempotency key. Returns external listing ID/URL and authoritative status or pending/failure. Channel adapter performs write; AI cannot directly call arbitrary URLs.

### `ProcessSaleEvent`
Inputs: authenticated channel event ID, order ID, item/quantity, status, timestamps. Returns deduplicated ledger event and queued inventory actions. No model invocation required.

## 6. Canonical product and inventory model
- `products`: product ID, tenant, title, verified attributes, category, lifecycle state.
- `variants`: variant ID, SKU, sellable quantity, stock policy.
- `channel_listings`: product/variant, platform, external ID, channel price, remote status, last observed version.
- `orders` and `order_lines`: channel IDs, verification status, quantity, fulfillment/cancellation state.
- `inventory_ledger`: append-only stock adjustments with source event IDs.
- `sync_operations`: per-channel action, idempotency key, retries, last error, state.
- `channel_connections`: encrypted tokens, scopes, expiry and health.

For one-of-a-kind items, support **ask-first** and **preauthorized auto-deactivate** modes. Verified sale events update canonical inventory and enqueue channel changes. Cross-platform overselling cannot be eliminated because events and APIs may be delayed. Never show a remote listing as inactive until the platform confirms it. Reconcile periodically and alert on discrepancies.

## 7. Cloud storage/export model
**MVP:** iOS Files picker/share sheet for user-initiated saving to supported providers (iCloud Drive, Google Drive, Dropbox when installed/configured). This is not persistent sync.

**Later:** Provider-specific OAuth integrations for folder selection, automatic uploads, resumable jobs, token refresh and sync status. Provider credentials are encrypted server-side. Export packages may contain `original/`, `edited/`, `listing.md`, and `product.json`; honor user selection and data minimization.

## 8. Style guide security and versioning
- Upload `style.md`, `visual-style.md`, examples, and reference images.
- Parse and validate into structured, versioned preferences; raw file text is untrusted data.
- Maintain clear precedence: system safety and policy > verified product facts > approved brand rules > channel formatting > per-task preferences (where compatible).
- Do not learn permanent style changes from chat without an explicit approval step.
- Profiles can be scoped to user, shop or organization with appropriate sharing permissions.

## 9. Privacy, security and platform compliance
- Supabase row-level security or equivalent authorization on every tenant-scoped table.
- Short-lived signed asset URLs, encrypted provider tokens, least-privilege scopes, rate limits and abuse controls.
- Tool allowlists; schema validation; prompt-injection defenses for imported text and images.
- Explicit approval for external publishing, deletion and exports; separate advance authorization for automatic delisting.
- App Store in-app purchase requirements and cross-app entitlements reviewed before implementation; no assumption that one purchase automatically unlocks all apps.
- Data export/deletion, privacy notices, provider processing disclosures, retention policies and audit trails.

## 10. Suggested workspace (migration later)
```text
go-commerce/
  apps/
    listly-ios/
    seller-studio-ios/
  packages/
    agent-contracts/
    product-schema/
    brand-profiles/
    design-tokens/
  services/
    orchestrator/
    ai-gateway/
    catalog/
    assets/
    exports/
    inventory/
    channel-adapters/
  agents/
    product-intelligence/
    brand/
    listing/
    image-director/
    quality/
    channel-publishing/
  docs/
    PLATFORM-ARCHITECTURE.md
    AGENT-CONTRACTS.md
    SHARED-SERVICES.md
```
Do not move the existing `go-commerce/listly` folder until code dependencies and migration steps are reviewed.

## 11. Implementation sequence
1. Establish identity, product/asset schemas, versioned brand profiles, basic AI gateway, audit and job tracking.
2. Deliver Listly's listing workflow and SellerStudio's deterministic image pipeline against shared records.
3. Add SellerStudio chat editing and approved AI image generation; measure cost and fidelity.
4. Add direct marketplace publishing with one adapter; then verified sale ingestion and deterministic inventory reconciliation.
5. Add second channel, cross-channel delisting, robust retries and notifications.
6. Expand cloud connectors, suite entitlements, web clients, and advanced image workflows.

## 12. Architecture acceptance criteria
- A product created in either app is visible in the other only to authorized users.
- Listing and image agents consume the same canonical product ID and versioned brand profile.
- User can reject an AI output without changing the canonical product or original asset.
- All external writes are authenticated, permission-checked, idempotent where supported, auditable and accurately status-reported.
- Duplicate sale events do not double-decrement inventory.
- Failed remote delisting remains visible as failed/pending and is retried or escalated.
- A disconnected cloud or marketplace account does not block local drafts and manual export.

## 13. Open decisions
- Initial tenant/shop model and user experience for connecting apps.
- Workflow engine choice and deployment topology.
- First direct marketplace integration and commercial API access.
- AI image provider and cost ceilings.
- Exact purchase/credit model per app and shared services.
- Whether a combined GO Commerce web dashboard is phase 2 or phase 3.
