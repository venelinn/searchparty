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

	// const headerNavLinks = navigationLinks.filter((link) => link.location === "header");
	const footerNavLinks = navigationLinks.filter((link) => link.location === "footer");

	let allLinks = navigationLinks;
	let footerLinks = footerNavLinks;

	const seo = page?.metaData;

	return (
		<>
			<Head>
				<title>{seo?.pageTitle || page.pageName}</title>
				{/* {siteConfig.backgroundImage && (
          <html data-has-bgr />
        )} */}
				<MetaData
					title={seo?.pageTitle}
					description={seo?.pageDescription}
					keywords={seo?.keywords}
				/>
			</Head>
			<Navigation
				pageLocale={page.locale}
				allLinks={allLinks}
				links={allLinks}
				siteConfig={siteConfig}
				isLogoVisible={page?.isLogoVisible}
				isNavigationVisible={page?.isNavigationVisible}
			/>
			<main className="page">
				{children}
			</main>
			<Footer siteConfig={siteConfig?.footer} links={footerLinks} pageLocale={page.locale} />
		</>
	);
}

export default Layout;
export { Layout };
