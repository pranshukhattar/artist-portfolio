import { siteConfig } from "@/lib/site";
import { singles } from "@/content/music";
import { JsonLd } from "@/components/JsonLd";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Music } from "@/components/sections/Music";
import { Videos } from "@/components/sections/Videos";
import { Journey } from "@/components/sections/Journey";
import { Gallery } from "@/components/sections/Gallery";
import { About } from "@/components/sections/About";
import { BackCover } from "@/components/sections/BackCover";

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
              track: singles.map((single) => ({
                "@type": "MusicRecording",
                name: single.title,
                datePublished: String(single.year),
              })),
            },
          ],
        }}
      />
      {/* One page, told as a record: intro → the record → the pictures → the road so far → snapshots → the person → back cover. */}
      <main id="main">
        <Hero />
        <Ticker />
        <Music />
        <Videos />
        <Journey />
        <Gallery />
        <About />
        <BackCover />
      </main>
      <ChapterRail />
    </>
  );
}
