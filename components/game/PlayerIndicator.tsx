"use client";

import styled, { css, keyframes } from "styled-components";
import { useTranslations } from "next-intl";
import type { Player } from "@/lib/game-engine";
import type { GameMode } from "@/hooks/useGame";
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

const PlayerCard = styled.div<{ $player: Player; $active: boolean; $winner: boolean; $rotate: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid
    ${({ $player, $active, $winner }) =>
      $winner
        ? $player === 1
          ? "var(--color-p1)"
          : "var(--color-p2)"
        : $active
        ? $player === 1
          ? "rgba(255, 59, 59, 0.5)"
          : "rgba(255, 215, 0, 0.5)"
        : "var(--color-border)"};
  background: ${({ $player, $active, $winner }) =>
    $winner
      ? $player === 1
        ? "var(--color-p1-glow-soft)"
        : "var(--color-p2-glow-soft)"
      : $active
      ? $player === 1
        ? "rgba(255, 59, 59, 0.08)"
        : "rgba(255, 215, 0, 0.08)"
      : "transparent"};
  transition: border-color var(--transition-normal), background var(--transition-normal), box-shadow var(--transition-normal), transform var(--transition-slow);
  min-width: 100px;

  ${({ $rotate }) =>
    $rotate &&
    css`
      @media (max-width: 767px) {
        transform: rotate(180deg);
      }
    `}

  ${({ $active, $winner, $player }) =>
    $active &&
    !$winner &&
    css`
      box-shadow: 0 0 20px ${$player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"};
    `}
`;

const Disc = styled.div<{ $player: Player; $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $player }) =>
    $player === 1
      ? "radial-gradient(circle at 35% 35%, var(--color-p1-light), var(--color-p1))"
      : "radial-gradient(circle at 35% 35%, var(--color-p2-light), var(--color-p2))"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${({ $active }) =>
    $active
      ? css`${pulse} 1.2s ease-in-out infinite`
      : "none"};
`;

const PlayerName = styled.span<{ $player: Player }>`
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $player }) =>
    $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
`;

const Score = styled.span`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
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
  mode: GameMode;
  isAiThinking: boolean;
}

export default function PlayerIndicator({
  currentPlayer,
  winner,
  scores,
  mode,
  isAiThinking,
}: Props) {
  const t = useTranslations("Game");

  function name(p: Player) {
    if (mode === "ai") return p === 1 ? t("you") : t("ai");
    return p === 1 ? t("player1") : t("player2");
  }

  return (
    <Container>
      {([1, 2] as Player[]).map((p, i) => (
        <>
          {i === 1 && (
            <Separator key="sep" aria-hidden="true">
              {t("vs")}
            </Separator>
          )}
          <PlayerCard
            key={p}
            $player={p}
            $active={!winner && currentPlayer === p}
            $winner={winner === p}
            $rotate={mode === "2p" && p === 1}
            aria-current={!winner && currentPlayer === p ? "true" : undefined}
          >
            <Disc $player={p} $active={!winner && currentPlayer === p} />
            <PlayerName $player={p}>{name(p)}</PlayerName>
            <Score aria-label={`${name(p)} ${t("score")}: ${scores[p]}`}>
              {scores[p]}
            </Score>
            <span style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-muted)",
              visibility: isAiThinking && p === 2 ? "visible" : "hidden",
            }}>
              ...
            </span>
          </PlayerCard>
        </>
      ))}
    </Container>
  );
}
