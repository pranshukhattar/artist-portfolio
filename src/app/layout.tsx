import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PlayerBar } from "@/components/player/PlayerBar";
import { PlayerSheet } from "@/components/player/PlayerSheet";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { PRELOAD_KEY } from "@/lib/preload";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { Nav } from "@/components/layout/Nav";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-space-grotesk" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  // Geo meta tags
  other: {
    "geo.region": siteConfig.geo.region,
    "geo.placename": siteConfig.geo.placename,
    "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
  },
  // verification: { google: "..." },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before paint: marks JS as available and decides whether the
// first-visit preloader should show (never under reduced motion).
const headScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('${PRELOAD_KEY}'))d.classList.add('preload')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <PlayerProvider>
          <Preloader />
          <SmoothScroll />
          <Nav />
          <CursorFollower />
          {children}
          <PlayerBar />
          <PlayerSheet />
          <MobileTabBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
