import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProcessView } from "./process-view";

export const metadata: Metadata = pageMetadata({ title: "Process", description: "Discover, Define, Build, Deploy, Evolve — the five stages of an UNFLECT project.", path: "/process" });

export default function ProcessPage() {
  return <ProcessView />;
}
