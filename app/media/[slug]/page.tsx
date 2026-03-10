import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/Gallery';
import { Layout } from '@/components/Layout';
import { Section } from '@/components/Section';
import { getOptimizedImage } from '@/utils/common';
import {
  getContentItems,
  getNavigationLinks,
  getPages,
  getSiteConfig,
} from '@/utils/content';
import { FormattedDate } from '@/utils/DateFormat';
import { localization } from '@/utils/localization';

export const revalidate = 86400;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const locale = localization.defaultLocale;
  const mediaItems = await getContentItems('media', locale);
  return mediaItems.map((item: any) => ({
    slug: item.slug.split('/').filter(Boolean).join('/'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageLocale = localization.defaultLocale;
  const mediaItems = await getContentItems('media', pageLocale);
  const mediaItem = mediaItems.find((item: any) => item.slug === slug);

  if (!mediaItem) return {};

  return {
    title: mediaItem.title,
  };
}

export default async function MediaItemPage({ params }: Props) {
  const { slug } = await params;
  const pageLocale = localization.defaultLocale;

  const [siteConfig, allPages, mediaItems] = await Promise.all([
    getSiteConfig(pageLocale),
    getPages(pageLocale),
    getContentItems('media', pageLocale),
  ]);

  const navigationLinks = await getNavigationLinks(allPages, pageLocale);
  const mediaItem = mediaItems.find((item: any) => item.slug === slug);

  if (!mediaItem) {
    notFound();
  }

  const apiKey = process.env.NEXT_YOUTUBE_API_KEY;
  const videoPromises = (mediaItem.videos || []).map(async (video: any) => {
    const videoId = new URL(video.url).searchParams.get('v');
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`,
    );
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      const videoSnippet = data.items[0].snippet;
      return {
        id: video.id,
        videoId,
        title: videoSnippet.title,
        thumbnail: videoSnippet.thumbnails.high.url,
      };
    }
    return null;
  });

  const videos = (await Promise.all(videoPromises))
    .filter(Boolean)
    .map((video: any) => ({
      ...video,
      thumbnailWidth: 480,
      thumbnailHeight: 360,
    }));

  const fullGallery = [
    ...videos.map((video: any) => ({
      src: `https://www.youtube.com/embed/${video.videoId}`,
      poster: mediaItem.videos.find((v: any) => v.id === video.id)?.thumb?.[0]
        ?.src
        ? getOptimizedImage(
            mediaItem.videos.find((v: any) => v.id === video.id).thumb[0],
            1000,
          ).url
        : video.thumbnail,
      isVideo: true,
      width: video.thumbnailWidth,
      height: video.thumbnailHeight,
      title:
        mediaItem.videos.find((v: any) => v.id === video.id)?.videoTitle ||
        video.title,
    })),
    ...mediaItem.images.map((img: any) => {
      const { url, width, height } = getOptimizedImage(img, 1600);
      return { ...img, src: url, width, height, isVideo: false };
    }),
  ];

  const thumbGallery = [
    ...videos.map((video: any) => ({
      src: mediaItem.videos.find((v: any) => v.id === video.id)?.thumb?.[0]?.src
        ? getOptimizedImage(
            mediaItem.videos.find((v: any) => v.id === video.id).thumb[0],
            700,
          ).url
        : video.thumbnail,
      isVideo: true,
      width: video.thumbnailWidth,
      height: video.thumbnailHeight,
      title:
        mediaItem.videos.find((v: any) => v.id === video.id)?.videoTitle ||
        video.title,
    })),
    ...mediaItem.images.map((img: any) => {
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
  ];

  return (
    <>
      <Section
        contentAlign='center'
        heading={{ heading: mediaItem.title, as: 'h1', size: 'h1' }}
      >
        <p className='flex gap-1'>
          <FormattedDate dateStr={mediaItem.date} locale={pageLocale} />
        </p>
      </Section>
      <Section size='full'>
        <Gallery full={fullGallery} thumbs={thumbGallery} itemsPerRow={5} />
      </Section>
    </>
  );
}
