"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getRelease, getTrack, playableTrackIds, releaseForTrack, singles, vinylCrop, type Platform } from "@/content/music";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer, usePlayerTime } from "@/components/player/PlayerProvider";
import { Equalizer, Scrubber } from "@/components/player/parts";
import { HOOK_SECONDS, usePreview } from "@/components/player/usePreview";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { Marginalia } from "@/components/ui/Marginalia";
import { RecordDisc } from "@/components/ui/RecordDisc";
import { button } from "@/components/ui/button";

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "youtube", label: "YouTube" },
];

const years = singles.map((s) => s.year);
const span = `${Math.min(...years)}–${Math.max(...years)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// How long the pointer rests on a song before its best part starts, so passing over doesn't blare.
const HOVER_INTENT_MS = 280;

type PreviewApi = ReturnType<typeof usePreview>;

/**
 * The record, set up like a listening booth. The deck (left) holds the song that
 * plays in full; the crate (right) holds every single. Resting the pointer on a
 * single plays its best part, clicking it puts it on the deck and plays it whole.
 * The deck follows whatever the player plays.
 */
export function Music() {
  const [selectedId, setSelectedId] = useState(singles[0].id);
  const { track } = usePlayer();
  const preview = usePreview();

  // Keep the deck in step with the player (hero, journey, queue skips…).
  useEffect(() => {
    if (track) setSelectedId(releaseForTrack(track.id).id);
  }, [track]);

  return (
    <Chapter id="music" theme="light" chapter="01 — The record" label="Music" className="pt-24 pb-32 md:pt-36 md:pb-44">
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

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-10">
          <Deck selectedId={selectedId} />
          <div className="md:col-span-7 lg:pl-8">
            <OnTheDeck selectedId={selectedId} onPlay={preview.stop} />
            <Crate selectedId={selectedId} onSelect={setSelectedId} preview={preview} />
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/**
 * Sleeve and record. A new song swaps the sleeve in three clean steps: the record
 * slides all the way home, then the sleeve changes, then the record slides back out
 * and only then starts turning. Every sleeve is in the DOM, so the swap is pure
 * transforms and a quick second pick just finishes the first swap before its own.
 */
function Deck({ selectedId }: { selectedId: string }) {
  const root = useRef<HTMLDivElement>(null);
  const shown = useRef(selectedId);
  const initialId = useRef(selectedId).current;
  const swap = useRef<gsap.core.Timeline | null>(null);
  const [swapping, setSwapping] = useState(false);
  const { track, isPlaying } = usePlayer();
  const trackId = getRelease(selectedId)!.trackIds[0];
  const spinning = isPlaying && track?.id === trackId && !swapping;

  // Scroll: the record slides out of its sleeve as the section arrives.
  useGSAP(
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

  useGSAP(
    () => {
      const from = shown.current;
      if (from === selectedId) return;
      shown.current = selectedId;
      swap.current?.progress(1).kill();

      const out = `[data-cover="${from}"]`;
      const into = `[data-cover="${selectedId}"]`;
      if (prefersReducedMotion()) {
        gsap.set(out, { autoAlpha: 0 });
        gsap.set(into, { autoAlpha: 1 });
        return;
      }
      setSwapping(true);
      swap.current = gsap
        .timeline({ onComplete: () => setSwapping(false) })
        // 1. The record slides all the way into the sleeve.
        .to("[data-vinyl-slot]", { xPercent: -42, duration: 0.45, ease: "power2.inOut" })
        .to("[data-vinyl-spin]", { rotate: "-=90", duration: 0.45, ease: "power2.inOut" }, "<")
        // 2. Then the sleeve changes: the old one tips away as the new one drops in over it.
        .to(out, { xPercent: -12, yPercent: 8, rotate: -7, autoAlpha: 0, duration: 0.4, ease: "power2.in" })
        .fromTo(
          into,
          { xPercent: 14, yPercent: -6, rotate: 6, autoAlpha: 0 },
          { xPercent: 0, yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          "<0.05",
        )
        .set(out, { xPercent: 0, yPercent: 0, rotate: 0 })
        // 3. Then the record slides back out; it starts turning once it's out (onComplete).
        .to("[data-vinyl-slot]", { xPercent: 0, duration: 0.6, ease: "power3.out" }, "+=0.05")
        .to("[data-vinyl-spin]", { rotate: "+=90", duration: 0.6, ease: "power3.out" }, "<");
    },
    { scope: root, dependencies: [selectedId] },
  );

  return (
    <div ref={root} className="md:sticky md:top-28 md:col-span-5 md:self-start">
      <div data-sleeve-stage className="relative aspect-[1.42/1] w-full max-md:max-w-[460px]">
        {/* Slot (swap slide, never rotated) → vinyl (scroll slide + turn) → spin (swap turn).
            The swap slides the outermost layer so it moves along the page, not the turned record. */}
        <div data-vinyl-slot className="absolute top-[3%] left-0 aspect-square h-[94%]">
          <div data-vinyl className="size-full">
            <div data-vinyl-spin className="size-full">
              <RecordDisc crop={vinylCrop} spinning={spinning} spin="3.5s" className="size-full shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        </div>
        <div data-sleeve className="absolute inset-y-0 left-0 aspect-square">
          {singles.map((single) => (
            <div
              key={single.id}
              data-cover={single.id}
              // Only the first paint is set here; GSAP owns visibility after that.
              style={single.id === initialId ? undefined : { opacity: 0, visibility: "hidden" }}
              className="absolute inset-0 shadow-[0_1px_2px_rgba(0,0,0,0.12),0_12px_24px_-8px_rgba(0,0,0,0.25),0_32px_64px_-16px_rgba(0,0,0,0.3)]"
            >
              <Cover crop={single.cover} alt={`${single.title} cover`} className="size-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The song on the deck: what it is, and the one obvious way to hear all of it. */
function OnTheDeck({ selectedId, onPlay }: { selectedId: string; onPlay: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const { play, toggle, track, isPlaying } = usePlayer();

  const index = singles.findIndex((s) => s.id === selectedId);
  const release = singles[index];
  const song = getTrack(release.trackIds[0])!;
  const isLatest = index === 0;
  const current = track?.id === song.id;
  const playing = isPlaying && current;

  // A new song: the title and its details roll up into place behind a mask.
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-roll]", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, delay: 0.45, overwrite: true });
    },
    { scope: root, dependencies: [selectedId] },
  );

  return (
    <div ref={root} data-reveal aria-live="polite">
      <p className="label flex items-center gap-3">
        <span className="opacity-60">On the deck</span>
        <span className="overflow-hidden tabular-nums opacity-60">
          <span data-roll className="inline-block">{pad(index + 1)}</span> / {pad(singles.length)}
        </span>
        {isLatest && <span className="rounded-full bg-red px-2.5 py-1 text-paper">Latest</span>}
      </p>
      <h3 className="mt-4 overflow-hidden pb-[0.08em] font-display text-[clamp(44px,5vw,84px)] leading-[0.9] font-medium tracking-[-0.045em]">
        <span data-roll className="block">
          {release.title}
        </span>
      </h3>
      <div className="mt-3 overflow-hidden">
        <p data-roll className="flex items-center gap-3">
          <span className="label rounded-full bg-ink px-3 py-1.5 text-paper">{song.genre}</span>
          <span className="text-[15px] tabular-nums opacity-60">{song.duration}</span>
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            onPlay();
            if (current) toggle();
            else play(song.id, playableTrackIds);
          }}
          aria-label={`${playing ? "Pause" : "Play"} ${release.title}`}
          data-cursor={playing ? "Pause" : "Play"}
          // Fixed width: Play ↔ Pause never moves the links beside it.
          className={button("ink", "h-12 w-32")}
        >
          <Icon name={playing ? "pause" : "play"} size={18} />
          {playing ? "Pause" : "Play"}
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

      {/* Progress: live while this song is the one in the player, at rest otherwise. */}
      <div className="mt-6 max-w-md">
        {current ? (
          <Scrubber />
        ) : (
          <div className="flex items-center gap-3 opacity-60" aria-hidden="true">
            <span className="w-9 text-right text-[11px] tabular-nums">0:00</span>
            <span className="h-[2px] flex-1 rounded-full bg-ink/20" />
            <span className="w-9 text-[11px] tabular-nums">{song.duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** A thin line along the bottom of the row whose song is in the player. */
function RowProgress() {
  const { currentTime, duration } = usePlayerTime();
  const p = duration ? currentTime / duration : 0;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-left bg-current opacity-60"
      style={{ transform: `scaleX(${p})` }}
    />
  );
}

/**
 * Every single. Resting the pointer on a song plays its best part (a red line runs
 * along the row); clicking it puts the song on the deck and plays it in full.
 */
function Crate({ selectedId, onSelect, preview }: { selectedId: string; onSelect: (id: string) => void; preview: PreviewApi }) {
  const { play, toggle, track, isPlaying, hasStarted } = usePlayer();
  const intent = useRef(0);

  useEffect(() => () => window.clearTimeout(intent.current), []);

  const pick = (id: string) => {
    window.clearTimeout(intent.current);
    preview.stop();
    const trackId = getRelease(id)!.trackIds[0];
    if (track?.id === trackId) return toggle();
    onSelect(id);
    play(trackId, playableTrackIds);
  };

  // A song that's playing in full is never interrupted by passing over another one.
  const hoverStart = (trackId: string) => {
    window.clearTimeout(intent.current);
    if (isPlaying) return;
    intent.current = window.setTimeout(() => preview.start(trackId), HOVER_INTENT_MS);
  };
  const hoverEnd = (trackId: string) => {
    window.clearTimeout(intent.current);
    if (preview.preview?.id === trackId) preview.stop();
  };

  return (
    <div className="mt-14 md:mt-16">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2" data-reveal>
        <h3 className="label opacity-60">The crate</h3>
        {/* Said once, here: previews need a hover, so touch screens don't get the hint. While a
            song plays, hovering stays quiet, so the hint steps aside (without moving the list). */}
        <p
          className={`label flex items-center gap-1.5 text-red-deep transition-opacity duration-300 [@media(hover:none)]:hidden ${isPlaying ? "invisible opacity-0" : ""}`}
        >
          <Icon name="volume" size={14} />
          {preview.blocked ? "Click anywhere once, then hover a song for its best part" : "Hover a song to hear its best part"}
        </p>
      </div>

      <ol className="mt-4 border-t border-ink/15">
        {singles.map((single, i) => {
          const song = getTrack(single.trackIds[0])!;
          // The newest single is cued on load; only mark a row once something has really played.
          const current = hasStarted && track?.id === song.id;
          const playing = isPlaying && current;
          const onDeck = single.id === selectedId;
          const sounding = preview.preview?.id === song.id && preview.preview.playing;
          return (
            <li
              key={single.id}
              data-reveal
              onPointerEnter={(e) => e.pointerType === "mouse" && hoverStart(song.id)}
              onPointerLeave={() => hoverEnd(song.id)}
              className="group relative flex items-center gap-3 border-b border-ink/15 px-2 py-3 sm:gap-5 sm:px-3 sm:py-4"
            >
              {/* Hover: a warm sand wash wipes in from the left. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-sand/45 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 motion-reduce:transition-none"
              />

              <span className="relative grid w-6 shrink-0 place-items-center text-[11px] tabular-nums max-sm:hidden">
                {current || sounding ? (
                  <Equalizer playing={playing || !!sounding} className={`h-3 ${current ? "text-red" : "text-red-deep"}`} />
                ) : (
                  <span className="opacity-50">{pad(i + 1)}</span>
                )}
              </span>

              <span className="relative size-12 shrink-0 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-out-expo group-hover:scale-105 group-hover:-rotate-3 sm:size-14">
                <Cover crop={single.cover} alt="" className="size-full" />
              </span>

              {/* The row itself is the full-song button: its ::after stretches over the whole row, so
                  nothing between it and the <li> may be positioned. Its text is, to sit above the wipe. */}
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => pick(single.id)}
                  aria-label={`${playing ? "Pause" : "Play"} ${single.title}, full song`}
                  aria-current={onDeck ? "true" : undefined}
                  data-cursor={playing ? "Pause" : "Play"}
                  className="block w-full text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-red"
                >
                  <span
                    className={`relative block truncate font-display text-[clamp(20px,2.1vw,34px)] leading-[1.05] tracking-[-0.03em] transition-colors ${current ? "text-red" : ""}`}
                  >
                    {single.title}
                  </span>
                  <span className="label relative mt-1.5 block truncate opacity-55">
                    {song.genre} · {single.year}
                  </span>
                </button>
              </div>

              <span className="relative w-10 shrink-0 text-right text-[13px] tabular-nums opacity-55 max-sm:hidden">{song.duration}</span>

              {/* What a click on the row does. Purely visual: the row button handles it. Fixed
                  width, so Play ↔ Pause never shifts the row. */}
              <span
                aria-hidden="true"
                className="pointer-events-none relative inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-full text-[10.5px] font-semibold tracking-[0.14em] uppercase ring-1 ring-ink/30 transition-colors duration-300 group-hover:bg-ink group-hover:text-paper group-hover:ring-ink sm:w-24"
              >
                <Icon name={playing ? "pause" : "play"} size={14} />
                <span className="max-sm:hidden">{playing ? "Pause" : "Play"}</span>
              </span>

              {current && <RowProgress />}
              {sounding && (
                <span
                  aria-hidden="true"
                  className="hook-fill pointer-events-none absolute inset-x-0 -bottom-px h-[2px] bg-red"
                  style={{ "--hook-length": `${HOOK_SECONDS}s` } as CSSProperties}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
