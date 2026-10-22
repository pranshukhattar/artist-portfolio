import Image from "next/image";
import hero from "../../../public/landing_page_hero.png";
import type { Crop } from "@/content/music";

type Props = {
  crop: Crop;
  alt: string;
  className?: string;
  priority?: boolean;
};

// Crops zoom 1.5–3.5× into the collage, so every crop needs the full-resolution
// source. A single fixed size also means all crops share one cached file.
const FULL = "1920px";

/**
 * Shift (in % of the frame) that moves the focus point toward the centre after
 * scaling around it, clamped so the image never pulls away from an edge.
 */
function centreOffset(focus: number, zoom: number) {
  const min = 100 - focus - zoom * (100 - focus);
  const max = zoom * focus - focus;
  return Math.max(min, Math.min(max, 50 - focus));
}

/** Stand-in cover art: a crop of the hero collage, centred on `crop`. */
export function Cover({ crop, alt, className = "", priority }: Props) {
  const tx = centreOffset(crop.x, crop.zoom);
  const ty = centreOffset(crop.y, crop.zoom);
  return (
    <div className={`relative overflow-hidden bg-ink-soft ${className}`}>
      <Image
        src={hero}
        alt={alt}
        fill
        sizes={FULL}
        priority={priority}
        placeholder="blur"
        className="object-cover"
        style={{
          objectPosition: `${crop.x}% ${crop.y}%`,
          transform: `translate(${tx}%, ${ty}%) scale(${crop.zoom})`,
          transformOrigin: `${crop.x}% ${crop.y}%`,
        }}
      />
    </div>
  );
}
