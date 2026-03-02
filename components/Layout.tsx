import type { ReactNode } from "react";
import Navigation from "./Navigation/Navigation";
import Footer from "./Footer/Footer";

interface LayoutProps {
  page: any;
  siteConfig: any;
  navigationLinks: any[];
  children: ReactNode;
}

function Layout({ page, siteConfig, navigationLinks, children }: LayoutProps) {
	const footerNavLinks = navigationLinks.filter((link) => link.location === "footer");

	return (
		<>
			<Navigation
				pageLocale={page.locale}
				links={navigationLinks}
				siteConfig={siteConfig}
				isLogoVisible={page?.isLogoVisible}
				isNavigationVisible={page?.isNavigationVisible}
			/>
			<main className="page">
				{children}
			</main>
			<Footer siteConfig={siteConfig?.footer} links={footerNavLinks} pageLocale={page.locale} />
		</>
	);
}

export default Layout;
export { Layout };
