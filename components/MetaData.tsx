import Head from "next/head";
import { useRouter } from "next/router";
interface MetaDataProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  date?: string;
	keywords?: string;
}

export default function MetaData({ title, description, keywords, image, type, date, ...customMeta }: MetaDataProps) {
	const router = useRouter()
  const frenchRoute = "/fr" + (router.asPath);
	const route = process.env.NEXT_PUBLIC_BASE_URL + (router.locale === "fr" ? frenchRoute : router.asPath);

  const meta = {
    title: title || "Search Party",
    description: description || "Search Party | search-party.ca",
		keywords: keywords || "band, rock band, band 80s",
    image: image || `${process.env.NEXT_PUBLIC_BASE_URL}/static/og-image.jpg`,
    type: type || "website",
		date: date || "", // Add the date property here
    ...customMeta,
  };

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
			<meta name="keywords" content={meta.keywords} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={route} />
      <meta
        property="og:site_name"
        content={process.env.NEXT_PUBLIC_SITE_NAME || ""}
      />
      <meta property="og:type" content={meta.type} />
      <meta property="og:image" content={meta.image} />
      {meta.date && (
        <meta property="article:published_time" content={meta.date} />
      )}
      <meta name="robots" content="follow, index" />
      <link rel="canonical" href={route} />
			<meta name="color-scheme" content="light dark" />
    </Head>
  );
}
