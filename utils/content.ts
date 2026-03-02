/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createClient,
  type EntryCollection,
  type EntrySkeletonType,
} from 'contentful';
import { normalizeSlug, PAGE_TYPE, SITE_CONFIG_TYPE } from './common';
import { localization } from './localization';

const deliveryClient = createClient({
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || '',
  space: process.env.CONTENTFUL_SPACE_ID || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  host: 'cdn.contentful.com',
});

const previewClient = process.env.CONTENTFUL_PREVIEW_TOKEN
  ? createClient({
      accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN || '',
      space: process.env.CONTENTFUL_SPACE_ID || '',
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
    })
  : null;

function getClient(isPreview?: boolean) {
  if (isPreview && previewClient) return previewClient;
  if (isPreview && !previewClient) {
    console.warn(
      'Preview client requested but CONTENTFUL_PREVIEW_TOKEN is missing. Falling back to delivery client.',
    );
  }
  return deliveryClient;
}

function getContentfulLocale(locale: string): string {
  const idx = localization.locales.indexOf(locale);
  if (idx === -1) return localization.contentfulLocales[0];
  return localization.contentfulLocales[idx];
}

async function getEntries<T extends EntrySkeletonType = EntrySkeletonType>(
  content_type: string,
  queryParams: { locale: string; [key: string]: unknown },
  options?: { preview?: boolean },
): Promise<EntryCollection<T>> {
  const client = getClient(options?.preview);
  const { locale } = queryParams;

  const matchIndex = localization.contentfulLocales.indexOf(locale);
  const contentfulLocale =
    matchIndex !== -1 ? locale : localization.contentfulLocales[0];

  const params = {
    ...queryParams,
    locale: contentfulLocale,
    include: 10,
  };

  return client.getEntries({
    content_type,
    ...params,
  });
}

/**
 * Resolves a Contentful entry ID to a URL path for the preview redirect.
 * Supports: page. Returns null for unsupported types.
 */
