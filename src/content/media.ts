// Videos from the v2 mockup. Placeholder until real data lands.
import type { Crop } from "./music";

export type Video = {
  id: string;
  title: string;
  kind: string;
  duration: string;
  /** YouTube video ID. When set, the video plays inline; otherwise the card links out. */
  youtubeId?: string;
  poster: Crop;
};

export const videos: Video[] = [
  // Poster crops stay clear of the collage's label text; replace with real stills.
  { id: "summer-days", title: "Summer Days", kind: "Official Video", duration: "3:42", poster: { x: 35, y: 30, zoom: 1.15 } },
  { id: "suburbia", title: "Suburbia", kind: "Official Video", duration: "3:18", poster: { x: 72, y: 20, zoom: 2.4 } },
  { id: "sor", title: "S.O.R", kind: "Official Video", duration: "2:46", poster: { x: 33, y: 88, zoom: 3.2 } },
];

