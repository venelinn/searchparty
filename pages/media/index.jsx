// pages/portfolio/index.js

import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "../../utils/content";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import localization from "../../utils/localization";
import { normalizeSlug } from "../../utils/common";
import Layout from "../../components/Layout";
import { Section } from "../../components/Section";
import { MediaCard } from "../../components/Cards/MediaCard";
import { Row, Cell } from "../../components/Grid";

export default function MediaPage({ page, mediaItems, siteConfig, navigationLinks }) {
	const containerRef = useRef(null);
	const sectionRef = useRef(null);

	useEffect(() => {
		if (containerRef.current) {
      // Select all `Member` components for animation
      const medias = Array.from(containerRef.current.querySelectorAll("[data-anim-item]"));

      gsap.fromTo(
        medias,
        { opacity: 0, y: 20 }, // Start state
        {
          opacity: 1,
          y: 0, // End state
          stagger: 0.1, // Add stagger effect between items
          delay: 0.5, // Delay before animation starts
          duration: 0.6,
          ease: "power4.out",
        }
      );
    }
  }, [mediaItems]);
	return (
    <Layout siteConfig={siteConfig} navigationLinks={navigationLinks} page={page}>
      <Section heading={{heading: "Media", as: "h1", size: "h1"}}>
        <Row cols={Math.min(mediaItems.length, 3)} ref={containerRef}>
					{mediaItems.map((item) => (
            <Cell key={item.id} data-anim-item>
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
