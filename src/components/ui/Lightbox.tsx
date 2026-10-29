"use client";

import { useEffect, useRef, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Photo } from "@/content/gallery";
import { lockScroll } from "@/lib/motion";
import { Cover } from "./Cover";
import { Icon } from "./Icon";

const RATIO = { portrait: 4 / 5, landscape: 3 / 2, square: 1 };

/** A photo filling its (positioned) box: the real image when there is one, else its collage crop. */
export function PhotoImage({ photo, sizes }: { photo: Photo; sizes: string }) {
  if (photo.src) {
    return (
      <div className="grain absolute inset-0">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: photo.position }} />
      </div>
    );
  }
  return photo.crop ? <Cover crop={photo.crop} alt={photo.alt} className="size-full" /> : null;
}

/**
 * Full-screen photo viewer, shared by the gallery and the hero polaroid. It
 * portals itself to <body>: chapters are transformed and clipped, which would
 * trap a fixed overlay. With one photo the counter and arrows stay hidden.
 */
export function Lightbox({
  photos,
  index,
  onChange,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const photo = photos[index];
  const many = photos.length > 1;
  const go = (dir: 1 | -1) => onChange((index + dir + photos.length) % photos.length);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    lockScroll(true);
    closeBtn.current?.focus();
    return () => {
      lockScroll(false);
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!many) return;
      if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, many, onChange, onClose, photos.length]);

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null || !many) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const ratio = RATIO[photo.shape];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="lightbox fixed inset-0 z-[80] flex flex-col bg-ink/95 text-paper backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <div className="wrap flex h-16 items-center justify-between md:h-20">
        <span className="label tabular-nums opacity-70">
          {many && (
            <>
              {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </>
          )}
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="grid size-11 place-items-center rounded-full ring-1 ring-paper/30 hover:bg-paper hover:text-ink"
        >
          <Icon name="x" size={20} />
        </button>
      </div>

      {/* Desktop arrows are pinned to the screen edges so they stay put whatever the photo's shape. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        {many && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute top-1/2 left-[clamp(16px,4vw,60px)] z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-paper/30 transition-colors hover:bg-paper hover:text-ink md:grid"
          >
            <Icon name="arrowLeft" size={22} />
          </button>
        )}
        <figure key={photo.id} className="lightbox-photo flex flex-col items-center">
          <div
            className="relative overflow-hidden bg-ink-soft [--lb-max:88vw] md:[--lb-max:calc(100vw-280px)]"
            style={{ aspectRatio: ratio, width: `min(var(--lb-max), calc(68svh * ${ratio}))` }}
          >
            <PhotoImage photo={photo} sizes="90vw" />
          </div>
          <figcaption className="mt-5 flex flex-col items-center gap-1 text-center">
            <span className="font-hand text-3xl">{photo.caption}</span>
            <span className="label opacity-60">{photo.meta}</span>
          </figcaption>
        </figure>
        {many && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute top-1/2 right-[clamp(16px,4vw,60px)] z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-paper/30 transition-colors hover:bg-paper hover:text-ink md:grid"
          >
            <Icon name="arrowRight" size={22} />
          </button>
        )}
      </div>

      <div className="flex justify-center gap-3 pt-4 pb-[max(24px,env(safe-area-inset-bottom))] md:hidden">
        {many && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid size-12 place-items-center rounded-full ring-1 ring-paper/30">
              <Icon name="arrowLeft" size={22} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid size-12 place-items-center rounded-full ring-1 ring-paper/30">
              <Icon name="arrowRight" size={22} />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
