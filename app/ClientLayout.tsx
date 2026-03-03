'use client';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from 'react';
import { NavigationContextProvider } from '@/context/navigationContext';
import { TransitionContextProvider } from '@/context/transitionContext';
import useNextCssRemovalPrevention from '@/hooks/useNextCssRemovalPrevention';
import { DataProvider } from '@/utils/DataProvider';
import enMessages from '../messages/en.json';

gsap.registerPlugin(ScrollTrigger);

export function ClientLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]);

  useEffect(() => {
    if (lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useNextCssRemovalPrevention();

  return (
    <TransitionContextProvider>
      <NextIntlClientProvider
        locale={lang}
        messages={enMessages}
        timeZone='America/Toronto'
      >
        <NavigationContextProvider>
          <DataProvider>{children}</DataProvider>
        </NavigationContextProvider>
      </NextIntlClientProvider>
    </TransitionContextProvider>
  );
}
