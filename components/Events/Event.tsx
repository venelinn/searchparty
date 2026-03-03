'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { FormattedDate, FormattedTime } from '@/utils/DateFormat';
import styles from './Event.module.scss';

export interface EventProps {
  event: any;
  type: 'upcoming' | 'past';
  locale: string;
  fallbackImage?: string;
}

function generateGoogleMapsURL(lat: number, lng: number, placeName: string) {
  const encodedPlaceName = encodeURIComponent(placeName);
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://res.cloudinary.com/dvgvftw9u/image/upload/q_auto/v1730046867/fallback_m5m9wa';

export const Event = ({ event, type, locale, fallbackImage }: EventProps) => {
  const [modalStates, setModalStates] = useState(false);
  const [imageError, setImageError] = useState(false);
  const effectiveFallback = fallbackImage ?? DEFAULT_FALLBACK_IMAGE;
  const handleOpenModal = () => {
    setModalStates(true);
  };

  const handleCloseModal = () => {
    setModalStates(false);
  };

  const hasCover = !!event.cover?.[0];
  const cover = event.cover?.[0] ?? {
    src: effectiveFallback,
    alt: 'Event cover',
    width: 507,
    height: 86,
  };
  const isFallback = !hasCover || imageError;

  const logo = event?.venueLogo?.logo[0];

  return (
    <div className={styles.event} key={event.id}>
      <div className={styles.event__date}>
        <FormattedDate
          dateStr={event.date}
          locale={locale}
          includeYear={type === 'upcoming' ? false : true}
        />
      </div>
      <figure className={styles.event__image}>
        <button type='button' onClick={() => handleOpenModal()}>
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
          />
        </button>
      </figure>
      <div className={styles.event__content}>
        <div className={styles.event__venue}>{event.venue}</div>
        <div className={styles.event__hour}>
          <Icon name='Clock' />{' '}
          <FormattedTime dateStr={event.date} locale={locale} />
        </div>
        {event.doorsOpen && (
          <p className='ui-caption'>
            Doors open at{' '}
            <FormattedTime dateStr={event.doorsOpen} locale={locale} />
          </p>
        )}
        {logo && (
          <figure className={styles.event__logo}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={clsx(isFallback && styles.event__imageFallback)}
            />
          </figure>
        )}
      </div>
      <div className={styles.event__buttons}>
        {type === 'upcoming' && (
          <Button
            variant='primary'
            label='Location'
            isExternal={true}
            icon='MapPin'
            externalHref={generateGoogleMapsURL(
              event.address.lat,
              event.address.lon,
              event.venue,
            )}
          />
        )}
        {type === 'past' && event.gallery && (
          <Button
            href={event.gallery}
            icon='Images'
            variant='primary'
            label='Gallery'
          />
        )}
      </div>
      <Modal isOpen={modalStates} onClose={() => handleCloseModal()}>
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          className={styles.modalImage}
        />
      </Modal>
    </div>
  );
};
