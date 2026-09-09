import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyQuoteBar } from "@/components/layout/sticky-quote-bar";
import { site, siteUrl } from "@/lib/site";

/** Preview para WhatsApp, LinkedIn y redes: 1200×630, fondo sólido. */
const ogImage = {
  url: `${siteUrl}/brand/og.png`,
  width: 1200,
  height: 630,
  alt: `${site.name} · courier internacional, importación y exportación`,
};

/**
 * Coolvetica para titulares: es la tipografía de la marca. Viene en un solo
 * corte, así que se declara con el rango completo de pesos para que el
 * navegador la use en cualquier `font-weight` sin fabricar una negrita falsa.
 */
const coolvetica = localFont({
  src: "../fonts/Coolvetica.woff2",
  variable: "--font-coolvetica",
  display: "swap",
  weight: "100 900",
  preload: true,
});

const geistSans = localFont({
  src: "../fonts/Geist.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  weight: "100 900",
  preload: true,
});

const geistMono = localFont({
  src: "../fonts/GeistMono.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} · Courier internacional, importación y exportación`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: `${site.name} · Cuando importás o exportás, necesitás mucho más que un courier`,
    description: site.description,
    url: siteUrl,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Cuando importás o exportás, necesitás mucho más que un courier`,
    description: site.description,
    images: [ogImage],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f6f4",
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-AR"
      className={`${coolvetica.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {GTM_ID ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}

        <a
          href="#contenido"
          className="sr-only rounded-ui bg-ink px-4 py-2 text-on-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70]"
        >
          Saltar al contenido
        </a>

        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StickyQuoteBar />
        <div className="cc-grain" aria-hidden />
      </body>
    </html>
  );
}
