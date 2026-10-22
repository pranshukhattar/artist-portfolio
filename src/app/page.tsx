import { siteConfig } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

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
              album: { "@type": "MusicAlbum", name: "Paper Suns" },
            },
          ],
        }}
      />
      <main>
        <h1>{siteConfig.name}</h1>
        <p>Paper Suns — coming soon.</p>
      </main>
    </>
  );
}
