import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MediaCard } from "@/components/Cards/Media/MediaCard"
import { Cell, Row } from "@/components/Grid"
import Layout from "@/components/Layout"
import { Section } from "@/components/Section"
import { normalizeSlug } from "@/utils/common"
import {
	getContentItems,
	getNavigationLinks,
	getPages,
	getSiteConfig,
} from "@/utils/content"
import { localization } from "@/utils/localization"

// No numeric `revalidate`: Contentful data is cached indefinitely under the
// "contentful" tag (utils/contentful-cache.ts) and refreshed by the publish
// webhook. A numeric revalidate here would re-enable traffic-driven polling.

export async function generateMetadata(): Promise<Metadata> {
	const pageLocale = localization.defaultLocale
	const allPages = await getPages(pageLocale)
	const page = allPages.find(
		(e: any) => normalizeSlug(e.slug) === "/media" && e.locale === pageLocale,
	)

	if (!page) return {}

	const seo = page?.metaData
	return {
		title: seo?.pageTitle || "Media",
		description: seo?.pageDescription,
	}
}

export default async function MediaPage() {
	const pageLocale = localization.defaultLocale

	const [mediaItems, siteConfig, allPages] = await Promise.all([
		getContentItems("media", pageLocale),
		getSiteConfig(pageLocale),
		getPages(pageLocale),
	])

	const page = allPages.find(
		(e: any) => normalizeSlug(e.slug) === "/media" && e.locale === pageLocale,
	)

	if (!page) {
		notFound()
	}

	return (
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
	)
}
