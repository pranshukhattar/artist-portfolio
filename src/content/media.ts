// Videos from the v2 mockup. Placeholder until real data lands.

export type Video = {
  id: string;
  title: string;
  kind: string;
  duration: string;
  /** YouTube video ID. When set, the video plays inline; otherwise the card links out. */
  youtubeId?: string;
  /** Poster still, under /public. */
  poster: string;
  /** Where to keep the poster's focus when it's cropped to 16:9 (CSS object-position). */
  posterPosition?: string;
};

export const videos: Video[] = [
  // PLACEHOLDER posters (Unsplash, see credits.ts): replace with stills from the real videos.
  { id: "summer-days", title: "Summer Days", kind: "Official Video", duration: "3:42", poster: "/photos/video-summer-days.jpg", posterPosition: "50% 60%" },
  { id: "suburbia", title: "Suburbia", kind: "Official Video", duration: "3:18", poster: "/photos/video-suburbia.jpg", posterPosition: "50% 62%" },
  { id: "sor", title: "S.O.R", kind: "Official Video", duration: "2:46", poster: "/photos/video-sor.jpg", posterPosition: "50% 35%" },
];

