'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
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
      delay,
      ease: 'power4.out',
    });

    return () => {
      gsap.set(el, { clearProps: 'all' });
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
