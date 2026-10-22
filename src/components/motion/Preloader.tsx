"use client";

import { useRef } from "react";
import { gsap, markIntroDone, useGSAP } from "@/lib/motion";
import { Cover } from "@/components/ui/Cover";
import { releases } from "@/content/music";
import { PRELOAD_KEY } from "@/lib/preload";

/**
 * First-visit preloader: a record spins up while the counter runs to 100.
 * Only shown when the head script added `html.preload` (first visit, motion allowed).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("preload")) {
        markIntroDone();
        return;
      }
      try {
        sessionStorage.setItem(PRELOAD_KEY, "1");
      } catch {}

      const counter = { value: 0 };
      gsap
        .timeline({ onComplete: () => document.documentElement.classList.remove("preload") })
        .to(counter, {
          value: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        })
        .to(bar.current, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(root.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "+=0.1")
        // Let the hero intro start while the curtain is still lifting.
        .call(markIntroDone, [], "<0.3");
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex-col items-center justify-center gap-6 bg-ink text-paper"
      aria-hidden="true"
    >
      <div className="spin size-20 overflow-hidden rounded-full" style={{ ["--spin" as string]: "1.6s", ["--spin-state" as string]: "running" }}>
        <Cover crop={releases[0].cover} alt="" className="size-full" />
      </div>
      <span ref={count} className="font-display text-7xl font-bold tracking-[-0.04em] tabular-nums md:text-8xl">
        000
      </span>
      <span className="block h-px w-40 bg-paper/20">
        <span ref={bar} className="block h-full origin-left scale-x-0 bg-paper" />
      </span>
    </div>
  );
}
