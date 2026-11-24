# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Next.js UI for the Quran project. It consumes the Laravel API in `../quran-backend` (see its `CLAUDE.md` for the API, response envelope and the Tajweed/Qiraat HTML it emits). Workspace overview: `../CLAUDE.md`.

Next.js App Router + React + TypeScript + Tailwind + shadcn/Radix UI. No test runner is configured.

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # next lint
```

- **API base**: `NEXT_PUBLIC_BASE_API` in `.env` (gitignored; only `NEXT_PUBLIC_*` reaches the browser). Single axios instance in `src/api/axiosInstance.ts` attaches `Authorization: Bearer <token>` from localStorage and types the `{ success, message, data, error }` envelope (`IApiResponse`, plus `IPaginationResponse` / `IMeta` for paging).
- **i18n routing**: every page lives under `src/app/[locale]/…` with locales `en | ar | ku` (`src/i18n-config.ts`, default `en`; translations in `src/translation/{en,ar,ku}.json`). `src/proxy.ts` (the Next request interceptor) redirects locale-less URLs and enforces auth via the `token` cookie: `dashboard` and `bookmarks` require it; `login`/`signup` redirect away when logged in. Add new protected sections to `protectedRoutes` there.
- **Page pattern**: each route is a server `page.tsx` (metadata/SEO, `JsonLd`) plus a `*Client.tsx` that does the interactive fetching. `src/services/dataService.ts` wraps fetches in React `cache()` so `generateMetadata` and the page share one API call.
- **Data layer**: React Query wrappers in `src/react-query/` (`useGet`, `useAdd`, `useUpdate`, `useDelete`, `useInfiniteScroll`, `auth/*`); Zustand stores in `src/store/` (auth, qiraat list, edition, audio, surah ids).
- **Rendering Quran text**: the backend sends precompiled HTML (ayah text, tajweed spans, qiraat diff markup) and the frontend injects it with `dangerouslySetInnerHTML` (`AyahCard.tsx`, `MushafPageClient.tsx`). Selecting a non-base qiraat shows the differences + explanation alongside Hafs.
- **Fonts**: Quran fonts are shipped locally in `public/fonts/quran/` (`quran_font_1..5`, `hafs/`, Noto Naskh fallback) and Kurdish fonts in `public/fonts/kurdish/`, wired up in `src/lib/fonts.ts`. A glyph missing from these shows as tofu — this is exactly what `qiraat:audit-text` checks on the backend side.
- **Books page**: `reading-books/books/BooksClient.tsx` has a Kurdish/Arabic edition switch and sends `language=ku|ar` to `GET /books` (default: `ar` for the Arabic UI locale, otherwise `ku`).
- **Main routes**: `surah/[id]`, `surahs/page/[pageNumber]` (mushaf pages), `tags`, `advanced-search`, `bookmarks`, `reading-books/{books,qiraats}/[id]`, `site-index`, and an admin `dashboard/{tags,unapproved,users}`.
