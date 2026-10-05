import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Single place to build per-page metadata, so every route carries the same
 * canonical, Open Graph and Twitter shape. Pages that use this cannot forget
 * og:image, which is the most common metadata omission.
 */

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.tagline}`,
};

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path beginning with a slash, used for canonical + og:url. */
  path: string;
  type?: "website" | "article";
  robots?: Metadata["robots"];
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  robots,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots,
    openGraph: {
      type,
      siteName: site.name,
      locale: site.locale,
      url,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