export async function getPreviewPathForEntry(
  entryId: string,
  locale: string,
): Promise<string | null> {
  const client = getClient(true);
  const contentfulLocale = getContentfulLocale(locale);
  try {
    const entry = await client.getEntry(entryId, { locale: contentfulLocale });
    const contentType = entry.sys?.contentType?.sys?.id;
    const fields = (entry.fields || {}) as Record<string, unknown>;

    if (contentType === PAGE_TYPE) {
      const slug = fields.slug as string | undefined;
      if (!slug) return null;
      const path = slug === '/' ? '' : String(slug).replace(/^\/+|\/+$/g, '');
      return path ? `/${path}` : '/';
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches a single page entry by its slug.
 */
export async function getPageBySlug(
  slug: string,
  locale: string,
  preview?: boolean,
) {
  const pageSlug = slug === '/' ? '/' : slug;

  const { items } = await getEntries(
    PAGE_TYPE,
    {
      locale,
      'fields.slug': pageSlug,
      limit: 1,
    },
    { preview },
  );

  if (items.length === 0 && pageSlug.includes('/')) {
    const leafSlug =
      pageSlug.split('/').filter(Boolean).slice(-1)[0] || pageSlug;
    const fallback = await getEntries(
      PAGE_TYPE,
      {
        locale,
        'fields.slug': leafSlug,
        limit: 1,
      },
      { preview },
    );
    if (fallback.items.length > 0) {
      return mapEntry(fallback.items[0]);
    }
  }

  if (items.length > 0) {
    return mapEntry(items[0]);
  }
  return null;
}

export async function getPagePaths(locale: string, preview?: boolean) {
  const { items } = await getEntries(PAGE_TYPE, { locale }, { preview });

  return items
    .filter((x: any) => !['/media'].includes(x.fields.slug))
    .map((page: any) => {
      const slug = page.fields.slug.split('/').filter(Boolean);
      return {
        params: { slug },
        locale: page.sys.locale.split('-')[0],
      };
    });
}

export async function getPages(locale: string, preview?: boolean) {
  const response = await getEntries(PAGE_TYPE, { locale }, { preview });
  return response.items.map(entry => mapEntry(entry));
}

export type SiteConfig = {
  fallbackEvents?:
    | { src?: string; url?: string; secure_url?: string }
    | Record<string, unknown>;
  fallbackEvent?:
    | { src?: string; url?: string; secure_url?: string }
    | Record<string, unknown>;
  fallbackNews?:
    | { src?: string; url?: string; secure_url?: string }
    | Record<string, unknown>;
  eventsHero?: Record<string, unknown>[];
  eventsPerPage?: number;
  listingEvents?: number;
  listingNews?: number;
  [key: string]: unknown;
};

export async function getSiteConfig(
  locale: string,
  preview?: boolean,
): Promise<SiteConfig | null> {
  const response = await getEntries(SITE_CONFIG_TYPE, { locale }, { preview });
  const itemCount = response.items?.length;
  if (itemCount === 1) {
    return mapEntry(response.items[0]) as SiteConfig;
  }
  console.error('Expected 1 site config object, got:', itemCount);
  return null;
}

export async function getMediaItems(locale: string, preview?: boolean) {
  try {
    const response = await getEntries('media', { locale }, { preview });
    if (!response.items) {
      console.error('No items found in the response:', response);
      return [];
    }
    return response.items.map(entry => mapEntry(entry));
  } catch (error) {
    console.error('Error fetching media items:', error);
    return [];
  }
}

export async function getContentItems(
  contentType: string = 'media',
  locale: string,
  preview?: boolean,
) {
  try {
    const response = await getEntries(contentType, { locale }, { preview });
    if (!response.items) {
      console.error(
        `No items found in the response for content type: ${contentType}`,
        response,
      );
      return [];
    }
    return response.items.map(entry => mapEntry(entry));
  } catch (error) {
    console.error(
      `Error fetching items for content type: ${contentType}`,
      error,
    );
    return [];
  }
}

export async function getContentItem(
  contentType: string,
  id: string,
  locale: string,
  preview?: boolean,
) {
  const client = getClient(preview);
  const res = await client.getEntries({
    content_type: contentType,
    'sys.id': id,
    locale: getContentfulLocale(locale),
    include: 10,
  });
  const item = res.items[0];
  return item ? mapEntry(item) : null;
}

function mapEntry(entry: any, localePassed?: string): any {
  const id = entry.sys?.id;
  const type = entry.sys?.contentType?.sys?.id || entry.sys?.type;
  const locale = entry.sys?.locale?.split('-')[0] || localePassed;

  if (entry?.type === 'upload') {
    const { public_id, resource_type, secure_url } = entry;
    return {
      id: public_id,
      type: resource_type,
      src: secure_url,
      alt: '',
      locale,
      width: entry.width,
      height: entry.height,
    };
  }

  if (entry.fields) {
    return {
      id,
      type,
      locale,
      ...Object.fromEntries(
        Object.entries(entry.fields).map(([key, value]) => [
          key,
          parseField(value, locale),
        ]),
      ),
    };
  }
  return null;
}

function parseField(value: any, locale: string): any {
  if (typeof value === 'object' && value?.sys) return mapEntry(value, locale);
  if (Array.isArray(value)) {
    return value.map(v => {
      if (typeof v !== 'object' || v === null) return v;
      return mapEntry(v, locale);
    });
  }
  return value;
}

async function getContentModel(
  contentType: string,
  locale: string,
  preview?: boolean,
) {
  const contentfulLocale =
    localization.contentfulLocales[localization.locales.indexOf(locale)] ||
    locale;
  try {
    const client = getClient(preview);
    const entries = await client.getEntries({
      content_type: contentType,
      locale: contentfulLocale,
      include: 10,
    });
    return entries.items.map(entry => entry.fields);
  } catch (error: any) {
    console.error(`Error fetching entries: ${error.message}`);
    throw error;
  }
}

/**
 * Navigation links: pages + custom links from Contentful.
 * Keeps the exact logic from the original content.js.
 */
export async function getNavigationLinks(
  pages: any[],
  locale: string,
  preview?: boolean,
) {
  const contentfulLocale =
    localization.contentfulLocales[localization.locales.indexOf(locale)] ||
    locale;
  const customLinks = await getContentModel(
    'customLinks',
    contentfulLocale,
    preview,
  );

  const remappedCustomLinks = customLinks
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    .map((link: any) => ({
      pageName: link.text,
      slug: link.url !== undefined ? link.url : null,
      locale,
      target: link.target,
      order: link.order !== undefined ? link.order : null,
      location: link.location !== undefined ? link.location : null,
    }));

  const navigationLinks = pages
    .filter(e => e.locale === locale)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(e => ({
      pageName: e.pageName,
      slug: normalizeSlug(e.slug),
      locale: e.locale,
      order: e.order !== undefined ? e.order : null,
      location: e.location !== undefined ? e.location : null,
    }));

  return [...navigationLinks, ...remappedCustomLinks];
}

export async function getAllEvents(locale: string, preview?: boolean) {
  const contentfulLocale = getContentfulLocale(locale);
  const { items } = await getEntries(
    'event',
    { locale: contentfulLocale, limit: 100 },
    { preview },
  );
  return items.map(entry => mapEntry(entry));
}

export async function getAllNews(locale: string, preview?: boolean) {
  const contentfulLocale = getContentfulLocale(locale);
	const { items } = await getEntries(
    'news',
    { locale: contentfulLocale, limit: 100 },
    { preview },
  );
  return items.map(entry => mapEntry(entry));


}

/** Extracts image URL from site config fallback (Cloudinary asset or array). */
export function getFallbackImageUrl(obj: unknown): string | null {
  if (!obj || typeof obj !== 'object') return null;

  if (Array.isArray(obj) && obj[0]) {
    const first = obj[0] as Record<string, unknown>;
    const url = (first.secure_url ?? first.url ?? first.src) as
      | string
      | undefined;
    if (typeof url === 'string' && url) return url;
  }

  const o = obj as Record<string, unknown>;
  const topLevel = (o.secure_url ?? o.url ?? o.src) as string | undefined;
  if (typeof topLevel === 'string' && topLevel) return topLevel;

  const image = o.image;
  if (Array.isArray(image) && image[0]) {
    const first = image[0] as Record<string, unknown>;
    const imgUrl = (first.secure_url ?? first.url ?? first.src) as
      | string
      | undefined;
    if (typeof imgUrl === 'string' && imgUrl) return imgUrl;
  }
  if (image && typeof image === 'object' && !Array.isArray(image)) {
    const img = image as Record<string, unknown>;
    const imgUrl = (img.secure_url ?? img.url ?? img.src) as string | undefined;
    if (typeof imgUrl === 'string' && imgUrl) return imgUrl;
  }
  return null;
}


export type ListingsSection = {
  type: "events" | "news";
  cards: Array<{ type: string; date?: string; [key: string]: unknown }>;
  hasMore: boolean;
};

export type ListingsDataResult = {
  sections: ListingsSection[];
  siteConfig: SiteConfig | null;
};

/**
 * Fetches listing data for Page model "listings" field.
 * Returns separate sections for events and news, each with its own limit from site config.
 */
export async function getListingsData(
  listingTypes: string[],
  locale: string,
  options?: { limit?: number; preview?: boolean },
): Promise<ListingsDataResult> {
  const defaultLimit = options?.limit ?? 5;
  const preview = options?.preview ?? false;
  const sections: ListingsSection[] = [];

  const siteConfig = await getSiteConfig(locale, preview);
  const eventsLimit = Number(siteConfig?.listingEvents) || defaultLimit;
  const newsLimit = Number(siteConfig?.listingNews) || defaultLimit;

  for (const listingType of listingTypes) {
    if (listingType === "events") {
      const events = await getAllEvents(locale, preview);
      const eventCards = events.map((e) => ({ ...e, type: "event" }));
      const today = new Date();
      const upcoming = eventCards
        .filter((e) => new Date(e.date || 0) > today)
        .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
      const past = eventCards
        .filter((e) => new Date(e.date || 0) <= today)
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      const limitedUpcoming = upcoming.slice(0, eventsLimit);
      const pastSlots = Math.max(0, eventsLimit - limitedUpcoming.length);
      const limitedPast = past.slice(0, pastSlots);
      const cards = [...limitedUpcoming, ...limitedPast];
      sections.push({
        type: "events",
        cards,
        hasMore: eventCards.length > eventsLimit,
      });
    }
    if (listingType === "news") {
      try {
        const news = await getAllNews(locale, preview);
        const newsCards = news.map((item) => ({ ...item, type: "news" }));
        const sorted = newsCards.sort((a, b) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA;
        });
        sections.push({
          type: "news",
          cards: sorted.slice(0, newsLimit),
          hasMore: sorted.length > newsLimit,
        });
      } catch {
        // news content type may not exist yet
      }
    }
  }

  return { sections, siteConfig };
}

/**
 * Fetches only upcoming/available events (future dates)
 * Useful for calendars and event listings that should only show future events
 */
export async function getAvailableEvents(locale: string, preview?: boolean) {
  const allEvents = await getAllEvents(locale, preview);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter to only future events and sort by date ascending
  return allEvents
    .filter((event: any) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
}
