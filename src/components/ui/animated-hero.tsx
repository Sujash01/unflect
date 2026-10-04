"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MagneticCta } from "@/components/ui/magnetic-cta";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { SplitText } from "@/components/fx/split-text";
import { LaptopVisual } from "@/components/fx/laptop-visual";
import { Marquee } from "@/components/fx/marquee";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const TICKER = ["Web products", "Internal systems", "Integrations", "Discover", "Define", "Build", "Deploy", "Evolve"];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line">
      {/* Atmosphere */}
      <motion.div aria-hidden="true" style={reduce ? undefined : { y: auroraY }} className="pointer-events-none absolute inset-0">
        <div className="aurora-blob aurora-a -left-[10%] top-[-12%] h-[44rem] w-[44rem]" />
        <div className="aurora-blob aurora-b right-[-12%] top-[8%] h-[40rem] w-[40rem]" />
        <div className="aurora-blob aurora-c bottom-[-18%] left-[28%] h-[36rem] w-[36rem]" />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.09] [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_72%)]"
      />

      <motion.div style={reduce ? undefined : { y: contentY, opacity: contentOpacity }} className="container-page relative grid min-h-[100dvh] items-center gap-10 pb-32 pt-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-6">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="glass-chip inline-flex items-center gap-2.5 rounded-full px-4 py-2"
          >
            <span className="label-mono text-muted-strong">Custom software · Remote-first</span>
          </motion.div>

          <h1 className="mt-8 max-w-4xl font-display text-[clamp(3rem,7.4vw,6.6rem)] leading-[0.98] tracking-[-0.025em]">
            <SplitText text="Software for the way your business actually works." mode="mount" delay={0.15} accent={["actually"]} />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="mt-8 max-w-xl text-lg leading-8 text-muted-strong"
          >
            UNFLECT designs, builds and supports custom software — web products, internal systems and integrations.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-5 flex h-6 items-center gap-3 font-mono text-[11px] tracking-[0.03em] text-steel"
          >
            <span aria-hidden="true" className="h-px w-8 bg-steel/60" />
            <TypingAnimation words={["Web products", "Internal systems", "Integrations", "Business software"]} loop className="text-steel" />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticCta href="/contact" label="Start a project →" />
            <MagneticCta href="/work" label="See our work" variant="outline" />
          </motion.div>
        </div>

        <LaptopVisual />
      </motion.div>

      {/* Ticker + scroll cue */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto mb-5 flex w-fit items-center gap-3 text-muted">
          <span className="label-mono">Scroll</span>
          <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden bg-line-strong">
            <motion.span
              className="absolute inset-x-0 top-0 h-3 bg-indigo"
              animate={reduce ? undefined : { y: ["-100%", "320%"] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
        <div className="border-t border-line bg-navy/60 py-4 backdrop-blur-md">
          <Marquee duration={60}>
            {TICKER.map((t, i) => (
              <span key={t} className="flex items-center">
                <span className="px-7 font-display text-xl text-muted-strong/70">{t}</span>
                <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
                {i === TICKER.length - 1 ? <span className="px-7" /> : null}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
