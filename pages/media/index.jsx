// pages/portfolio/index.js

import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "../../utils/content";
import localization from "../../utils/localization";
import { normalizeSlug } from "../../utils/common";
import Layout from "../../components/Layout";
import { Section } from "../../components/Section";
import { MediaCard } from "../../components/Cards/MediaCard";
import { Row, Cell } from "../../components/Grid";

export default function MediaPage({ page, mediaItems, siteConfig, navigationLinks }) {
	return (
    <Layout siteConfig={siteConfig} navigationLinks={navigationLinks} page={page}>
      <Section heading={{heading: "Media", as: "h1", size: "h1"}}>
        <Row cols="2">
					{mediaItems.map((item) => (
            <Cell key={item.id}>
							<MediaCard key={item.id} item={item} />
						</Cell>
          ))}
        </Row>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const pageLocale = locale || localization.defaultLocale;
	const [mediaItems, siteConfig, allPages] = await Promise.all([
    getContentItems("media", pageLocale),
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
      mediaItems,
      siteConfig,
      navigationLinks,
    },
    revalidate: 60,
  };
}
