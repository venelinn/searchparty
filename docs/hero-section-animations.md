# Hero & Section Entrance Animations

**Files**: `components/Hero/Hero.tsx`, `components/Hero/Hero.module.scss`, `components/Section/Section.tsx`, `components/Hero/HeroConnector.tsx`, `utils/RichText.js`, `styles/globals.scss`
**Created**: 2026-06-06

## Overview

The hero and content sections fade/scale in on load and on scroll using [GSAP](https://gsap.com/). The hero plays a one-time **entrance timeline** on mount; other sections animate when scrolled into view via `ScrollTrigger`.

Both honour `prefers-reduced-motion` through the `useReduceMotion` hook — when reduced motion is requested, the JS animation is skipped and content renders at full opacity.

## The flash-of-content problem (FOUC)

GSAP `.from()` / `.to()` timelines are created inside a `useEffect`, which runs **after** the browser's first paint. Without a guard, the sequence is:

```
1. HTML paints → hero image, content, header all fully visible
2. useEffect runs → GSAP .from() snaps them to opacity: 0
3. Timeline plays → they fade back in
```

Step 1→2 is a visible **blink** ("page renders, then disappears, then animates in").

### Fix: hide animated elements from the first paint, fade them *in*

The animated elements are set to `opacity: 0` **in CSS** so the very first paint is already hidden, then GSAP fades them in:

| Element | Hidden by | Selector |
|---------|-----------|----------|
| Hero image wrap (`.image`) + content (`.hero__content`) | `Hero.module.scss` | `[data-anim] .image`, `[data-anim] .hero__content` |
| Global `<header>` | `styles/globals.scss` | `body:has([data-anim] [data-anim='hero-content']) header` |

Both rules are wrapped in `@media (prefers-reduced-motion: no-preference)` so reduced-motion visitors — for whom the JS animation never runs — are never left with permanently hidden content.

### Scoping (why these exact selectors)

The CSS hide must only apply when GSAP **will** run and reveal the element again — otherwise content gets stuck invisible.

- The animated elements live inside the hero's `Section`, which carries `data-anim="<animationID>"` **only when the hero has an `animationID`** → guarantees the hero timeline actually runs. A hero without an `animationID` has no `[data-anim]` ancestor, so it is never hidden.
- The global header lives in the layout (outside the hero), so it can't be reached by the hero's scoped module CSS — hence the `body:has(...)` rule in `globals.scss`, keyed on the hero-only `[data-anim='hero-content']` marker.

### The header fade and LCP

The global `<header>` fades in as part of the entrance timeline. This is **LCP-safe but timing-sensitive**:

- The header logo is **not** the LCP element — the larger band logo embedded in the hero *content* is. So fading the header doesn't change which element LCP measures.
- What *does* matter is timeline ordering: the header tween carries `delay: 1` and sits **before** `hero-content` in the timeline, so it pushes the content fade (and therefore the LCP paint) out to ~2.9s. That's an accepted tradeoff for the choreographed entrance the design calls for. The LCP **warning** stays away because the content image is eager-loaded (see below) — the warning is about lazy-loading, not timing.
- If you ever need a faster LCP, move the header tween so it runs concurrently with the image (don't let its `delay` gate the content), rather than removing the fade.

## `.from()` vs `.fromTo()` — important

> **Do not use `.from({ opacity: 0 })` on an element that CSS already hides.**

`.from()` reads the element's *current* computed value as the animation's **destination**. If CSS sets `opacity: 0`, `.from({ opacity: 0 })` animates `0 → 0` and the element stays invisible forever.

Every CSS-hidden target therefore uses **`.fromTo()`** with an explicit visible end state:

```ts
timeline.fromTo(
  sectionSelector,
  { opacity: 0, scale: 1.1 },          // from (matches the CSS-hidden state)
  { opacity: 1, scale: 1, duration: 1.5, delay: 0.5, ease: 'power4.out' },
);
```

The hero entrance timeline (`heroAnimation` in `Hero.tsx`) animates, in order:

1. `section-img-wrap` (the hero background image) — `fromTo`
2. `header` — `fromTo`
3. `hero-content` — `fromTo`
4. `hero-anchor` (scroll-down chevron, rendered conditionally) — `from` (not CSS-hidden, so `from` is fine)

Each tween is guarded by an `exists()` check so conditionally-rendered targets don't throw.

## `data-anim` markers

The animation selectors key off `data-anim` attributes rather than CSS-module class names (which are hashed):

| Attribute | Element | Set by |
|-----------|---------|--------|
| `data-anim="<animationID>"` | Section root | `Section.tsx` (only when `animationID` is set) |
| `data-anim="section-img-wrap"` | Image wrapper | `Section.tsx` |
| `data-anim="section-img"` | `<Image>` | `Section.tsx` |
| `data-anim="hero-content"` | Hero content div | `Hero.tsx` |
| `data-anim="hero-anchor"` | Scroll-down chevron | `Hero.tsx` |
| `data-anim="section-title"` | Section heading | `Heading` via `Section.tsx` |

## Reduced motion

`useReduceMotion()` reads `prefers-reduced-motion`. When it returns `true`, `Hero.tsx` skips calling `heroAnimation`, and the CSS hide rules (gated on `no-preference`) don't apply — so content is visible and static. Keep these two in sync: **any element hidden by CSS for the animation must also be revealed by a JS tween, and both must be gated on the same reduced-motion condition.**

## LCP & embedded content images

The hero's text content (rendered from Contentful rich text via `utils/RichText.js`) can contain an embedded image — on the homepage it's the large band logo, which is the page's **Largest Contentful Paint** element.

Two things keep it fast and warning-free:

- **Eager loading**: `renderRichTextContent(content, { priorityFirstImage: true })` makes the **first** embedded image render with next/image `priority` (eager + preload) instead of lazy. `HeroConnector` passes this flag; other rich-text callers leave it off so below-the-fold images stay lazy. Without it, Next logs *"… was detected as the Largest Contentful Paint (LCP). Please add the `loading="eager"` property …"*.
- **`https` normalization**: `getCloudinaryImageURL()` rewrites `http://` and protocol-relative `//` Cloudinary URLs to `https://`. A protocol mismatch between the preload and the rendered `<img>` makes the browser fetch the image twice and wastes the priority hint.

> **Tradeoff**: the LCP image lives inside `hero-content`, which fades in late in the timeline (after the image and header tweens), so LCP is recorded when that fade begins (~2.5–2.9s) rather than at first paint. `priority` only controls when the image is *fetched* (eagerly, up front), not when the animation *reveals* it. This is the accepted cost of the choreographed entrance; to make LCP earlier, bring the `hero-content` tween forward in the timeline (see "The header fade and LCP" above) or stop fading the content.

## Adding a new animated element

1. Render it with a unique `data-anim` marker.
2. If it must be hidden before the entrance runs, add an `opacity: 0` rule under `@media (prefers-reduced-motion: no-preference)`, scoped so it only applies when its tween will run.
3. Animate it with **`.fromTo()`** (not `.from()`) so the visible end state is explicit.
4. Verify there's no blink (see below).

## Verifying

Load the homepage and sample opacity over the first ~2.5s — the animated elements should start at `0` and rise to `1`, never `1 → 0 → 1`. A quick Playwright probe:

```js
await page.goto('http://localhost:3018', { waitUntil: 'commit' });
for (let i = 0; i < 60; i++) {
  console.log(await page.evaluate(() =>
    [...document.querySelectorAll('[data-anim="section-img-wrap"], [data-anim="hero-content"], header')]
      .map(el => +getComputedStyle(el).opacity.toFixed(2))));
  await page.waitForTimeout(40);
}
```
