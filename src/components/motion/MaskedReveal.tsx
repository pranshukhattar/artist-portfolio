"use client";

import { useRef, type ElementType } from "react";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

type Props = {
  as?: ElementType;
  /** One string per visual line. */
  lines: string[];
  className?: string;
};

/**
 * Masked word-by-word reveal on scroll (masked-reveal skill). The full text is
 * exposed once to assistive tech; the split words are decorative. Words stay
 * visible without JS and are only armed (hidden) after mount.
 */
export function MaskedReveal({ as: Tag = "h2", lines, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      el.setAttribute("data-armed", "");
      gsap.fromTo(
        el.querySelectorAll(".word"),
        { yPercent: 110, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.035,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      <SplitWords lines={lines} />
    </Tag>
  );
}

/** Accessible split markup shared by scroll and intro reveals. */
export function SplitWords({ lines }: { lines: string[] }) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, i) => (
        <span key={i} className="block" aria-hidden="true">
          {line.split(" ").map((word, j) => (
            <span key={j} className="word-mask">
              <span className="word">{word}</span>
              {j < line.split(" ").length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
