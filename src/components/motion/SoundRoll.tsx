"use client";

import { Fragment, useRef } from "react";
import { artist } from "@/content/artist";
import { releases } from "@/content/music";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { RecordDisc } from "@/components/ui/RecordDisc";

type Props = {
  /** Only animate while this media query matches (the roll is hidden otherwise). */
  media: string;
  size?: "sm" | "lg";
  className?: string;
};

const SIZES = {
  sm: { word: "text-[clamp(34px,10vw,48px)]", disc: "size-7" },
  lg: { word: "text-[clamp(56px,9vw,148px)]", disc: "size-[clamp(36px,5vw,80px)]" },
};

/**
 * The sound in words, rolling past (marquee-loop skill): solid and outlined
 * words with small spinning records between them. The roll follows the
 * reader — faster with a quick scroll, reversing when scrolling up, leaning
 * slightly with speed — and stops when offscreen. Static under reduced motion.
 */
export function SoundRoll({ media, size = "lg", className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const words = artist.sound;

  useGSAP(
    () => {
      gsap.matchMedia().add(`${media} and (prefers-reduced-motion: no-preference)`, () => {
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
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <span className="sr-only">The sound: {words.join(", ")}</span>
      <div aria-hidden="true" className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div data-roll className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {words.map((word, i) => (
                <Fragment key={word}>
                  <span
                    className={`px-[0.35em] font-display leading-none font-medium tracking-[-0.045em] whitespace-nowrap ${SIZES[size].word} ${
                      i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]" : ""
                    }`}
                  >
                    {word}
                  </span>
                  <RecordDisc crop={releases[i % releases.length].cover} spinning spin="8s" className={`shrink-0 ${SIZES[size].disc}`} />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
