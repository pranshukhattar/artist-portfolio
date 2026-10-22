"use client";

import { useEffect, useRef, useState } from "react";
import { getTrack, releases, singles, type Track } from "@/content/music";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { Marginalia } from "@/components/ui/Marginalia";
import { RecordDisc } from "@/components/ui/RecordDisc";
import { arrowNudge, button } from "@/components/ui/button";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "singles", label: "Singles" },
  { key: "albums", label: "Albums" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

const album = releases.find((r) => r.type === "album")!;
const albumTracks = album.trackIds.map((id) => getTrack(id)!);
const albumQueue = albumTracks.filter((t) => t.audio).map((t) => t.id);
const singleQueue = singles.map((r) => r.trackIds[0]);
// The record inside the sleeve: a black disc from the collage.
const VINYL = { x: 40, y: 45, zoom: 2.8 };

export function Music() {
  const [filter, setFilter] = useState<Filter>("all");

  // Section height changes when filtering; re-measure every trigger below.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <Chapter id="music" theme="light" chapter="01 — The record" label="Music" className="pt-24 pb-32 md:pt-36 md:pb-48">
      <div className="wrap">
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <ChapterTitle index="01" story="The record">
            <MaskedReveal lines={["Music"]} className="mt-4 font-display text-[clamp(64px,11vw,184px)] leading-[0.85] font-medium tracking-[-0.05em]" />
          </ChapterTitle>
          <Marginalia className="absolute top-2 right-0 hidden -rotate-6 text-ink/70 lg:right-[28%] lg:block">same sky, different sound</Marginalia>

          <div className="flex gap-1 rounded-full bg-paper-lo p-1" role="group" aria-label="Filter releases" data-reveal>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`label rounded-full px-4 py-2.5 transition-colors duration-300 ${filter === f.key ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filter !== "singles" && <Album />}
        {filter !== "albums" && <Singles />}
      </div>
    </Chapter>
  );
}

function Album() {
  const root = useRef<HTMLDivElement>(null);
  const { play, toggle, track, isPlaying } = usePlayer();
  const albumPlaying = isPlaying && !!track && album.trackIds.includes(track.id);

  // The record slides out of its sleeve as the album scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 768px)" }, (ctx) => {
        const { reduce } = ctx.conditions!;
        if (reduce) {
          gsap.set("[data-vinyl]", { xPercent: 42, x: 0, rotate: 0 });
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
          {
            rotate: 0,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: "[data-sleeve-stage]", start: "top 95%", end: "center 50%", scrub: 1 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
      {/* The sleeve stays in view while the tracklist scrolls past it. */}
      <div className="md:sticky md:top-28 md:col-span-6 md:self-start">
        <div data-sleeve-stage className="relative aspect-[1.42/1] w-full">
          <div data-vinyl className="absolute top-[3%] left-0 aspect-square h-[94%]">
            <RecordDisc
              crop={VINYL}
              spinning={albumPlaying}
              spin="3.5s"
              className="size-full shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]"
            />
          </div>
          <div data-sleeve className="absolute inset-y-0 left-0 aspect-square shadow-[0_1px_2px_rgba(0,0,0,0.12),0_12px_24px_-8px_rgba(0,0,0,0.25),0_32px_64px_-16px_rgba(0,0,0,0.3)]">
            <Cover crop={album.cover} alt={`${album.title} album cover`} className="size-full" />
          </div>
        </div>
      </div>

      <div className="md:col-span-6 md:pl-6">
        <p className="label opacity-60" data-reveal>
          Album · {album.year} · {album.trackIds.length} tracks
        </p>
        <h3 className="mt-3 font-display text-[clamp(40px,5vw,72px)] leading-[0.9] font-medium tracking-[-0.04em]" data-reveal>
          {album.title}
        </h3>
        <div className="mt-6 flex flex-wrap gap-3" data-reveal>
          <button type="button" onClick={() => (albumPlaying ? toggle() : play(albumQueue[0], albumQueue))} className={button("ink")}>
            <Icon name={albumPlaying ? "pause" : "play"} size={18} />
            {albumPlaying ? "Pause" : "Listen now"}
            <Icon name="arrowRight" size={18} className={arrowNudge} />
          </button>
          <a href={albumTracks[0].links.spotify} target="_blank" rel="noopener noreferrer" className={button("outlineInk")}>
            <Icon name="spotify" size={18} />
            Spotify
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>

        <ol className="mt-10 border-b border-ink/12">
          {albumTracks.map((t, i) => (
            <TrackRow key={t.id} track={t} n={i + 1} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function TrackRow({ track, n }: { track: Track; n: number }) {
  const { play, toggle, track: current, isPlaying } = usePlayer();
  const isCurrent = current?.id === track.id;
  const num = <span className="text-[11px] tabular-nums opacity-45">{String(n).padStart(2, "0")}</span>;
  const row = "grid w-full grid-cols-[2.5rem_1fr_auto_2.25rem] items-center gap-2 py-3 text-left";

  return (
    <li data-reveal className="border-t border-ink/12">
      {track.audio ? (
        <button
          type="button"
          onClick={() => (isCurrent ? toggle() : play(track.id, albumQueue))}
          aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title}`}
          data-cursor={isCurrent && isPlaying ? "Pause" : "Play"}
          className={`${row} group transition-colors hover:text-red ${isCurrent ? "text-red" : ""}`}
        >
          {num}
          <span className="font-display text-[15px] tracking-[-0.01em] transition-transform duration-300 ease-out-expo group-hover:translate-x-1">{track.title}</span>
          <span className="text-[11px] tabular-nums opacity-60">{track.duration}</span>
          <span className="grid size-8 place-items-center justify-self-end rounded-full ring-1 ring-current/30">
            <Icon name={isCurrent && isPlaying ? "pause" : "play"} size={16} />
          </span>
        </button>
      ) : (
        <div className={row}>
          {num}
          <span className="font-display text-[15px] tracking-[-0.01em] opacity-70">{track.title}</span>
          <span className="text-[11px] tabular-nums opacity-45">{track.duration}</span>
          <a
            href={track.links.spotify}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${track.title} on Spotify`}
            className="grid size-8 place-items-center justify-self-end rounded-full opacity-50 transition-opacity hover:opacity-100"
          >
            <Icon name="arrowUpRight" size={18} />
          </a>
        </div>
      )}
    </li>
  );
}

function Singles() {
  const { play, toggle, track, isPlaying } = usePlayer();

  return (
    <div className="mt-24 md:mt-32">
      <div className="flex items-end justify-between" data-reveal>
        <h3 className="font-display text-[clamp(28px,3vw,44px)] leading-none font-medium tracking-[-0.03em]">Singles</h3>
        <p className="label opacity-50">{singles.length} releases</p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {singles.map((single) => {
          const id = single.trackIds[0];
          const playing = isPlaying && track?.id === id;
          return (
            <li key={single.id} data-reveal>
              <button
                type="button"
                onClick={() => (track?.id === id ? toggle() : play(id, singleQueue))}
                aria-label={`${playing ? "Pause" : "Play"} ${single.title}`}
                data-cursor={playing ? "Pause" : "Play"}
                className="group block w-full text-left"
              >
                <div className="relative aspect-square overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1),0_10px_24px_-10px_rgba(0,0,0,0.3)]">
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
                  {single.year} · Single
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
