"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import { videos, type Video } from "@/content/media";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Chapter, ChapterTitle } from "@/components/motion/Chapter";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { button } from "@/components/ui/button";

export function Videos() {
  const root = useRef<HTMLDivElement>(null);
  const [featured, ...rest] = videos;

  // The featured frame opens from a small window to full width, like house lights dimming.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-screen]",
        { clipPath: "inset(14% 18% 14% 18% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: "[data-screen]", start: "top 90%", end: "top 25%", scrub: 1 },
        },
      );
      gsap.fromTo(
        "[data-screen] [data-poster]",
        { scale: 1.25 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-screen]", start: "top 90%", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <Chapter id="videos" theme="dark" chapter="02 — The pictures" label="Videos" className="pt-24 pb-32 md:pt-36 md:pb-48">
      <div ref={root} className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <ChapterTitle index="02" story="The pictures">
            <MaskedReveal lines={["Videos"]} className="mt-4 font-display text-[clamp(64px,11vw,184px)] leading-[0.85] font-medium tracking-[-0.05em]" />
          </ChapterTitle>
          <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className={button("outlinePaper", "self-start md:self-auto")} data-reveal>
            <Icon name="youtube" size={18} />
            All videos
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>

        <div data-screen className="mt-14 md:mt-20">
          <VideoCard video={featured} featured />
        </div>

        <ul className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2">
          {rest.map((video) => (
            <li key={video.id} data-reveal>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

function VideoCard({ video, featured = false }: { video: Video; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const { pause } = usePlayer();
  const name = `${video.title} — ${video.kind}`;

  if (playing && video.youtubeId) {
    return (
      <div className="relative aspect-video overflow-hidden bg-ink-soft">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={name}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  const content = (
    <>
      <div data-poster className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]">
        <Cover crop={video.poster} alt="" className="size-full" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.15)_0%,rgba(17,17,17,0.35)_55%,rgba(17,17,17,0.85)_100%)]" />
      <span
        aria-hidden="true"
        className={`absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/10 ring-1 ring-paper/60 backdrop-blur-sm transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-paper group-hover:text-ink ${featured ? "size-20 md:size-24" : "size-14"}`}
      >
        <Icon name="play" size={featured ? 30 : 22} />
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
        <span>
          <span className={`block font-display font-medium tracking-[-0.03em] ${featured ? "text-[clamp(28px,4vw,56px)] leading-none" : "text-2xl"}`}>{video.title}</span>
          <span className="label mt-2 block opacity-70">
            {video.kind} · {video.duration}
          </span>
        </span>
        {!video.youtubeId && (
          <span className="label inline-flex items-center gap-1.5 opacity-70">
            YouTube <Icon name="arrowUpRight" size={16} />
          </span>
        )}
      </span>
    </>
  );

  const frame = "group relative block aspect-video w-full overflow-hidden bg-ink-soft text-left text-paper";

  // With an ID the video plays here; without one the card links out to YouTube.
  return video.youtubeId ? (
    <button
      type="button"
      onClick={() => {
        pause();
        setPlaying(true);
      }}
      aria-label={`Play ${name}`}
      data-cursor="Watch"
      className={frame}
    >
      {content}
    </button>
  ) : (
    <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${name} on YouTube (opens in a new tab)`} data-cursor="Watch" className={frame}>
      {content}
    </a>
  );
}
