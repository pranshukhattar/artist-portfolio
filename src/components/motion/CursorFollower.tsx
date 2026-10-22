"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type Mode = "idle" | "hover" | "label";

const INTERACTIVE = "a, button, input, textarea, select, label, [data-cursor]";

/**
 * A small ring that trails the cursor with a soft lag, plus an exact dot.
 * Over links and buttons the ring swells; over anything marked
 * `data-cursor="Play"` it becomes a little red record with a spinning groove
 * and the label. Fine pointers only, off under reduced motion; the native
 * cursor stays visible.
 */
export function CursorFollower() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !ring.current || !dot.current) return;
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power2.out" });

    const onMove = (e: PointerEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element).closest?.(INTERACTIVE);
      const text = target?.getAttribute("data-cursor");
      setMode(text ? "label" : target ? "hover" : "idle");
      if (text) setLabel(text);
    };
    const hide = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = mode === "label" ? "size-[76px]" : mode === "hover" ? "size-14" : "size-8";

  // Each layer is its own fixed element: blend modes only reach the page from the top level.
  const layer = `pointer-events-none fixed top-0 left-0 z-[90] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`;

  return (
    <>
      <div ref={ring} aria-hidden="true" className={`${layer} ${mode === "label" ? "" : "mix-blend-difference"}`}>
        <div
          className={`relative grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height,background-color,border-color] duration-500 ease-out-expo ${ringSize} ${
            mode === "label" ? "bg-red text-paper shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]" : mode === "hover" ? "border border-paper bg-paper" : "border border-paper"
          }`}
        >
          {mode === "label" && (
            <>
              {/* Groove: a dashed ring that turns like a record. */}
              <span className="spin absolute inset-1.5 rounded-full border border-dashed border-paper/45" style={{ ["--spin" as string]: "6s", ["--spin-state" as string]: "running" }} />
              <span className="relative text-[10px] font-semibold tracking-[0.16em] uppercase">{label}</span>
            </>
          )}
        </div>
      </div>
      <div ref={dot} aria-hidden="true" className={`${layer} mix-blend-difference`}>
        <div className={`size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper transition-opacity duration-300 ${mode === "idle" ? "opacity-100" : "opacity-0"}`} />
      </div>
    </>
  );
}
