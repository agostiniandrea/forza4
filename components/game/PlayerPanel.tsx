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

const Panel = styled.div<{ $player: Player; $active: boolean; $winner: boolean; $side?: "left" | "right" }>`
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
  border: 2px solid ${({ $active, $winner }) =>
    $winner || $active ? "var(--color)" : "var(--glow-soft)"};
  background: linear-gradient(160deg,
    rgba(255,255,255,0.03) 0%,
    var(--color-surface) 50%,
    rgba(0,0,0,0.35) 100%);
  box-shadow: ${({ $active, $winner }) =>
    $winner
      ? "0 0 16px var(--glow), 0 0 40px var(--glow), 0 0 80px var(--glow-soft), inset 0 0 40px rgba(0,0,0,0.5)"
      : $active
      ? "0 0 10px var(--glow-soft), 0 0 28px var(--glow-soft), inset 0 0 30px rgba(0,0,0,0.5)"
      : "0 0 8px var(--glow-soft), inset 0 0 20px rgba(0,0,0,0.4)"};
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal), background var(--transition-normal);
  height: 100%;
  min-height: 320px;
  transform: ${({ $side }) =>
    $side === "left" ? "perspective(1000px) rotateY(8deg)"
    : $side === "right" ? "perspective(1000px) rotateY(-8deg)"
    : "none"};
  transform-origin: center center;

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
      ? `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55) 0%, transparent 40%),
         radial-gradient(circle at 35% 30%, #ff8585 0%, var(--color-p1) 38%, var(--color-p1-dark) 70%, #770000 100%)`
      : `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.6) 0%, transparent 40%),
         radial-gradient(circle at 35% 30%, #ffe87c 0%, var(--color-p2) 38%, var(--color-p2-dark) 70%, #7a5500 100%)`};
  box-shadow: ${({ $player, $active, $winner }) =>
    $winner
      ? `0 0 50px ${$player === 1 ? "var(--color-p1-glow)" : "var(--color-p2-glow)"},
         0 8px 30px rgba(0,0,0,0.7),
         inset 0 -4px 12px rgba(0,0,0,0.45),
         inset 0 3px 8px rgba(255,255,255,0.5)`
      : $active
      ? `0 0 28px ${$player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"},
         0 6px 22px rgba(0,0,0,0.6),
         inset 0 -4px 12px rgba(0,0,0,0.4),
         inset 0 3px 8px rgba(255,255,255,0.45)`
      : `0 6px 20px rgba(0,0,0,0.6),
         inset 0 -4px 12px rgba(0,0,0,0.4),
         inset 0 3px 8px rgba(255,255,255,0.38)`};
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
  side?: "left" | "right";
}

export default function PlayerPanel({ player, name, score, isActive, isWinner, isDraw, turnLabel, side }: Props) {
  const isGameOver = isWinner || isDraw;

  return (
    <Panel $player={player} $active={isActive} $winner={isWinner} $side={side}>
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
