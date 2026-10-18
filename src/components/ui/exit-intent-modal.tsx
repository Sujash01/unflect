"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, FolderKanban, Calendar, Sparkles } from "lucide-react";

const MIN_DWELL_TIME_MS = 300; // Fast arming (300ms) so testing and intentional exits trigger reliably

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const mountTimeRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const triggerModal = useCallback(() => {
    if (hasTriggeredRef.current) return;
    if (Date.now() - mountTimeRef.current < MIN_DWELL_TIME_MS) return;

    hasTriggeredRef.current = true;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    mountTimeRef.current = Date.now();
    hasTriggeredRef.current = false;

    // Detect when cursor moves out of the viewport toward the browser tabs / address bar
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when cursor leaves through the top of the viewport
      if (e.clientY <= 35) {
        triggerModal();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      // Moving out of the document window towards browser chrome / tabs
      if (!e.relatedTarget && e.clientY <= 45) {
        triggerModal();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseout", handleMouseOut);

    // Global testing helpers available in developer console
    if (typeof window !== "undefined") {
      (window as unknown as { __resetExitIntent?: () => void }).__resetExitIntent = () => {
        hasTriggeredRef.current = false;
        mountTimeRef.current = Date.now();
      };
      (window as unknown as { __openExitIntent?: () => void }).__openExitIntent = () => {
        setIsOpen(true);
      };
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [triggerModal]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 bg-navy/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-line-strong bg-navy-raised/95 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl"
          >
            {/* Top gradient hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo to-transparent"
            />

            {/* Background glowing aurora */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(78,140,163,0.18),transparent_70%)] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(40,92,112,0.15),transparent_70%)] blur-2xl"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close dialog"
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-navy/80 text-muted-strong transition-all duration-200 hover:border-line-strong hover:bg-module hover:text-bone active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Content */}
            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo-wash/40 px-3 py-1 text-xs font-medium text-indigo-bright">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo" />
                </span>
                <span>Before You Go</span>
              </div>

              {/* Title & Description */}
              <h2
                id="exit-intent-title"
                className="mt-3.5 font-display text-2xl font-semibold tracking-[-0.025em] text-bone sm:text-3xl md:text-[2.2rem] md:leading-[1.12]"
              >
                Preview our work or get a free consultation today.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-strong sm:text-base">
                Discover custom software, marketplaces, and data platforms engineered by UNFLECT—or speak directly with our engineering founders about your project with zero commitment.
              </p>
            </div>

            {/* Action Cards */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Preview Our Work */}
              <Link
                href="/work"
                onClick={closeModal}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-line bg-module/80 p-5 sm:p-6 transition-all duration-300 hover:border-indigo/50 hover:bg-module hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-line bg-navy-inset/60 px-2 py-0.5 font-mono text-[10px] tracking-wide text-muted uppercase">
                      Case Studies
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-navy-inset/70 text-indigo group-hover:border-indigo/40 group-hover:text-indigo-bright transition-colors">
                      <FolderKanban className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-bone group-hover:text-indigo-bright transition-colors">
                    Preview Our Work
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-strong leading-normal">
                    Explore PaperPlane marketplace, DataForge analytics, and verified client deliverables.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-full border border-line-strong bg-navy/60 px-4 py-2 text-xs font-medium text-bone transition-all duration-200 group-hover:border-indigo group-hover:bg-indigo-wash/30 group-hover:text-indigo-bright">
                  <span>Browse Projects</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>

              {/* Card 2: Get a Free Consultation */}
              <Link
                href="/contact"
                onClick={closeModal}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-indigo/40 bg-gradient-to-b from-indigo-panel/20 via-module/90 to-module p-5 sm:p-6 transition-all duration-300 hover:border-indigo hover:shadow-[0_0_30px_rgba(78,140,163,0.18)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-md border border-indigo/40 bg-indigo-wash/50 px-2 py-0.5 font-mono text-[10px] tracking-wide text-indigo-bright uppercase">
                      <Sparkles className="h-2.5 w-2.5" />
                      Zero Obligation
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo/40 bg-indigo-panel/40 text-indigo-bright group-hover:bg-indigo group-hover:text-[#0A0A0A] transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-bone group-hover:text-indigo-bright transition-colors">
                    Free Consultation
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-strong leading-normal">
                    Get honest technical scoping, architecture advice, and feasibility assessment with our founders.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-full bg-indigo px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition-all duration-200 group-hover:bg-indigo-bright shadow-sm">
                  <span>Claim Consultation</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </div>

            {/* Footer / Dismiss note */}
            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line/60 pt-4 text-center sm:flex-row sm:text-left">
              <span className="font-mono text-[11px] text-muted">
                Remote-first studio · Direct response within 2 working days
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="text-xs text-muted transition-colors hover:text-bone hover:underline underline-offset-4 cursor-pointer"
              >
                Continue browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
