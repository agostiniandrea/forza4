# Forza 4 — Project Context

Next.js 16 · React 19 · TypeScript 6 · styled-components 6.4 · Tailwind v4

**Live:** https://forza4-game.vercel.app  
**GitHub:** https://github.com/agostiniandrea/forza4  
**Vercel project:** andrea-agostinis-projects/forza4

## What this is

A beautiful, accessible Connect Four game with:
- English only — the three-locale setup and next-intl were removed
- AI opponent (minimax + alpha-beta pruning, 3 difficulty levels) or 2-player mode
- Web Audio API sounds (synthesized, no files) — distinct tones per player, win fanfare, draw, reset
- Confetti burst on win
- Animated piece drop with bounce physics
- Full WCAG 2.2 keyboard navigation (arrow keys + Enter) and screen reader support

## Architecture

| Concern | Approach |
|---|---|
| Routing | Single route at `app/page.tsx` — no locale segment, no middleware |
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
| `components/game/GameOverModal.tsx` | End-of-game dialog — result, score, rematch or back to setup |
| `components/game/NameEntry.tsx` | Setup screen — names, mode and difficulty all live here |
| `components/game/PlayerPanel.tsx` | Desktop side panel (disc, score, turn badge) |
| `components/game/PlayerIndicator.tsx` | Mobile score row |
| `components/game/Confetti.tsx` | CSS particle burst on win |
| `app/GamePage.tsx` | Main game page — wires everything together |

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

- **New sound:** add a function to `lib/sound-engine.ts` and expose it via `hooks/useSound.ts`
- **New game mode:** extend `GameMode` in `hooks/useGame.ts` and add a segment button in `components/game/NameEntry.tsx` — the setup screen is the only place mode and difficulty are chosen
