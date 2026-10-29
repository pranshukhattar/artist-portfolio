"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { artist } from "@/content/artist";
import { playableTrackIds, releases } from "@/content/music";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { ScrubText } from "@/components/motion/ScrubText";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Icon } from "@/components/ui/Icon";
import { Marginalia } from "@/components/ui/Marginalia";


// Releases are newest first.
const LATEST = releases[0];

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
    <Chapter id="about" theme="light" chapter="03 — The person" label="About" surface="bg-paper-hi" className="pt-20 pb-32 md:pt-28 md:pb-44">
      <div ref={root} className="wrap grid gap-10 md:grid-cols-12 md:items-center md:gap-10">
        <div className="mx-auto w-full max-w-sm md:col-span-4 md:max-w-none">
          <div data-portrait-frame className="grain relative aspect-[4/3] overflow-hidden md:aspect-[4/5] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_24px_48px_-20px_rgba(0,0,0,0.35)]">
            <div data-portrait className="absolute -inset-y-[10%] inset-x-0">
              <Image src={artist.photo.src} alt={artist.photo.alt} fill sizes="(min-width: 768px) 34vw, 384px" className="object-cover" />
            </div>
          </div>
          <Marginalia className="mt-4 -rotate-3 text-ink/70">music is a form of home</Marginalia>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <ChapterTitle index="03" story="The person">
            {/* Who, then the pull quote. */}
            <div className="mt-5" data-reveal>
              <p className="font-display text-[clamp(28px,2.6vw,40px)] leading-none font-semibold tracking-[-0.035em]">{siteConfig.person}</p>
              <p className="mt-2 text-sm text-ink/60">
                The person behind <span className="font-medium text-red">{siteConfig.name}</span>
              </p>
            </div>
            <MaskedReveal lines={["Making sense", "of the noise"]} className="mt-6 font-display text-[clamp(40px,5vw,80px)] leading-[0.9] font-medium tracking-[-0.045em]" />
          </ChapterTitle>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Disciplines" data-reveal>
            {artist.disciplines.map((discipline) => (
              <li key={discipline} className="rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ring-ink/25">
                {discipline}
              </li>
            ))}
          </ul>

          <ScrubText text={artist.about} className="mt-7 font-display text-[clamp(20px,1.8vw,28px)] leading-[1.25] tracking-[-0.02em]" />

          <dl className="mt-9 grid grid-cols-2 gap-5 border-t border-ink/12 pt-6">
            <div data-reveal>
              <dt className="label opacity-50">Based in</dt>
              <dd className="mt-2 text-[15px]">{artist.basedIn}</dd>
            </div>
            <div data-reveal>
              <dt className="label opacity-50">Latest</dt>
              <dd className="mt-1">
                <PlayLatest />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Chapter>
  );
}

function PlayLatest() {
  const { play, toggle, track, isPlaying } = usePlayer();
  const id = LATEST.trackIds[0];
  const playing = isPlaying && track?.id === id;
  return (
    <button
      type="button"
      onClick={() => (track?.id === id ? toggle() : play(id, playableTrackIds))}
      data-cursor={playing ? "Pause" : "Play"}
      aria-label={`${playing ? "Pause" : "Play"} ${LATEST.title}`}
      className="group/latest inline-flex items-center gap-2.5 text-left text-[15px] transition-colors hover:text-red"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full ring-1 ring-ink/25 transition-colors group-hover/latest:bg-red group-hover/latest:text-paper group-hover/latest:ring-red">
        <Icon name={playing ? "pause" : "play"} size={12} />
      </span>
      <span>
        {LATEST.title} <span className="whitespace-nowrap">({LATEST.year})</span>
      </span>
    </button>
  );
}
