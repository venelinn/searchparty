# CMS Page Rendering

**File**: `app/[lang]/[[...slug]]/page.tsx`
**Created**: 2026-02-25

## Overview

This is the catch-all page route that renders all CMS-driven pages from Contentful. It handles the homepage (`/bg`, `/en`) and any nested page (`/bg/about`, `/en/events`, `/bg/about/mission`, etc.).

## Route Structure

```
app/[lang]/[[...slug]]/page.tsx
         │        │
         │        └── Optional catch-all: [] = homepage, ["about"] = /about, ["about","mission"] = /about/mission
         └── Required locale: "bg" or "en"
```

## Data Flow

```
URL → params → slug → getPageBySlug() → Contentful page entry → mapEntry() → page object
                                                                                    │
                                              ┌────────────────────────────────────────┘
                                              ▼
                                        { sections, sidebar, widgets, listings }
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                         Hero (full-width)  Sections        Sidebar
                                              │               │
                                         componentMap    widgets (calendar,
                                              │          donate, subscribe)
                                              ▼
                                    Rendered components
```

## How It Works

### 1. Metadata (`generateMetadata`)

Fetches the page and extracts the linked `metaData` Contentful entry to build `<title>`, `<meta description>`, `<meta keywords>`, and Open Graph tags via `buildMetadata()`.

### 2. Page Fetch

```
params.slug = ["about", "mission"]  →  path = "about/mission"
params.slug = []                    →  path = "/"  (homepage)
```

- Validates the locale against `localization.locales`
- Calls `getPageBySlug(path, contentfulLocale, preview)` to fetch from Contentful
- Returns `notFound()` if page doesn't exist or locale is invalid

### 3. Page Structure from Contentful

Each Contentful page entry resolves to:

| Field | Type | Description |
|-------|------|-------------|
| `sections` | `Section[]` | Ordered list of content sections (hero, section, events, etc.) |
| `sidebar` | `boolean` | Whether to show the sidebar layout |
| `widgets` | `WidgetType[]` | Sidebar widgets: `"calendar"`, `"donate"`, `"subscribe"` |
| `listings` | `string[]` | Content listings to show: `"events"`, `"news"` |

### 4. Hero Detection

The page checks if the **first section** is a hero:

- Direct: `firstSection.type === "hero"`
- Nested: first section is a `"section"` wrapper whose first child is `"hero"`

If a hero is found, it renders **outside** the sidebar layout (full-width), and the remaining sections render below it.

### 5. Section Rendering

Each section is rendered via `componentMap`:

| Contentful Type | Component |
|----------------|-----------|
| `hero` | `HeroConnector` |
| `section` | `SectionConnector` (wrapper with children) |
| `imageContent` | `ImageContentConnector` |
| `contacts` | `ContactsConnector` |
| `collection` | `CollectionConnector` |
| `paragraph` | `ParagraphConnector` |
| `events` | `EventsConnector` |
| `table` | `TableConnector` |

**Section wrappers** (`type === "section"`) contain nested children in one of three arrays: `components`, `items`, or `content`. Each child is resolved from `componentMap` and rendered inside `<SectionConnector>`.

**Slider detection**: If a section's first child is a `slider`, extra section props are computed via `getSliderSectionProps()`.

### 6. Sidebar Layout

When `sidebar === true` or `listings` is non-empty:

```
┌──────────────────────────────────────────┐
│  Hero (full width, outside sidebar)      │
├──────────────────────┬───────────────────┤
│  Main content        │  Sidebar          │
│  - Listings          │  - Calendar       │
│  - Sections          │  - Donate         │
│                      │  - Subscribe      │
└──────────────────────┴───────────────────┘
```

Without sidebar, sections render full-width.

### 7. Preview Mode

When `draftMode()` is enabled, `getPageBySlug` fetches from Contentful's Preview API (draft content). The layout shows a yellow preview banner (handled in `[lang]/layout.tsx`).

### 8. Empty State

In development only (`IS_DEV`), pages with no sections and no hero show a dashed-border placeholder: "Empty page! Add sections."

## Key Dependencies

| Import | Purpose |
|--------|---------|
| `componentMap` | Maps Contentful content types → React components |
| `getPageBySlug` | Fetches + resolves a Contentful page by slug |
| `buildMetadata` | Constructs Next.js Metadata from Contentful `metaData` entry |
| `SectionConnector` | Wraps section children with layout/styling props |
| `ListingsConnector` | Renders event/news listing cards |
| `Sidebar` | Sidebar wrapper component |
| `getSliderSectionProps` | Computes section props when child is a slider |
