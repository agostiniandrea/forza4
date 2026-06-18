"use client";

import styled, { css, keyframes } from "styled-components";
import type { Player } from "@/lib/game-engine";

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(0.92); }
`;

const Container = styled.div`
  display: flex;
  align-items: stretch;
  gap: var(--space-3);
  width: 100%;
`;

const PlayerCard = styled.div<{ $player: Player; $active: boolean; $winner: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
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
      : "var(--color-surface)"};
  box-shadow: ${({ $active, $winner, $player }) =>
    ($winner || $active)
      ? `0 0 20px ${$player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"}`
      : "none"};
  transition: border-color var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal);
  min-height: 110px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const Disc = styled.div<{ $player: Player; $active: boolean }>`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $player }) =>
    $player === 1
      ? "radial-gradient(circle at 35% 35%, var(--color-p1-light), var(--color-p1))"
      : "radial-gradient(circle at 35% 35%, var(--color-p2-light), var(--color-p2))"};
  animation: ${({ $active }) => $active ? css`${pulse} 1.2s ease-in-out infinite` : "none"};
`;

const PlayerName = styled.span<{ $player: Player }>`
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
`;

const Score = styled.span<{ $player: Player }>`
  font-size: clamp(36px, 10vw, 52px);
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  text-shadow: ${({ $player }) =>
    $player === 1
      ? "0 0 20px var(--color-p1-glow)"
      : "0 0 20px var(--color-p2-glow)"};
`;

const TurnBadge = styled.div<{ $player: Player; $visible: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  background: ${({ $player }) => $player === 1 ? "rgba(255,59,59,0.12)" : "rgba(255,215,0,0.12)"};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  min-height: 22px;
  transition: opacity var(--transition-normal);
`;

const TurnDot = styled.span<{ $player: Player }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
`;

const TurnText = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text);
  white-space: nowrap;
`;

interface Props {
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  scores: { 1: number; 2: number };
  names: { 1: string; 2: string };
  turnLabels: { 1: string; 2: string };
}

export default function PlayerIndicator({ currentPlayer, winner, isDraw, scores, names, turnLabels }: Props) {
  const isGameOver = !!winner || isDraw;

  return (
    <Container>
      {([1, 2] as Player[]).map((p) => {
        const isActive = !isGameOver && currentPlayer === p;
        const isWinner = winner === p;
        const label = isWinner ? "Winner!" : isDraw ? "Draw" : turnLabels[p];
        const badgeVisible = isWinner || isDraw || (isActive && !!label);

        return (
          <PlayerCard
            key={p}
            $player={p}
            $active={isActive}
            $winner={isWinner}
            aria-label={`${names[p]}, score ${scores[p]}`}
            aria-current={isActive ? "true" : undefined}
          >
            <TopRow>
              <Disc $player={p} $active={isActive} />
              <PlayerName $player={p}>{names[p]}</PlayerName>
            </TopRow>

            <Score $player={p} aria-hidden="true">
              {String(scores[p]).padStart(2, "0")}
            </Score>

            <TurnBadge $player={p} $visible={badgeVisible}>
              <TurnDot $player={p} />
              <TurnText>{label || "​"}</TurnText>
            </TurnBadge>
          </PlayerCard>
        );
      })}
    </Container>
  );
}
