"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Desktop-only track counter in the left gutter: shows the current chapter
 * and how far through it you are. Hidden over the hero. Sits on the same
 * frosted pill as the nav so it reads over light, dark and image sections.
 */
export function ChapterRail() {
  const fill = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<string | null>(null);

  useGSAP(() => {
    document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setCurrent(section.dataset.chapter!);
          // Leaving the first chapter upward means we're back in the hero.
          else if (self.direction === -1 && section === document.querySelector("[data-chapter]")) setCurrent(null);
        },
        onUpdate: (self) => {
          if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
        },
      });
    });
  });

  const [number, title] = current?.split(" — ") ?? ["", ""];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-1/2 left-4 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 rounded-full bg-ink/50 px-2 py-4 text-paper ring-1 ring-paper/10 backdrop-blur-md transition-opacity duration-500 xl:flex ${current ? "opacity-100" : "opacity-0"}`}
    >
      <span className="label tabular-nums">{number}</span>
      <span className="relative h-20 w-px bg-current/20">
        <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-current" />
      </span>
      {/* Fixed-height slot (fits the longest title) so the pill never resizes between chapters. */}
      <span className="flex h-32 items-center justify-center">
        <span className="label rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">{title}</span>
      </span>
    </div>
  );
}
