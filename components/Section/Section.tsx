"use client";

import cx from 'clsx';
import gsap from 'gsap';
import Image from 'next/image';
import { forwardRef, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Heading } from '../Headings';
import styles from './Section.module.scss';

export interface SectionClassNames {
  main?: string;
  inner?: string;
  image?: string;
  imageImg?: string;
  heading?: string;
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  children?: ReactNode;
  className?: string;
  classNames?: SectionClassNames;
  image?: any;
  animationID?: string | null;
  heading?: any;
  size?: 'fixed' | 'full';
  height?: 'full' | 'half' | 'quarter';
  imageAlignment?: 'top' | 'bottom';
  contentAlign?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      id = '',
      children = null,
      className = '',
      classNames = {},
      image = undefined,
      animationID = null,
      heading = {},
      size = 'fixed',
      height = undefined,
      imageAlignment = undefined,
      contentAlign = undefined,
      ...props
    },
    ref,
  ) => {
    const sectionRef = useRef(null);

    useEffect(() => {
      if (!sectionRef.current || !animationID) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%', // Adjust trigger position as needed
          toggleActions: 'play none none none',
        },
      });

      timeline
        .from(
          `[data-anim=${animationID}] [data-anim='section-title']`,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power4.out',
          },
          0, // Start immediately
        )
        .from(
          `[data-anim=${animationID}] [data-anim='section-img']`,
          {
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: 'power4.out',
          },
          0.3, // Delay slightly after the title starts
        )
        .from(
          `[data-anim=${animationID}] .${styles.section__inner}`,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power4.out',
          },
          0.6, // Delay after the image starts
        );

      return () => {
        if (timeline.scrollTrigger) {
          timeline.scrollTrigger.kill();
        }
        timeline.kill();
      };
    }, [animationID]);

    const classes = cx(styles.section, classNames?.main, {
      [styles['section--full-width']]: size === 'full',
      [styles[`section--${height}-height`]]: height,
      [className]: className,
      rel: image,
    });

    return (
      <section
        id={id}
        className={classes}
        data-anim={animationID}
        ref={ref}
        style={
          contentAlign
            ? ({ '--section-text-align': contentAlign } as React.CSSProperties)
            : undefined
        }
        {...props}
      >
        {image && (
          <div
            className={cx(styles.section__image, classNames?.image)}
            data-anim='section-img-wrap'
          >
            <Image
              src={image.src}
              alt={image.alt}
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
              className={cx(styles.section__heading, classNames?.heading)}
            >
              {heading?.heading}
            </Heading>
          )}
          {children}
        </div>
      </section>
    );
  },
);

Section.displayName = 'Section';
