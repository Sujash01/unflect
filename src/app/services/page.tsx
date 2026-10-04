import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicesView } from "./services-view";

export const metadata: Metadata = pageMetadata({ title: "Services", description: "Web products, internal systems and integrations built around real business problems.", path: "/services" });

export default function ServicesPage() {
  return <ServicesView />;
}
