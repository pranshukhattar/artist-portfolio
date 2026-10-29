"use client";

import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { usePlayer, usePlayerTime } from "./PlayerProvider";
import { Disc, ghostButton } from "./parts";

/** Hairline progress along the bottom edge of the mini player. */
function Progress() {
  const { currentTime, duration } = usePlayerTime();
  const progress = duration ? (currentTime / duration) * 100 : 0;
  return (
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] bg-paper/10">
      <span className="block h-full bg-red" style={{ width: `${progress}%` }} />
    </span>
  );
}

/** Mini player: a small floating card in the bottom-right corner. Pops in after the first play. */
export function PlayerBar() {
  const { track, hasStarted, isPlaying, toggle, next, close, expanded, setExpanded } = usePlayer();
  const visible = hasStarted && !expanded;

  return (
    <section
      aria-label="Music player"
      inert={!visible}
      className={`fixed right-3 bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 origin-bottom-right transition-[transform,opacity] duration-500 ease-out-expo md:right-5 md:bottom-5 ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
    >
      <div className="relative flex w-[min(340px,calc(100vw-24px))] items-center gap-1 overflow-hidden rounded-2xl bg-ink/92 p-2 text-paper shadow-[0_1px_1px_rgba(0,0,0,0.25),0_8px_16px_-4px_rgba(0,0,0,0.3),0_24px_48px_-12px_rgba(0,0,0,0.45)] ring-1 ring-paper/10 backdrop-blur-md">
        {track && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="group/open flex min-w-0 flex-1 items-center gap-3 rounded-xl pr-2 text-left"
            aria-label={`Open player: ${track.title}`}
          >
            {/* The record spins while playing; hovering shows that it opens the full player. */}
            <span className="relative size-11 shrink-0">
              <Disc track={track} spinning={isPlaying} className="size-full ring-1 ring-paper/15" />
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center rounded-full bg-ink/55 opacity-0 transition-opacity duration-200 group-hover/open:opacity-100 group-focus-visible/open:opacity-100"
              >
                <Icon name="expand" size={16} />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[13px] leading-tight font-medium tracking-[-0.01em]">{track.title}</span>
              <span className="block truncate text-[11px] opacity-55">{siteConfig.name}</span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={track ? `${isPlaying ? "Pause" : "Play"} ${track.title}` : "Play"}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform duration-200 ease-out-expo hover:scale-105 active:scale-95"
        >
          <Icon name={isPlaying ? "pause" : "play"} size={16} />
        </button>
        <button type="button" onClick={next} aria-label="Next track" className={`${ghostButton} size-9`}>
          <Icon name="next" size={18} />
        </button>

        <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-paper/15" />

        <button type="button" onClick={() => setExpanded(true)} aria-label="Expand player" className={`${ghostButton} size-8`}>
          <Icon name="expand" size={16} />
        </button>
        <button type="button" onClick={close} aria-label="Close player and stop music" className={`${ghostButton} size-8`}>
          <Icon name="x" size={18} />
        </button>

        <Progress />
      </div>
    </section>
  );
}
