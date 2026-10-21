import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProcessView } from "./process-view";

import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Software Development Process: Discover to Deploy",
  description:
    "Explore UNFLECT's structured software development process: Discover, Define, Build, Deploy, and Evolve. Clear milestones, direct engineering communication, and complete code ownership.",
  path: "/process",
});

export default function ProcessPage() {
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
            name: "Process",
            item: `${site.url}/process`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProcessView />
    </>
  );
}
