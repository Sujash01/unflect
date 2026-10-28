import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicesView } from "./services-view";

import { services } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Business Automation & Systems Integration Services | UNFLECT",
  description:
    "Explore UNFLECT's business automation and systems integration services: workflow automation, WhatsApp business workflows, systems integration, and AI-powered automation.",
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
        name: "Business Automation & Systems Integration Services",
        description:
          "UNFLECT provides core automation disciplines: Business Automation, WhatsApp Automation, Systems Integration, and AI-Powered Workflows, alongside secondary development services.",
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
