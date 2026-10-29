// The artist's catalogue: singles only for now. Titles, years and durations are
// from the v2 mockup; audio files are generated placeholders (see credits.ts).
// PLACEHOLDER: genres, notes and credits — replace with the artist's own words.

import { siteConfig } from "@/lib/site";

export type Platform = "spotify" | "appleMusic" | "youtube" | "soundcloud";

/** A crop of the hero collage used as stand-in cover art. Focus is in % of the image. */
export type Crop = { x: number; y: number; zoom: number };

export type Track = {
  id: string;
  title: string;
  duration: string;
  genre: string;
  audio?: string;
  /** Where the best part starts, in seconds: the "best part" button plays from here. */
  hook?: number;
  links: Partial<Record<Platform, string>>;
};

export type Credit = { role: string; name: string };

export type Release = {
  id: string;
  title: string;
  type: "single" | "ep" | "album";
  year: number;
  trackIds: string[];
  cover: Crop;
  /** A line or two behind the song, shown on the featured sleeve. */
  note: string;
  credits: Credit[];
};

// Replace with per-track URLs; profile links stand in for now.
const links = {
  spotify: "https://open.spotify.com/",
  appleMusic: "https://music.apple.com/",
  youtube: "https://youtube.com/",
};

const track = (id: string, title: string, duration: string, genre: string, audio?: string, hook?: number): Track => ({
  id,
  title,
  duration,
  genre,
  audio,
  hook,
  links,
});

export const tracks: Track[] = [
  // PLACEHOLDER genres, guessed from the song notes below.
  // PLACEHOLDER hooks: the stand-in clips are 24s long; set these to each song's real best part.
  track("summer-days", "Summer Days", "3:42", "Synth-pop", "/audio/summer-days.wav", 6),
  track("suburbia", "Suburbia", "3:18", "Indie electronic", "/audio/suburbia.wav", 8),
  track("sor", "S.O.R", "2:46", "Electronic", "/audio/sor.wav", 4),
  track("ananke", "Ananke", "4:02", "Ambient", "/audio/ananke.wav", 7),
];

const selfCredits: Credit[] = [
  { role: "Written by", name: siteConfig.name },
  { role: "Produced by", name: siteConfig.name },
];

// Newest first: the first release is the one the hero and the sleeve feature.
export const releases: Release[] = [
  {
    id: "summer-days",
    title: "Summer Days",
    type: "single",
    year: 2024,
    trackIds: ["summer-days"],
    cover: { x: 72, y: 27, zoom: 3.4 },
    note: "A song for the long, slow end of a day — warm synths, a heartbeat of a drum, and the feeling of not wanting it to finish.",
    credits: selfCredits,
  },
  {
    id: "suburbia",
    title: "Suburbia",
    type: "single",
    year: 2023,
    trackIds: ["suburbia"],
    cover: { x: 40, y: 45, zoom: 2.8 },
    note: "About the places in between — late trains, empty streets, and the quiet that comes after the city switches off.",
    credits: selfCredits,
  },
  {
    id: "sor",
    title: "S.O.R",
    type: "single",
    year: 2021,
    trackIds: ["sor"],
    cover: { x: 33, y: 88, zoom: 3.2 },
    note: "Restless and fast. Built from a single loop that refused to leave, then pushed until it became a song.",
    credits: selfCredits,
  },
  {
    id: "ananke",
    title: "Ananke",
    type: "single",
    year: 2021,
    trackIds: ["ananke"],
    cover: { x: 8, y: 50, zoom: 2.4 },
    note: "Named for the idea of things that have to happen. Slow, wide and patient — the first song that felt like home.",
    credits: selfCredits,
  },
];

// The record that slides out of a sleeve (hero on phones, the Music chapter): a black disc from the collage.
export const vinylCrop: Crop = { x: 40, y: 45, zoom: 2.8 };

export const singles = releases.filter((r) => r.type === "single");

export const getTrack = (id: string) => tracks.find((t) => t.id === id);

export const getRelease = (id: string) => releases.find((r) => r.id === id);

/** The release a track is best represented by. */
export const releaseForTrack = (id: string) => releases.find((r) => r.trackIds.includes(id))!;

/** Tracks that can play on-site, in catalogue order. */
export const playableTrackIds = tracks.filter((t) => t.audio).map((t) => t.id);
