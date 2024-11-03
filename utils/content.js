import { createClient } from "contentful";
import { PAGE_TYPE, SITE_CONFIG_TYPE, IS_DEV, normalizeSlug } from "./common";
import localization from "./localization";

const client = createClient({
	accessToken: IS_DEV ? process.env.CONTENTFUL_PREVIEW_TOKEN : process.env.CONTENTFUL_DELIVERY_TOKEN,
	space: process.env.CONTENTFUL_SPACE_ID,
	environment: process.env.CONTENTFUL_ENVIRONMENT || "nextjs",
	host: IS_DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

async function getEntries1(content_type, queryParams) {
	const { locale } = queryParams;
	const matchIndex = (item) => locale === item;
	const params = { ...queryParams, locale: localization.contentfulLocales[localization.locales.findIndex(matchIndex)] };
	console.log(params);
	return await client.getEntries({ content_type, ...params, include: 10 });
}

async function getEntries(content_type, queryParams) {
  const { locale } = queryParams;
  const matchIndex = localization.contentfulLocales.indexOf(locale);
  const params = { ...queryParams, locale: matchIndex !== -1 ? locale : localization.contentfulLocales[0] };
  return await client.getEntries({ content_type, ...params, include: 10 });
}

export async function getPagePaths(locale) {
	const { items } = await getEntries(PAGE_TYPE, { locale });

	return items
		.filter((x) => !["/media"].includes(x.fields.slug))
		.map((page) => {
			let slug = page.fields.slug.split("/").filter(Boolean);
			return { params: { slug }, locale: page.sys.locale.split("-")[0] };
		});
}

export async function getPages(locale) {
	let response = await getEntries(PAGE_TYPE, { locale });
	return response.items.map(mapEntry);
}


export async function getSiteConfig(locale) {
	let response = await getEntries(SITE_CONFIG_TYPE, { locale });
	const itemCount = response.items?.length;
	if (itemCount === 1) {
		return mapEntry(response.items[0]);
	} else {
		console.error("Expected 1 site config object, got:", itemCount);
		return null;
	}
}

// Add this function to fetch portfolio items
// export async function getPortfolioItems(locale) {
//   let response = await getEntries("portfolio", { locale });
//   return response.items.map(mapEntry);
// }

export async function getMediaItems(locale) {
  try {
    console.log("Fetching media items for locale:", locale);
    const response = await getEntries("media", { locale });

    if (!response.items) {
      console.error("No items found in the response:", response);
      return [];
    }

    return response.items.map(mapEntry);
  } catch (error) {
    console.error("Error fetching media items:", error);
    return [];
  }
}

export async function getContentItems(contentType = "media", locale) {
  try {
    const response = await getEntries(contentType, { locale });

    if (!response.items) {
      console.error(`No items found in the response for content type: ${contentType}`, response);
      return [];
    }

    return response.items.map(mapEntry);
  } catch (error) {
    console.error(`Error fetching items for content type: ${contentType}`, error);
    return [];
  }
}

function mapEntry(entry, localePassed) {
	const id = entry.sys?.id;
	const type = entry.sys?.contentType?.sys?.id || entry.sys?.type;
	const locale = entry.sys?.locale?.split("-")[0] || localePassed;

	if (entry?.type === "upload") {
		const { public_id, resource_type, secure_url } = entry;

		return {
			id: public_id,
			type: resource_type,
			src: secure_url,
			alt: "",
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
			...Object.fromEntries(Object.entries(entry.fields).map(([key, value]) => [key, parseField(value, locale)])),
		};
	} else {
		return null;
	}
}

function mapEntry1(entry) {

	if (entry.sys?.type === "Asset") {
		const id = entry.sys?.id;
		const type = entry.sys?.contentType?.sys?.id || entry.sys?.type;
    return {
      id,
      type,
      src: `https:${entry.fields.file.url}`,
      alt: entry.fields.title,
    };
  }

  return {
    id,
    type,
    ...Object.fromEntries(Object.entries(entry.fields).map(([key, value]) => [key, parseField(value)])),
  };
}


function parseField(value, locale) {
	if (typeof value === "object" && value.sys) return mapEntry(value, locale);
	if (Array.isArray(value)) return value.map(mapEntry);
	return value;
}

const getContentModel = async (contentType, locale) => {
  const contentfulLocale = localization.contentfulLocales[localization.locales.indexOf(locale)] || locale;

  try {
    const entries = await client.getEntries({
      content_type: contentType,
      locale: contentfulLocale,
    });
    return entries.items.map(entry => entry.fields);
  } catch (error) {
    console.error(`Error fetching entries: ${error.message}`);
    throw error;
  }
};


export const getNavigationLinks = async (pages, locale) => {
	const contentfulLocale = localization.contentfulLocales[localization.locales.indexOf(locale)] || locale;
	const customLinks = await getContentModel("customLinks", contentfulLocale);

  const remappedCustomLinks = customLinks
	.sort((a, b) => (a.order || 0) - (b.order || 0))
	.map(link => ({
    pageName: link.text,
    slug: link.url !== undefined ? link.url : null,
		locale,
    target: link.target,
    order: link.order !== undefined ? link.order : null,
    location: link.location !== undefined ? link.location : null,
  }));

  const navigationLinks = pages
	.filter((e) => e.locale === locale)
	.sort((a, b) => (a.order || 0) - (b.order || 0))
	.map((e) => ({
		pageName: e.pageName,
		slug: normalizeSlug(e.slug),
		locale: e.locale,
		order: e.order !== undefined ? e.order : null,
		location: e.location !== undefined ? e.location : null,
	}));

  return [...navigationLinks, ...remappedCustomLinks];
};
