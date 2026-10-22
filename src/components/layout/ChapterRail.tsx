"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Desktop-only track counter in the left gutter: shows the current chapter
 * and how far through it you are. Hidden over the hero.
 */
export function ChapterRail() {
  const fill = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<{ title: string; light: boolean } | null>(null);

  useGSAP(() => {
    document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setCurrent({ title: section.dataset.chapter!, light: section.dataset.theme === "light" });
          // Leaving the first chapter upward means we're back in the hero.
          else if (self.direction === -1 && section === document.querySelector("[data-chapter]")) setCurrent(null);
        },
        onUpdate: (self) => {
          if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
        },
      });
    });
  });

  const [number, title] = current?.title.split(" — ") ?? ["", ""];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 transition-[opacity,color] duration-500 xl:flex ${current ? "opacity-100" : "opacity-0"} ${current?.light ? "text-ink" : "text-paper"}`}
    >
      <span className="label tabular-nums">{number}</span>
      <span className="relative h-20 w-px bg-current/20">
        <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-current" />
      </span>
      <span className="label rotate-180 [writing-mode:vertical-rl]">{title}</span>
    </div>
  );
}
