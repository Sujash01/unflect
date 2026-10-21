import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicesView } from "./services-view";

import { services } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Custom Software Development Services",
  description:
    "Explore UNFLECT's custom software development services: bespoke web applications, customer portals, internal business systems, and automated API integrations.",
  path: "/services",
});

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${site.url}/services`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Custom Software Development Services",
        description:
          "UNFLECT provides three connected software disciplines: Web, Systems, and Integrations.",
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.name,
          url: `${site.url}/services/${service.slug}`,
          description: service.summary,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesView />
    </>
  );
}
