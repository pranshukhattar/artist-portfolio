"use client";

import { useRef } from "react";
import Image from "next/image";
import hero from "../../../public/landing_page_hero.png";
import { artist } from "@/content/artist";
import { singles } from "@/content/music";
import { siteConfig } from "@/lib/site";
import {
  EASE,
  gsap,
  onIntroDone,
  prefersReducedMotion,
  useGSAP,
} from "@/lib/motion";
import { SplitWords } from "@/components/motion/MaskedReveal";
import { SoundRoll } from "@/components/motion/SoundRoll";
import { Icon } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Equalizer } from "@/components/player/parts";
import { scrollToHash } from "@/components/layout/Nav";

// On hover the collage zooms in slightly, then leans toward the cursor. The
// drift stays inside the margin the zoom creates, so no edge ever shows.
const HOVER_SCALE = 1.07;
const DRIFT = { x: 0.96, y: 0.96, copy: 20, polaroid: 14, tilt: 4 }; // share of the zoom margin used; copy/polaroid in px, tilt in deg

const latest = singles[0];
const city = artist.basedIn.split(",")[0];
const since = artist.milestones[0].year;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();

      // Intro: collage settles, headline rises word by word, details follow.
      if (!reduce) {
        const intro = gsap.timeline({ paused: true, defaults: { ease: EASE } });
        intro
          .fromTo(
            "[data-hero-media]",
            { scale: 1.08 },
            { scale: 1, duration: 1.8, ease: "power2.out" },
            0,
          )
          .fromTo(
            "[data-intro-words] .word",
            { yPercent: 110, y: 0 },
            { yPercent: 0, y: 0, duration: 1, stagger: 0.05 },
            0.15,
          )
          .fromTo(
            "[data-intro]",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
            0.55,
          )
          .fromTo(
            "[data-polaroid-drop]",
            { y: -48, rotation: -14 },
            { y: 0, rotation: 0, duration: 1.1, ease: "back.out(1.7)" },
            0.7,
          );
        onIntroDone(() => intro.play());
      }

      // Scroll: the collage drifts slower than the page, the copy lifts away.
      if (!reduce) {
        gsap.to("[data-hero-parallax]", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to("[data-hero-copy]", {
          y: -60,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Pointer: zoom in slightly on enter, then follow the cursor (fine pointers only).
      if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
      const section = root.current!;
      const follow = { duration: 0.9, ease: "power3.out" };
      const panX = gsap.quickTo("[data-hero-pan]", "x", follow);
      const panY = gsap.quickTo("[data-hero-pan]", "y", follow);
      const copyX = gsap.quickTo("[data-hero-copy]", "x", follow);
      const polaroidX = gsap.quickTo("[data-polaroid-tilt]", "x", follow);
      const polaroidTilt = gsap.quickTo("[data-polaroid-tilt]", "rotation", follow);

      const onEnter = () =>
        gsap.to("[data-hero-pan]", {
          scale: HOVER_SCALE,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
        });
      const onMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        // Margin on each side created by the zoom.
        const marginX = (rect.width * (HOVER_SCALE - 1)) / 2;
        const marginY = (rect.height * (HOVER_SCALE - 1)) / 2;
        panX(nx * 2 * marginX * DRIFT.x);
        panY(ny * 2 * marginY * DRIFT.y);
        copyX(-nx * 2 * DRIFT.copy);
        polaroidX(-nx * 2 * DRIFT.polaroid);
        polaroidTilt(nx * 2 * DRIFT.tilt);
      };
      const settle = () => {
        gsap.to("[data-hero-pan]", {
          scale: 1,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
        });
        panX(0);
        panY(0);
        copyX(0);
        polaroidX(0);
        polaroidTilt(0);
      };
      const onVisibility = () => document.hidden && settle();

      section.addEventListener("pointerenter", onEnter);
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", settle);
      window.addEventListener("blur", settle);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        section.removeEventListener("pointerenter", onEnter);
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", settle);
        window.removeEventListener("blur", settle);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Introduction"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-paper"
    >
      {/* Media: parallax wrapper → intro scale wrapper → hover zoom/follow layer. */}
      <div data-hero-parallax className="absolute inset-0">
        <div data-hero-media className="absolute inset-0">
          <div data-hero-pan className="absolute inset-0 will-change-transform">
            <Image
              src={hero}
              alt="A collage of worn vinyl records and hand-lettered labels in red, black, teal and mustard"
              fill
              priority
              placeholder="blur"
              sizes="100vw"
              className="object-cover max-md:object-[38%_50%]"
            />
          </div>
        </div>
      </div>

      {/* Desktop contrast: ink from the left for the headline, from the top for the nav, from the bottom for the rail. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(17,17,17,0.92)_0%,rgba(17,17,17,0.7)_32%,rgba(17,17,17,0)_62%)] md:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 hidden h-36 bg-gradient-to-b from-ink/75 to-transparent md:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink/80 to-transparent md:block"
      />

      {/* Phone contrast: long, soft ink washes behind the headline (top) and the socials
          (bottom), leaving the middle of the collage clear. The bottom wash reaches solid ink, so
          the hero dissolves into the next chapter with no edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[52%] bg-[linear-gradient(180deg,rgba(17,17,17,0.9)_0%,rgba(17,17,17,0.72)_38%,rgba(17,17,17,0)_100%)] md:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(0deg,rgba(17,17,17,1)_0%,rgba(17,17,17,0.94)_24%,rgba(17,17,17,0.62)_55%,rgba(17,17,17,0)_100%)] md:hidden"
      />

      {/* Phones: a poster — headline at the top, the collage through the middle, the socials at
          the bottom. Desktop: everything centred on the left. */}
      <div
        data-hero-copy
        className="wrap relative flex h-full flex-col pt-[calc(64px+3svh)] pb-[calc(84px+env(safe-area-inset-bottom))] md:justify-center md:pt-0 md:pb-0"
      >
        {/* Editorial details above the headline: a hairline, the name and where from. */}
        <span
          data-intro
          aria-hidden="true"
          className="mb-5 hidden h-14 w-px bg-paper/45 md:block"
        />
        <p data-intro className="label mb-4 flex items-center gap-3 md:mb-6">
          <span className="font-semibold">{siteConfig.name}</span>
          <span
            aria-hidden="true"
            className="size-[3px] rounded-full bg-paper/50"
          />
          <span className="opacity-60">
            {city} · Est. {since}
          </span>
        </p>

        {/* The headline sets the font size here so the polaroid can be placed and sized in em:
            it fills the gap right of "Sounds" and "for the", one corner resting on "inbetween". */}
        <div className="relative w-fit text-[clamp(52px,min(16vw,8.4svh),72px)] md:text-[clamp(56px,7.6vw,148px)]">
          <h1
            data-intro-words
            className="font-display leading-[0.88] font-bold tracking-[-0.045em]"
          >
            <SplitWords lines={artist.tagline} />
          </h1>

          {/* Polaroid: outer places it, middle sways with the cursor, inner drops in on intro. */}
          <div
            data-intro
            className="pointer-events-none absolute top-[0.02em] left-[3.55em] w-[1.12em] rotate-[7deg]"
          >
            <div data-polaroid-tilt>
              <figure
                data-polaroid-drop
                className="relative bg-paper p-[0.05em] pb-0 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)]"
              >
                <span className="relative block aspect-[4/5] w-full overflow-hidden bg-ink-soft">
                  <Image
                    src={artist.portrait.src}
                    alt={artist.portrait.alt}
                    fill
                    sizes="180px"
                    className="object-cover"
                    style={{ objectPosition: artist.portrait.position }}
                  />
                </span>
                <figcaption className="py-[0.45em] text-center font-hand text-[clamp(14px,1.25vw,22px)] leading-none text-ink">
                  {city}, {since}
                </figcaption>
                <span
                  aria-hidden="true"
                  className="absolute -top-[0.07em] left-1/2 h-[0.15em] w-[0.5em] -translate-x-1/2 -rotate-[5deg] bg-paper/75 shadow-sm"
                />
              </figure>
            </div>
          </div>
        </div>

        {/* Now-playing strip: the newest single, with bars that keep moving. */}
        <p data-intro className="label mt-auto flex items-center gap-3 md:mt-8">
          <Equalizer playing className="h-3 text-paper" />
          <span>
            {latest.title} — {latest.year}
          </span>
        </p>

        {/* Phones only: socials sit at the bottom (desktop has them in the rail). */}
        <div data-intro className="mt-4 flex items-center md:hidden">
          <SocialLinks only={["instagram", "youtube", "spotify"]} />
        </div>

        {/* Phones: the sound in words rolls along the bottom (desktop has it in its own section). */}
        <div data-intro className="-mx-[clamp(16px,4vw,60px)] mt-7 md:hidden">
          <SoundRoll media="(max-width: 767px)" size="sm" />
        </div>
      </div>

      {/* Desktop rail: socials bottom-left. */}
      <div
        data-intro
        className="absolute inset-x-0 bottom-0 hidden pb-6 md:block"
      >
        <div className="wrap">
          <SocialLinks
            only={["instagram", "youtube", "spotify"]}
            className="-ml-2"
          />
        </div>
      </div>

      {/* Scroll cue (desktop): a label turning like a record around a bobbing arrow.
          Phones have the tab bar instead. */}
      <div
        data-intro
        className="absolute right-[clamp(16px,4vw,60px)] bottom-6 hidden md:block"
      >
        <a
          href="#music"
          onClick={(e) => {
            e.preventDefault();
            scrollToHash("#music");
          }}
          aria-label="Scroll to the music"
          className="group relative grid size-[88px] place-items-center rounded-full bg-ink/50 backdrop-blur-sm md:size-[112px]"
        >
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="spin absolute inset-0 size-full"
            style={{
              ["--spin" as string]: "16s",
              ["--spin-state" as string]: "running",
            }}
          >
            <path
              id="scroll-cue-ring"
              fill="none"
              d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0"
            />
            <text className="fill-paper text-[8.5px] font-semibold uppercase">
              <textPath
                href="#scroll-cue-ring"
                textLength={242}
                lengthAdjust="spacing"
              >
                Scroll to listen • Scroll to listen •
              </textPath>
            </text>
          </svg>
          <span className="grid size-11 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-out-expo group-hover:scale-110 md:size-12">
            <Icon name="arrowDown" size={20} className="scroll-bob" />
          </span>
        </a>
      </div>
    </section>
  );
}
