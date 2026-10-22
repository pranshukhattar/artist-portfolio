# Artist Portfolio

Next.js (App Router, TypeScript) site. `artist_portfolio_dummy.html` is the static design reference.

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm install
npm run dev
```

SEO lives in `src/lib/site.ts` (config), `src/app/layout.tsx` (metadata, OG, Twitter, geo tags),
`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx` and JSON-LD in `src/components/JsonLd.tsx`.
