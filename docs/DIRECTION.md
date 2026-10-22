# Art Direction — Artist Portfolio

> Status: **approved direction, v2** (2026‑10‑23). Stages 1–6 built; stage 7 (polish) in progress. Copy and components follow mockup v2. Layout ideas also come from mockup v1.
> Driving skill: `build-awwwards-quality-sites`. Supporting skills listed per section.
> Artist name is a single placeholder (`src/content/artist.ts`) until confirmed. Neither "Bee Gees" (mockup v1) nor
> "Martin Garrix" (mockup v2) is used, because both are real artists.

---

## 0. The art style

**Analog collage / mixed‑media zine.** Torn and layered printed vinyl and labels, sun‑faded print colors (tomato
red, orange, mustard, teal, sky blue) on near‑black, a warm off‑white paper ground, handwritten marginalia, and a clean
modern grotesk on top so it reads editorial, not retro‑kitsch.

## 1. Visual thesis

**"A sonic journey through time, places and feeling."** This line comes from the mockup's design‑concept panel.

The page plays like one record, with each chapter as a track: **Intro → Music → Videos → Shows → About → Back cover**.
The persistent player is the turntable that stays with you while you scroll. Dark (ink) and light (paper) chapters
alternate, like flipping the record.

## 2. Section sequence

