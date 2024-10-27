import { useEffect } from "react";
import Head from "next/head";
import { useData } from "../utils/DataProvider";
import Navigation from "./Navigation/Navigation";
import MetaData from "./MetaData";
import Footer from "./Footer/Footer";

function Layout({ page, siteConfig, navigationLinks, children }) {
	const [state, setState] = useData();

	useEffect(() => {
		setState({
			...state
		});
	}, [page.locale]);

	const headerNavLinks = navigationLinks.filter((link) => link.location === "header");
	const footerNavLinks = navigationLinks.filter((link) => link.location === "footer");

	let allLinks = navigationLinks;
	let footerLinks = footerNavLinks;


	const seo = page?.metaData;


	return (
		<>
			<Head>
				<title>{page.title}</title>
			</Head>
			<MetaData title={seo?.pageTitle} description={seo?.pageDescription} keywords={seo?.keywords} />
			<Navigation
				pageLocale={page.locale}
				allLinks={allLinks}
				links={headerNavLinks}
				siteConfig={siteConfig}
				isNavigationVisible={page.isNavigationVisible}
			/>
			<main data-sb-object-id={page.id} className="page">
				{children}
			</main>
			<Footer siteConfig={siteConfig?.footer} links={footerLinks} pageLocale={page.locale} />
		</>
	);
}

export default Layout;
export { Layout };
