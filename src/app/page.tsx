import type { Metadata } from "next";
import { Hero } from "@/components/ui/animated-hero";
import { HomeSections } from "@/components/home/home-sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Business Automation & Systems Integration | UNFLECT",
  description:
    "UNFLECT helps businesses automate repetitive tasks, connect software systems, streamline workflows, and implement practical AI-powered automation.",
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
