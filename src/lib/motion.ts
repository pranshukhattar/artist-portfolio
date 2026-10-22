"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const EASE = "power3.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The single Lenis instance, owned by <SmoothScroll />. Null under reduced motion.
let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => (lenis = instance);
export const getLenis = () => lenis;

/** Freeze page scroll while an overlay (menu, player sheet) is open. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

// Intro gate: the hero waits for the preloader (first visit only) before playing.
let introDone = false;
const introListeners = new Set<() => void>();

export function markIntroDone() {
  introDone = true;
  introListeners.forEach((cb) => cb());
  introListeners.clear();
}

export function onIntroDone(cb: () => void) {
  if (introDone || !document.documentElement.classList.contains("preload")) cb();
  else introListeners.add(cb);
  return () => introListeners.delete(cb);
}
