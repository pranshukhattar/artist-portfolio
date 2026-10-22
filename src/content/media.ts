// Videos and shows from the v2 mockup. All placeholder until real data lands.
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

export type Show = {
  date: string; // ISO date
  city: string;
  country: string;
  venue: string;
  tickets?: string;
};

// Venues are the mockup's placeholders. Dates moved to 2027 so they read as upcoming.
export const shows: Show[] = [
  { date: "2027-06-12", city: "Ibiza", country: "ES", venue: "Ocean Beach Club" },
  { date: "2027-06-20", city: "Amsterdam", country: "NL", venue: "Ziggo Dome" },
  { date: "2027-07-05", city: "New York", country: "US", venue: "Brooklyn Mirage" },
  { date: "2027-07-19", city: "Tokyo", country: "JP", venue: "Zepp DiverCity" },
  { date: "2027-08-02", city: "São Paulo", country: "BR", venue: "Tomorrowland Brasil" },
];
