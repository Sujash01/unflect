import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Inter_Tight } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageTransition } from "@/components/layout/page-transition";
import { SiteDock } from "@/components/layout/site-dock";
import { SiteEffects } from "@/components/layout/site-effects";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import { ScrollProgress } from "@/components/fx/scroll-progress";
import { ScrollManager } from "@/components/layout/scroll-manager";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { OG_IMAGE } from "@/lib/seo";

import "./globals.css";

/* ==========================================================================
   TYPEFACES
   Three faces, each with a job:
     Inter Tight — display. Clean, tight, neutral.
     Inter       — body. Neutral and highly legible at small sizes.
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
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
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
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
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
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* ==========================================================================
   ORGANIZED DATA — Organization + Service catalogue.
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
        name: `${service.name} — ${service.summary}`,
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
      className={`${heading.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-navy font-sans text-bone antialiased">
        {/* Theme initialization must run before hydration.
            next/script with beforeInteractive is the correct
            Next.js mechanism for this. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            const saved = localStorage.getItem("theme");
            document.documentElement.classList.toggle(
              "dark",
              saved !== "light"
            );
          } catch (_) {
            document.documentElement.classList.add("dark");
          }`}
        </Script>

        {/* Static, developer-authored JSON-LD — no user input involved. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-indigo focus:bg-navy focus:px-5 focus:py-3 focus:text-[0.875rem] focus:text-indigo"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <ScrollManager />
        <ScrollProgress />
        <SiteHeader />
        <SiteEffects />

        <main
          id="main"
          className="relative z-10 pt-[4.75rem] sm:pt-[5rem]"
        >
          <PageTransition>{children}</PageTransition>
        </main>

        <SiteFooter />
        <SiteDock />
      </body>
    </html>
  );
}