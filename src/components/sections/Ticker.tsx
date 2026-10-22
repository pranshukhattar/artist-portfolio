"use client";

import { Fragment, useRef } from "react";
import { artist } from "@/content/artist";
import { releases } from "@/content/music";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { RecordDisc } from "@/components/ui/RecordDisc";

/**
 * Prelude between the hero and the music: three facts, then the sound in
 * words rolling past (marquee-loop skill), so visitors know what the music is.
 * The roll follows the reader — faster with a quick scroll, reversing when
 * scrolling up, leaning slightly with speed — and stops when offscreen.
 */
export function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector("[data-roll]")!;
      const roll = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
      let direction = 1;
      // Once scrolling stops, ease back to cruising speed (in the last direction) and straighten up.
      const settle = gsap
        .delayedCall(0.2, () => {
          gsap.to(roll, { timeScale: direction, duration: 1.2, ease: "power2.out", overwrite: true });
          skew(0);
        })
        .pause();

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? roll.resume() : roll.pause()),
        onUpdate: (self) => {
          direction = self.direction;
          const velocity = self.getVelocity();
          const speed = Math.min(Math.abs(velocity) / 300, 6);
          gsap.to(roll, { timeScale: direction * (1 + speed), duration: 0.2, overwrite: true });
          skew(gsap.utils.clamp(-8, 8, -velocity / 260));
          settle.restart(true);
        },
      });
    },
    { scope: root },
  );

  const words = artist.sound;

  return (
    <section ref={root} aria-label="Latest and the sound" className="overflow-hidden bg-ink pt-16 pb-28 text-paper md:pt-20 md:pb-36">
      <div className="wrap">
        {/* The 1px gaps over a faint background draw the dividers between facts. */}
        <dl className="grid gap-px bg-paper/12 md:grid-cols-3">
          {artist.facts.map((fact) => (
            <div key={fact.label} className="bg-ink py-5 md:px-6 md:py-2 md:first:pl-0">
              <dt className="label opacity-55">{fact.label}</dt>
              <dd className="mt-2 font-display text-[17px] tracking-[-0.01em] md:text-lg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="label wrap mt-14 flex items-center gap-3 opacity-55 md:mt-20">
        The sound <span aria-hidden="true" className="h-px w-8 bg-current" />
        <span className="sr-only">{words.join(", ")}</span>
      </p>
      <div aria-hidden="true" className="mt-6 md:mt-8 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div data-roll className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {words.map((word, i) => (
                <Fragment key={word}>
                  <span
                    className={`px-[0.35em] font-display text-[clamp(56px,9vw,148px)] leading-none font-medium tracking-[-0.045em] whitespace-nowrap ${
                      i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]" : ""
                    }`}
                  >
                    {word}
                  </span>
                  <RecordDisc crop={releases[i % releases.length].cover} spinning spin="8s" className="size-[clamp(36px,5vw,80px)] shrink-0" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
