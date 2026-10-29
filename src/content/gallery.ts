// Snapshots from the road.
// PLACEHOLDER: these are Unsplash stand-ins (see credits.ts), not the artist's
// photos. Replace the files in public/gallery/ (plus `alt` and caption); `src`
// always wins over the collage crop, which is only a fallback.
import type { Crop } from "./music";

export type Photo = {
  id: string;
  /** Path under /public, e.g. "/gallery/studio-01.jpg". */
  src?: string;
  /** Stand-in crop of the collage, used until `src` is set. */
  crop: Crop;
  alt: string;
  caption: string;
  meta: string;
  shape: "portrait" | "landscape" | "square";
};

export const photos: Photo[] = [
  {
    id: "studio",
    src: "/gallery/studio.jpg",
    crop: { x: 72, y: 24, zoom: 3 },
    alt: "A home studio: a condenser mic, monitors and a desk by the window",
    caption: "where the songs start",
    meta: "Studio · Mumbai",
    shape: "portrait",
  },
  {
    id: "soundcheck",
    src: "/gallery/soundcheck.jpg",
    crop: { x: 40, y: 40, zoom: 3 },
    alt: "Black-and-white: a guitarist at the mic under stage lights",
    caption: "soundcheck, 4pm",
    meta: "Live · 2024",
    shape: "landscape",
  },
  {
    id: "crowd",
    src: "/gallery/crowd.jpg",
    crop: { x: 33, y: 88, zoom: 3.2 },
    alt: "Silhouettes of a crowd with hands raised in stage haze",
    caption: "a little louder",
    meta: "Live · 2023",
    shape: "square",
  },
  {
    id: "notes",
    src: "/gallery/notes.jpg",
    crop: { x: 92, y: 30, zoom: 2.2 },
    alt: "An open notebook and pen beside headphones and coffee on a wooden desk",
    caption: "notes for Summer Days",
    meta: "Studio · 2024",
    shape: "portrait",
  },
  {
    id: "night",
    src: "/gallery/night.jpg",
    crop: { x: 20, y: 14, zoom: 2 },
    alt: "A city street at night, neon signs and traffic lights on wet tarmac",
    caption: "after the show",
    meta: "On the road · 2023",
    shape: "landscape",
  },
];
