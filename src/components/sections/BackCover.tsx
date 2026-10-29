"use client";

import { useRef } from "react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { siteConfig } from "@/lib/site";
import { artist } from "@/content/artist";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer } from "@/components/player/PlayerProvider";
import { scrollToHash } from "@/components/layout/Nav";
import { Icon } from "@/components/ui/Icon";
import { RecordDisc } from "@/components/ui/RecordDisc";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { BookingForm } from "./forms";

gsap.registerPlugin(Draggable, InertiaPlugin);

/** The finale: bookings, a record to spin, and the footer. */
export function BackCover() {
  const root = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const { isPlaying } = usePlayer();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();

      // The record turns a little with the scroll, as if the needle is still on it.
      if (!reduce) {
        gsap.fromTo(
          "[data-turntable]",
          { rotate: -60 },
          { rotate: 200, ease: "none", scrollTrigger: { trigger: "[data-turntable]", start: "top bottom", end: "bottom top", scrub: true } },
        );
      }

      // With a mouse, grab the record and spin it; let go and it carries on and slows down.
      // (On touch, dragging would fight the page scroll, so a tap gives it a spin instead.)
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const [spinner] = Draggable.create(disc.current, {
        type: "rotation",
        inertia: !reduce,
        dragClickables: true,
        onPress: () => (dragged.current = false),
        onDragStart: () => (dragged.current = true),
      });
      return () => spinner.kill();
    },
    { scope: root },
  );

  // A click (or tap, or Enter) gives it one good spin, unless it was just dragged.
  const spin = () => {
    if (dragged.current) return;
    gsap.to(disc.current, { rotation: "+=540", duration: prefersReducedMotion() ? 0 : 1.6, ease: "power3.out" });
  };

  return (
    <Chapter id="contact" theme="dark" surface="bg-red-deep" chapter="05 — Bookings" label="Bookings">
      <div ref={root}>
        {/* Desktop: the title and the record share the left column, the form fills the right.
            Phones: title, then the form, then the record. */}
        <div className="wrap grid gap-12 pt-24 md:grid-cols-12 md:gap-x-10 md:gap-y-16 md:pt-36">
          <div className="md:col-span-5 md:row-start-1">
            <ChapterTitle index="05" story="Bookings">
              <MaskedReveal
                lines={["Book", "a show"]}
                className="mt-4 font-display text-[clamp(72px,9.5vw,168px)] leading-[0.82] font-bold tracking-[-0.055em]"
              />
            </ChapterTitle>
            <p className="mt-8 max-w-sm text-lg" data-reveal>
              Club nights, festivals, private and brand events. Send the date and a few details. Based in {artist.basedIn}, playing everywhere.
            </p>
          </div>

          <div className="md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1 md:pt-4" data-reveal>
            <BookingForm />
          </div>

          {/* A record you can spin. It also turns on its own while any song is playing. */}
          <div className="mx-auto w-[min(56vw,260px)] md:col-span-5 md:row-start-2 md:mx-0 md:self-end" data-reveal>
            <div data-turntable className="aspect-square w-full">
              <button
                ref={disc}
                type="button"
                onClick={spin}
                aria-label="Spin the record"
                data-cursor="Spin"
                className="relative block size-full cursor-grab rounded-full active:cursor-grabbing"
              >
                <RecordDisc crop={{ x: 40, y: 45, zoom: 2.8 }} spinning={isPlaying} spin="3s" className="size-full shadow-[0_28px_56px_-24px_rgba(0,0,0,0.55)]" />
                {/* Centre label: side B of whatever comes next. */}
                <span className="absolute inset-[33%] rounded-full bg-paper text-ink ring-1 ring-ink/10">
                  <span className="absolute inset-x-0 top-[14%] text-center font-hand text-[clamp(16px,1.8vw,22px)] leading-none -rotate-6">Side B</span>
                  <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-[9%] -translate-1/2 rounded-full bg-ink" />
                  <span className="absolute inset-x-0 bottom-[22%] text-center text-[7px] font-semibold tracking-[0.12em] uppercase opacity-60">
                    in the works
                  </span>
                </span>
              </button>
            </div>
            <p aria-hidden="true" className="mt-5 text-center font-hand text-xl opacity-85 -rotate-2">
              <span className="[@media(pointer:coarse)]:hidden">grab it and give it a spin</span>
              <span className="hidden [@media(pointer:coarse)]:inline">tap to give it a spin</span>
            </p>
          </div>
        </div>

        <footer className="wrap mt-24 flex flex-col gap-6 border-t border-paper/40 pt-8 pb-[calc(150px+env(safe-area-inset-bottom))] md:mt-32 md:flex-row md:items-center md:justify-between md:pb-32">
          <p className="label opacity-95">
            © {new Date().getFullYear()} {siteConfig.name} · {artist.basedIn}
          </p>
          <SocialLinks className="-ml-2" />
          <button type="button" onClick={() => scrollToHash("#top")} className="label inline-flex items-center gap-2 self-start opacity-95 hover:opacity-100 md:self-auto">
            Back to top <Icon name="chevronUp" size={18} />
          </button>
        </footer>
      </div>
    </Chapter>
  );
}
