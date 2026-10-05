import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";

export function AuthShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="container-page min-h-[calc(100dvh-8rem)] py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="inline-flex rounded-xl p-1" aria-label="UNFLECT home"><Wordmark size={26} /></Link>
        <p className="label-mono mt-12 text-indigo">{eyebrow}</p>
        <h1 className="mt-4 font-display text-display">{title}</h1>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
