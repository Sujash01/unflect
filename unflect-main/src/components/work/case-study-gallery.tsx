"use client";

import { useState } from "react";
import { CaseStudyScreenshot } from "@/content/case-studies";
import { Monitor } from "lucide-react";

interface CaseStudyGalleryProps {
  image: string | null;
  imagePlaceholderLabel: string;
  screenshots?: readonly CaseStudyScreenshot[];
  title: string;
  liveUrl?: string | null;
}

export function CaseStudyGallery({
  image,
  imagePlaceholderLabel,
  screenshots = [],
  title,
  liveUrl,
}: CaseStudyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no screenshots or image, display fallback placeholder
  if (!image && (!screenshots || screenshots.length === 0)) {
    return (
      <div className="flex aspect-[21/9] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-navy-raised p-8 text-center">
        <span className="font-mono text-sm text-bone">
          Project visual pending screenshot
        </span>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
          {imagePlaceholderLabel.includes("[CONFIRM")
            ? "Visual asset and live interface preview pending release."
            : imagePlaceholderLabel}
        </p>
      </div>
    );
  }

  const currentScreenshot =
    screenshots[activeIndex] ?? {
      src: image ?? "",
      title: title,
      caption: imagePlaceholderLabel,
    };

  const domain = liveUrl ? liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : "unflect.com";

  return (
    <div className="space-y-6">
      {/* Mock Browser Frame */}
      <div className="overflow-hidden rounded-2xl border border-line bg-navy-raised shadow-2xl transition-all duration-300">
        {/* Browser Top Chrome */}
        <div className="flex items-center justify-between border-b border-line bg-navy-muted px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-line/60 bg-black/40 px-4 py-1 text-xs text-muted font-mono max-w-xs truncate">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>https://{domain}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted font-mono">
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">1920 × 1080</span>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-black/50 overflow-hidden group">
          <img
            src={currentScreenshot.src}
            alt={currentScreenshot.title}
            className="w-full h-full object-cover object-top transition-opacity duration-300"
          />

          {/* Caption Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 text-left flex flex-col justify-end">
            <span className="label-mono text-indigo-bright text-xs">
              Preview {activeIndex + 1} of {screenshots.length || 1}
            </span>
            <h3 className="font-display text-base sm:text-lg text-bone mt-1">
              {currentScreenshot.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-2xl mt-1">
              {currentScreenshot.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail Bar / Selector */}
      {screenshots.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {screenshots.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item.src + index}
                onClick={() => setActiveIndex(index)}
                className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 p-1.5 ${
                  isActive
                    ? "border-indigo bg-indigo/10 ring-1 ring-indigo"
                    : "border-line bg-navy/60 hover:border-line-strong hover:bg-navy"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black/40">
                  <img
                    src={item.src}
                    alt={item.title}
                    className={`w-full h-full object-cover object-top transition-transform duration-300 ${
                      isActive ? "scale-105" : "group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <div className="mt-2 px-1 pb-1">
                  <p
                    className={`text-xs font-medium truncate ${
                      isActive ? "text-bone" : "text-muted group-hover:text-bone"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
