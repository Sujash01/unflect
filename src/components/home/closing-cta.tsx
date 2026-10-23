"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { MagneticCta } from "@/components/ui/magnetic-cta";
import { SplitText } from "@/components/fx/split-text";
import { useReveal } from "@/components/home/selected-work";

export function ClosingCta() {
  const r = useReveal();

  return (
    <section className="content-auto relative overflow-hidden border-t border-line py-32 text-center sm:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora-blob aurora-a left-[5%] top-[-30%] h-[38rem] w-[38rem]" />
        <div className="aurora-blob aurora-b right-[0%] bottom-[-35%] h-[40rem] w-[40rem]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_70%)]"
      />
      <Container className="relative">
        <p className="label-mono mb-8 text-indigo">Start a project</p>
        <h2 className="mx-auto max-w-5xl font-display text-[clamp(3rem,7vw,6.4rem)] leading-[0.98] tracking-[-0.025em] text-bone">
          <SplitText
            text="Tell us what is getting in the way."
            accent={["getting"]}
            stagger={0.07}
          />
        </h2>
        <motion.p
          {...r(0.2)}
          className="mx-auto mt-8 max-w-xl text-lg leading-8 text-muted-strong"
        >
          Bring the business problem. We will help turn it into a useful next step.
        </motion.p>
        <motion.div
          {...r(0.3)}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticCta href="/contact" label="Start a project →" />
          <MagneticCta
            href="/process"
            label="See how we work"
            variant="outline"
          />
        </motion.div>
      </Container>
    </section>
  );
}
