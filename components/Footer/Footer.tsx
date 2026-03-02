'use client';

import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import useReduceMotion from '../../hooks/useReduceMotion';
import { Section } from '../Section';
import styles from './Footer.module.scss';

interface FooterProps {
  siteConfig: any;
  links: any[];
  pageLocale: string;
}

export default function Footer({ siteConfig }: FooterProps) {
  const reduceMotion = useReduceMotion();
  const pathname = usePathname();
  const element = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        gsap.from(element.current, {
          opacity: 0,
          delay: 0.3,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element.current,
            start: '-100% bottom',
            end: 'top top',
          },
        });
      }
    }, element);
    return () => ctx.revert();
  }, [pathname, reduceMotion]);

  return (
    <Section
      classNames={{
        main: styles.main,
      }}
    >
      <div className={styles.footer} ref={element}>
        <div className={styles.footer__fineprint}>
          <span>
            {siteConfig?.footer?.copyright} &copy; {new Date().getFullYear()}{' '}
            {''}
            {siteConfig?.footer?.fineprint} | Crafted by{' '}
            <a
              href='https://venelin.ca'
              target='_blank'
              rel='noopener noreferrer'
            >
              Venelin.ca
            </a>
          </span>
        </div>
      </div>
    </Section>
  );
}
