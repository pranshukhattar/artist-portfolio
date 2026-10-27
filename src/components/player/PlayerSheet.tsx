"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";
import { lockScroll } from "@/lib/motion";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { getTrack, releaseForTrack, type Platform } from "@/content/music";
import { usePlayer } from "./PlayerProvider";
import { Disc, Equalizer, Scrubber, Transport, Volume, ghostButton } from "./parts";

const PLATFORM_LABEL: Record<Platform, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
};

/** Expanded player: full screen on phones, side panel on desktop. */
export function PlayerSheet() {
  const { track, expanded, setExpanded, close, isPlaying, queue, play } = usePlayer();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!expanded) return;
    opener.current = document.activeElement;
    lockScroll(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [expanded, setExpanded]);

  if (!track) return null;
  const release = releaseForTrack(track.id);

  const position = queue.indexOf(track.id) + 1;
  const links = Object.entries(track.links) as [Platform, string][];

  return (
    <div className={`fixed inset-0 z-50 ${expanded ? "" : "pointer-events-none"}`} inert={!expanded}>
      <div
        className={`absolute inset-0 bg-ink/60 transition-opacity duration-500 ${expanded ? "opacity-100" : "opacity-0"}`}
        onClick={() => setExpanded(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Now playing"
        className={`absolute inset-0 flex flex-col overflow-hidden bg-ink text-paper transition-transform duration-700 ease-out-expo md:top-auto md:right-3 md:bottom-3 md:left-auto md:max-h-[calc(100svh-24px)] md:w-[420px] md:rounded-3xl md:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] md:ring-1 md:ring-paper/10 ${expanded ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-[calc(100%+24px)] md:translate-y-0"}`}
        data-lenis-prevent
      >
        <header className="flex shrink-0 items-center justify-between px-3 pt-[max(12px,env(safe-area-inset-top))] pb-1">
          <button ref={closeBtn} type="button" onClick={() => setExpanded(false)} aria-label="Minimize player" className={`${ghostButton} size-10`}>
            <Icon name="chevronDown" size={22} className="md:hidden" />
            <Icon name="collapse" size={18} className="hidden md:block" />
          </button>
          <span className="label opacity-55">Now playing</span>
          <button type="button" onClick={close} aria-label="Close player and stop music" className={`${ghostButton} size-10`}>
            <Icon name="x" size={20} />
          </button>
        </header>

        <div className="shrink-0 px-6">
          {/* The sleeve with its record sliding out; it scales with screen height and drops away on short screens. */}
          <div className="relative mx-auto mt-3 aspect-square w-[min(64%,260px,24svh)] -translate-x-[9%] [@media(max-height:740px)]:hidden">
            <Disc
              track={track}
              spinning={isPlaying}
              className={`absolute inset-[5%] ring-1 ring-paper/15 transition-transform duration-700 ease-out-expo ${isPlaying ? "translate-x-[30%]" : "translate-x-[16%]"}`}
            />
            <div className="absolute inset-0 overflow-hidden rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.3),0_24px_48px_-12px_rgba(0,0,0,0.7)] ring-1 ring-paper/10">
              <Cover crop={release.cover} alt={`${release.title} cover`} className="size-full" />
            </div>
          </div>

          <div className="mt-7 flex items-center gap-3 [@media(max-height:740px)]:mt-2">
            <span className="hidden size-12 shrink-0 overflow-hidden rounded-md ring-1 ring-paper/10 [@media(max-height:740px)]:block">
              <Cover crop={release.cover} alt="" className="size-full" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-2xl leading-tight font-medium tracking-[-0.03em]">{track.title}</h2>
              <p className="label mt-1 truncate text-red">{track.genre}</p>
              <p className="mt-1 truncate text-sm opacity-55">
                {siteConfig.name} · {release.title}
              </p>
            </div>
            {links.length > 0 && (
              <ul className="flex shrink-0 items-center" aria-label="Listen on">
                {links.map(([platform, href]) => (
                  <li key={platform}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Listen on ${PLATFORM_LABEL[platform]}`} title={PLATFORM_LABEL[platform]} className={`${ghostButton} size-9`}>
                      <Icon name={platform} size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Scrubber className="mt-4" />
          <div className="mt-2 flex justify-center">
            <Transport size="lg" />
          </div>
          <div className="mt-3 hidden justify-center md:flex [@media(max-height:760px)]:md:hidden">
            <Volume />
          </div>
        </div>

        {/* Phones: pushes the queue down to the thumb. The desktop panel is sized to its content, so this collapses. */}
        <div aria-hidden="true" className="min-h-5 flex-1" />

        {/* Fits up to four rows exactly; a longer queue scrolls on its own while the rest of the player stays put. */}
        <section aria-label="Queue" className="flex min-h-0 shrink flex-col border-t border-paper/10 pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="flex shrink-0 items-center justify-between px-6 pt-3 pb-2">
            <p className="label opacity-55">Up next</p>
            <p className="label tabular-nums opacity-40">
              {position} / {queue.length}
            </p>
          </div>
          <ol className="max-h-[224px] min-h-0 overflow-y-auto overscroll-contain px-3 [scrollbar-color:rgb(237_232_221/0.2)_transparent] [scrollbar-width:thin]">
            {queue.map((id, i) => {
              const item = getTrack(id)!;
              const current = id === track.id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => play(id)}
                    aria-current={current ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${current ? "bg-paper/[0.07]" : "hover:bg-paper/[0.04]"}`}
                  >
                    <span className="grid w-4 shrink-0 place-items-center text-[11px] tabular-nums">
                      {current ? <Equalizer playing={isPlaying} className="h-3 text-red" /> : <span className="opacity-50">{i + 1}</span>}
                    </span>
                    <span className="size-10 shrink-0 overflow-hidden rounded-md">
                      <Cover crop={releaseForTrack(id).cover} alt="" className="size-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-medium ${current ? "text-red" : ""}`}>{item.title}</span>
                      <span className="block truncate text-xs opacity-50">{item.genre}</span>
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums opacity-50">{item.duration}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
