"use client";

import styled, { keyframes } from "styled-components";
import { useTranslations } from "next-intl";
import type { Player } from "@/lib/game-engine";
import type { GameMode } from "@/hooks/useGame";
import Button from "@/components/ui/Button";

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
`;

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-8);
  border-radius: var(--radius-xl);
  background: rgba(13, 16, 32, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 64px rgba(0, 0, 0, 0.7);
  animation: ${floatIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  text-align: center;
`;

const WinText = styled.h2<{ $player?: Player }>`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin: 0;
  background: ${({ $player }) =>
    $player === 1
      ? "linear-gradient(135deg, var(--color-p1-light), var(--color-p1))"
      : $player === 2
      ? "linear-gradient(135deg, var(--color-p2-light), var(--color-p2))"
      : "linear-gradient(135deg, #888, #aaa)"};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 2s linear infinite;
`;

const Emoji = styled.span`
  font-size: 48px;
  line-height: 1;
`;

interface Props {
  winner: Player | null;
  isDraw: boolean;
  mode: GameMode;
  onPlayAgain: () => void;
}

export default function GameStatus({ winner, isDraw, mode, onPlayAgain }: Props) {
  const t = useTranslations("Game");

  if (!winner && !isDraw) return null;

  function getMessage() {
    if (isDraw) return t("draw");
    if (mode === "ai") {
      return winner === 1 ? t("youWin") : t("aiWins");
    }
    return winner === 1 ? t("player1Wins") : t("player2Wins");
  }

  const emoji = isDraw ? "🤝" : winner === 1 ? "🎉" : mode === "ai" ? "🤖" : "🏆";

  return (
    <Overlay role="alert" aria-live="assertive">
      <Emoji aria-hidden="true">{emoji}</Emoji>
      <WinText $player={winner ?? undefined}>{getMessage()}</WinText>
      <Button onClick={onPlayAgain}>{t("playAgain")}</Button>
    </Overlay>
  );
}
