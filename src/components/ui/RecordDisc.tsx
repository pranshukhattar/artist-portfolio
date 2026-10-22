import type { CSSProperties } from "react";
import type { Crop } from "@/content/music";
import { Cover } from "./Cover";

type Props = { crop: Crop; spinning?: boolean; className?: string; spin?: string };

/**
 * A record cut from a crop of the collage. Position and size come from
 * `className` on the outer element; the spin lives on the inner one so GSAP
 * can move the outer element without fighting the CSS animation.
 */
export function RecordDisc({ crop, spinning = false, className = "", spin = "5s" }: Props) {
  const style = { "--spin": spin, "--spin-state": spinning ? "running" : "paused" } as CSSProperties;
  return (
    <div className={`rounded-full ${className}`}>
      <div className="spin relative size-full overflow-hidden rounded-full" style={style}>
        <Cover crop={crop} alt="" className="size-full" />
        <span className="absolute inset-[42%] rounded-full bg-ink ring-1 ring-paper/20" />
      </div>
    </div>
  );
}
