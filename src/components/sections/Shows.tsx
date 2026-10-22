"use client";

import { useRef } from "react";
import { shows } from "@/content/media";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Icon } from "@/components/ui/Icon";
import { Marginalia } from "@/components/ui/Marginalia";
import { button } from "@/components/ui/button";

const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "UTC" });

export function Shows() {
  const root = useRef<HTMLDivElement>(null);

  // The tour route draws down the list; each stop lights up as the line reaches it.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-route]", { scaleY: 1 });
        gsap.utils.toArray<HTMLElement>("[data-stop]").forEach((dot) => dot.classList.add("is-passed"));
        return;
      }
      gsap.fromTo(
        "[data-route]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-route-list]", start: "top 62%", end: "bottom 62%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>("[data-stop]").forEach((dot) => {
        ScrollTrigger.create({ trigger: dot, start: "center 62%", toggleClass: { targets: dot, className: "is-passed" } });
      });
    },
    { scope: root },
  );

  return (
    <Chapter id="shows" theme="light" chapter="03 — The road" label="Shows" className="pt-24 pb-32 md:pt-36 md:pb-48">
      <div ref={root} className="wrap">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <ChapterTitle index="03" story="The road">
            <MaskedReveal lines={["Shows"]} className="mt-4 font-display text-[clamp(64px,11vw,184px)] leading-[0.85] font-medium tracking-[-0.05em]" />
          </ChapterTitle>
          <Marginalia className="hidden rotate-[-5deg] text-ink/70 md:block md:pb-6">a little louder →</Marginalia>
          <p className="label opacity-60" data-reveal>
            Live 2027 · {shows.length} dates
          </p>
        </div>

        <ol data-route-list className="relative mt-14 md:mt-20">
          {/* Route line: the track behind, the drawn line in front. */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-ink/12 md:left-[7px]" />
          <span aria-hidden="true" data-route className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-red md:left-[7px]" />

          {shows.map((show) => {
            const date = new Date(show.date);
            return (
              <li key={show.date} data-reveal className="group relative border-b border-ink/12 first:border-t">
                <span aria-hidden="true" data-stop className="route-stop absolute top-1/2 left-0 size-[11px] -translate-y-1/2 rounded-full md:size-[15px]" />
                <div className="grid grid-cols-[4.5rem_1fr] items-center gap-x-4 gap-y-3 py-6 pl-8 md:grid-cols-[7rem_1fr_auto] md:gap-x-10 md:py-8 md:pl-14">
                  <time dateTime={show.date} className="flex flex-col leading-none">
                    <span className="label opacity-60">{month.format(date)}</span>
                    <span className="mt-1 font-display text-[clamp(32px,3.4vw,52px)] font-medium tracking-[-0.04em] tabular-nums">{day.format(date)}</span>
                  </time>
                  <div className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                    <p className="font-display text-[clamp(22px,2.6vw,40px)] leading-[1] font-medium tracking-[-0.03em]">
                      {show.city}, <span className="opacity-50">{show.country}</span>
                    </p>
                    <p className="mt-2 text-sm opacity-60">{show.venue}</p>
                  </div>
                  <div className="col-start-2 md:col-start-auto">
                    {show.tickets ? (
                      <a href={show.tickets} target="_blank" rel="noopener noreferrer" className={button("outlineInk", "h-10")}>
                        Tickets <Icon name="arrowUpRight" size={16} />
                      </a>
                    ) : (
                      <span className={button("disabled", "h-10")} aria-disabled="true">
                        Tickets soon
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Chapter>
  );
}
