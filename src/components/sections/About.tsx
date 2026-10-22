"use client";

import { useRef } from "react";
import { artist } from "@/content/artist";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { ScrubText } from "@/components/motion/ScrubText";
import { Cover } from "@/components/ui/Cover";
import { Marginalia } from "@/components/ui/Marginalia";

const PORTRAIT = { x: 84, y: 20, zoom: 2.4 };

const FACTS = [
  { term: "Based in", value: artist.basedIn },
  { term: "Disciplines", value: "Production · Live · Composition" },
  { term: "Latest", value: "Fragments (2023)" },
];

export function About() {
  const root = useRef<HTMLDivElement>(null);

  // The image drifts inside its frame while the frame scrolls past.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-portrait]",
        { yPercent: -8 },
        { yPercent: 8, ease: "none", scrollTrigger: { trigger: "[data-portrait-frame]", start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <Chapter id="about" theme="light" chapter="04 — The person" label="About" surface="bg-paper-hi" className="pt-24 pb-32 md:pt-36 md:pb-48">
      <div ref={root} className="wrap grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div data-portrait-frame className="relative aspect-[4/5] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1),0_24px_48px_-20px_rgba(0,0,0,0.35)]">
            <div data-portrait className="absolute -inset-y-[10%] inset-x-0">
              <Cover crop={PORTRAIT} alt="Detail of the collage: a colour-wheel record label and red vinyl" className="size-full" />
            </div>
          </div>
          <Marginalia className="mt-5 -rotate-3 text-ink/70">music is a form of home</Marginalia>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <ChapterTitle index="04" story="The person">
            <MaskedReveal lines={["Making sense", "of the noise"]} className="mt-4 font-display text-[clamp(44px,6vw,96px)] leading-[0.9] font-medium tracking-[-0.045em]" />
          </ChapterTitle>

          <ScrubText text={artist.about} className="mt-10 font-display text-[clamp(22px,2.3vw,34px)] leading-[1.2] tracking-[-0.02em]" />

          <dl className="mt-14 grid gap-6 border-t border-ink/12 pt-8 sm:grid-cols-3">
            {FACTS.map((fact) => (
              <div key={fact.term} data-reveal>
                <dt className="label opacity-50">{fact.term}</dt>
                <dd className="mt-2 text-[15px]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Chapter>
  );
}
