# Forza 4 — Project Context

Next.js 16 · React 19 · TypeScript 6 · styled-components 6.4 · next-intl 4.x · Tailwind v4

**Live:** https://forza4-three.vercel.app  
**GitHub:** https://github.com/agostiniandrea/forza4  
**Vercel project:** andrea-agostinis-projects/forza4

## What this is

A beautiful, accessible Connect Four game with:
- Three languages: English (`/en`), Italian (`/it`), Thai (`/th`) — default locale is `en`
- AI opponent (minimax + alpha-beta pruning, 3 difficulty levels) or 2-player mode
- Web Audio API sounds (synthesized, no files) — distinct tones per player, win fanfare, draw, reset
- Confetti burst on win
- Animated piece drop with bounce physics
- Full WCAG 2.2 keyboard navigation (arrow keys + Enter) and screen reader support

## Architecture

| Concern | Approach |
|---|---|
| Routing | `app/[locale]/` — locale segment always present |
| i18n | next-intl; messages in `messages/en.json`, `messages/it.json`, `messages/th.json` |
| Proxy (middleware) | `proxy.ts` (Next 16 convention, replaces `middleware.ts`) |
| Styling | styled-components for components; Tailwind for layout utilities |
| Design tokens | CSS custom properties in `app/globals.css` |
| Breakpoints | `lib/breakpoints.ts` → `mq.sm/md/lg/xl` for styled-components |
| Hydration | Shared code wrapped in `lib/ClientOnly.tsx` where needed |
| Game logic | `lib/game-engine.ts` — pure functions, zero side effects, fully testable |
| AI | `lib/ai.ts` — minimax with alpha-beta pruning |
| Sounds | `lib/sound-engine.ts` — Web Audio API, synthesized tones |

## Key files

| File | Purpose |
|---|---|
| `lib/game-engine.ts` | Board state, move logic, win detection, draw detection |
| `lib/ai.ts` | Minimax AI — `getBestMove(board, difficulty)` |
| `lib/sound-engine.ts` | `playDrop(player)`, `playWin()`, `playDraw()`, `playReset()` |
| `hooks/useGame.ts` | Game state machine (reducer) + AI scheduling |
| `hooks/useSound.ts` | Sound enabled/disabled toggle wrapper |
| `hooks/useAnnouncer.ts` | ARIA live region for screen reader announcements |
| `components/game/Board.tsx` | 7×6 grid, keyboard handling, column hover |
| `components/game/Piece.tsx` | Disc with drop animation and win glow |
| `components/game/GameStatus.tsx` | Win/draw overlay |
| `components/game/Confetti.tsx` | CSS particle burst on win |
| `app/[locale]/page.tsx` | Main game page — wires everything together |

## Game constants

- Board: 7 columns × 6 rows (ROWS, COLS in `lib/game-engine.ts`)
- Win length: 4 in a row
- Player 1: Red (`--color-p1: #FF3B3B`)
- Player 2: Yellow/Gold (`--color-p2: #FFD700`)
- AI plays as Player 2

## Accessibility standard

Target: **WCAG 2.2 Level AA**

Key decisions:
- Board is `role="grid"`, cells are `role="gridcell"` with `aria-label`
- Arrow keys navigate columns, Enter drops the piece
- `useAnnouncer` injects an `aria-live="assertive"` region for move announcements
- Skip link is first focusable element
- All animations respect `prefers-reduced-motion` via global CSS

## Pre-commit checklist

Before any PR:
```bash
yarn typecheck   # zero TypeScript errors
yarn lint        # zero ESLint warnings
yarn test        # all tests pass
```

## Extending the game

- **New language:** add `messages/<locale>.json` and add the locale to `i18n/routing.ts`
- **New sound:** add a function to `lib/sound-engine.ts` and expose it via `hooks/useSound.ts`
- **New game mode:** extend `GameMode` in `hooks/useGame.ts` and add a segment button in `components/game/GameControls.tsx`
