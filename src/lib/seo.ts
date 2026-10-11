import type { Metadata } from "next";
import { site } from "@/content/site";

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: site.name,
};

type PageMetaInput = {
  title?: string | { absolute: string };
  description: string;
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

  const isHome = path === "/";
  // On the homepage, ensure title is absolute "UNFLECT" so parent template (%s · UNFLECT) is ignored
  const pageTitle = isHome
    ? { absolute: typeof title === "string" ? title : (title?.absolute ?? site.name) }
    : (title ?? site.name);

  const ogTitle = typeof pageTitle === "string" ? pageTitle : pageTitle.absolute;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    robots,
    openGraph: {
      type,
      siteName: site.name,
      locale: site.locale,
      url,
      title: ogTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
