import { getPages, getPagePaths, getSiteConfig, getNavigationLinks } from "@/utils/content";
import localization from "@/utils/localization";
import { IS_DEV, normalizeSlug } from "@/utils/common";
import { componentMap } from "@/components";
import Layout from "@/components/Layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
	params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
	const locale = localization.defaultLocale;
	const paths = await getPagePaths(locale);
	return paths.map((path: { params: { slug: string[] } }) => ({
		slug: path.params.slug,
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const pageSlug = "/" + (slug ?? [""]).join("/");
	const pageLocale = localization.defaultLocale;
	const allPages = await getPages(pageLocale);
	const page = allPages.find((e: any) => normalizeSlug(e.slug) === pageSlug && e.locale === pageLocale);

	if (!page) return {};

	const seo = page?.metaData;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	return {
		title: seo?.pageTitle || page.pageName,
		description: seo?.pageDescription,
		keywords: seo?.keywords,
		openGraph: {
			title: seo?.pageTitle || page.pageName,
			description: seo?.pageDescription,
			url: `${baseUrl}/${(slug ?? []).join("/")}`,
		},
		alternates: {
			canonical: `${baseUrl}/${(slug ?? []).join("/")}`,
		},
	};
}

export default async function ComposablePage({ params }: Props) {
	const { slug } = await params;
	const pageSlug = "/" + (slug ?? [""]).join("/");
	const pageLocale = localization.defaultLocale;

	const [siteConfig, allPages] = await Promise.all([
		getSiteConfig(pageLocale),
		getPages(pageLocale),
	]);

	const page = allPages.find((e: any) => normalizeSlug(e.slug) === pageSlug && e.locale === pageLocale);

	if (!page) {
		notFound();
	}

	const navigationLinks = await getNavigationLinks(allPages, pageLocale);

	return (
		<Layout page={page} siteConfig={siteConfig} navigationLinks={navigationLinks}>
			{page.sections?.length ? (
				page.sections.map((section: any) => {
					const Component = componentMap[section.type];
					if (!Component) return null;
					return <Component key={section.id} {...section} pageName={page?.pageName} />;
				})
			) : (
				IS_DEV ? <EmptyState /> : null
			)}
		</Layout>
	);
}

function EmptyState() {
	return (
		<div className="flex items-center justify-center w-full py-32">
			<div className="border-4 border-gray-400 rounded p-16 border-dashed flex flex-col gap-2 items-center">
				<span className="text-2xl">Empty page! add sections.</span>
				<span>(this message does not appear in production)</span>
			</div>
		</div>
	);
}
