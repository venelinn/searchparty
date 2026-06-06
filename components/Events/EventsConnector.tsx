'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Select } from '@/components/Forms/Select';
import { Icon } from '@/components/Icon';
import { Pagination } from '@/components/Pagination';
import type {
  EventItem,
  EventsConnectorProps,
  EventType,
} from '@/types/events';
import { Heading } from '../Headings';
import { Event } from './Event';
import styles from './Events.module.scss';

const DEFAULT_PER_PAGE = 10;

const renderEvents = (
  events: EventItem[] | undefined,
  type: EventType,
  locale: string,
  t: (key: string) => string,
  fallbackImage?: string,
) => {
  if (!events || events.length === 0) {
    return <p>{t('Events.noEventsAvailable')}</p>;
  }

  return events.map(event => (
    <Event
      key={event.id}
      type={type}
      event={event}
      locale={locale}
      fallbackImage={fallbackImage}
    />
  ));
};

export const EventsConnector = ({
  events = [],
  locale,
  fallbackImage,
  eventsPerPage,
  serverTime,
}: EventsConnectorProps) => {
  const t = useTranslations();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pastSectionRef = useRef<HTMLDivElement>(null);
  const pageSize = eventsPerPage ?? DEFAULT_PER_PAGE;

  const { upcomingEvents, pastEvents, years } = useMemo(() => {
    const currentDate = serverTime ? new Date(serverTime) : new Date();
    // Keep an event in the current/upcoming list for 5 hours after its start
    // time before moving it to past events.
    const EVENT_GRACE_PERIOD_MS = 5 * 60 * 60 * 1000;

    const upcoming: EventItem[] = [];
    const past: EventItem[] = [];
    const yearSet = new Set<number>();

    events.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate.getTime() + EVENT_GRACE_PERIOD_MS > currentDate.getTime()) {
        upcoming.push(event);
      } else {
        past.push(event);
        yearSet.add(eventDate.getFullYear());
      }
    });

    upcoming.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    past.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const years = Array.from(yearSet).sort((a, b) => b - a);

    return { upcomingEvents: upcoming, pastEvents: past, years };
  }, [events, serverTime]);

  const filteredPastEvents = useMemo(() => {
    if (selectedYear === 'all') return pastEvents;
    const year = parseInt(selectedYear, 10);
    return pastEvents.filter(e => new Date(e.date).getFullYear() === year);
  }, [pastEvents, selectedYear]);

  const paginatedPastEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPastEvents.slice(start, start + pageSize);
  }, [filteredPastEvents, currentPage, pageSize]);

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(e.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    pastSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const showPagination = filteredPastEvents.length > pageSize;

  return (
    <div className={styles.events}>
      {upcomingEvents.length > 0 && (
        <div data-type='upcoming'>
          <Heading
            as='h2'
            size='h2'
            uppercase={true}
            className={styles.events__heading}
          >
            <Icon name='Guitar' /> {t('Events.upcomingEvents')}
          </Heading>
          {renderEvents(upcomingEvents, 'upcoming', locale, t, fallbackImage)}
        </div>
      )}

      <div data-type='past' ref={pastSectionRef}>
        <div className={styles.events__header}>
          <Heading
            as='h2'
            size='h2'
            uppercase
            className={styles.events__heading}
          >
            <Icon name='Guitar' /> {t('Events.pastEvents')}
          </Heading>
          {pastEvents.length > 0 && (
            <div className={styles.events__yearFilter}>
              <Select
                value={selectedYear}
                inputSize='sm'
                theme='dark'
                onChange={handleYearChange}
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
        {renderEvents(paginatedPastEvents, 'past', locale, t, fallbackImage)}
        {showPagination && (
          <Pagination
            totalItems={filteredPastEvents.length}
            currentPageIndex={currentPage}
            handleSlideTo={handlePageChange}
            variant='extended'
            pageSize={pageSize}
            theme='dark'
          />
        )}
      </div>
    </div>
  );
};
