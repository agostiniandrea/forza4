# Forza 4

A beautiful, accessible Connect Four game built with Next.js, React and styled-components.

**Live demo → [forza4-three.vercel.app](https://forza4-three.vercel.app)**

---

## Features

- **Three languages** — English, Italian, Thai (route-based i18n via next-intl)
- **AI opponent** — minimax + alpha-beta pruning, three difficulty levels
- **Animated piece drop** — bounce physics, win glow
- **Web Audio API sounds** — synthesized tones, no audio files; win fanfare, draw, reset
- **Confetti burst** on win
- **Fullscreen mode** — one click to go edge-to-edge
- **Single-page layout** — everything fits the viewport, no scroll
- **WCAG 2.2 Level AA** — keyboard navigation (arrow keys + Enter), ARIA grid, screen reader announcements, `prefers-reduced-motion` support

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + styled-components 6.4 |
| i18n | next-intl 4.x |
| Styling | Tailwind v4 + CSS custom properties |
| AI | Minimax with alpha-beta pruning |
| Audio | Web Audio API (synthesized, zero files) |
| Deploy | Vercel |

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The default locale is `en`; navigate to `/it` or `/th` for Italian or Thai.

## Scripts

```bash
yarn dev        # development server
yarn build      # production build
yarn typecheck  # TypeScript — must be zero errors before any PR
yarn lint       # ESLint — must be zero warnings before any PR
yarn test       # Jest unit tests
```

## Architecture

```
app/
  [locale]/       # locale segment — always present
    page.tsx      # main game page
    layout.tsx    # locale metadata + NextIntlClientProvider
  globals.css     # design tokens (CSS custom properties) + keyframes
  layout.tsx      # root layout — fonts, StyledComponentsRegistry, Analytics
  icon.svg        # favicon

components/
  game/           # Board, Piece, GameStatus, GameControls, PlayerIndicator, Confetti
  layout/         # Header, SkipLink
  ui/             # Button, LanguageSwitcher

lib/
  game-engine.ts  # pure board logic — state, moves, win detection
  ai.ts           # minimax AI
  sound-engine.ts # Web Audio synthesis
  breakpoints.ts  # mq.sm/md/lg/xl helpers for styled-components
  ClientOnly.tsx  # hydration guard

hooks/
  useGame.ts      # game state machine (reducer) + AI scheduling
  useSound.ts     # sound toggle wrapper
  useAnnouncer.ts # ARIA live region

messages/         # en.json, it.json, th.json
```

## Adding a language

1. Add `messages/<locale>.json` (copy `en.json` and translate values)
2. Add the locale to `i18n/routing.ts`

## License

MIT
