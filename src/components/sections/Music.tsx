"use client";

import { useEffect, useRef, useState } from "react";
import { getRelease, getTrack, playableTrackIds, releaseForTrack, singles, type Platform } from "@/content/music";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer } from "@/components/player/PlayerProvider";
import { scrollToHash } from "@/components/layout/Nav";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { Marginalia } from "@/components/ui/Marginalia";
import { RecordDisc } from "@/components/ui/RecordDisc";
import { arrowNudge, button } from "@/components/ui/button";

// The record inside the sleeve: a black disc from the collage.
const VINYL = { x: 40, y: 45, zoom: 2.8 };

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "youtube", label: "YouTube" },
];

const years = singles.map((s) => s.year);
const span = `${Math.min(...years)}–${Math.max(...years)}`;

/**
 * The record. The sleeve features one single at a time; the crate below holds
 * every single. Picking a record from the crate puts it on the sleeve and plays
 * it, and the sleeve also follows whatever the player is playing.
 */
export function Music() {
  const [selectedId, setSelectedId] = useState(singles[0].id);
  const { track } = usePlayer();

  // Keep the sleeve in step with the player (hero, journey, queue skips…).
  useEffect(() => {
    if (track) setSelectedId(releaseForTrack(track.id).id);
  }, [track]);

  return (
    <Chapter id="music" theme="light" chapter="01 — The record" label="Music" className="pt-24 pb-32 md:pt-36 md:pb-48">
      <div className="wrap">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <ChapterTitle index="01" story="The record">
            <MaskedReveal lines={["Music"]} className="mt-4 font-display text-[clamp(64px,11vw,184px)] leading-[0.85] font-medium tracking-[-0.05em]" />
          </ChapterTitle>
          <Marginalia className="absolute top-2 right-0 hidden -rotate-6 text-ink/70 lg:right-[28%] lg:block">same sky, different sound</Marginalia>
          <p className="label opacity-60" data-reveal>
            {singles.length} singles · {span}
          </p>
        </div>

        <Featured selectedId={selectedId} />
        <Crate selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </Chapter>
  );
}

