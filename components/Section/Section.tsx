'use client';

import cx from 'clsx';
import gsap from 'gsap';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { Heading } from '@/components/Headings';
import type { SectionProps } from '@/types/section';
import styles from './Section.module.scss';

export function Section({
  id,
  children,
  className,
  classNames,
  image,
  animationID,
  heading,
  size = 'fixed',
  height,
  imageAlignment,
  contentAlign,
  paddingControl,
  padding = 'small',
  as = 'section',
  disableAnimation,
  ref,
}: SectionProps & { ref?: React.Ref<HTMLElement> }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const Tag = as || 'section';

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [ref],
  );

  useEffect(() => {
    if (!sectionRef.current || disableAnimation) return;

    if (animationID) {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      timeline
        .from(
          `[data-anim=${animationID}] [data-anim='section-title']`,
          { opacity: 0, y: 20, duration: 0.8, ease: 'power4.out' },
          0,
        )
        .from(
          `[data-anim=${animationID}] [data-anim='section-img']`,
          { opacity: 0, scale: 1.1, duration: 1, ease: 'power4.out' },
          0.3,
        )
        .from(
          `[data-anim=${animationID}] .${styles.section__inner}`,
          { opacity: 0, y: 20, duration: 0.8, ease: 'power4.out' },
          0.6,
        );

      return () => {
        if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
        timeline.kill();
      };
    }

    const el = sectionRef.current;
    gsap.set(el, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power4.out',
    });

    return () => {
      gsap.set(el, { clearProps: 'all' });
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [animationID, disableAnimation]);

  const classes = cx(
    styles.section,
    classNames?.main,
    paddingControl ? styles[`section--${paddingControl}`] : null,
    padding ? styles[`section--padding-${padding}`] : null,
    className,
    {
      'full-width': size === 'full',
      'full-max': size === 'full-max',
      breakout: size === 'breakout',
      [styles[`section--${height}-height`]]: !!height,
      [styles['section--small']]: size === 'small',
    },
  );

  return (
    <Tag
      id={id || undefined}
      className={classes}
      data-anim={animationID}
      ref={mergedRef}
      style={
        contentAlign
          ? ({ '--section-text-align': contentAlign } as React.CSSProperties)
          : undefined
      }
    >
      {image && (
        <div
          className={cx(styles.section__image, classNames?.image)}
          data-anim='section-img-wrap'
          data-size={size}
          data-hero
        >
          <Image
            src={image.src}
            alt={image.alt || ''}
            fill
            data-anim='section-img'
            className={cx(styles.section__image__img, classNames?.imageImg, {
              [styles[`hero-${imageAlignment}`]]: imageAlignment,
            })}
          />
        </div>
      )}
      <div className={cx(styles.section__inner, classNames?.inner)}>
        {heading?.heading && (
          <Heading
            as={heading?.as}
            size={heading?.size}
            uppercase={heading?.uppercase}
            animationID='section-title'
            center={heading?.center}
            highlight={heading?.highlight}
            className={cx(styles.section__heading, classNames?.heading)}
          >
            {heading?.heading}
          </Heading>
        )}
        {children}
      </div>
    </Tag>
  );
}
