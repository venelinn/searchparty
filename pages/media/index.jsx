// pages/portfolio/index.js

import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "../../utils/content";
import Link from "next/link";
import localization from "../../utils/localization";
import { normalizeSlug } from "../../utils/common";
import Layout from "../../components/Layout";

export default function PortfolioPage({ page, portfolioItems, siteConfig, navigationLinks }) {
	return (
    <Layout siteConfig={siteConfig} navigationLinks={navigationLinks} page={page}>
      <div>
        <h1>Portfolio</h1>
        <ul>
          {portfolioItems.map((item) => (
            <li key={item.id}>
              <Link href={`/media/${item.slug}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const pageLocale = locale || localization.defaultLocale;
	const [portfolioItems, siteConfig, allPages] = await Promise.all([
    getContentItems("portfolio", pageLocale),
    getSiteConfig(pageLocale),
    getPages(pageLocale)
  ]);
	const page = allPages.find((e) => normalizeSlug(e.slug) === "/media" && e.locale === pageLocale);
	if (!page) {
		console.warn("Did not find page for: /media", "locale:", locale);
		return { notFound: true };
	}

  const navigationLinks = await getNavigationLinks(allPages, pageLocale);

  return {
    props: {
			page,
      portfolioItems,
      siteConfig,
      navigationLinks,
    },
    revalidate: 60,
  };
}
