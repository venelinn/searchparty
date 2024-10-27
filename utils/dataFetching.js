// data-fetching.js

import { createClient } from "contentful";

export async function fetchNewsData(locale) {
  const newsClient = createClient({
		space: process.env.CONTENTFUL_CORPORATENEWS_SPACE_ID,
		accessToken: process.env.CONTENTFUL_CORPORATENEWS_ACCESS_TOKEN,
		environment: process.env.CONTENTFUL_CORPORATENEWS_ENVIRONMENT || "master",
  });

  const res = await newsClient.getEntries({
    content_type: "newsContainer",
    "fields.brands.sys.id[in]": process.env.CONTENTFUL_CORPORATENEWS_SWG_ID,
    locale: locale || "en-CA",
  });

  return res.items;
}

export async function fetchPageData(locale) {
  // Make an API request to fetch the page data based on the provided locale
}

export async function fetchSiteConfigData(locale) {
  // Make an API request to fetch the site config data based on the provided locale
}

export async function fetchNavigationLinksData(locale) {
  // Make an API request to fetch the navigation links data based on the provided locale
}