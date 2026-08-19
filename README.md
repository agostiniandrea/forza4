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
```

## Architecture

```
app/
  page.tsx        # thin server component — renders GamePage
  GamePage.tsx    # root client component — wires game state to UI
  globals.css     # design tokens (CSS custom properties) + keyframes
  layout.tsx      # root layout — fonts, StyledComponentsRegistry, Analytics

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

hooks/
  useGame.ts      # game state machine (useReducer) + AI scheduling
  useSound.ts     # sound toggle + memoized play functions
  useAnnouncer.ts # ARIA live region for screen reader announcements

lib/__tests__/
  game-engine.test.ts  # 25 unit tests covering all pure game logic
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

## License

MIT
