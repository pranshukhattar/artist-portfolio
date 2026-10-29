// Snapshots from the road.
// PLACEHOLDER: there are no real photos yet, so each print shows a crop of the
// hero collage. Add the artist's photos to public/gallery/ and set `src` (plus
// a real `alt` and caption); `src` always wins over the stand-in crop.
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
    crop: { x: 72, y: 24, zoom: 3 },
    alt: "Placeholder: collage detail",
    caption: "where the songs start",
    meta: "Studio · Mumbai",
    shape: "portrait",
  },
  {
    id: "soundcheck",
    crop: { x: 40, y: 40, zoom: 3 },
    alt: "Placeholder: collage detail",
    caption: "soundcheck, 4pm",
    meta: "Live · 2024",
    shape: "landscape",
  },
  {
    id: "crowd",
    crop: { x: 33, y: 88, zoom: 3.2 },
    alt: "Placeholder: collage detail",
    caption: "a little louder",
    meta: "Live · 2023",
    shape: "square",
  },
  {
    id: "notes",
    crop: { x: 92, y: 30, zoom: 2.2 },
    alt: "Placeholder: collage detail",
    caption: "notes for Summer Days",
    meta: "Studio · 2024",
    shape: "portrait",
  },
  {
    id: "night",
    crop: { x: 20, y: 14, zoom: 2 },
    alt: "Placeholder: collage detail",
    caption: "after the show",
    meta: "On the road · 2023",
    shape: "landscape",
  },
];
