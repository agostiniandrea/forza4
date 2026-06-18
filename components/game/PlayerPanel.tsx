"use client";

import styled, { css, keyframes } from "styled-components";
import type { Player } from "@/lib/game-engine";

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.75; transform: scale(0.93); }
`;

const winPulse = keyframes`
  0%, 100% { box-shadow: 0 0 30px var(--glow), 0 0 60px var(--glow); }
  50%       { box-shadow: 0 0 50px var(--glow), 0 0 100px var(--glow); }
`;

const Panel = styled.div<{ $player: Player; $active: boolean; $winner: boolean }>`
  --color: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  --glow: ${({ $player }) => $player === 1 ? "var(--color-p1-glow)" : "var(--color-p2-glow)"};
  --glow-soft: ${({ $player }) => $player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-xl);
  border: 1px solid ${({ $active, $winner }) =>
    $winner || $active ? "var(--color)" : "rgba(255,255,255,0.08)"};
  background: ${({ $winner, $active }) =>
    $winner || $active
      ? "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 100%)"
      : "var(--color-surface)"};
  box-shadow: ${({ $active, $winner }) =>
    $winner
      ? "0 0 40px var(--glow), 0 0 80px var(--glow-soft), inset 0 0 30px rgba(255,255,255,0.03)"
      : $active
      ? "0 0 20px var(--glow-soft), inset 0 0 20px rgba(255,255,255,0.02)"
      : "none"};
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal), background var(--transition-normal);
  height: 100%;
  min-height: 320px;

  ${({ $winner }) => $winner && css`
    animation: ${winPulse} 2s ease-in-out infinite;
  `}
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  justify-content: center;
`;

const Star = styled.span<{ $player: Player; $lit: boolean }>`
  font-size: 12px;
  color: ${({ $player, $lit }) =>
    $lit
      ? $player === 1 ? "var(--color-p1)" : "var(--color-p2)"
      : "var(--color-text-dim)"};
  transition: color var(--transition-normal);
`;

const Name = styled.h2<{ $player: Player }>`
  margin: 0;
  font-size: clamp(var(--font-size-xl), 2.5vw, var(--font-size-2xl));
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
`;

const BigDisc = styled.div<{ $player: Player; $active: boolean; $winner: boolean }>`
  width: clamp(88px, 10vw, 128px);
  height: clamp(88px, 10vw, 128px);
  border-radius: 50%;
  background: ${({ $player }) =>
    $player === 1
      ? "radial-gradient(circle at 32% 28%, var(--color-p1-light), var(--color-p1), var(--color-p1-dark))"
      : "radial-gradient(circle at 32% 28%, var(--color-p2-light), var(--color-p2), var(--color-p2-dark))"};
  box-shadow: ${({ $player, $active, $winner }) =>
    $winner
      ? `0 0 40px ${$player === 1 ? "var(--color-p1-glow)" : "var(--color-p2-glow)"}, 0 6px 24px rgba(0,0,0,0.5)`
      : $active
      ? `0 0 20px ${$player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"}, 0 4px 16px rgba(0,0,0,0.4)`
      : "0 4px 16px rgba(0,0,0,0.4)"};
  animation: ${({ $active, $winner }) => ($active && !$winner) ? css`${pulse} 1.4s ease-in-out infinite` : "none"};
  transition: box-shadow var(--transition-normal);
`;

const ScoreBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
`;

const ScoreLabel = styled.span`
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted);
`;

const ScoreNumber = styled.span<{ $player: Player }>`
  font-size: clamp(56px, 7vw, 96px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
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
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid ${({ $player }) => $player === 1 ? "rgba(255,59,59,0.3)" : "rgba(255,215,0,0.3)"};
  background: ${({ $player }) => $player === 1 ? "rgba(255,59,59,0.08)" : "rgba(255,215,0,0.08)"};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity var(--transition-normal);
  min-height: 30px;
`;

const TurnDot = styled.span<{ $player: Player }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  flex-shrink: 0;
`;

const TurnText = styled.span`
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text);
  white-space: nowrap;
`;

interface Props {
  player: Player;
  name: string;
  score: number;
  isActive: boolean;
  isWinner: boolean;
  isDraw: boolean;
  turnLabel: string;
}

export default function PlayerPanel({ player, name, score, isActive, isWinner, isDraw, turnLabel }: Props) {
  const isGameOver = isWinner || isDraw;

  return (
    <Panel $player={player} $active={isActive} $winner={isWinner}>
      <Stars>
        <Star $player={player} $lit={isWinner}>★</Star>
        <Name $player={player}>{name}</Name>
        <Star $player={player} $lit={isWinner}>★</Star>
      </Stars>

      <BigDisc $player={player} $active={isActive} $winner={isWinner} />

      <ScoreBlock>
        <ScoreLabel>Score</ScoreLabel>
        <ScoreNumber $player={player}>
          {String(score).padStart(2, "0")}
        </ScoreNumber>
      </ScoreBlock>

      <TurnBadge $player={player} $visible={!isGameOver && !!turnLabel}>
        <TurnDot $player={player} />
        <TurnText>{turnLabel || "​"}</TurnText>
      </TurnBadge>
    </Panel>
  );
}
