"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { photos, type Photo } from "@/content/gallery";
import { gsap, lockScroll, ScrollTrigger, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";

// Print sizes: widths drive the swipe row; heights drive the pinned strip.
const SHAPE = {
  portrait: {
    ratio: 4 / 5,
    box: "aspect-[4/5] w-[64vw] group-data-[pinned]:h-[56vh] group-data-[pinned]:w-auto",
  },
  landscape: {
    ratio: 3 / 2,
    box: "aspect-[3/2] w-[82vw] group-data-[pinned]:h-[42vh] group-data-[pinned]:w-auto",
  },
  square: {
    ratio: 1,
    box: "aspect-square w-[70vw] group-data-[pinned]:h-[48vh] group-data-[pinned]:w-auto",
  },
};
// Hand-placed feel: a slight tilt and vertical stagger per print.
const TILT = [-2.5, 1.8, -1.2, 2.4, -2, 1.4, -1.6];
const LIFT = [
  "",
  "group-data-[pinned]:mt-[10vh]",
  "group-data-[pinned]:-mt-[8vh]",
  "group-data-[pinned]:mt-[6vh]",
  "group-data-[pinned]:-mt-[4vh]",
  "group-data-[pinned]:mt-[12vh]",
  "group-data-[pinned]:-mt-[6vh]",
];

const intro =
  "Studios, soundchecks, late nights — the moments in between the songs.";

/**
 * Snapshots from the road. On desktop the chapter holds still while scrolling
 * slides a strip of prints sideways (pinned with position: sticky); each print
 * rises in and its photo drifts inside the frame. Without JS, on phones or
 * with reduced motion it's a plain swipeable row. Any print opens the lightbox.
 */
export function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = root.current!;
          const wrap = el.querySelector<HTMLElement>("[data-pin-wrap]")!;
          const track = el.querySelector<HTMLElement>("[data-track]")!;
          el.setAttribute("data-pinned", "");

          // Slide until the Instagram link sits in the middle of the screen, then release the pin.
          const more = el.querySelector<HTMLElement>("[data-more]")!;
          const distance = () =>
            Math.max(
              0,
              more.offsetLeft +
                more.offsetWidth / 1.5 -
                window.innerWidth / 1.5,
            );
          const size = () =>
            (wrap.style.height = `${distance() + window.innerHeight}px`);
          size();

          const slide = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
              invalidateOnRefresh: true,
              onRefreshInit: size,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-print]").forEach((print) => {
            gsap.fromTo(
              print,
              { y: 90, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: print,
                  containerAnimation: slide,
                  start: "left 105%",
                  end: "left 72%",
                  scrub: true,
                },
              },
            );
            gsap.fromTo(
              print.querySelector("[data-drift]"),
              { xPercent: -7 },
              {
                xPercent: 7,
                ease: "none",
                scrollTrigger: {
                  trigger: print,
                  containerAnimation: slide,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });
          ScrollTrigger.refresh();

          return () => {
            el.removeAttribute("data-pinned");
            wrap.style.height = "";
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <Chapter
      id="gallery"
      theme="dark"
      chapter="03 — The person"
      label="Gallery"
      className="pt-20 pb-20 md:pt-0 md:pb-0"
    >
      <div ref={root} className="group">
        {/* Intro for the swipe row (the pinned strip carries its own). */}
        <div className="wrap group-data-[pinned]:hidden">
          <Intro />
        </div>

        <div data-pin-wrap className="relative">
          <div className="group-data-[pinned]:sticky group-data-[pinned]:top-0 group-data-[pinned]:flex group-data-[pinned]:h-[100svh] group-data-[pinned]:items-center group-data-[pinned]:overflow-hidden">
            <ul
              data-track
              className="mt-8 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[clamp(16px,4vw,60px)] pt-4 pb-10 [scrollbar-width:none] group-data-[pinned]:mt-0 group-data-[pinned]:w-max group-data-[pinned]:snap-none group-data-[pinned]:gap-14 group-data-[pinned]:overflow-visible group-data-[pinned]:py-0 [&::-webkit-scrollbar]:hidden"
            >
              <li className="hidden w-[34vw] shrink-0 pr-[4vw] group-data-[pinned]:block">
                <Intro />
                <p className="label mt-10 flex items-center gap-3 opacity-60">
                  Keep scrolling <Icon name="arrowRight" size={16} />
                </p>
              </li>

              {photos.map((photo, i) => (
                <li
                  key={photo.id}
                  data-print
                  className={`shrink-0 snap-center ${LIFT[i % LIFT.length]}`}
                >
                  <Print
                    photo={photo}
                    tilt={TILT[i % TILT.length]}
                    onOpen={() => setOpen(i)}
                  />
                </li>
              ))}

              <li
                data-more
                className="shrink-0 snap-center pr-[clamp(16px,4vw,60px)] group-data-[pinned]:pr-0"
              >
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Follow"
                  className="group/more flex flex-col items-center gap-5 text-center"
                >
                  <span className="grid size-28 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-out-expo group-hover/more:scale-110 md:size-36">
                    <Icon name="instagram" size={34} />
                  </span>
                  <span className="font-display text-2xl tracking-[-0.02em]">
                    More on Instagram
                  </span>
                  <span className="label inline-flex items-center gap-1.5 opacity-60">
                    Follow <Icon name="arrowUpRight" size={14} />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Portalled to <body>: chapters are transformed and clipped, which would trap a fixed overlay. */}
      {open !== null &&
        createPortal(
          <Lightbox
            index={open}
            onChange={setOpen}
            onClose={() => setOpen(null)}
          />,
          document.body,
        )}
    </Chapter>
  );
}

