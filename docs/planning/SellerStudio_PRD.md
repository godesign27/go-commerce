# SellerStudio — Product Requirements Document

**Version:** 0.1 | **Status:** Proposed for review | **Date:** 2026-11-11  
**Portfolio:** GO Commerce | **Platform:** iPhone first, web later

## 1. Executive summary
SellerStudio is a conversational AI product-photography assistant for independent sellers, makers, artists, resellers, and small shops. Users import product photos, describe desired improvements, preview results, approve accurate images, and export marketplace-ready assets. SellerStudio operates independently but shares a user-authorized product catalog, asset library, brand profiles, and AI platform with Listly.

**Promise:** Turn everyday product photos into polished, marketplace-ready visuals without misrepresenting the item.

## 2. Goals and non-goals
### Goals
- Complete a common edit (background cleanup, crop, resize, export) in minutes.
- Preserve original files, product identity, labels, color, proportions, and distinctive details.
- Support conversational commands plus direct controls for predictable editing.
- Save approved assets to a shared product record, or export via iOS Files/share sheet.
- Let users define reusable visual styles with `visual-style.md` and reference examples.
- Make AI usage and credit consumption understandable before costly actions.

### Non-goals for MVP
- Full Photoshop-class editor, generative video, batch catalog processing, marketplace posting, or automatic cloud-folder sync.
- Guaranteeing pixel-perfect fidelity from generative editing; use deterministic operations when fidelity is critical.
- Fully automated image approval or publication.

## 3. Personas and jobs
1. **Independent seller:** Needs clean product photos quickly for online listings.
2. **Artist:** Needs artwork colors, aspect ratios, and framing presented accurately.
3. **Vintage reseller:** Needs condition details preserved, not erased by AI.
4. **Small shop owner:** Needs consistent imagery across a modest catalog.

Jobs: remove distracting backgrounds; resize to marketplace specifications; apply a repeatable visual identity; create approved images for a listing; save assets to chosen cloud storage.

## 4. Primary user journey
1. Open SellerStudio; import or photograph an item, or choose an existing GO Commerce product.
2. Choose a brand profile and optional marketplace destination.
3. App analyzes technical quality and proposes changes, clearly distinguishing observed facts from suggestions.
4. User chats or uses controls: “Use a clean white background and subtle natural shadow; do not change the label.”
5. System plans edits, estimates credit cost, and performs deterministic operations or approved generative edits.
6. App shows original versus edited versions, with zoom and side-by-side comparison.
7. User accepts, revises, or rejects each variant. Originals remain untouched.
8. User exports through Files/share sheet or attaches approved assets to the shared product record for Listly.

## 5. MVP requirements
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| SS-01 | Camera, Photos, Files import | P0 | Import JPEG/PNG/HEIC; retain immutable original and metadata when permitted |
| SS-02 | Conversational editing | P0 | User can request edits in natural language and see a clear proposed action |
| SS-03 | Deterministic image operations | P0 | Crop, resize, format conversion, padding and aspect ratio without stretching |
| SS-04 | Background cleanup | P0 | Remove/replace background with visible quality check and revert |
| SS-05 | Visual style profiles | P0 | Save, select, edit, import/export `visual-style.md` and example references |
| SS-06 | Versioned asset library | P0 | Every edit creates a new version; originals are never overwritten |
| SS-07 | Fidelity review | P0 | Original/edited comparison; warning for possible changes to item, color or text |
| SS-08 | Export | P0 | User chooses destination through iOS Files/share sheet; export single or packaged assets |
| SS-09 | Shared product association | P0 | Approved image can link to a canonical product with explicit user authorization |
| SS-10 | Cost disclosure | P0 | Before paid AI generation, show estimated credit use and require confirmation |
| SS-11 | Reliability | P0 | Failed jobs can be retried safely; state persists across app restarts |
| SS-12 | Accessibility | P0 | VoiceOver labels, Dynamic Type, adequate contrast, clear status messages |
| SS-13 | Authentication and usage controls | P1 | Sign-in, entitlements and quota enforced server-side for commercial launch |

### Phase 2
- AI lifestyle scenes and multiple variations; batch processing; direct Google Drive/Dropbox API connections; advanced templates; shared Listly handoff refinements.

