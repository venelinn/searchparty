# Contentful Caching — Pure-Webhook Model

**Created**: 2026-06-06

## Related

- Cache wrapper: `utils/contentful-cache.ts`
- Data layer (all reads funnel here): `utils/content.ts`
- Revalidation logic: `utils/revalidation.ts`
- Webhook endpoint: `app/api/revalidate/route.ts`
- Env template: `.env.example` — `CONTENTFUL_REVALIDATE_SECRET`
- Health probe: `app/api/health/route.ts`
- Manual purge: `scripts/purge-cache.js` (`pnpm purge-cache`)

## Overview

Every Contentful read is cached **indefinitely** and only refreshed when an
editor publishes. Ordinary visitors and crawlers are served from cache and spend
**zero** Contentful API calls. The CMS is queried only (a) at build time and
(b) once per cache entry after a publish webhook busts the cache.

There is **no numeric `revalidate`** anywhere — content is not refreshed on a
timer, never per visitor. This replaced the earlier time-based ISR
(`export const revalidate = 3600 / 86400` on the events/media routes).

```
Visitor / crawler traffic ───▶ Next data cache (revalidate:false) ───▶ HTML
                                      ▲ zero Contentful calls
                                      │
Editor clicks Publish in Contentful   │ (only refetch trigger)
   │ webhook (shared-secret header)
   ▼
POST /api/revalidate ─ auth ─▶ revalidateTag("contentful","max")  ← busts ALL cached reads
                              + revalidatePath("/", "layout")      ← clears rendered HTML
```

### Why this over time-based ISR

A short `revalidate` lets crawlers (Googlebot etc.) trigger constant CMS
refetches and burn the Contentful API quota; a long one makes editors wait to
see published changes. The pure-webhook model removes the trade-off: content is
cached as cheaply as possible (indefinitely) yet refreshes immediately on
publish.

## How It Works

### 1. The cache wrapper (`utils/contentful-cache.ts`)

`cachedContentful(fn, keyParts, opts?)` wraps any async Contentful fetch:

- **Production** → `unstable_cache(fn, keyParts, { revalidate: false, tags: ["contentful"] })`.
  Cached forever; refetched only when the `contentful` tag is busted.
- **`next dev`** → an in-process memo (`devMemo`), *not* `unstable_cache`
  (which would persist to `.next/cache` on disk and survive restarts, hiding
  freshly published content). Repeated requests/hot-reloads cost zero Contentful
  calls; **restart the dev server to pick up newly published content**.
- **`opts.bypass`** → skips the cache entirely. Used for preview/draft so editors
  always read fresh drafts.

`CONTENTFUL_TAG = "contentful"` is the single tag every cached read carries, so
one `revalidateTag` call invalidates all of them. Keep this string identical in
`contentful-cache.ts` and `revalidation.ts`.

> **`keyParts` must uniquely identify the result.** Include every argument that
> changes it (content type, locale, slug, serialized query params). A collision
> serves the wrong content from cache.

### 2. The data layer (`utils/content.ts`)

All public Contentful reads funnel through one choke point, `getEntries`, which
is where caching is applied — so the whole app inherits it:

```ts
return cachedContentful(
  () => client.getEntries<T>({ content_type, ...params }),
  [content_type, JSON.stringify(params), String(preview)], // unique key
  { bypass: preview },
);
```

Two reads that don't go through `getEntries` are wrapped directly with the same
pattern: `getContentItem` (key `["item", contentType, id, locale, preview]`) and
`getContentModel` (key `["model", contentType, locale, preview]`).

`getPageBySlug` is wrapped in React `cache()` so the two calls per request
(`generateMetadata` + the page body) dedupe into one — important in preview,
where the data cache is bypassed and both would otherwise hit Contentful.

### 3. Preview / draft bypass

Pages read `const { isEnabled } = await draftMode()` and thread it down as the
`preview` flag → `cachedContentful(..., { bypass: true })`. So:

- **Published traffic** → delivery client (`cdn.contentful.com`), cached forever,
  busted only on publish.
- **Preview traffic** → preview client (`preview.contentful.com`), cache
  bypassed, always fresh drafts.

`draftMode()` only flips a route to dynamic rendering when the draft cookie is
present, so normal visitors still get static/cached pages. See
`docs/contentful-preview.md` for the full preview flow.

### 4. The webhook endpoint (`app/api/revalidate/route.ts`)

Thin orchestration — configured → authorized → revalidate → respond. Auth
accepts `Authorization: Bearer <secret>` **or** `x-revalidate-secret: <secret>`
and **fails closed**: no secret set → `500`, bad/missing secret → `401`.
`export const runtime = "nodejs"` is required (ISR manifest updates need Node,
not Edge).

`revalidateContentful()` (in `utils/revalidation.ts`) does two things:

1. **Primary:** `revalidateTag("contentful", "max")` — busts every cached read.
   (The `"max"` profile arg is required in Next 16+.)
