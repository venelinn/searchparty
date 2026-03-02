import type { Metadata } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: {
    default: 'Search Party',
    template: '%s | Search Party',
  },
  description: 'Search Party | searchpartyottawa.ca',
  keywords: 'band, rock band, band 80s',
  icons: {
    apple: '/static/favicons/apple-touch-icon.png',
    icon: [
      {
        url: '/static/favicons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/static/favicons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    shortcut: '/static/favicons/favicon.ico',
  },
  manifest: '/static/favicons/site.webmanifest',
  other: {
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/static/favicons/browserconfig.xml',
  },
  openGraph: {
    type: 'website',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/static/og-image.jpg`],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://searchpartyottawa.ca',
  ),
  robots: 'follow, index',
  verification: {
    google: 'nUA_iL8L_0u8UoXtxBhLE8dSuJ6e04s1dFv2UZSBRBc',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='theme-color' content='#000000' />
        <meta name='color-scheme' content='light dark' />
        <link
          rel='mask-icon'
          href='/static/favicons/safari-pinned-tab.svg'
          color='#FF6000'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
