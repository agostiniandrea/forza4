"use client";

import styled, { css, keyframes } from "styled-components";
import type { Player } from "@/lib/game-engine";

const dropAnim = keyframes`
  0%   { transform: translateY(-300%) scale(0.8); opacity: 0.6; }
  60%  { transform: translateY(8%) scale(1.04); opacity: 1; }
  80%  { transform: translateY(-3%) scale(0.98); }
  100% { transform: translateY(0) scale(1); opacity: 1; }
`;

const winAnim = keyframes`
  0%, 100% { filter: brightness(1.1) drop-shadow(0 0 8px currentColor); transform: scale(1); }
  50%       { filter: brightness(1.6) drop-shadow(0 0 22px currentColor); transform: scale(1.1); }
`;

interface PieceProps {
  $player: Player;
  $dropping?: boolean;
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
          background: radial-gradient(circle at 35% 35%, var(--color-p1-light), var(--color-p1) 60%, var(--color-p1-dark));
          box-shadow: 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25);
          color: var(--color-p1);
        `
      : css`
          background: radial-gradient(circle at 35% 35%, var(--color-p2-light), var(--color-p2) 60%, var(--color-p2-dark));
          box-shadow: 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
          color: var(--color-p2);
        `}

  ${({ $dropping }) =>
    $dropping &&
    css`
      animation: ${dropAnim} 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    `}

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
  winning?: boolean;
}

export default function Piece({ player, dropping, winning }: Props) {
  return <PieceEl $player={player} $dropping={dropping} $winning={winning} />;
}
