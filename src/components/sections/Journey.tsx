"use client";

import { useRef } from "react";
import { artist, type Milestone } from "@/content/artist";
import { playableTrackIds } from "@/content/music";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer } from "@/components/player/PlayerProvider";
import { scrollToHash } from "@/components/layout/Nav";
import { Icon } from "@/components/ui/Icon";
import { Marginalia } from "@/components/ui/Marginalia";
import { button } from "@/components/ui/button";

/** The road so far: the artist's milestones along a route that draws itself as you scroll. */
export function Journey() {
  const root = useRef<HTMLDivElement>(null);

  // The route draws down the list; each stop lights up as the line reaches it.
  useGSAP(
    () => {
      const stops = gsap.utils.toArray<HTMLElement>("[data-stop]");
      if (prefersReducedMotion()) {
        gsap.set("[data-route]", { scaleY: 1 });
        stops.forEach((dot) => dot.classList.add("is-passed"));
        return;
      }
      gsap.fromTo(
        "[data-route]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-route-list]", start: "top 62%", end: "bottom 62%", scrub: true } },
      );
      stops.forEach((dot) => {
        ScrollTrigger.create({ trigger: dot, start: "center 62%", toggleClass: { targets: dot, className: "is-passed" } });
      });
    },
    { scope: root },
  );

  return (
    <Chapter id="journey" theme="light" chapter="03 — The road so far" label="The road so far" className="pt-24 pb-32 md:pt-36 md:pb-48">
      <div ref={root} className="wrap">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <ChapterTitle index="03" story="Journey">
            <MaskedReveal
              lines={["The road", "so far"]}
              className="mt-4 font-display text-[clamp(56px,9vw,152px)] leading-[0.86] font-medium tracking-[-0.05em]"
            />
          </ChapterTitle>
          <Marginalia className="hidden rotate-[-5deg] text-ink/70 md:block md:pb-6">a little louder each time →</Marginalia>
        </div>

        <ol data-route-list className="relative mt-14 md:mt-20">
          {/* Route line: the track behind, the drawn line in front. */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-ink/12 md:left-[7px]" />
          <span aria-hidden="true" data-route className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-red md:left-[7px]" />

          {artist.milestones.map((m) => (
            <li key={m.year + m.title} data-reveal className="group relative border-b border-ink/12 first:border-t">
              <span
                aria-hidden="true"
                data-stop
                className={`route-stop absolute top-1/2 left-0 size-[11px] -translate-y-1/2 rounded-full md:size-[15px] ${m.upcoming ? "route-stop--next" : ""}`}
              />
              <div className="grid grid-cols-[4.5rem_1fr] items-center gap-x-4 gap-y-3 py-6 pl-8 md:grid-cols-[8rem_1fr_auto] md:gap-x-10 md:py-8 md:pl-14">
                <span className={`font-display text-[clamp(28px,3vw,48px)] leading-none font-medium tracking-[-0.04em] tabular-nums ${m.upcoming ? "opacity-45" : ""}`}>
                  {m.year}
                </span>
                <div className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  <p className="font-display text-[clamp(22px,2.6vw,40px)] leading-[1] font-medium tracking-[-0.03em]">{m.title}</p>
                  <p className="mt-2 max-w-xl text-[15px] opacity-65">{m.text}</p>
                </div>
                <div className="col-start-2 md:col-start-auto">
                  <MilestoneAction milestone={m} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}

function MilestoneAction({ milestone }: { milestone: Milestone }) {
  const { play, toggle, track, isPlaying } = usePlayer();

  if (milestone.trackId) {
    const id = milestone.trackId;
    const playing = isPlaying && track?.id === id;
    return (
      <button
        type="button"
        onClick={() => (track?.id === id ? toggle() : play(id, playableTrackIds))}
        data-cursor={playing ? "Pause" : "Play"}
        aria-label={`${playing ? "Pause" : "Play"} ${milestone.title}`}
        className={button("outlineInk", "h-10")}
      >
        <Icon name={playing ? "pause" : "play"} size={16} />
        {playing ? "Pause" : "Play"}
      </button>
    );
  }

  if (milestone.href) {
    return (
      <a
        href={milestone.href}
        onClick={(e) => {
          e.preventDefault();
          scrollToHash(milestone.href!);
        }}
        className={button("ink", "h-10")}
      >
        Join the list <Icon name="arrowRight" size={16} />
      </a>
    );
  }

  return null;
}
