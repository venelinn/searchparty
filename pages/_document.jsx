import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/static/favicons/safari-pinned-tab.svg"
          color="#FF6000"
        />
        <link rel="shortcut icon" href="/static/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#FF6000" />
        <meta
          name="msapplication-config"
          content="/static/favicons/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
				{(process.env.CONTEXT === "production") && (
					<Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','GTM-KT3X3F');`}}></Script>
					)}
      </Head>
      <body>
				{(process.env.CONTEXT === "production") && (
					<noscript dangerouslySetInnerHTML={{ __html: "<iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-KT3X3F\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>"}}></noscript>
				)}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
