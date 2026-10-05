import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { SplitText } from "@/components/fx/split-text";

export function EditorialPageHeader({ section, title, lede, aside }: { section: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora-blob aurora-a -right-[10%] -top-[40%] h-[36rem] w-[36rem] opacity-80" />
        <div className="aurora-blob aurora-b -left-[16%] bottom-[-60%] h-[32rem] w-[32rem] opacity-70" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.2] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <Container>
        <div className="relative py-24 sm:py-32 lg:py-40">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.03em] text-muted">
            <span className="flex items-center gap-2 text-indigo">
              {section}
            </span>
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,.5fr)] lg:items-end">
            <h1 className="max-w-5xl font-display text-[clamp(3.2rem,7.2vw,7rem)] leading-[0.96] tracking-[-0.03em] text-bone text-balance">
              {typeof title === "string" ? <SplitText text={title} mode="mount" delay={0.1} /> : title}
            </h1>
            {lede ? (
              <div className="max-w-md lg:pb-2">
                <p className="text-base leading-7 text-muted-strong sm:text-lg">{lede}</p>
                {aside ? <div className="mt-7">{aside}</div> : null}
              </div>
            ) : aside ? (
              <div className="max-w-md lg:pb-2">{aside}</div>
            ) : null}
          </div>
          <div aria-hidden="true" className="mt-14 h-px origin-left bg-gradient-to-r from-indigo/50 via-line-strong to-transparent" />
        </div>
      </Container>
    </header>
  );
}
