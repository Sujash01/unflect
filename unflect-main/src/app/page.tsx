import type { Metadata } from "next";
import { Hero } from "@/components/ui/animated-hero";
import { HomeSections } from "@/components/home/home-sections";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}
