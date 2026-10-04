import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageTransition } from "@/components/layout/page-transition";
import { SiteDock } from "@/components/layout/site-dock";
import { SiteEffects } from "@/components/layout/site-effects";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import { ScrollProgress } from "@/components/fx/scroll-progress";
import { CustomCursor } from "@/components/fx/custom-cursor";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { OG_IMAGE } from "@/lib/seo";

import "./globals.css";

/* ==========================================================================
   TYPEFACES
   Three faces, each with a job:
     Inter Tight \u2014 display. Clean, tight, neutral.
     Inter         \u2014 body. Neutral and highly legible at small sizes.
     (labels and indices use Inter too, small and in sentence case)
   ========================================================================== */

const heading = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ==========================================================================
   METADATA DEFAULTS
   ========================================================================== */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} \u2014 ${site.tagline}`,
    template: `%s \u00b7 ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "custom software development",
    "business software",
    "web application development",
    "internal business systems",
    "systems integration",
    "API integration",
    "custom web development",
    "software consultancy",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} \u2014 ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} \u2014 ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* ==========================================================================
   ORGANISED DATA \u2014 Organization + Service catalogue.
   ========================================================================== */

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description: site.description,
  slogan: site.positioning,
  email: site.email ?? undefined,
  knowsAbout: services.map((service) => service.name),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${service.name} \u2014 ${service.summary}`,
        description: service.promise,
        url: `${site.url}/services/${service.slug}`,
      },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${heading.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-navy font-sans text-bone antialiased">
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD \u2014 no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-indigo focus:bg-navy focus:px-5 focus:py-3 focus:text-[0.875rem] focus:text-indigo"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        <SiteHeader />
        <SiteEffects />
        <main id="main" className="relative z-10 pt-[4.75rem] sm:pt-[5rem]">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <SiteDock />
      </body>
    </html>
  );
}