| # | Section | Content (from mockup v2) | Motion |
|---|---|---|---|
| 0 | **Preloader** | Spinning disc + 000→100 counter | ≤1.6s, first visit only, skipped under reduced motion |
| 1 | **Hero** (ink) | "Sounds for the inbetween" · "New single out now." · LISTEN NOW → · socials bottom‑left · `01 / 04` with ← → | Intro timeline; image parallax on scroll; ←/→ pans the collage to a new disc and swaps the featured single |
| — | **Collage strip + marquee** | Torn‑edge collage band with a slow text ticker | One marquee on the page |
| 2 | **Music** (paper) | Tabs ALL / SINGLES / ALBUMS · singles list · album *Fragments* (2023 · 14 tracks) with full tracklist · LISTEN NOW | ★ **Needle drop**: a disc scales from the strip into the album cover (pinned, scrubbed, desktop only) |
| 3 | **Videos** (ink) | Featured *Summer Days — Official Video* + *Suburbia*, *S.O.R* | Clip‑path open into the featured video; thumbnails fade up |
| 4 | **Shows** (paper) | 5 dated rows with TICKETS buttons | Hairline draws, rows stagger in |
| 5 | **About** (paper/ink split) | Bio from the mockup, "More about →", marginalia "a little louder" | Masked headline, slow image parallax |
| 6 | **Design concept** | "A sonic journey through time, places and feeling." with collage | ★ Horizontal collage drift (scrubbed) |
| 7 | **More Music Soon** (ink) | JOIN MAILING LIST, email field | Footer reveal |
| 8 | **Footer / Contact** | Contact form (UI only), socials, "play more" vinyl sticker | — |
| — | **Player** | Compact bar → expanded player (mockup's mobile player screen) | Slides in after the first play |
| — | **Mobile tab bar** | HOME · MUSIC · SHOWS · ABOUT (mockup's mobile view) | Static, with the active tab tracking scroll |

★ = the only two big scroll moments. Everything else stays restrained.

Handwritten marginalia (Caveat): one per section at most, always `aria-hidden`, never real content.
Lines: *"you're just a sad song"*, *"same sky, different sound"*, *"a little louder"*, *"play more →"*.

## 3. Hero

- **Asset: `public/landing_page_hero.png`.** This is the client's chosen hero and stays as is (decision 2026‑10‑23).
  Rendered with `next/image` (priority, AVIF/WebP). The 2.9MB PNG is converted automatically.
  *Note on file: the artwork includes real label text ("Bee Gees", "Polydor", "Blondie"). Clear the rights or swap it
  before a public launch.*
- Left ink gradient for type contrast. Headline is Space Grotesk 700, 3 lines, about 7.5vw.
- **`01 / 04` control**: cycles the four singles (Summer Days, Suburbia, S.O.R, Ananke). Each step pans and zooms the
  collage to a different disc (transform only, 0.9s `power3.inOut`) and updates "New single" and the LISTEN NOW target.
  Arrow keys work when the control has focus. It never auto‑advances.
- Static first frame: image, headline and CTA are all visible without JS.

## 4. Typography

| Role | Font |
|---|---|
| Headlines | **Space Grotesk** 500/700, tracking −0.04em |
| Body / UI | **Inter** 400/500/600, labels 10–11px uppercase +0.16em |
| Marginalia | **Caveat** 500/600, decorative only |

Loaded with `next/font/google`.

## 5. Color

| Token | Hex | Role |
|---|---|---|
| `ink` | `#111111` | Text, dark chapters, primary buttons |
| `paper` | `#EDE8DD` (hi `#F4F0E7`, lo `#E2DCCE`) | Light chapters |
| `red` | `#E44B3C` | Primary accent, "PLAY NOW" accent button, active states |
| `orange` | `#F38C35` | Secondary accent |
| `sand` | `#E0C48A` | Disc centers, highlights |
| `teal` | `#3A989A` | Links, tickets |
| `sky` | `#5BA3C9` | Info, collage accent |
| `grey` | `#C7C7BE` | Hairlines, disabled |

Button states follow the mockup: ink filled, outlined, disabled (grey), and accent (red).

## 6. Music + video playback

- **Plays on site and links out.** Every track and video has an in‑site play control and external links (Spotify,
  Apple Music, YouTube, SoundCloud) when they exist.
- **One global audio engine** (`PlayerProvider`, a single `<audio>` element). Playback continues while scrolling.
  Compact bar with expanded player, prev/next queue, seek, volume, Media Session (lock‑screen controls), never autoplay.
- Tracks without an audio file show their external links only. There's no fake play button.
- **Videos**: a poster facade, and the YouTube iframe loads on click. Starting a video pauses the audio. Each video also
  links out to YouTube.
- **Placeholder media**: generated ambient tones (`public/audio/*.wav`), clearly marked in `src/content/credits.ts`.
  Covers and posters are crops of the hero collage. Replace them with real assets.

## 7. Motion system

- **GSAP + ScrollTrigger** for choreography. **Lenis** is the only smooth‑scroll engine. **No Three.js**, because the
  flat print aesthetic doesn't need it.
- Tokens: `power3.out` · scrub 1 · text 0.8–1.0s · word stagger 0.035s · y offset 32px · no bounce or elastic.
- Skills: `masked-reveal` (all headings), `cinematic-scroll-storytelling` (Lenis, preloader, footer reveal),
  `gsap-scrolltrigger-storytelling` (needle drop, collage drift), `gsap` (hero intro, cleanup), `marquee-loop` (one
  ticker), `progressive-blur` (under the player bar only), `beautiful-shadows` (player, cards, buttons), `tailwindcss`.
- Skipped: `staggered-word-reveal` and `animation-on-scroll`, because they duplicate the systems above.
- Reduced motion: no Lenis, pinning, scrubbing, preloader or disc spin, and final states render immediately.

## 8. Contact & newsletter

**UI only for now.** The form has full client‑side states (validation, submitting, success, error) and isn't connected to
any provider. A `TODO` marks where a Server Action plugs in.

## 9. Location

Based in **Mumbai, India**. The nav shows a live `IST` clock. SEO geo is set to Mumbai.

## 10. Build stages

1. **Foundation**: deps, Tailwind tokens, fonts, Lenis + GSAP, content files, icons.
2. **Hero, nav, preloader, mobile tab bar, collage strip and marquee**.
3. **Player**: global audio, bar, expanded player, Media Session.
4. **Music** with the needle drop.
5. **Videos and Shows**.
6. **About, design concept, More Music Soon, footer and contact form**.
7. **Polish and validation**: reduced motion, no‑JS, keyboard, mobile, Lighthouse, production build.

## 11. Open questions

1. **Artist name**: still a placeholder.
