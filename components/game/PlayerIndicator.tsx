"use client";

import { Fragment } from "react";
import styled, { css, keyframes } from "styled-components";
import type { Player } from "@/lib/game-engine";
import { mq } from "@/lib/breakpoints";

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(0.92); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;

  ${mq.md} {
    gap: var(--space-6);
  }
`;

const PlayerCard = styled.div<{ $player: Player; $active: boolean; $winner: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid
    ${({ $player, $active, $winner }) =>
      $winner
        ? $player === 1 ? "var(--color-p1)" : "var(--color-p2)"
        : $active
        ? $player === 1 ? "rgba(255, 59, 59, 0.5)" : "rgba(255, 215, 0, 0.5)"
        : "var(--color-border)"};
  background: ${({ $player, $active, $winner }) =>
    $winner
      ? $player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"
      : $active
      ? $player === 1 ? "rgba(255, 59, 59, 0.08)" : "rgba(255, 215, 0, 0.08)"
      : "transparent"};
  transition: border-color var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);

  ${({ $active, $winner, $player }) =>
    $active && !$winner && css`
      box-shadow: 0 0 20px ${$player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"};
    `}
`;

const Disc = styled.div<{ $player: Player; $active: boolean }>`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $player }) =>
    $player === 1
      ? "radial-gradient(circle at 35% 35%, var(--color-p1-light), var(--color-p1))"
      : "radial-gradient(circle at 35% 35%, var(--color-p2-light), var(--color-p2))"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${({ $active }) => $active ? css`${pulse} 1.2s ease-in-out infinite` : "none"};
`;

const Score = styled.span`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
  min-width: 1.5ch;
  text-align: center;
`;

const Separator = styled.span`
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
  font-weight: 300;
  align-self: center;
`;

interface Props {
  currentPlayer: Player;
  winner: Player | null;
  scores: { 1: number; 2: number };
}

export default function PlayerIndicator({ currentPlayer, winner, scores }: Props) {
  return (
    <Container>
      {([1, 2] as Player[]).map((p, i) => (
        <Fragment key={p}>
          {i === 1 && <Separator aria-hidden="true">vs</Separator>}
          <PlayerCard
            $player={p}
            $active={!winner && currentPlayer === p}
            $winner={winner === p}
            aria-current={!winner && currentPlayer === p ? "true" : undefined}
            aria-label={`Player ${p}, score ${scores[p]}`}
          >
            <Disc $player={p} $active={!winner && currentPlayer === p} />
            <Score aria-hidden="true">{scores[p]}</Score>
          </PlayerCard>
        </Fragment>
      ))}
    </Container>
  );
}
