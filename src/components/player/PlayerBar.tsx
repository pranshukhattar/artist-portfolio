"use client";

import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { usePlayer } from "./PlayerProvider";
import { Disc, Scrubber, Transport, Volume } from "./parts";

/** Compact now-playing bar. Slides in after the first play. */
export function PlayerBar() {
  const { track, hasStarted, isPlaying, expanded, setExpanded } = usePlayer();
  const visible = hasStarted && !expanded;

  return (
    <>
      {/* Content softens as it passes under the bar. */}
      <div
        aria-hidden="true"
        className={`progressive-blur pointer-events-none fixed inset-x-0 bottom-0 z-30 h-36 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div /><div /><div /><div />
      </div>

      <section
        aria-label="Music player"
        inert={!visible}
        className={`fixed inset-x-3 bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 transition-transform duration-700 ease-out-expo md:inset-x-auto md:bottom-5 md:left-1/2 md:w-[min(920px,calc(100vw-40px))] md:-translate-x-1/2 ${visible ? "translate-y-0" : "translate-y-[calc(100%+120px)]"}`}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-ink/95 py-2 pr-2 pl-2 text-paper shadow-[0_1px_1px_rgba(0,0,0,0.25),0_8px_16px_-4px_rgba(0,0,0,0.3),0_24px_48px_-12px_rgba(0,0,0,0.45)] ring-1 ring-paper/10 md:gap-5 md:pr-3">
          {track && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left md:flex-none md:w-56"
              aria-label={`Open player: ${track.title}`}
            >
              <Disc track={track} spinning={isPlaying} className="size-11 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-medium tracking-[-0.01em]">{track.title}</span>
                <span className="block truncate text-xs opacity-60">{siteConfig.name}</span>
              </span>
            </button>
          )}

          <Transport />
          <Scrubber className="hidden flex-1 md:flex" />
          <div className="hidden lg:block">
            <Volume />
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Maximize player"
            className="grid size-9 shrink-0 place-items-center rounded-full opacity-75 hover:opacity-100"
          >
            <Icon name="maximize" size={22} />
          </button>
        </div>
      </section>
    </>
  );
}
