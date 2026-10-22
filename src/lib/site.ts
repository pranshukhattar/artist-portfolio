export const siteConfig = {
  name: "SLOW RADIO",
  title: "SLOW RADIO — Paper Suns",
  description:
    "Official site of SLOW RADIO: music, visuals, live dates and the Paper Suns release.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  keywords: ["SLOW RADIO", "Paper Suns", "artist portfolio", "music", "live dates"],
  // Replace with real profile URLs
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    spotify: "https://open.spotify.com/",
    bandcamp: "https://bandcamp.com/",
    soundcloud: "https://soundcloud.com/",
  },
  // Geo / local SEO — replace with real values
  geo: {
    region: "US-NY",
    placename: "New York",
    latitude: 40.7128,
    longitude: -74.006,
  },
  routes: ["/"],
};