function Intro() {
  return (
    <ChapterTitle index="03" story="Snapshots">
      <MaskedReveal
        lines={["Snapshots", "from the road"]}
        className="mt-4 font-display text-[clamp(40px,4.4vw,72px)] leading-[0.88] font-medium tracking-[-0.045em]"
      />
      <p className="mt-5 max-w-sm text-base opacity-75 md:text-lg">{intro}</p>
    </ChapterTitle>
  );
}

function PhotoImage({ photo, sizes }: { photo: Photo; sizes: string }) {
  return photo.src ? (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  ) : (
    <Cover crop={photo.crop} alt={photo.alt} className="size-full" />
  );
}

function Print({
  photo,
  tilt,
  onOpen,
}: {
  photo: Photo;
  tilt: number;
  onOpen: () => void;
}) {
  return (
    <figure
      className="bg-paper-hi p-2.5 pb-3 text-ink shadow-[0_2px_4px_rgba(0,0,0,0.25),0_24px_48px_-16px_rgba(0,0,0,0.6)] md:p-3 md:pb-4"
      style={{ rotate: `${tilt}deg` }}
    >
      <button
        type="button"
        onClick={onOpen}
        data-cursor="View"
        aria-label={`Open photo: ${photo.caption}`}
        className="group/print block"
      >
        <div
          className={`relative overflow-hidden bg-ink-soft ${SHAPE[photo.shape].box}`}
        >
          <div
            data-drift
            className="absolute inset-y-0 -inset-x-[10%] transition-transform duration-700 ease-out-expo group-hover/print:scale-[1.03]"
          >
            <PhotoImage photo={photo} sizes="(min-width: 768px) 75vw, 90vw" />
          </div>
        </div>
      </button>
      <figcaption className="flex items-baseline justify-between gap-4 px-1 pt-3">
        <span className="font-hand text-[22px] leading-none md:text-[26px]">
          {photo.caption}
        </span>
        <span className="label shrink-0 opacity-50">{photo.meta}</span>
      </figcaption>
    </figure>
  );
}

function Lightbox({
  index,
  onChange,
  onClose,
}: {
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const photo = photos[index];
  const go = (dir: 1 | -1) =>
    onChange((index + dir + photos.length) % photos.length);

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
      if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft")
        onChange((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onChange, onClose]);

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const ratio = SHAPE[photo.shape].ratio;

  return (
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
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(photos.length).padStart(2, "0")}
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
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute top-1/2 left-[clamp(16px,4vw,60px)] z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-paper/30 transition-colors hover:bg-paper hover:text-ink md:grid"
        >
          <Icon name="arrowLeft" size={22} />
        </button>
        <figure
          key={photo.id}
          className="lightbox-photo flex flex-col items-center"
        >
          <div
            className="relative overflow-hidden bg-ink-soft [--lb-max:88vw] md:[--lb-max:calc(100vw-280px)]"
            style={{
              aspectRatio: ratio,
              width: `min(var(--lb-max), calc(68svh * ${ratio}))`,
            }}
          >
            <PhotoImage photo={photo} sizes="90vw" />
          </div>
          <figcaption className="mt-5 flex flex-col items-center gap-1 text-center">
            <span className="font-hand text-3xl">{photo.caption}</span>
            <span className="label opacity-60">{photo.meta}</span>
          </figcaption>
        </figure>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute top-1/2 right-[clamp(16px,4vw,60px)] z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-paper/30 transition-colors hover:bg-paper hover:text-ink md:grid"
        >
          <Icon name="arrowRight" size={22} />
        </button>
      </div>

      <div className="flex justify-center gap-3 pt-4 pb-[max(24px,env(safe-area-inset-bottom))] md:hidden">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="grid size-12 place-items-center rounded-full ring-1 ring-paper/30"
        >
          <Icon name="arrowLeft" size={22} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="grid size-12 place-items-center rounded-full ring-1 ring-paper/30"
        >
          <Icon name="arrowRight" size={22} />
        </button>
      </div>
    </div>
  );
}
