"use client";

import { useRef, type ReactNode } from "react";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";

type Props = {
  id?: string;
  theme: "dark" | "light";
  /** Shown in the chapter rail, e.g. "01 — The record". */
  chapter?: string;
  label?: string;
  /** Background override, e.g. "bg-paper-hi" to separate two light chapters. */
  surface?: string;
  className?: string;
  children: ReactNode;
};

/**
 * One chapter of the page's story. Each chapter rises over the previous one
 * with rounded corners; as it leaves, its content sinks and dims beneath the
 * next. Children marked `data-reveal` fade up in sequence when they arrive.
 */
export function Chapter({ id, theme, chapter, label, surface, className = "", children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(items, { autoAlpha: 0, y: 32 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.07, overwrite: true }),
      });

      gsap.to("[data-chapter-inner]", {
        y: 90,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "bottom bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  const tone = theme === "light" ? `${surface ?? "bg-paper"} text-ink` : `${surface ?? "bg-ink"} text-paper`;

  return (
    <section
      ref={root}
      id={id}
      aria-label={label}
      data-theme={theme}
      data-chapter={chapter}
      // overflow-clip (not hidden) keeps the rounded corners without breaking position: sticky inside.
      className={`relative -mt-10 overflow-clip rounded-t-[28px] shadow-[0_-20px_48px_-24px_rgba(0,0,0,0.35)] md:-mt-12 md:rounded-t-[44px] ${tone} ${className}`}
    >
      <div data-chapter-inner>{children}</div>
    </section>
  );
}

/** Chapter heading: story number + title, then the section name in large type. */
export function ChapterTitle({ index, story, children }: { index: string; story: string; children: ReactNode }) {
  return (
    <div>
      <p className="label flex items-center gap-3 opacity-60" data-reveal>
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-8 bg-current opacity-50" />
        {story}
      </p>
      {children}
    </div>
  );
}
