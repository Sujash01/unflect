import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { services } from "@/content/services";
import { site } from "@/content/site";

/**
 * Sitemap. Placeholder case studies are excluded \u2014 they are not real results and
 * should not be indexed as though they were.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const workPages: MetadataRoute.Sitemap = caseStudies
    .filter((study) => study.status === "published")
    .map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      lastModified: study.completedAt ? new Date(study.completedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [...core, ...servicePages, ...workPages];
}
