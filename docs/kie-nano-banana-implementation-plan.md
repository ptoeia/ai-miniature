# KIE Nano Banana Integration Plan

This document outlines the implementation plan to integrate KIE Nano Banana (Google Gemini 2.5 Flash Image Preview) into our generate API. It follows maintainability and SOLID principles.

## Goals
- Replace/augment current image generation with KIE Nano Banana.
- Keep existing UX: auth, credits check, timeouts, progress/error messaging.
- Clean abstractions for easy provider changes.

## Architecture Overview
- **KieClient (lib/kie/KieClient.ts)**
  - Interface-driven client (`IKieClient`) encapsulating HTTP, retries, and error mapping.
  - Exposes `generateImage()` and (if async) `getTaskStatus()`.
- **DTOs (lib/kie/dto.ts)**
  - Typed request/response shapes for KIE endpoints.
  - Mappers from our `imageGenerationSchema` to KIE payload.
- **Errors (lib/kie/errors.ts)**
  - `AuthError`, `RateLimitError`, `ValidationError`, `ServiceError`, `TimeoutError` for normalized handling.
- **API Routes**
  - `app/api/generate/route.ts`: public entry. Auth + credits + validation, calls KieClient, returns final image URL.
  - `app/api/generate/kie/route.ts`: optional direct KIE test endpoint for debugging.
- **Config**
  - Add to `config.ts` and `.env`: `KIE_API_KEY`, `KIE_BASE_URL`, `KIE_MODEL`, `KIE_TIMEOUT_MS`, `KIE_USE_ASYNC`.

## Confirmed Decisions
- **Async strategy**: Frontend polling. The API creates job (if async) and returns a task identifier and minimal metadata; the frontend polls KIE status until completion/timeout, then fetches the final image.
- **Uploads first**: Implement KIE File Upload step before generate. We will upload local files to KIE, receive hosted URLs, and pass them as `input_images` to the generate API.

## Model Types
- **text_to_image**: Generate images purely from text prompt.
- **image_edit**: Edit based on 1–5 input images (style transfer, background change, restoration, etc.). Sub‑types (e.g., inpainting) can be modeled as parameters under `image_edit` without adding new top‑level types.

## Request Flow
1. Validate body with `imageGenerationSchema` (prompt, model, aspectRatio, randomSeed, optional images).
2. Auth check via Supabase; fetch credits; ensure sufficient.
3. Build KIE request from DTO mapper.
4. Call KIE:
   - **Sync**: return image URL/base64 directly.
   - **Async**: create task → poll status until `completed|failed|timeout` (exponential backoff).
5. On success: deduct credits, return `{ success, imageUrl, creditsUsed, remainingCredits }`.
6. On failure: map KIE error → normalized error, do not deduct credits, return helpful message.

## Parameter Mapping
- `prompt` → KIE `prompt`.
- `model` → `google/nano-banana` (configurable).
- `aspectRatio` → map to KIE-supported parameter (or resolution profile if required).
- `randomSeed` → pass-through if supported.
- `images` (optional) → `input_images` for editing:
  - If KIE supports external URLs: pass URLs.
  - If upload required: use KIE File Upload API first; then pass returned URLs.

## Endpoints (to confirm with KIE docs)
- Base URL: `KIE_BASE_URL` (likely `https://api.kie.ai`).
- Generate endpoint: `/api/v1/.../generate` (exact path to confirm).
- Status endpoint (async): `/api/v1/.../status/:taskId`.
- File upload endpoint (if needed) for multipart/form-data.
- Auth: `Authorization: Bearer ${KIE_API_KEY}`.

## Timeouts, Retries, and Polling
- Use undici Agent plus per-request `AbortController` timeouts (`KIE_TIMEOUT_MS`).
- Retries (with jitter) only on idempotent operations (status polling; 5xx/429 scenarios).
- Polling budget: configurable max total wait (e.g., 60–90s) before returning timeout.

## Error Handling and User Messages
- Map KIE responses:
  - 401/403 → AuthError (invalid/missing key).
  - 429 → RateLimitError (propagate `Retry-After` when present).
  - 400-range → ValidationError (bad prompt/params).
  - 5xx/network → ServiceError (transient).
- Return concise messages: insufficient credits, invalid prompt, file too large, rate limit.

## Security & Compliance
- Never log raw API keys; redact sensitive fields.
- Proxy image downloads via `/api/image-proxy?url=...` to avoid CORS/data leaks.
- Validate uploaded files against existing `fileValidation` utilities before sending to KIE.

## Observability
- Generate a request ID / idempotency key for each call; forward to KIE if supported.
- Structured logs: start/end, elapsed ms, KIE status transitions, redacted payloads.
- Metrics hooks for success/failure/timeout/retry counts.

## Rate Limiting & Idempotency
- Optionally throttle per user/IP to protect credits and KIE quotas.
- Support `Idempotency-Key` header with short TTL cache for duplicate-submission protection.

## Configuration Checklist
- `.env` additions:
  - `KIE_API_KEY=...`
  - `KIE_BASE_URL=https://api.kie.ai`
  - `KIE_MODEL=google/nano-banana`
  - `KIE_TIMEOUT_MS=180000`
  - `KIE_USE_ASYNC=true|false`
- `next.config.mjs`: if switching to `next/image` for KIE URLs, allow remote domain(s).

## Testing Plan
- Unit tests for `KieClient` (mock fetch) covering success and error mapping.
- Integration tests for API routes ensuring auth, credits, and error propagation.
- Optional E2E against KIE sandbox (guarded by env flag).

## Open Points To Confirm
- Exact generate/status/upload endpoint paths & parameter names.
- Whether image inputs accept external URLs directly.
- Response payload fields: `image_url`, `images[]`, or base64.
- Supported options: aspect ratio, negative prompts, seed, safety toggles.
- Rate-limit headers and recommended backoff.

## Implementation Steps
1. Create `lib/kie/dto.ts`, `lib/kie/errors.ts`, and `lib/kie/KieClient.ts`.
2. Add env/config keys and loaders in `config.ts`.
3. Wire `app/api/generate/route.ts` to `KieClient` (auth + credits + validation retained).
4. Implement async polling path (with backoff) and timeout.
5. Add logging/metrics and idempotency support.
6. Write unit/integration tests; add minimal E2E if feasible.
