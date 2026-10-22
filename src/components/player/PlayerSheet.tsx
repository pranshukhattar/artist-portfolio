"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";
import { lockScroll } from "@/lib/motion";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { getTrack, releaseForTrack, type Platform } from "@/content/music";
import { usePlayer } from "./PlayerProvider";
import { Disc, Scrubber, Transport, Volume } from "./parts";

const PLATFORM_LABEL: Record<Platform, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
};

/** Expanded player: full screen on phones, side panel on desktop. */
export function PlayerSheet() {
  const { track, expanded, setExpanded, isPlaying, queue, play } = usePlayer();
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
        className={`absolute inset-0 flex flex-col overflow-y-auto overscroll-contain bg-ink text-paper transition-transform duration-700 ease-out-expo md:inset-y-3 md:right-3 md:left-auto md:w-[440px] md:rounded-2xl md:ring-1 md:ring-paper/10 ${expanded ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-[calc(100%+24px)] md:translate-y-0"}`}
        data-lenis-prevent
      >
        <header className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))] pb-2">
          <button ref={closeBtn} type="button" onClick={() => setExpanded(false)} aria-label="Minimize player" className="grid size-10 place-items-center rounded-full opacity-80 hover:opacity-100">
            <Icon name="minimize" size={24} />
          </button>
          <span className="label opacity-60">Now playing</span>
          <span className="size-10" />
        </header>

        <div className="px-6">
          <div className="relative mx-auto aspect-square w-full max-w-[340px]">
            <div className="absolute inset-[6%] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
              <Cover crop={release.cover} alt={`${release.title} cover`} className="size-full rounded-sm" />
            </div>
            <Disc track={track} spinning={isPlaying} className={`absolute -bottom-3 -right-3 size-[42%] ring-4 ring-ink transition-transform duration-700 ease-out-expo ${isPlaying ? "translate-x-2" : ""}`} />
          </div>

          <div className="mt-8 text-center">
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em]">{track.title}</h2>
            <p className="mt-1 text-sm opacity-60">
              {siteConfig.name} · {release.title}
            </p>
          </div>

          <Scrubber className="mt-8" />
          <div className="mt-4 flex justify-center">
            <Transport size="lg" />
          </div>
          <div className="mt-4 hidden justify-center md:flex">
            <Volume />
          </div>

          <div className="mt-8">
            <p className="label opacity-50">Listen on</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(Object.entries(track.links) as [Platform, string][]).map(([platform, href]) => (
                <li key={platform}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs ring-1 ring-paper/20 transition-colors hover:bg-paper hover:text-ink"
                  >
                    <Icon name={platform} size={18} />
                    {PLATFORM_LABEL[platform]}
                    <Icon name="arrowUpRight" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pb-[max(24px,env(safe-area-inset-bottom))]">
            <p className="label opacity-50">Queue</p>
            <ol className="mt-2 divide-y divide-paper/10">
              {queue.map((id, i) => {
                const item = getTrack(id)!;
                const current = id === track.id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => play(id)}
                      aria-current={current ? "true" : undefined}
                      className={`flex w-full items-center gap-4 py-3 text-left text-sm transition-opacity ${current ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                    >
                      <span className="w-5 text-[11px] tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`flex-1 ${current ? "text-red" : ""}`}>{item.title}</span>
                      <span className="text-[11px] tabular-nums opacity-60">{item.duration}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
