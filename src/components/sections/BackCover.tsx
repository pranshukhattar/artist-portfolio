"use client";

import { useRef } from "react";
import { siteConfig } from "@/lib/site";
import { artist } from "@/content/artist";
import { singles } from "@/content/music";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer } from "@/components/player/PlayerProvider";
import { scrollToHash } from "@/components/layout/Nav";
import { Icon } from "@/components/ui/Icon";
import { RecordDisc } from "@/components/ui/RecordDisc";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ContactForm, MailingList } from "./forms";

const singleQueue = singles.map((r) => r.trackIds[0]);

/** The finale: more music soon, the mailing list, contact and the footer. */
export function BackCover() {
  const root = useRef<HTMLDivElement>(null);
  const { toggle, play, hasStarted, isPlaying } = usePlayer();

  // The record turns with the scroll, as if the needle is still on it.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-turntable]",
        { rotate: -60 },
        { rotate: 200, ease: "none", scrollTrigger: { trigger: "[data-turntable]", start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <Chapter id="contact" theme="dark" surface="bg-red-deep" chapter="05 — Back cover" label="More music and contact">
      <div ref={root}>
        <div className="wrap grid items-center gap-14 pt-24 md:grid-cols-12 md:pt-36">
          <div className="md:col-span-7">
            <ChapterTitle index="05" story="Back cover">
              <MaskedReveal
                lines={["More", "music", "soon"]}
                className="mt-4 font-display text-[clamp(72px,12vw,200px)] leading-[0.82] font-bold tracking-[-0.055em]"
              />
            </ChapterTitle>
            <p className="mt-8 max-w-md text-lg" data-reveal>
              New music is on the way. Join the list for first listens, show announcements and the occasional voice note.
            </p>
            <div className="mt-8" data-reveal>
              <MailingList />
            </div>
          </div>

          <div className="relative mx-auto w-[min(78vw,440px)] md:col-span-5" data-reveal>
            <button
              type="button"
              onClick={() => (hasStarted ? toggle() : play(singleQueue[0], singleQueue))}
              aria-label={isPlaying ? "Pause" : "Play more"}
              data-cursor={isPlaying ? "Pause" : "Play"}
              className="group relative block aspect-square w-full rounded-full"
            >
              <div data-turntable className="size-full">
                <RecordDisc crop={{ x: 40, y: 45, zoom: 2.8 }} spinning={isPlaying} spin="3s" className="size-full shadow-[0_32px_64px_-24px_rgba(0,0,0,0.55)]" />
              </div>
              <span className="absolute top-1/2 left-1/2 grid size-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-out-expo group-hover:scale-105">
                <span className="text-center font-hand text-[clamp(22px,3vw,34px)] leading-[0.9] -rotate-6">
                  {isPlaying ? "now playing" : "play more"}
                  <Icon name={isPlaying ? "pause" : "arrowRight"} size={22} className="mx-auto mt-1" />
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="wrap mt-24 grid gap-12 border-t border-paper/40 pt-16 md:mt-32 md:grid-cols-12 md:pt-24">
          <div className="md:col-span-4">
            <p className="label opacity-95" data-reveal>
              Contact
            </p>
            <h2 className="mt-4 font-display text-[clamp(32px,3.6vw,56px)] leading-[0.95] font-medium tracking-[-0.035em]" data-reveal>
              Bookings, press &amp; collaborations
            </h2>
            <p className="mt-4 max-w-sm" data-reveal>
              Tell us about the show, story or idea. Based in {artist.basedIn}, playing everywhere.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6" data-reveal>
            <ContactForm />
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
