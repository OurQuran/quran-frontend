# Quran Frontend

Next.js (App Router) + React + TypeScript + Tailwind/shadcn UI for browsing the Quran, its qiraat, tags and reading books. It consumes the API from `../quran-backend`.

## Setup

```bash
npm install
# .env
NEXT_PUBLIC_BASE_API=<backend API base URL>
npm run dev
```

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
```

No test runner is configured.

## Notes

- Pages live under `src/app/[locale]/…` with locales `en | ar | ku`; `src/proxy.ts` handles locale redirects and auth-protected routes.
- The backend sends precompiled HTML (ayah text, tajweed spans, qiraat diffs); tajweed `tajweed-*` classes are styled in `src/index.css`.
- Quran and Kurdish fonts are shipped in `public/fonts/`.
