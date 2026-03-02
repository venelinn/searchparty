import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { EventsConnector } from '@/components/Events';
import { Heading } from '@/components/Headings';
import { Hero } from '@/components/Hero';
import { buildMetadata } from '@/components/MetaData';
import { Sidebar, SidebarWidgets } from '@/components/Sidebar';
import type { WidgetType } from '@/types/widgets';
import {
  getAllEvents,
  getFallbackImageUrl,
  getSiteConfig,
} from '@/utils/content';
import { localization } from '@/utils/localization';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Events');
  return buildMetadata({
    pageTitle: t('sectionTitle'),
    path: 'events',
  });
}

export default async function EventsPage() {
  const { isEnabled: preview } = await draftMode();
  const locale = localization.defaultLocale;
  const t = await getTranslations('Events');

  const [events, siteConfig] = await Promise.all([
    getAllEvents(locale, preview),
    getSiteConfig(locale, preview),
  ]);

  const eventsPerPage = Number(siteConfig?.eventsPerPage) || 10;
  const rawWidgets = siteConfig?.widgets;
  const widgets: WidgetType[] = Array.isArray(rawWidgets)
    ? rawWidgets
    : typeof rawWidgets === 'string'
      ? [rawWidgets as WidgetType]
      : [];
  const fallbackImage =
    getFallbackImageUrl(siteConfig?.fallbackEvents) ?? undefined;
  const rawHeroImages = siteConfig?.eventsHero;
  const hasHero = Array.isArray(rawHeroImages) && rawHeroImages.length > 0;
  const heroImages = hasHero
    ? rawHeroImages.map(img => ({ image: [img] }))
    : undefined;

  return (
    <>
      {hasHero && (
        <Hero
          images={heroImages}
          height='half'
          imageAlignment='top'
          content={
            <Heading as='h1' size='h1'>
              {t('sectionTitle')}
            </Heading>
          }
        />
      )}

      <div className='page__with-sidebar' data-has-sidebar>
        <div className='page__main'>
          <EventsConnector
            events={events}
            locale={locale}
            fallbackImage={fallbackImage}
            eventsPerPage={eventsPerPage}
            serverTime={Date.now()}
          />
        </div>
        {widgets.length > 0 && (
          <Sidebar>
            <SidebarWidgets widgets={widgets} locale={locale} />
          </Sidebar>
        )}
      </div>
    </>
  );
}
