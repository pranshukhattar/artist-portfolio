// Site copy from the v2 mockup.
export const artist = {
  tagline: ["Sounds", "for the", "inbetween"],
  // PLACEHOLDER photos (Unsplash, see credits.ts): swap in the artist's own.
  // The polaroid tucked against the hero headline.
  portrait: {
    src: "/photos/polaroid.jpg",
    position: "30% 50%",
    alt: "Hands on an electric guitar in low light",
  },
  // The photo beside the About story.
  photo: {
    src: "/photos/about.jpg",
    alt: "A DJ in a red hoodie and headphones behind the decks, lit orange",
  },
  concept: "A sonic journey through time, places and feeling.",
  about:
    "Music has always been a way for me to make sense of the noise. This project is a collection of moments, sounds and emotions — not a fixed identity, but a constant search.",
  basedIn: "Mumbai, India",
  disciplines: ["Production", "Live", "Composition"],
  // The prelude band between the hero and the music.
  facts: [
    { label: "New single", value: "Summer Days — out now" },
    { label: "Catalogue", value: "4 singles · 2021–2024" },
    { label: "Based in", value: "Mumbai, India" },
  ],
  // The sound in words: rolls past under the hero so first-time visitors know what the music is.
  // PLACEHOLDER: replace with the artist's own genres and moods.
  sound: ["Electronic", "Ambient", "Guitar loops", "Late-night", "Analog textures", "Made in Mumbai"],
  // PLACEHOLDER: the artist's real milestones go here. Rows that point at a
  // single play it; the last row is what's next.
  milestones: [
    { year: "2019", title: "Where it started", text: "First sketches and loops, made late at night between Mumbai's noise and its quiet." },
    { year: "2021", title: "S.O.R & Ananke", text: "The first two singles go out into the world.", trackId: "sor" },
    { year: "2022", title: "From headphones to rooms", text: "The first live sets — the songs, rebuilt for a crowd." },
    { year: "2023", title: "Suburbia", text: "A single about the places in between.", trackId: "suburbia" },
    { year: "2024", title: "Summer Days", text: "The newest single — out now.", trackId: "summer-days" },
    { year: "Next", title: "More music soon", text: "New songs are in the works.", upcoming: true },
  ] as Milestone[],
};

export type Milestone = {
  year: string;
  title: string;
  text: string;
  trackId?: string;
  upcoming?: boolean;
};

export const nav = [
  { label: "Music", href: "#music" },
  { label: "Videos", href: "#videos" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];
