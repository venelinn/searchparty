import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "@/utils/content";
import localization from "@/utils/localization";
import { normalizeSlug } from "@/utils/common";
import Layout from "@/components/Layout";
import { Section } from "@/components/Section";
import { MediaCard } from "@/components/Cards/MediaCard";
import { Row, Cell } from "@/components/Grid";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	const pageLocale = localization.defaultLocale;
	const allPages = await getPages(pageLocale);
	const page = allPages.find((e: any) => normalizeSlug(e.slug) === "/media" && e.locale === pageLocale);

	if (!page) return {};

	const seo = page?.metaData;
	return {
		title: seo?.pageTitle || "Media",
		description: seo?.pageDescription,
	};
}

export default async function MediaPage() {
	const pageLocale = localization.defaultLocale;

	const [mediaItems, siteConfig, allPages] = await Promise.all([
		getContentItems("media", pageLocale),
		getSiteConfig(pageLocale),
		getPages(pageLocale),
	]);

	const page = allPages.find((e: any) => normalizeSlug(e.slug) === "/media" && e.locale === pageLocale);

	if (!page) {
		notFound();
	}

	const navigationLinks = await getNavigationLinks(allPages, pageLocale);

	return (
		<Layout siteConfig={siteConfig} navigationLinks={navigationLinks} page={page}>
			<Section heading={{ heading: "Media", as: "h1", size: "h1" }}>
				<Row cols={Math.min(mediaItems.length, 3)}>
					{mediaItems.map((item: any, index: number) => (
						<Cell
							key={item.id}
							data-anim-item
							style={{ "--anim-order": index } as React.CSSProperties}
						>
							<MediaCard item={item} />
						</Cell>
					))}
				</Row>
			</Section>
		</Layout>
	);
}
