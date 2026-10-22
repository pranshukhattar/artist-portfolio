"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { RecordDisc } from "@/components/ui/RecordDisc";
import { releaseForTrack, type Track } from "@/content/music";
import { formatTime, usePlayer, usePlayerTime } from "./PlayerProvider";

/** The current track's record; spins only while playing. */
export function Disc({ track, spinning, className = "" }: { track: Track; spinning: boolean; className?: string }) {
  return <RecordDisc crop={releaseForTrack(track.id).cover} spinning={spinning} className={className} />;
}

export function Transport({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { isPlaying, toggle, next, prev, track } = usePlayer();
  const big = size === "lg";
  const label = track ? `${isPlaying ? "Pause" : "Play"} ${track.title}` : "Play";
  return (
    <div className={`flex items-center ${big ? "gap-6" : "gap-1"}`}>
      <button type="button" onClick={prev} aria-label="Previous track" className="grid size-9 place-items-center rounded-full opacity-80 transition-opacity hover:opacity-100">
        <Icon name="prev" size={big ? 30 : 22} />
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className={`grid place-items-center rounded-full bg-paper text-ink transition-transform duration-200 ease-out-expo active:scale-95 ${big ? "size-16" : "size-10"}`}
      >
        <Icon name={isPlaying ? "pause" : "play"} size={big ? 30 : 20} />
      </button>
      <button type="button" onClick={next} aria-label="Next track" className="grid size-9 place-items-center rounded-full opacity-80 transition-opacity hover:opacity-100">
        <Icon name="next" size={big ? 30 : 22} />
      </button>
    </div>
  );
}

export function Scrubber({ showTimes = true, className = "" }: { showTimes?: boolean; className?: string }) {
  const { seek, track } = usePlayer();
  const { currentTime, duration } = usePlayerTime();
  const progress = duration ? (currentTime / duration) * 100 : 0;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showTimes && <span className="w-9 text-right text-[11px] tabular-nums opacity-60">{formatTime(currentTime)}</span>}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        disabled={!duration}
        aria-label={track ? `Seek ${track.title}` : "Seek"}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        className="scrubber min-w-0 flex-1"
        style={{ "--progress": `${progress}%` } as CSSProperties}
      />
      {showTimes && <span className="w-9 text-[11px] tabular-nums opacity-60">{formatTime(duration)}</span>}
    </div>
  );
}

export function Volume() {
  const { volume, muted, setVolume, toggleMute } = usePlayer();
  const level = muted ? 0 : volume;
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="grid size-9 place-items-center opacity-80 hover:opacity-100">
        <Icon name={muted || volume === 0 ? "mute" : "volume"} size={22} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={level}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="scrubber w-20"
        style={{ "--progress": `${level * 100}%` } as CSSProperties}
      />
    </div>
  );
}
