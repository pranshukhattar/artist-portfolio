// Provenance of every media asset on the site. Update when real assets land.
export const credits = [
  {
    asset: "public/landing_page_hero.png",
    use: "Hero artwork; crops of it stand in for release covers",
    source: "Supplied by client",
    note: "Contains real record-label text (Bee Gees, Polydor, Blondie). Clear rights or replace before public launch.",
  },
  {
    asset: "public/audio/*.wav",
    use: "Player audio for the four singles",
    source: "Synthesized by scripts/build-placeholder-audio.mjs",
    note: "Placeholder. Replace with the artist's masters or previews.",
  },
  {
    asset: "src/components/ui/icon-data.ts",
    use: "Interface icons and platform marks",
    source: "Solar (CC BY 4.0) and Simple Icons (CC0) via Iconify",
    note: "Platform marks link only to the artist's own profiles.",
  },
];