### Phase 3
- Marketplace publishing via Listly, product videos, team collaboration, web editor.

## 6. Visual style profile
Each profile is scoped to a user or organization and can be assigned to a shop. It includes:
- `name`, `version`, `brand_id`, `visual-style.md` source, approved reference asset IDs.
- Background preferences, lighting, shadows, camera angle, padding, target aspect ratios, output dimensions and formats.
- **Preservation rules:** do not alter product geometry, printed text, artwork colors, logos, defects or condition evidence.
- Prohibited transformations and marketplace-specific image requirements.
- A user-approved compiled configuration for runtime; raw Markdown is treated as untrusted input, never as unrestricted tool instructions.

## 7. Agent and service responsibilities
- **Commerce Lead Agent (shared):** routes user intent; selects permitted workflows; requests clarification when needed.
- **Product Intelligence Agent (shared):** extracts candidate product attributes, flags uncertainty; never treats guesses as verified facts.
- **Brand Agent (shared):** interprets approved voice/visual profiles and checks consistency.
- **Image Director Agent (SellerStudio):** translates creative intent into bounded edit plans and calls authorized tools.
- **Quality Agent (shared):** checks output against product facts, preservation constraints and marketplace requirements; flags uncertain outcomes.
- **Image Processing Service (deterministic):** crop, resize, convert, composite and metadata operations.
- **AI Image Provider Adapter:** generative edits with job tracking, cost metering and model/provider abstraction.
- **Asset Service (shared):** immutable originals, derivatives, permissions, retention, and versions.
- **Export Service (shared):** creates approved files/packages and invokes client-side save or supported connector.

No agent has direct arbitrary database access, credential access, or permission to publish/export without the applicable authorization.

## 8. Data model (conceptual)
- `users`, `organizations`, `memberships`, `brands`
- `products` (canonical shared record), `product_assets` (asset associations)
- `assets` (immutable original/derivative refs, checksum, MIME, dimensions, owner)
- `asset_versions` (parent asset, transformation recipe, output, review status)
- `visual_profiles` (versioned Markdown, normalized settings, reference assets)
- `edit_jobs` (intent, planned operations, state, provider, cost, idempotency key)
- `approvals` (actor, target, action, timestamp)
- `export_jobs` (destination type, assets, state, audit trail)

Tenant isolation via database policies and scoped object storage; signed URLs expire; sensitive credentials remain server-side.

## 9. Quality, trust and compliance
- Original source always retrievable unless explicitly deleted by owner.
- Never claim a generative result preserves exact color or shape; warn and provide comparison.
- Default to non-generative edits for original art, branded packaging and condition-sensitive resale.
- Require user review before exporting potentially misleading altered images.
- Marketplace-specific policies are versioned and validated before publishing; image exports are not guarantees of platform acceptance.
- Explicit opt-in for processing photos with external AI providers; clear privacy and deletion policies.

## 10. Pricing experiments
Hypotheses only: limited free deterministic edits; pay-as-you-go AI credits; Pro subscription around $12.99/month with bounded AI usage. Final allowances depend on measured model costs, storage and conversion tests. Avoid unlimited generative editing claims.

## 11. Success metrics
- Time to first approved image; import-to-export completion rate.
- Percentage of outputs approved without rework; fidelity-related rejection rate.
- AI cost per approved asset; crash-free sessions; export success rate.
- 7/30-day retention, free-to-paid conversion, paid contribution margin.

## 12. Delivery plan and exit gates
**Milestone A:** Product import, versioned assets, deterministic edits, basic export. Gate: original preservation and reliable export.

**Milestone B:** Chat-driven editing, visual profiles, generative background edits, quality comparison. Gate: user testing with real products and acceptable cost per approved asset.

**Milestone C:** Shared Listly product handoff, entitlements, analytics, App Store readiness. Gate: end-to-end acceptance tests, privacy review and beta feedback.

## 13. Open decisions
- Initial editing provider and pricing/credit budget.
- Whether generative background replacement is included in the first public release or gated behind beta.
- Default image output presets by marketplace and regional rules.
- Whether shared catalog is enabled for all users by default or opt-in at first connection.
- Product and suite brand-name clearance before launch.
