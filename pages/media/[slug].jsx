import { useEffect, useState } from "react";
import { getPages, getContentItems, getSiteConfig, getNavigationLinks } from "../../utils/content";
import localization from "../../utils/localization";
import { getOptimizedImage } from "../../utils/common";
import { Layout } from "../../components/Layout";
import { FormattedDate } from "../../utils/DateFormat";
import { Section } from "../../components/Section";
import { Gallery } from "../../components/Gallery";

export default function MediaItemPage({ pageLocale, mediaItem, siteConfig, navigationLinks, slug, videos }) {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
    setIsClient(true); // Set to true once the component has mounted on the client
  }, []);
	if (!mediaItem || !videos || !isClient) return null;

	const fullDate = <FormattedDate dateStr={mediaItem.date} locale={pageLocale} />;
	return (
    <Layout
			siteConfig={siteConfig}
			navigationLinks={navigationLinks}
			page={{
				title: mediaItem.title,
				locale: pageLocale,
			}}>
		  <Section
				contentAlign="center"
				heading={{
					heading: mediaItem.title,
					as: "h1",
					size: "h1"
					}}>
				<p>{fullDate}</p>
      </Section>
			<Section size="full" >
			<Gallery
				full={[
					...videos.map((video) => ({
						src: `https://www.youtube.com/embed/${video.videoId}`,  // YouTube video URL
						poster: mediaItem.videos.find(v => v.id === video.id)?.thumb?.[0]?.src // Check if mediaItem.videos exists and has thumb[0]
							? getOptimizedImage(mediaItem.videos.find(v => v.id === video.id).thumb[0], 1000).url // Use it if available
							: video.thumbnail,
						isVideo: true,
						width: video.thumbnailWidth,
						height: video.thumbnailHeight,
						title: mediaItem.videos.find(v => v.id === video.id)?.videoTitle || video.title, // Fallback to YouTube title if no title in mediaItem
					})),
					...mediaItem.images.map((img) => {
						const { url, width, height } = getOptimizedImage(img, 1600);
						return {
							...img,
							src: url,
							width,
							height,
							isVideo: false,
						};
					}),
				]}
				thumbs={[
					...videos.map((video) => ({
						src: mediaItem.videos.find(v => v.id === video.id)?.thumb?.[0]?.src // Check if mediaItem.videos exists and has thumb[0]
							? getOptimizedImage(mediaItem.videos.find(v => v.id === video.id).thumb[0], 700).url // Use it if available
							: video.thumbnail, // Fallback to YouTube thumbnail if thumb[0] is missing
						isVideo: true,
						width: video.thumbnailWidth,
						height: video.thumbnailHeight,
						title: mediaItem.videos.find(v => v.id === video.id)?.videoTitle || video.title,
					})),
					...mediaItem.images.map((img) => {
						const { url, width, height } = getOptimizedImage(img, 700);
						return {
							...img,
							src: url,
							width,
							height,
							isVideo: false,
							title: img?.title || mediaItem.title,
						};
					}),
				]}
				itemsPerRow={5}
				slug={slug}
			/>
			</Section>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = [];

  for (const locale of locales) {
    const mediaItems = await getContentItems("media", locale);
    const localePaths = mediaItems.map(item => {
      const slug = item.slug.split("/").filter(Boolean).join("/"); // Ensure slug is a string
      return {
        params: { slug }, // Pass slug as a string
        locale,
      };
    });
    paths.push(...localePaths);
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
  const pageLocale = locale || localization.defaultLocale;
  const slug = params.slug; // params.slug should be a string directly

  const [siteConfig, allPages, mediaItems] = await Promise.all([
    getSiteConfig(pageLocale),
    getPages(pageLocale),
    getContentItems("media", pageLocale),
  ]);

  const navigationLinks = await getNavigationLinks(allPages, pageLocale);

  if (slug) {
    const mediaItem = mediaItems.find(item => item.slug === slug);
    if (!mediaItem) {
      return { notFound: true };
    }

    // Fetch YouTube video data
		const apiKey = process.env.NEXT_YOUTUBE_API_KEY;
		const videoPromises = (mediaItem.videos || []).map(async (video) => {
			const videoId = new URL(video.url).searchParams.get("v");
			const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
			const data = await res.json();
			if (data.items && data.items.length > 0) {
				const videoSnippet = data.items[0].snippet;
				return {
					id: video.id,
					videoId: videoId,
					title: videoSnippet.title,
					thumbnail: videoSnippet.thumbnails.high.url,
				};
			}
			return null;
		});

		const videos = (await Promise.all(videoPromises)).filter(Boolean).map(video => ({
			...video,
			thumbnailWidth: 480,  // Default width for YouTube hqdefault
			thumbnailHeight: 360,  // Default height for YouTube hqdefault
		}))


    return {
      props: {
        mediaItem,
				slug,
        siteConfig,
				pageLocale,
        navigationLinks,
				videos,
      },
      revalidate: 60,
    };
  }

  return {
    notFound: true,
  };
}
