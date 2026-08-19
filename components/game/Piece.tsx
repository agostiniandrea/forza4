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

// All shading is expressed as a fraction of --cell-size rather than in fixed
// pixels. The board scales from 36px cells on a phone to 92px on a large
// desktop, and absolute blurs that read as plastic at 92px turn to mud at 36px.
const shade = (k: number) => `calc(var(--cell-size) * ${k})`;

const body = (p: Player) => {
  const [hot, base, dark, deep] =
    p === 1
      ? ["#ff8585", "var(--color-p1)", "var(--color-p1-dark)", "#770000"]
      : ["#ffe87c", "var(--color-p2)", "var(--color-p2-dark)", "#7a5500"];
  return css`
    background:
      /* specular highlight */
      radial-gradient(circle at 32% 26%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.14) 28%, rgba(255,255,255,0) 46%),
      /* bounce light off the well floor, opposite the key light */
      radial-gradient(circle at 72% 79%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 36%),
      /* sphere body */
      radial-gradient(circle at 38% 33%, ${hot} 0%, ${base} 38%, ${dark} 70%, ${deep} 100%);
    box-shadow:
      /* contact shadow: seats the disc inside the well instead of on top of it */
      0 ${shade(0.05)} ${shade(0.1)} rgba(0,0,0,0.85),
      0 ${shade(0.02)} ${shade(0.04)} rgba(0,0,0,0.55),
      /* terminator */
      inset 0 ${shade(-0.06)} ${shade(0.15)} rgba(0,0,0,0.5),
      /* light wrapping over the top edge */
      inset 0 ${shade(0.035)} ${shade(0.1)} rgba(255,255,255,0.45),
      /* rim keeps the silhouette crisp against a near-black hole */
      inset 0 0 0 1px rgba(0,0,0,0.28);
    color: ${p === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  `;
};

// Shape, not just hue. Red and yellow converge under protanopia and in
// greyscale, so each player carries a distinct engraved mark: P1 a ring,
// P2 a filled core. Previously both wore the same faint ring, which told
// a colourblind player nothing while still flattening the sphere.
const mark = (p: Player) => css`
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    ${p === 1
      ? css`
          inset: 26%;
          border: ${shade(0.035)} solid rgba(0, 0, 0, 0.22);
          box-shadow:
            inset 0 ${shade(0.012)} ${shade(0.02)} rgba(0, 0, 0, 0.3),
            0 ${shade(0.012)} ${shade(0.02)} rgba(255, 255, 255, 0.16);
        `
      : css`
          inset: 36%;
          background: rgba(0, 0, 0, 0.2);
          box-shadow:
            inset 0 ${shade(0.015)} ${shade(0.025)} rgba(0, 0, 0, 0.32),
            0 ${shade(0.012)} ${shade(0.02)} rgba(255, 255, 255, 0.18);
        `}
  }
`;

const PieceEl = styled.div<PieceProps>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;

  ${({ $player }) => body($player)}
  ${({ $player }) => mark($player)}

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
