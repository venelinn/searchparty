import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "../../utils/content";
import localization from "../../utils/localization";
import Layout from "../../components/Layout";
import FormattedDate from "../../utils/DateFormat";
import { Section } from "../../components/Section";
import { Gallery } from "../../components/Galllery";

export default function MediaItemPage({ pageLocale, mediaItem, siteConfig, navigationLinks }) {
	const fullDate = <FormattedDate dateStr={mediaItem.date} locale={pageLocale} />;
	return (
    <Layout
			siteConfig={siteConfig}
			navigationLinks={navigationLinks}
			page={{
				title: mediaItem.title,
				locale: pageLocale,
			}}>
      <Section heading={{heading: mediaItem.title, as: "h1", size: "h1"}}>
				<p>{fullDate}</p>
				<Gallery
					full={mediaItem.images}
					thumbs={mediaItem.images}
					itemsPerRow={3}
				/>
      </Section>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = [];

  for (const locale of locales) {
    const mediaItems = await getContentItems("media", locale);
    const localePaths = mediaItems.map(item => {
      const slug = item.slug.split("/").filter(Boolean).join("/"); // Ensure slug is a string
      return {
        params: { slug }, // Pass slug as a string
        locale,
      };
    });
    paths.push(...localePaths);
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
  const pageLocale = locale || localization.defaultLocale;
  const slug = params.slug; // params.slug should be a string directly

  const [siteConfig, allPages, mediaItems] = await Promise.all([
    getSiteConfig(pageLocale),
    getPages(pageLocale),
    getContentItems("media", pageLocale),
  ]);

  const navigationLinks = await getNavigationLinks(allPages, pageLocale);

  if (slug) {
    const mediaItem = mediaItems.find(item => item.slug === slug);
    if (!mediaItem) {
      return { notFound: true };
    }
    return {
      props: {
        mediaItem,
        siteConfig,
				pageLocale,
        navigationLinks,
      },
      revalidate: 60,
    };
  }

  return {
    notFound: true,
  };
}
