import type { Metadata } from "next";
import { Hero } from "@/components/ui/animated-hero";
import { HomeSections } from "@/components/home/home-sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "UNFLECT · Custom Software Development Company",
  description:
    "UNFLECT is a custom software development company. We engineer bespoke web applications, internal business tools, operations platforms, and workflow automation integrations.",
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
