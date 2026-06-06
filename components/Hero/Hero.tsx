'use client';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/Section';
import useNavigationContext from '@/context/navigationContext';
import type { SectionProps } from '@/types/section';
import useReduceMotion from '../../hooks/useReduceMotion';
import Icon from '../Icons/Icons';
import styles from './Hero.module.scss';

gsap.registerPlugin(ScrollTrigger);

export interface HeroProps {
  id?: string;
  images?: any[];
  content?: any;
  animationID?: string;
  height?: SectionProps['height'];
  imageAlignment?: 'top' | 'bottom';
  anchorToNext?: boolean;
  size?: SectionProps['size'];
  locale?: string;
}

const heroAnimation = (animationID: string) => {
  const timeline = gsap.timeline();
  const sectionSelector = `[data-anim="${animationID}"] [data-anim="section-img-wrap"]`;
  const heroContentSelector = `[data-anim="${animationID}"] [data-anim="hero-content"]`;
  const heroAnchor = `[data-anim="${animationID}"] [data-anim="hero-anchor"]`;

  // Only tween targets that exist; the hero anchor renders conditionally.
  const exists = (selector: string) => gsap.utils.toArray(selector).length > 0;

  if (exists(sectionSelector)) {
    timeline.fromTo(
      sectionSelector,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, delay: 0.5, ease: 'power4.out' },
    );
  }

  if (exists(heroContentSelector)) {
    timeline.fromTo(
      heroContentSelector,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power4.out' },
      '-=0.5',
    );
  }

  if (exists(heroAnchor)) {
    timeline.from(
      heroAnchor,
      {
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      },
      '-=0.5',
    );
  }
};

const Hero = ({
  images,
  content,
  animationID,
  height,
  imageAlignment,
  anchorToNext,
  size = 'full',
}: HeroProps) => {
  const reduceMotion = useReduceMotion();
  const [hasNextSection, setHasNextSection] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const { setIsLogoVisible } = useNavigationContext();
  const heroImages =
    images
      ?.flatMap(item => {
        if (Array.isArray(item?.image)) return item.image;
        if (item && (item.src || item.url)) return [item];
        return [];
      })
      .filter(Boolean) ?? [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduceMotion && animationID) {
        heroAnimation(animationID);
      }
    });
    return () => ctx.revert();
  }, [reduceMotion, animationID]);

  useEffect(() => {
    if (!heroRef.current || height !== 'full') return;

    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        setIsLogoVisible(self.progress >= 0.8);
      },
      onLeave: () => setIsLogoVisible(true),
      onEnterBack: () => setIsLogoVisible(false),
    });

    return () => trigger.kill();
  }, [height, setIsLogoVisible]);

  useEffect(() => {
    if (anchorToNext && height === 'full' && heroRef.current) {
      const nextSection = heroRef.current.nextElementSibling;
      if (nextSection) {
        setHasNextSection(true);
      }
    }
  }, [anchorToNext, height]);

  const scrollToNextSection = () => {
    heroRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section
      image={heroImages[0]}
      animationID={animationID}
      height={height}
      size={size}
      ref={heroRef}
      imageAlignment={imageAlignment}
      disableAnimation
      classNames={{
        main: styles.main,
        inner: styles.inner,
        heading: styles.heading,
        image: styles.image,
      }}
    >
      <div className={styles.hero__content} data-anim='hero-content'>
        {content}
      </div>
      {anchorToNext && height === 'full' && hasNextSection && (
        <button
          type='button'
          className={styles.hero__down}
          data-anim='hero-anchor'
          title='Scroll to next section'
          onClick={scrollToNextSection}
        >
          <Icon name='ChevronsDown' size='3em' color='#ffffff' />
        </button>
      )}
    </Section>
  );
};

export default Hero;
export { Hero, heroAnimation };
