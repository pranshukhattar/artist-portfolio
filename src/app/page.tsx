import { siteConfig } from "@/lib/site";
import { releases, tracks } from "@/content/music";
import { JsonLd } from "@/components/JsonLd";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Music } from "@/components/sections/Music";
import { Videos } from "@/components/sections/Videos";
import { Shows } from "@/components/sections/Shows";
import { About } from "@/components/sections/About";
import { Concept } from "@/components/sections/Concept";
import { BackCover } from "@/components/sections/BackCover";

const album = releases.find((r) => r.type === "album")!;

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${siteConfig.url}/#website`,
              url: siteConfig.url,
              name: siteConfig.name,
              description: siteConfig.description,
              inLanguage: "en",
            },
            {
              "@type": "MusicGroup",
              "@id": `${siteConfig.url}/#artist`,
              name: siteConfig.name,
              url: siteConfig.url,
              sameAs: Object.values(siteConfig.social),
              location: {
                "@type": "Place",
                name: siteConfig.geo.placename,
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: siteConfig.geo.latitude,
                  longitude: siteConfig.geo.longitude,
                },
              },
              album: {
                "@type": "MusicAlbum",
                name: album.title,
                datePublished: String(album.year),
                numTracks: album.trackIds.length,
                track: album.trackIds.map((id) => ({
                  "@type": "MusicRecording",
                  name: tracks.find((t) => t.id === id)!.title,
                })),
              },
            },
          ],
        }}
      />
      {/* One page, told as a record: intro → the record → the pictures → the road → the person → back cover. */}
      <main id="main">
        <Hero />
        <Ticker />
        <Music />
        <Videos />
        <Shows />
        <About />
        <Concept />
        <BackCover />
      </main>
      <ChapterRail />
    </>
  );
}