function Featured({ selectedId }: { selectedId: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [shownId, setShownId] = useState(selectedId);
  const { play, toggle, track, isPlaying } = usePlayer();

  const release = getRelease(shownId)!;
  const song = getTrack(release.trackIds[0])!;
  const isLatest = release.id === singles[0].id;
  const playing = isPlaying && track?.id === song.id;

  // Scroll: the record slides out of its sleeve as the section arrives.
  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-vinyl]", { xPercent: 42, x: 0 });
        return;
      }
      gsap.fromTo(
        "[data-vinyl]",
        { xPercent: 0, x: 0, rotate: -90 },
        {
          xPercent: 42,
          rotate: 120,
          ease: "none",
          scrollTrigger: { trigger: "[data-sleeve-stage]", start: "top 85%", end: "center 45%", scrub: 1 },
        },
      );
      gsap.fromTo(
        "[data-sleeve]",
        { rotate: -4, y: 40 },
        { rotate: 0, y: 0, ease: "none", scrollTrigger: { trigger: "[data-sleeve-stage]", start: "top 95%", end: "center 50%", scrub: 1 } },
      );
    },
    { scope: root },
  );

  // Swap: the record slides back in, the sleeve changes, the new record slides out.
  const swapTo = contextSafe((id: string) => {
    if (prefersReducedMotion()) return setShownId(id);
    gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .to("[data-vinyl-swap]", { xPercent: -42, rotate: "-=120", duration: 0.45, ease: "power3.in" }, 0)
      .to("[data-sleeve-swap]", { scale: 0.95, duration: 0.45, ease: "power3.in" }, 0)
      .to("[data-details]", { autoAlpha: 0, y: 12, duration: 0.3, ease: "power2.in" }, 0)
      .call(() => setShownId(id))
      .to("[data-vinyl-swap]", { xPercent: 0, rotate: "+=120", duration: 0.8, ease: "power3.out" }, "+=0.05")
      .to("[data-sleeve-swap]", { scale: 1, duration: 0.8, ease: "power3.out" }, "<")
      .to("[data-details]", { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "<0.1");
  });

  useEffect(() => {
    if (selectedId !== shownId) swapTo(selectedId);
    // Only react to new selections; shownId catches up mid-animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div ref={root} id="featured" className="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-6">
        <div data-sleeve-stage className="relative aspect-[1.42/1] w-full">
          <div data-vinyl className="absolute top-[3%] left-0 aspect-square h-[94%]">
            <div data-vinyl-swap className="size-full">
              <RecordDisc crop={VINYL} spinning={playing} spin="3.5s" className="size-full shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
          <div data-sleeve className="absolute inset-y-0 left-0 aspect-square">
            <div data-sleeve-swap className="size-full shadow-[0_1px_2px_rgba(0,0,0,0.12),0_12px_24px_-8px_rgba(0,0,0,0.25),0_32px_64px_-16px_rgba(0,0,0,0.3)]">
              <Cover crop={release.cover} alt={`${release.title} cover`} className="size-full" />
            </div>
          </div>
        </div>
      </div>

      <div data-details className="md:col-span-6 md:pl-6" aria-live="polite">
        <p className="label flex items-center gap-2 opacity-70">
          {isLatest && <span className="rounded-full bg-red px-2.5 py-1 text-paper">Latest</span>}
          Single · {release.year}
        </p>
        <h3 className="mt-4 font-display text-[clamp(44px,5.6vw,88px)] leading-[0.9] font-medium tracking-[-0.045em]">{release.title}</h3>
        <p className="mt-6 max-w-md text-lg leading-relaxed opacity-75">{release.note}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => (track?.id === song.id ? toggle() : play(song.id, playableTrackIds))}
            data-cursor={playing ? "Pause" : "Play"}
            className={button("ink")}
          >
            <Icon name={playing ? "pause" : "play"} size={18} />
            {playing ? "Pause" : "Play"}
            <Icon name="arrowRight" size={18} className={arrowNudge} />
          </button>
          {PLATFORMS.filter((p) => song.links[p.key]).map((p) => (
            <a
              key={p.key}
              href={song.links[p.key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listen to ${release.title} on ${p.label}`}
              className="grid size-11 place-items-center rounded-full ring-1 ring-ink/40 transition-colors hover:bg-ink hover:text-paper"
            >
              <Icon name={p.key} size={20} />
            </a>
          ))}
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/12 pt-6 sm:grid-cols-4">
          <div>
            <dt className="label opacity-50">Length</dt>
            <dd className="mt-1.5 text-[15px] tabular-nums">{song.duration}</dd>
          </div>
          <div>
            <dt className="label opacity-50">Released</dt>
            <dd className="mt-1.5 text-[15px]">{release.year}</dd>
          </div>
          {release.credits.map((c) => (
            <div key={c.role}>
              <dt className="label opacity-50">{c.role}</dt>
              <dd className="mt-1.5 text-[15px]">{c.name}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Crate({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const { play, toggle, track, isPlaying } = usePlayer();

  const pick = (id: string) => {
    const trackId = getRelease(id)!.trackIds[0];
    if (track?.id === trackId) return toggle();
    onSelect(id);
    play(trackId, playableTrackIds);
    scrollToHash("#featured", -120);
  };

  return (
    <div className="mt-24 md:mt-32">
      <div className="flex items-end justify-between" data-reveal>
        <h3 className="font-display text-[clamp(28px,3vw,44px)] leading-none font-medium tracking-[-0.03em]">All singles</h3>
        <p className="label opacity-50">Pick a record</p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {singles.map((single) => {
          const id = single.trackIds[0];
          const playing = isPlaying && track?.id === id;
          const onSleeve = single.id === selectedId;
          return (
            <li key={single.id} data-reveal>
              <button
                type="button"
                onClick={() => pick(single.id)}
                aria-label={`${playing ? "Pause" : "Play"} ${single.title}`}
                aria-current={onSleeve ? "true" : undefined}
                data-cursor={playing ? "Pause" : "Play"}
                className="group block w-full text-left"
              >
                <div
                  className={`relative aspect-square overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1),0_10px_24px_-10px_rgba(0,0,0,0.3)] ring-offset-4 ring-offset-paper transition-shadow duration-500 ${onSleeve ? "ring-2 ring-ink" : ""}`}
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
                    <Cover crop={single.cover} alt="" className="size-full" />
                  </div>
                  <span
                    className={`absolute right-3 bottom-3 grid size-11 place-items-center rounded-full bg-paper text-ink shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:bg-red group-hover:text-paper ${playing ? "scale-100 bg-red text-paper" : "scale-90"}`}
                  >
                    <Icon name={playing ? "pause" : "play"} size={18} />
                  </span>
                </div>
                <p className={`mt-4 font-display text-lg tracking-[-0.02em] transition-colors ${playing ? "text-red" : ""}`}>{single.title}</p>
                <p className="label mt-1 opacity-50">
                  {single.year} · Single{onSleeve ? " · On the sleeve" : ""}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
