"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getTrack, playableTrackIds, releaseForTrack, singles, type Track } from "@/content/music";
import { siteConfig } from "@/lib/site";

type PlayerState = {
  /** The loaded track. The newest single is cued on load, so this is set before anything plays. */
  track: Track | null;
  queue: string[];
  isPlaying: boolean;
  /** Something has actually played (and the player wasn't closed since). */
  hasStarted: boolean;
  expanded: boolean;
  volume: number;
  muted: boolean;
};

type PlayerActions = {
  /** Play a track; optionally replace the queue it belongs to. */
  play: (trackId: string, queue?: string[]) => void;
  toggle: () => void;
  pause: () => void;
  /** Stop playback and dismiss the player entirely. */
  close: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setExpanded: (expanded: boolean) => void;
};

type PlayerTime = { currentTime: number; duration: number };

const StateContext = createContext<(PlayerState & PlayerActions) | null>(null);
const TimeContext = createContext<PlayerTime>({ currentTime: 0, duration: 0 });

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [queue, setQueue] = useState<string[]>(playableTrackIds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolumeState] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState<PlayerTime>({ currentTime: 0, duration: 0 });
  const [started, setStarted] = useState(false);

  const track = trackId ? (getTrack(trackId) ?? null) : null;

  const load = useCallback((id: string) => {
    const el = audio.current;
    const next = getTrack(id);
    if (!el || !next?.audio) return;
    if (id !== trackId) {
      el.src = next.audio;
      setTrackId(id);
      setTime({ currentTime: 0, duration: 0 });
    }
    el.play().catch(() => setIsPlaying(false));
  }, [trackId]);

  const play = useCallback(
    (id: string, newQueue?: string[]) => {
      if (newQueue) setQueue(newQueue.filter((t) => getTrack(t)?.audio));
      if (id === trackId && audio.current) {
        audio.current.play().catch(() => setIsPlaying(false));
        return;
      }
      load(id);
    },
    [load, trackId],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!trackId || queue.length === 0) return;
      const i = queue.indexOf(trackId);
      load(queue[(i + dir + queue.length) % queue.length]);
    },
    [load, queue, trackId],
  );

  const next = useCallback(() => step(1), [step]);

  const prev = useCallback(() => {
    // Restart the current track first, like any music player.
    if (audio.current && audio.current.currentTime > 3) audio.current.currentTime = 0;
    else step(-1);
  }, [step]);

  const toggle = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (!trackId) return load(queue[0]);
    if (el.paused) el.play().catch(() => setIsPlaying(false));
    else el.pause();
  }, [load, queue, trackId]);

  const pause = useCallback(() => audio.current?.pause(), []);

  // Stop and put the player away; the track stays cued at the start.
  const close = useCallback(() => {
    const el = audio.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setStarted(false);
    setExpanded(false);
    setIsPlaying(false);
    setTime((t) => ({ ...t, currentTime: 0 }));
  }, []);

  const seek = useCallback((seconds: number) => {
    if (audio.current) audio.current.currentTime = seconds;
    setTime((t) => ({ ...t, currentTime: seconds }));
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audio.current) audio.current.volume = v;
    setVolumeState(v);
    setMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  useEffect(() => {
    if (audio.current) audio.current.muted = muted;
  }, [muted]);

  // Cue the newest single on load (metadata only), so its real length and a working
  // progress bar show before anything plays.
  useEffect(() => {
    const el = audio.current;
    const first = getTrack(singles[0].trackIds[0]);
    if (!el || !first?.audio || el.getAttribute("src")) return;
    el.src = first.audio;
    setTrackId(first.id);
  }, []);

  // Lock-screen / headphone controls, once something has played.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !track || !started) return;
    const release = releaseForTrack(track.id);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: siteConfig.name,
      album: release.title,
      artwork: [{ src: "/landing_page_hero.png", sizes: "1706x922", type: "image/png" }],
    });
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => audio.current?.play()],
      ["pause", () => audio.current?.pause()],
      ["previoustrack", prev],
      ["nexttrack", next],
      ["seekto", (d) => d.seekTime != null && seek(d.seekTime)],
    ];
    handlers.forEach(([action, handler]) => navigator.mediaSession.setActionHandler(action, handler));
    return () => handlers.forEach(([action]) => navigator.mediaSession.setActionHandler(action, null));
  }, [track, started, next, prev, seek]);

  useEffect(() => {
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const state = useMemo(
    () => ({
      track,
      queue,
      isPlaying,
      hasStarted: started,
      expanded,
      volume,
      muted,
      play,
      toggle,
      pause,
      close,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      setExpanded,
    }),
    [track, queue, isPlaying, started, expanded, volume, muted, play, toggle, pause, close, next, prev, seek, setVolume, toggleMute],
  );

  return (
    <StateContext.Provider value={state}>
      <TimeContext.Provider value={time}>
        {children}
        <audio
          ref={audio}
          preload="metadata"
          onPlay={() => {
            setIsPlaying(true);
            setStarted(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={next}
          onLoadedMetadata={(e) => setTime({ currentTime: 0, duration: e.currentTarget.duration })}
          onTimeUpdate={(e) =>
            setTime({ currentTime: e.currentTarget.currentTime, duration: e.currentTarget.duration || 0 })
          }
        />
      </TimeContext.Provider>
    </StateContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

export const usePlayerTime = () => useContext(TimeContext);

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
