"use client";

type ScrollController = {
  scrollTo: (target: number | HTMLElement, options?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
};

let controller: ScrollController | null = null;

export function setScrollController(next: ScrollController | null) {
  controller = next;
}

export function jumpToTop() {
  if (controller) {
    controller.scrollTo(0, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function jumpToPosition(position: number) {
  const top = Math.max(0, Number.isFinite(position) ? position : 0);
  if (controller) {
    controller.scrollTo(top, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top, left: 0, behavior: "auto" });
}