2. **Safety net:** `revalidatePath("/", "layout")` — clears the rendered HTML
   subtree from the root layout down (covers Netlify's durable HTML cache).

Single-locale (`en`) means one root path covers the whole tree — no per-locale
loop. The sitemap is generated at build time by `next-sitemap` (postbuild), so
there is no runtime sitemap route to revalidate.

A successful call returns:

```json
{ "revalidated": true, "paths": ["tag:contentful", "/ (layout)"] }
```

## Setup

### Environment

```bash
CONTENTFUL_DELIVERY_TOKEN=     # published content (cdn.contentful.com)
CONTENTFUL_PREVIEW_TOKEN=      # drafts (preview.contentful.com) — enables preview
CONTENTFUL_HOST=               # optional preview host override
# Shared secret for POST /api/revalidate. Send as
# Authorization: Bearer <value> OR x-revalidate-secret: <value>.
CONTENTFUL_REVALIDATE_SECRET=
```

Set `CONTENTFUL_REVALIDATE_SECRET` in the Netlify env too (never commit the real
value).

### Contentful webhook

Settings → Webhooks → add one:

- **URL**: `POST https://<your-domain>/api/revalidate`
- **Triggers**: Entry → **Publish** and **Unpublish** (add Asset → Publish/
  Unpublish if assets render directly)
- **Header**: `x-revalidate-secret: <the same secret>`

> Deploy the route + env var to production **before** wiring the webhook. A
> `200 { revalidated: true }` only means Next accepted the request.

### Is the webhook required?

No — it's only needed if published Contentful edits should appear **without a
redeploy**. Without it, the indefinite cache refreshes on **rebuild only**, so a
publish stays invisible on the live site until the next deploy. The cache works
fine either way; the route just returns `500 "not configured"` when the secret
is unset (fail-closed, safe). If real people edit content in Contentful, set it.

## Checking and forcing it

Two tools, because the failure mode here is **silent**.
`isRevalidationConfigured()` is checked *before* auth in the route, so if
`CONTENTFUL_REVALIDATE_SECRET` is not set **on the deployment**, every caller —
the Contentful webhook included — gets `500 "Revalidation is not configured"`
and nothing surfaces it. Combined with `revalidate: false`, the site then serves
whatever it first cached, indefinitely. A sibling project ran that way for
months; an unpublished page stayed live and a redeploy did not fix it.

**Is this deployment able to refresh at all?**

```bash
curl -s https://searchpartyottawa.ca/api/health
# {"ok":true,"revalidation":"configured"}   ← good
# {"ok":true,"revalidation":"missing"}      ← the webhook is failing silently
```

`app/api/health/route.ts` reports presence only, never the value, and keeps
`ok: true` either way so it still works as a plain liveness probe.

A quicker one-off check without deploying anything: POST to `/api/revalidate`
with **no** secret. `401` means the secret is configured (auth simply rejected
you); `500 "not configured"` means it is missing.

**Force a refresh** when an edit or unpublish does not appear to land:

```bash
pnpm purge-cache                                # ⚠ defaults to PRODUCTION
PURGE_URL=http://localhost:3018 pnpm purge-cache
```

`scripts/purge-cache.js` POSTs to `/api/revalidate` with the secret from `.env`,
exits non-zero on failure, and explains the two common failures (500 → secret
missing on the deployment; 401 → local secret does not match).

Two limits worth knowing:

- **It does not refresh `sitemap.xml`.** `next-sitemap` generates that in
  `postbuild`, so the sitemap only changes on a redeploy.
- **It does nothing useful against `next dev`.** Development memoizes reads
  in-process (the `devMemo` in `utils/contentful-cache.ts`), and that memo is
  not reachable from a route handler — restart the dev server instead.

## Guardrails — do not regress

1. **No numeric `revalidate` on any CMS-backed route or the sitemap.** It
   re-enables traffic-driven polling and burns the Contentful quota — the exact
   thing this model avoids. Each route carries a comment saying so.
2. **`revalidateTag("contentful", "max")` is the primary lever.** The
   `revalidatePath("/", "layout")` is a belt-and-suspenders HTML bust.
3. **Use `"layout"`, not `"page"`, in `revalidatePath`.** `"page"` alone can
   leave a stale homepage/listings rendered by the root layout.
4. **Keep `export const runtime = "nodejs"` on the route.**
5. **Fail closed.** No secret → `500`; bad/missing secret → `401`.
6. **`keyParts` must be fully unique.** Include every argument that changes the
   result.
7. **Don't use `unstable_cache` in `next dev`.** The in-process `devMemo` is
   intentional — restart the dev server to see newly published content.

## Notes

- **Node ≥ 22 is required** to build (`.nvmrc` = `22.22.2`). Older Node breaks
  the `build-dictionary` step before `next build` even runs. Run `nvm use` first.
- `/[[...slug]]` builds as dynamic (`ƒ`) because it calls `draftMode()` at the
  top level. That's expected — the dynamic/static label is about *HTML* caching;
  this strategy caches at the *data* layer, so a per-request render still costs
  zero Contentful calls on a cache hit. `/events` and `/media` stay static and
  only flip dynamic when the draft cookie is present.
