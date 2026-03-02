# Metadata & SSR Architecture

**Created**: 2026-02-17
**Updated**: 2026-02-25

## Related

- Metadata helper: `components/MetaData.tsx` — `buildMetadata()`
- CMS pages: `app/[lang]/[[...slug]]/page.tsx` — `generateMetadata()`
- Event detail: `app/[lang]/events/[...slug]/page.tsx` — `generateMetadata()`
- News detail: `app/[lang]/news/[...slug]/page.tsx` — `generateMetadata()`

## Overview

All pages use the Next.js App Router `generateMetadata` API instead of the legacy `<Head>` / `useRouter` pattern from Pages Router. A shared `buildMetadata()` utility constructs the `Metadata` object from Contentful or API data.

## How It Works

### `buildMetadata()` utility

Located in `components/MetaData.tsx`. Accepts:

| Param             | Type              | Description                              |
|-------------------|-------------------|------------------------------------------|
| `pageTitle`       | `string \| null`  | Page title; falls back to `SITE_NAME`    |
| `pageDescription` | `string \| null`  | Meta description                         |
| `keywords`        | `string \| null`  | Meta keywords                            |
| `image`           | `string \| null`  | OG image URL; falls back to default      |
| `type`            | `string`          | OG type (`website` or `article`)         |
| `path`            | `string`          | URL path (without locale prefix)         |
| `locale`          | `string`          | Language code (e.g. `en`, `fr`)          |

Returns a Next.js `Metadata` object with `title`, `description`, `keywords`, `alternates.canonical`, `openGraph`, and `robots`.

### Per-page metadata sources

| Route                              | Source                              | Dynamic? |
|------------------------------------|-------------------------------------|----------|
| `[lang]/[[...slug]]`               | Contentful `metaData` linked entry  | Per-page |
| `[lang]/events/[...slug]`          | Event `venue`, `date`, `cover`      | Per-event |
| `[lang]/news/[...slug]`            | News `heading`, `cover`             | Per-article |

## CMS Pages (`[[...slug]]`)

The `generateMetadata` export in `page.tsx`:

1. Resolves params and fetches page data via `getPageBySlug()`
2. Extracts the linked `metaData` entry (Contentful content type: `metaData`)
3. Passes `pageTitle`, `pageDescription`, `keywords` to `buildMetadata()`

The Contentful `metaData` content model has these fields:
- **Title** — internal label (not rendered)
- **Page Title** — used as `<title>` and `og:title`
- **Page Description** — used as `<meta name="description">` and `og:description`
- **Keywords** — used as `<meta name="keywords">`

## Event Detail (`events/[...slug]`)

The `generateMetadata` export:

1. Finds the event by matching the Bulgarian heading slug
2. Builds title from `venue` + `date`, description from `venue`
3. Uses event `cover` image as OG image when available
4. Passes `type: "article"` and `path: "events/<slug>"` to `buildMetadata()`

## News Detail (`news/[...slug]`)

The `generateMetadata` export:

1. Finds the news item by matching the Bulgarian heading slug
2. Uses the heading text as title and description
3. Uses news `cover` image as OG image when available
4. Passes `type: "article"` and `path: "news/<slug>"` to `buildMetadata()`

## Code Pattern

```typescript
import type { Metadata } from "next"
import { buildMetadata } from "@/components/MetaData"

export async function generateMetadata(props: {
  params: Promise<{ lang: string; /* ... */ }>
}): Promise<Metadata> {
  const { lang } = await props.params
  // fetch data...
  return buildMetadata({
    pageTitle: "...",
    pageDescription: "...",
    image: "...",       // OG image URL (optional)
    type: "website",    // or "article" for detail pages
    path: "...",
    locale: lang,
  })
}
```

## Environment Variables

| Variable                  | Usage                          |
|---------------------------|--------------------------------|
| `NEXT_PUBLIC_BASE_URL`    | Canonical URL prefix           |
| `NEXT_PUBLIC_SITE_NAME`   | Default title / og:site_name   |
