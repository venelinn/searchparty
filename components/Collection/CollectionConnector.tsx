'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { MemberCard } from '@/components/Cards';
import { GridCollection } from '@/components/Collection';
import { EventsConnector } from '@/components/Events';
import { Event } from '@/components/Events/Event';
import { Select } from '@/components/Forms/Select';
import type { HeadingProps } from '@/components/Headings';
import { Heading } from '@/components/Headings';
import type { PaginationProps } from '@/components/Pagination';
import type { CardImage, CardImageRatio, CardVariantType } from '@/types/card';
import type { EventItem } from '@/types/events';
import type { SectionProps } from '@/types/section';
import eventsStyles from '../Events/Events.module.scss';
import { PaginatedCollection } from './Paginated/PaginatedCollection';

function EventsPaginatedWithHeadings({
  eventCards,
  locale,
  fallbackImage,
  props: p,
}: {
  eventCards: EventItem[];
  locale: string;
  fallbackImage?: string;
  props: PaginatedCollectionConnectorProps;
}) {
  const t = useTranslations();
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const { upcoming, past, years } = useMemo(() => {
    const today = new Date();
    const up = eventCards
      .filter(e => new Date(e.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pa = eventCards
      .filter(e => new Date(e.date) <= today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const yearSet = new Set(pa.map(e => new Date(e.date).getFullYear()));
    const yrs = Array.from(yearSet).sort((a, b) => b - a);
    return { upcoming: up, past: pa, years: yrs };
  }, [eventCards]);

  const filteredPast = useMemo(() => {
    if (selectedYear === 'all') return past;
    const year = parseInt(selectedYear, 10);
    return past.filter(e => new Date(e.date).getFullYear() === year);
  }, [past, selectedYear]);

  const toItems = (events: EventItem[], type: 'upcoming' | 'past') =>
    events.map(event => ({
      id: event.id,
      content: (
        <Event
          key={event.id}
          event={event}
          type={type}
          locale={locale}
          fallbackImage={fallbackImage}
        />
      ),
    }));

  const upcomingItems = toItems(upcoming, 'upcoming');
  const pastItems = toItems(filteredPast, 'past');

  return (
    <div className={eventsStyles.events}>
      {upcomingItems.length > 0 && (
        <div data-type='upcoming'>
          <Heading as='h2' size='sb'>
            {t('Events.upcomingEvents')}
          </Heading>
          <PaginatedCollection
            cardsPerPage={p.cardsPerPage ?? 3}
            itemsPerRow={p.itemsPerRow}
            itemsPerPage={p.itemsPerPage}
            paginationVariant={p.paginationVariant ?? 'default'}
            numberOfPaginationToDisplay={p.numberOfPaginationToDisplay ?? 5}
            items={upcomingItems}
            onCardHover={p.onCardHover}
            autoFit={p.autoFit}
            totalCardsPerPage={p.totalCardsPerPage}
          />
        </div>
      )}
      <div data-type='past'>
        <div className={eventsStyles.events__header}>
          <Heading as='h2' size='sb'>
            {t('Events.pastEvents')}
          </Heading>
          {past.length > 0 && (
            <div className={eventsStyles.events__yearFilter}>
              <Select
                value={selectedYear}
                inputSize='sm'
                theme='dark'
                onChange={e => setSelectedYear(e.target.value)}
                aria-label={t('Events.filterByYear')}
              >
                <option value='all'>{t('Events.allYears')}</option>
                {years.map(year => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
        {pastItems.length > 0 ? (
          <PaginatedCollection
            cardsPerPage={p.cardsPerPage ?? 3}
            itemsPerRow={p.itemsPerRow}
            itemsPerPage={p.itemsPerPage}
            paginationVariant={p.paginationVariant ?? 'default'}
            numberOfPaginationToDisplay={p.numberOfPaginationToDisplay ?? 5}
            items={pastItems}
            onCardHover={p.onCardHover}
            autoFit={p.autoFit}
            totalCardsPerPage={p.totalCardsPerPage}
          />
        ) : (
          <p>{t('Events.noEventsAvailable')}</p>
        )}
      </div>
    </div>
  );
}

function EventsGridWithHeadings({
  eventCards,
  locale,
  fallbackImage,
  props: gridProps,
}: {
  eventCards: EventItem[];
  locale: string;
  fallbackImage?: string;
  props: GridCollectionConnectorProps;
}) {
  const t = useTranslations();
  const today = new Date();
  const upcoming = eventCards
    .filter(e => new Date(e.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = eventCards
    .filter(e => new Date(e.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toItems = (events: EventItem[], type: 'upcoming' | 'past') =>
    events.map(event => ({
      id: event.id,
      content: (
        <Event
          key={event.id}
          event={event}
          type={type}
          locale={locale}
          fallbackImage={fallbackImage}
        />
      ),
    }));

  const upcomingItems = toItems(upcoming, 'upcoming');
  const pastItems = toItems(past, 'past');

  return (
    <div className={eventsStyles.events}>
      {upcomingItems.length > 0 && (
        <div data-type='upcoming'>
          <Heading as='h2' size='sb' className='mt-4'>
            {t('Events.upcomingEvents')}
          </Heading>
          <GridCollection
            id={gridProps.id}
            items={upcomingItems}
            itemsPerRow={gridProps.itemsPerRow ?? 1}
          />
        </div>
      )}
      <div data-type='past'>
        <Heading as='h2' size='sb' className='pt-8'>
          {t('Events.pastEvents')}
        </Heading>
        {pastItems.length > 0 ? (
          <GridCollection
            id={gridProps.id}
            items={pastItems}
            itemsPerRow={gridProps.itemsPerRow ?? 1}
          />
        ) : (
          <p>{t('Events.noEventsAvailable')}</p>
        )}
      </div>
    </div>
  );
}

type RichTextContent = Record<string, unknown> | string;

type CollectionCard = {
  id: string;
  images?: Array<CardImage>;
  image?: CardImage;
  imageRatio?: CardImageRatio['imageRatio'];
  heading?: HeadingProps;
  headingVariant?: SectionProps['headingVariant'];
  variant?: string;
  role?: string;
  link?: {
    href: string;
    label?: string;
    target?: string;
  };
  content?: RichTextContent | React.ReactNode;
  [key: string]: unknown;
};

export type ItemsPerRow = 1 | 2 | 3 | 4 | 5 | 6;

export type CardsPerPage = 2 | 3 | 4;

type BaseCollectionConnectorProps = {
  id?: string;
  cards?: CollectionCard[];
  members?: CollectionCard[];
  cardVariant?: CardVariantType;
  locale?: string;
  fallbackImage?: string;
  hasGap?: boolean;
};

type GridCollectionConnectorProps = BaseCollectionConnectorProps & {
  variant?: 'grid';
  itemsPerRow?: ItemsPerRow;
};

type PaginatedCollectionConnectorProps = BaseCollectionConnectorProps & {
  variant: 'paginated';
  cardsPerPage?: CardsPerPage;
  itemsPerRow?: ItemsPerRow;
  itemsPerPage?: number;
  paginationVariant?: PaginationProps['variant'];
  numberOfPaginationToDisplay?: number;
  totalCardsPerPage?: number;
  autoFit?: boolean;
  colWidth?: string;
  onCardHover?: (id: string | null) => void;
};

export type CollectionVariant = 'grid' | 'paginated';

export type CollectionConnectorProps =
  | GridCollectionConnectorProps
  | PaginatedCollectionConnectorProps;

export const CollectionConnector = (props: CollectionConnectorProps) => {
  const cards = [...(props.cards ?? []), ...(props.members ?? [])];
  if (!cards.length) return null;

  const cardVariant = props.cardVariant || 'member';
  const eventCards = cards.filter(item => item.type === 'event') as EventItem[];
  const locale = props.locale || 'en';
  const fallbackImage = props.fallbackImage;

  if (
    (cardVariant === 'event' || eventCards.length > 0) &&
    props.variant === 'paginated'
  ) {
    return (
      <EventsPaginatedWithHeadings
        eventCards={eventCards}
        locale={locale}
        fallbackImage={fallbackImage}
        props={props as PaginatedCollectionConnectorProps}
      />
    );
  }

  if (
    (cardVariant === 'event' || eventCards.length > 0) &&
    props.variant === 'grid'
  ) {
    return (
      <EventsGridWithHeadings
        eventCards={eventCards}
        locale={locale}
        fallbackImage={fallbackImage}
        props={props as GridCollectionConnectorProps}
      />
    );
  }

  if (cardVariant === 'event' || eventCards.length > 0) {
    return (
      <EventsConnector
        id={props.id}
        events={eventCards}
        locale={locale}
        fallbackImage={fallbackImage}
        serverTime={Date.now()}
      />
    );
  }

  const mapItems = (items: CollectionCard[]) =>
    items
      .map(item => {
        const content = (
          <MemberCard
            key={item.id}
            data={item}
            tabIndex={0}
          />
        );

        return { id: item.id, content };
      });

  switch (props.variant) {
    case 'paginated':
      return (
        <PaginatedCollection
          cardsPerPage={props.cardsPerPage || 3}
          itemsPerRow={props.itemsPerRow}
          itemsPerPage={props.itemsPerPage}
          paginationVariant={props.paginationVariant || 'default'}
          numberOfPaginationToDisplay={props.numberOfPaginationToDisplay || 5}
          items={mapItems(cards)}
          onCardHover={props.onCardHover}
          autoFit={props?.autoFit}
          totalCardsPerPage={props?.totalCardsPerPage}
        />
      );

    case 'grid':
    default:
      return (
        <GridCollection
          id={props.id}
          itemsPerRow={(props as GridCollectionConnectorProps).itemsPerRow}
          gap={props.hasGap ?? undefined}
          items={mapItems(cards)}
        />
      );
  }
};
