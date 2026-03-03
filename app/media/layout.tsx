import { draftMode } from "next/headers";
import Footer from "@/components/Footer/Footer";
import { Navigation } from "@/components/Navigation/Navigation";
import { getNavigationLinks, getPages, getSiteConfig } from "@/utils/content";
import { localization } from "@/utils/localization";
import { ClientLayout } from "../ClientLayout";

export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = localization.defaultLocale;
  const { isEnabled } = await draftMode();

  const [pages, siteConfig] = await Promise.all([
    getPages(locale, isEnabled),
    getSiteConfig(locale, isEnabled),
  ]);

  const navigationLinks = await getNavigationLinks(pages, locale, isEnabled);

  const headerLinks = navigationLinks.filter((link: any) => link.location !== "footer");
  const footerLinks = navigationLinks.filter((link: any) => link.location === "footer");

  return (
    <ClientLayout lang={locale}>
      <Navigation pageLocale={locale} siteConfig={siteConfig} links={headerLinks} />
      <main className="page">
        <div className="content-grid">
          {children}
        </div>
      </main>
      <div className="content-grid">
        <Footer siteConfig={siteConfig} links={footerLinks} pageLocale={locale} />
      </div>
    </ClientLayout>
  );
}
