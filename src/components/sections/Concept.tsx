"use client";

import { useRef } from "react";
import Image from "next/image";
import hero from "../../../public/landing_page_hero.png";
import { artist } from "@/content/artist";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Marginalia } from "@/components/ui/Marginalia";

/** Interlude: the thesis line, then the collage pans past like a passing train window. */
export function Concept() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-band-image]",
        { xPercent: 0 },
        { xPercent: -41, ease: "none", scrollTrigger: { trigger: "[data-band]", start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    // Part of "The person": the rail carries chapter 04 through the interlude.
    <Chapter theme="dark" chapter="04 — The person" label="Concept" className="pt-28 pb-36 md:pt-44 md:pb-52">
      <div ref={root}>
        <div className="wrap relative">
          <p className="label opacity-60" data-reveal>
            Interlude
          </p>
          <MaskedReveal
            as="p"
            lines={["A sonic journey", "through time, places", "and feeling."]}
            className="mt-6 max-w-[16ch] font-display text-[clamp(40px,6.4vw,112px)] leading-[0.92] font-medium tracking-[-0.045em]"
          />
          <Marginalia className="mt-6 rotate-[-4deg] text-paper/70 md:absolute md:right-[8%] md:bottom-4 md:mt-0">same places, different feeling</Marginalia>
        </div>

        <div data-band className="relative mt-16 h-[30vh] min-h-52 overflow-hidden md:mt-24 md:h-[44vh]">
          <div data-band-image className="absolute inset-y-0 left-0 w-[170%]">
            <Image src={hero} alt="" fill sizes="170vw" placeholder="blur" className="object-cover object-[50%_100%]" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_0%,transparent_12%,transparent_88%,var(--color-ink)_100%)]" />
        </div>
        <p className="sr-only">{artist.concept}</p>
      </div>
    </Chapter>
  );
}
