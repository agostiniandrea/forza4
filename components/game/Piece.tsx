"use client";

import styled, { css, keyframes } from "styled-components";
import type { Player } from "@/lib/game-engine";

// Drop distance is set as a CSS custom property per-piece based on target row,
// so the token always falls from just above the top of the grid.
const dropAnim = keyframes`
  0%   { transform: translateY(var(--drop-start)) scale(0.9); opacity: 0.7; }
  70%  { transform: translateY(0) scale(1.04); opacity: 1; }
  83%  { transform: translateY(calc(var(--cell-size) * -0.04)) scale(0.98); }
  92%  { transform: translateY(calc(var(--cell-size) * 0.02)) scale(1.01); }
  100% { transform: translateY(0) scale(1); opacity: 1; }
`;

const winAnim = keyframes`
  0%, 100% { filter: brightness(1.1) drop-shadow(0 0 8px currentColor); transform: scale(1); }
  50%       { filter: brightness(1.6) drop-shadow(0 0 22px currentColor); transform: scale(1.1); }
`;

interface PieceProps {
  $player: Player;
  $dropping?: boolean;
  $row?: number;
  $winning?: boolean;
}

const PieceEl = styled.div<PieceProps>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;

  ${({ $player }) =>
    $player === 1
      ? css`
          background:
            radial-gradient(circle at 30% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 42%),
            radial-gradient(circle at 38% 33%, #ff8585 0%, var(--color-p1) 38%, var(--color-p1-dark) 70%, #770000 100%);
          box-shadow:
            0 5px 16px rgba(0,0,0,0.8),
            0 2px 6px rgba(0,0,0,0.5),
            inset 0 -3px 9px rgba(0,0,0,0.45),
            inset 0 2px 6px rgba(255,255,255,0.5);
          color: var(--color-p1);
        `
      : css`
          background:
            radial-gradient(circle at 30% 26%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 42%),
            radial-gradient(circle at 38% 33%, #ffe87c 0%, var(--color-p2) 38%, var(--color-p2-dark) 70%, #7a5500 100%);
          box-shadow:
            0 5px 16px rgba(0,0,0,0.8),
            0 2px 6px rgba(0,0,0,0.5),
            inset 0 -3px 9px rgba(0,0,0,0.4),
            inset 0 2px 6px rgba(255,255,255,0.55);
          color: var(--color-p2);
        `}

  ${({ $dropping, $row = 0 }) => {
    const rows = Math.max(0.5, $row);
    return $dropping && css`
      --drop-start: calc(-1 * ${rows} * (var(--cell-size) + var(--cell-gap)));
      animation: ${dropAnim} calc(0.4s + ${$row} * 0.07s) cubic-bezier(0.15, 1.0, 0.4, 1) forwards;
    `;
  }}

  ${({ $winning }) =>
    $winning &&
    css`
      animation: ${winAnim} 0.9s ease-in-out infinite;
      z-index: 2;
    `}

  /* Colorblind pattern */
  &::after {
    content: "";
    position: absolute;
    inset: 22%;
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }
`;

interface Props {
  player: Player;
  dropping?: boolean;
  droppingRow?: number;
  winning?: boolean;
}

export default function Piece({ player, dropping, droppingRow, winning }: Props) {
  return (
    <PieceEl
      $player={player}
      $dropping={dropping}
      $row={droppingRow}
      $winning={winning}
    />
  );
}
