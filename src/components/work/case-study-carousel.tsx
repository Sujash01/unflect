"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { CaseStudyScreenshot } from "@/content/case-studies";

type CaseStudyCarouselProps = {
  readonly title: string;
  readonly liveUrl: string | null;
  readonly defaultImage: string | null;
  readonly placeholderLabel: string;
  readonly screenshots?: readonly CaseStudyScreenshot[];
};

export function CaseStudyCarousel({
  title,
  liveUrl,
  defaultImage,
  placeholderLabel,
  screenshots,
}: CaseStudyCarouselProps) {
  // If no multiple screenshots available, use default image if exists
  const items: readonly CaseStudyScreenshot[] =
    screenshots && screenshots.length > 0
      ? screenshots
      : defaultImage
        ? [
            {
              src: defaultImage,
              alt: `${title} preview`,
              title: "Interface Preview",
              description: "Live interface build",
            },
          ]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  const total = items.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Autoplay
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, total, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (total <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, prevSlide, nextSlide]);

  if (total === 0) {
    return (
      <div className="flex aspect-[21/9] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-navy-raised p-8 text-center">
        <span className="font-mono text-sm text-bone">
          Project visual pending screenshot
        </span>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
          {placeholderLabel}
        </p>
      </div>
    );
  }

  const current = items[currentIndex] ?? items[0];
  if (!current) return null;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-line bg-navy/90 shadow-2xl transition-colors hover:border-line-strong"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshot carousel`}
    >
      {/* Browser window chrome header */}
      <div className="flex items-center justify-between border-b border-line bg-navy-raised/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>

        <div className="flex max-w-[55%] items-center truncate rounded-md border border-line bg-black/50 px-3 py-1 font-mono text-[11px] text-muted-strong">
          <span className="truncate">
            {liveUrl ? liveUrl.replace("https://", "") : "preview.internal"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {total > 1 ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-indigo-bright">
                0{currentIndex + 1} / 0{total}
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                className="flex h-6 w-6 items-center justify-center rounded border border-line bg-navy/70 text-muted transition-colors hover:border-line-strong hover:text-bone"
              >
                {isPaused ? (
                  <Play className="h-2.5 w-2.5 fill-current" />
                ) : (
                  <Pause className="h-2.5 w-2.5 fill-current" />
                )}
              </button>
            </div>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-indigo">
              Live Preview
            </span>
          )}
        </div>
      </div>

      {/* Main viewport frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-inset sm:aspect-[21/10]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.25 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient overlay gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        />

        {/* Floating caption & HUD info */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-xl">
            <span className="inline-block rounded-md border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-indigo-bright backdrop-blur-md">
              0{currentIndex + 1} · {current.title}
            </span>
            {current.description ? (
              <p className="mt-2 text-xs leading-relaxed text-bone/90 drop-shadow-md sm:text-sm">
                {current.description}
              </p>
            ) : null}
          </div>

          {/* Slide Indicator Pills */}
          {total > 1 ? (
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-line bg-black/70 p-1.5 backdrop-blur-md">
              {items.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-7 bg-indigo-bright"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Next / Prev Navigation Arrows */}
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous screenshot"
              className="group/btn absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-black/60 text-bone backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-line-strong hover:bg-black/90 focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next screenshot"
              className="group/btn absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-black/60 text-bone backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-line-strong hover:bg-black/90 focus:outline-none"
            >
              <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
          </>
        ) : null}
      </div>

      {/* Bottom Thumbnail Strip for fast selection */}
      {total > 1 ? (
        <div className="flex border-t border-line bg-navy-raised/50 p-2 overflow-x-auto gap-2">
          {items.map((item, idx) => (
            <button
              key={item.src}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`group/thumb relative flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition-all ${
                idx === currentIndex
                  ? "border-indigo bg-indigo/10 text-bone"
                  : "border-transparent text-muted hover:border-line hover:text-muted-strong"
              }`}
            >
              <span className="font-mono text-[10px] text-indigo">
                0{idx + 1}
              </span>
              <span className="truncate text-xs font-medium">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
