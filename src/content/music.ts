// Placeholder catalogue taken from the v2 mockup. Durations are the mockup's
// listed runtimes; the audio files are generated placeholders (see credits.ts).

export type Platform = "spotify" | "appleMusic" | "youtube" | "soundcloud";

/** A crop of the hero collage used as stand-in cover art. Focus is in % of the image. */
export type Crop = { x: number; y: number; zoom: number };

export type Track = {
  id: string;
  title: string;
  duration: string;
  audio?: string;
  links: Partial<Record<Platform, string>>;
};

export type Release = {
  id: string;
  title: string;
  type: "single" | "album";
  year: number;
  trackIds: string[];
  cover: Crop;
};

// Replace with per-track URLs; profile links stand in for now.
const links = {
  spotify: "https://open.spotify.com/",
  appleMusic: "https://music.apple.com/",
  youtube: "https://youtube.com/",
};

const track = (id: string, title: string, duration: string, audio?: string): Track => ({
  id,
  title,
  duration,
  audio,
  links,
});

export const tracks: Track[] = [
  track("lost-in-static", "Lost in Static", "3:24"),
  track("summer-days", "Summer Days", "3:42", "/audio/summer-days.wav"),
  track("suburbia", "Suburbia", "3:18", "/audio/suburbia.wav"),
  track("sor", "S.O.R", "2:46", "/audio/sor.wav"),
  track("ananke", "Ananke", "4:02", "/audio/ananke.wav"),
  track("floating-points", "Floating Points", "3:11"),
  track("you-and-me", "You & Me", "3:56"),
  track("last-light", "Last Light", "4:20"),
  track("paper-planes", "Paper Planes", "3:33"),
  track("echoes", "Echoes", "2:48"),
  track("tides", "Tides", "3:12"),
  track("better-days", "Better Days", "3:45"),
  track("gravity", "Gravity", "3:28"),
  track("fragments", "Fragments", "5:02"),
];

export const releases: Release[] = [
  { id: "summer-days", title: "Summer Days", type: "single", year: 2024, trackIds: ["summer-days"], cover: { x: 72, y: 27, zoom: 3.4 } },
  { id: "suburbia", title: "Suburbia", type: "single", year: 2023, trackIds: ["suburbia"], cover: { x: 40, y: 45, zoom: 2.8 } },
  { id: "sor", title: "S.O.R", type: "single", year: 2021, trackIds: ["sor"], cover: { x: 33, y: 88, zoom: 3.2 } },
  { id: "ananke", title: "Ananke", type: "single", year: 2021, trackIds: ["ananke"], cover: { x: 8, y: 50, zoom: 2.4 } },
  {
    id: "fragments",
    title: "Fragments",
    type: "album",
    year: 2023,
    trackIds: tracks.map((t) => t.id),
    cover: { x: 92, y: 30, zoom: 2.4 },
  },
];

export const singles = releases.filter((r) => r.type === "single");

export const getTrack = (id: string) => tracks.find((t) => t.id === id);

/** The release a track is best represented by (its single if one exists). */
export const releaseForTrack = (id: string) =>
  singles.find((r) => r.trackIds.includes(id)) ?? releases.find((r) => r.trackIds.includes(id))!;

/** Tracks that can play on-site, in catalogue order. */
export const playableTrackIds = tracks.filter((t) => t.audio).map((t) => t.id);
