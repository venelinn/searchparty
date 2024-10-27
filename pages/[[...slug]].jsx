import { getPages, getPagePaths, getSiteConfig, getNavigationLinks } from "../utils/content";
import localization from "../utils/localization";
import { IS_DEV, normalizeSlug } from "../utils/common";
import { componentMap } from "../components";
import Layout from "../components/Layout";

function ComposablePage({ page, siteConfig, navigationLinks }) {
	return (
		<Layout
			page={page}
			siteConfig={siteConfig}
			navigationLinks={navigationLinks}
			>
			{page.sections?.length ? (
				page.sections.map((section) => {
					const Component = componentMap[section.type];
					if (!Component) {
						return null;
					}
					return <Component key={section.id} {...section} pageName={page?.pageName} />;
				})
			) : (
				<EmptyState />
			)}
		</Layout>
	);
}

function EmptyState() {
	return IS_DEV ? (
		<div className="flex items-center justify-center w-full py-32">
			<div className="border-4 border-gray-400 rounded p-16 border-dashed flex flex-col gap-2 items-center">
				<span className="text-2xl">Empty page! add sections.</span>
				<span>(this message does not appear in production)</span>
			</div>
		</div>
	) : (
		<></>
	);
}

const getStaticPaths = async ({ locales }) => {
	const routesPromises = locales.map(async (locale) => await getPagePaths(locale));
	const paths = await Promise.all(routesPromises).then((promises) => promises.flatMap((promise) => promise));

	return { paths, fallback: false };
};

const getStaticProps = async ({ params, locale }) => {
	const slug = "/" + (params?.slug ?? [""]).join("/");
	const pageLocale = locale || localization.defaultLocale;
	const [siteConfig, allPages] = await Promise.all([getSiteConfig(pageLocale), getPages(pageLocale)]);
	const page = allPages.find((e) => normalizeSlug(e.slug) === slug && e.locale === pageLocale);
	if (!page) {
		console.warn("Did not find page for:", params, "locale:", locale);
		return { notFound: true };
	}

	// Include the "order" and "location" properties in headerLinks
	const navigationLinks = await getNavigationLinks(allPages, pageLocale);


	return {
		props: {
			page,
			siteConfig,
			navigationLinks,
		}
	};
};


export default ComposablePage;
export { ComposablePage, getStaticPaths, getStaticProps };
