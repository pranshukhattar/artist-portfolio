// Placeholder artist name — replace once the real performing name is confirmed.
const ARTIST_NAME = "SLOW RADIO";

export const siteConfig = {
  name: ARTIST_NAME,
  title: `${ARTIST_NAME} — Sounds for the inbetween`,
  description: `Official site of ${ARTIST_NAME}, a music producer and live performer from Mumbai: music, videos, shows and the Fragments album.`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",
  timeZone: "Asia/Kolkata",
  keywords: [ARTIST_NAME, "Fragments", "music producer", "Mumbai", "live shows", "artist portfolio"],
  // Replace with real profile URLs
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    spotify: "https://open.spotify.com/",
    tiktok: "https://tiktok.com/",
    soundcloud: "https://soundcloud.com/",
  },
  geo: {
    region: "IN-MH",
    placename: "Mumbai",
    latitude: 19.076,
    longitude: 72.8777,
  },
  routes: ["/"],
};
