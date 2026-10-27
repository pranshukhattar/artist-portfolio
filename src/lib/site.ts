// The artist's performing name, used everywhere on the site.
const ARTIST_NAME = "FretByte";
// The person behind the project.
const PERSON_NAME = "Bhushan Kumar";

export const siteConfig = {
  name: ARTIST_NAME,
  person: PERSON_NAME,
  title: `${ARTIST_NAME} — Sounds for the inbetween`,
  description: `Official site of ${ARTIST_NAME}, the music project of ${PERSON_NAME}, a music producer and live performer from Mumbai: music, videos and the story so far.`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",
  keywords: [ARTIST_NAME, PERSON_NAME, "Summer Days", "music producer", "Mumbai", "live shows", "artist portfolio"],
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
