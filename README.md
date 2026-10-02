# Forza 4

A beautiful, accessible Connect Four game built with Next.js, React and styled-components.

**Live demo → [forza4-game.vercel.app](https://forza4-game.vercel.app)**

---

## Features

- **AI opponent** — minimax + alpha-beta pruning, three difficulty levels (Easy / Medium / Hard); always takes immediate wins and blocks immediate threats
- **Animated piece drop** — token falls from above the grid with bounce physics; win glow on winning pieces
- **Web Audio API sounds** — synthesized tones, zero audio files; distinct tones per player, win fanfare, draw, reset
- **Confetti burst** on win
- **Fullscreen mode** — one click to go edge-to-edge
- **Single-page layout** — everything fits the viewport, no scroll
- **WCAG 2.2 Level AA** — keyboard navigation (arrow keys + Enter), ARIA grid, screen reader announcements, `prefers-reduced-motion` support
- **End-to-end tested** — Playwright suite covering setup, gameplay, AI mode, accessibility (axe-core) and mobile, gating every PR in CI
- **SEO & hardening** — robots.txt, sitemap, web manifest, dynamic Open Graph/Twitter card image, JSON-LD structured data, baseline security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + styled-components 6.4 |
| Styling | Tailwind v4 + CSS custom properties |
| AI | Minimax with alpha-beta pruning |
| Audio | Web Audio API (synthesized, zero files) |
| Deploy | Vercel |

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
yarn dev        # development server
yarn build      # production build
yarn typecheck  # TypeScript — must be zero errors before any PR
yarn lint       # ESLint — must be zero warnings before any PR
yarn test       # Jest unit tests
yarn e2e        # Playwright end-to-end tests (requires `yarn build` or `yarn dev` reachable)
yarn e2e:ui     # Playwright UI mode — step through tests interactively
yarn e2e:report # open the last HTML report
```

## Architecture

```
app/
  page.tsx        # thin server component — renders GamePage + JSON-LD structured data
  GamePage.tsx    # root client component — wires game state to UI
  globals.css     # design tokens (CSS custom properties) + keyframes
  layout.tsx      # root layout — fonts, StyledComponentsRegistry, Analytics, metadataBase
  robots.ts       # robots.txt (allow all, points to sitemap)
  sitemap.ts      # sitemap.xml
  manifest.ts     # web app manifest
  opengraph-image.tsx  # dynamic OG image (next/og)
  twitter-image.tsx    # dynamic Twitter card image (same artwork as OG)

components/
  game/           # Board, Piece, GameOverModal, NameEntry, PlayerPanel, PlayerIndicator, Confetti
  layout/         # Header, SkipLink
  ui/             # Button

lib/
  game-engine.ts  # pure board logic — state, moves, win detection (fully tested)
  ai.ts           # minimax AI with alpha-beta pruning
  sound-engine.ts # Web Audio synthesis
  breakpoints.ts  # mq.sm/md/lg/xl helpers for styled-components
  ClientOnly.tsx  # hydration guard via useSyncExternalStore
  registry.tsx    # styled-components SSR registry for Next.js App Router
  og-image.tsx    # shared ImageResponse renderer used by opengraph-image.tsx and twitter-image.tsx

hooks/
  useGame.ts      # game state machine (useReducer) + AI scheduling
  useSound.ts     # sound toggle + memoized play functions
  useAnnouncer.ts # ARIA live region for screen reader announcements

lib/__tests__/
  game-engine.test.ts  # 25 unit tests covering all pure game logic

e2e/
  support/board.ts          # shared helpers — dropInColumn, completeSetup, playSequence
  setup.spec.ts              # name entry, mode/difficulty selection
  gameplay.spec.ts           # 2-player drops, wins, play again / change players
  ai-mode.spec.ts            # AI replies, blocks immediate threats
  accessibility.spec.ts      # axe-core scans + focus management
  header-controls.spec.ts    # sound toggle, fullscreen, new game
  smoke.spec.ts               # mobile viewport smoke test
```

## Game logic

- Board: **7 columns × 6 rows**, win length 4
- Player 1: Red (`#FF3B3B`) — human in AI mode
- Player 2: Gold (`#FFD700`) — AI or second human
- AI depth: Easy = 2, Medium = 4, Hard = 7 (plus immediate win/block checks at all depths)

## Accessibility

Target: **WCAG 2.2 Level AA**

- Board is `role="grid"`, cells are `role="gridcell"` with `aria-label`
- Arrow keys navigate columns, Enter drops the piece
- `useAnnouncer` injects an `aria-live="assertive"` region for move announcements
- Skip link is first focusable element
- All animations respect `prefers-reduced-motion`

## SEO & security headers

- `robots.ts` / `sitemap.ts` / `manifest.ts` — standard Next.js file-convention routes, no extra config needed
- `opengraph-image.tsx` / `twitter-image.tsx` — generated at request time via `next/og`, sharing one renderer in `lib/og-image.tsx`
- JSON-LD (`VideoGame` schema) in `app/page.tsx` for richer search/AI-crawler context
- `next.config.ts` sets baseline security headers on every response: HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`
- `middleware.ts` sets the Content-Security-Policy header with a fresh nonce on every request (`script-src 'self' 'nonce-...' 'strict-dynamic'`, `style-src 'self' 'unsafe-inline'` — the latter required by styled-components' SSR registry). This has to be per-request middleware rather than a static header: the App Router injects its own inline hydration/streaming scripts on every page, and without a nonce a static `script-src` blocks them, breaking all client-side interactivity while the page still looks fine (it was server-rendered). Next.js auto-detects the nonce from this header and applies it to its own injected scripts — see [Next's CSP guide](https://nextjs.org/docs/app/guides/content-security-policy). In development only, `'unsafe-eval'` is added too — `next dev`'s Fast Refresh needs it to `eval()` component signatures for hot reload, and without it HMR throws mid-registration and leaves some event handlers half-wired. Production builds don't ship that code path, so the production CSP never gets `'unsafe-eval'`
- No cookie banner: `@vercel/analytics` / `@vercel/speed-insights` don't use cookies or store personal data (see [Vercel's privacy docs](https://vercel.com/docs/analytics/privacy-policy))

## License

MIT
