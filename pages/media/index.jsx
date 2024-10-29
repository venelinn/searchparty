// pages/portfolio/index.js

import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "../../utils/content";
import Link from "next/link";
import localization from "../../utils/localization";
import { normalizeSlug } from "../../utils/common";
import Layout from "../../components/Layout";

export default function PortfolioPage({ page, portfolioItems, siteConfig, navigationLinks }) {
	return (
    <Layout siteConfig={siteConfig} navigationLinks={navigationLinks} page={page}>
      <div>
        <h1>Portfolio</h1>
				<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
					<input type="hidden" name="form-name" value="contact" />
					<p>
						<label>
							Name: <input type="text" name="name" required />
						</label>
					</p>
					<p>
						<label>
							Email: <input type="email" name="email" required />
						</label>
					</p>
					<p>
						<label>
							Message: <textarea name="message" required></textarea>
						</label>
					</p>
					<button type="submit">Send</button>
				</form>
        <ul>
          {portfolioItems.map((item) => (
            <li key={item.id}>
              <Link href={`/media/${item.slug}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const pageLocale = locale || localization.defaultLocale;
	const [portfolioItems, siteConfig, allPages] = await Promise.all([
    getContentItems("portfolio", pageLocale),
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
      portfolioItems,
      siteConfig,
      navigationLinks,
    },
    revalidate: 60,
  };
}
