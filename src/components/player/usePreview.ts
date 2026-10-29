"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTrack } from "@/content/music";
import { usePlayer } from "./PlayerProvider";

/** How long a best-part preview plays, in seconds. */
export const HOOK_SECONDS = 15;
const FADE_MS = 400;

type Preview = { id: string; playing: boolean } | null;

/** Ramp an element's volume over FADE_MS, then call `done`. */
function ramp(el: HTMLAudioElement, to: number, frame: { current: number }, done?: () => void) {
  cancelAnimationFrame(frame.current);
  const from = el.volume;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / FADE_MS);
    el.volume = from + (to - from) * p;
    if (p < 1) frame.current = requestAnimationFrame(tick);
    else done?.();
  };
  frame.current = requestAnimationFrame(tick);
}

/**
 * Plays a short segment of a track from its hook, on its own audio element so the
 * main player (queue, sheet, lock-screen controls) is left alone. Starting a
 * preview pauses the main player; starting the main player stops the preview.
 *
 * Browsers only allow sound after the visitor has clicked or tapped the page once,
 * so a preview before that is skipped and `blocked` turns on, which the UI uses to
 * explain how to switch previews on.
 */
export function usePreview() {
  const { isPlaying, pause } = usePlayer();
  const audio = useRef<HTMLAudioElement | null>(null);
  const frame = useRef(0);
  const endAt = useRef(0);
  const pending = useRef<(() => void) | null>(null);
  const [preview, setPreview] = useState<Preview>(null);
  const [blocked, setBlocked] = useState(false);

  const stop = useCallback(() => {
    setPreview(null);
    endAt.current = 0;
    const el = audio.current;
    if (!el) return;
    if (pending.current) {
      el.removeEventListener("loadedmetadata", pending.current);
      pending.current = null;
    }
    if (!el.paused) ramp(el, 0, frame, () => el.pause());
  }, []);

  const start = useCallback(
    (id: string) => {
      const track = getTrack(id);
      if (!track?.audio || track.hook == null) return;
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
        setBlocked(true);
        return;
      }
      const hook = track.hook;

      if (!audio.current) {
        const el = new Audio();
        el.preload = "auto";
        el.addEventListener("playing", () => {
          if (!endAt.current) return; // stopped while it was still loading
          setPreview((p) => p && { ...p, playing: true });
          ramp(el, 0.9, frame);
        });
        el.addEventListener("timeupdate", () => endAt.current && el.currentTime >= endAt.current && stop());
        el.addEventListener("ended", stop);
        audio.current = el;
      }

      const el = audio.current;
      cancelAnimationFrame(frame.current);
      el.pause();
      el.volume = 0;
      pause();
      endAt.current = hook + HOOK_SECONDS;
      setBlocked(false);
      setPreview({ id, playing: false });

      if (!el.src.endsWith(track.audio)) el.src = track.audio;
      // Seeking before metadata loads is ignored by some browsers, so wait for it.
      // A quick second pick replaces the first one's pending start.
      if (pending.current) el.removeEventListener("loadedmetadata", pending.current);
      const seekAndPlay = () => {
        pending.current = null;
        el.currentTime = hook;
        el.play().catch((err: DOMException) => {
          if (err.name === "NotAllowedError") setBlocked(true);
          setPreview(null);
          endAt.current = 0;
        });
      };
      if (el.readyState >= HTMLMediaElement.HAVE_METADATA) seekAndPlay();
      else {
        pending.current = seekAndPlay;
        el.addEventListener("loadedmetadata", seekAndPlay, { once: true });
      }
    },
    [pause, stop],
  );

  // The first click or key press anywhere unlocks sound, so the hint can go.
  useEffect(() => {
    if (!blocked) return;
    const unlock = () => setBlocked(false);
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [blocked]);

  // The main player takes over: stop the preview.
  useEffect(() => {
    if (isPlaying) stop();
  }, [isPlaying, stop]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      audio.current?.pause();
    },
    [],
  );

  return { preview, blocked, start, stop };
}
