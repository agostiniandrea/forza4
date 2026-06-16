"use client";

import styled, { keyframes } from "styled-components";
import type { Player } from "@/lib/game-engine";
import type { GameMode } from "@/hooks/useGame";
import Button from "@/components/ui/Button";

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-xl);
  background: rgba(13, 16, 32, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04);
  animation: ${floatIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  width: 100%;
  max-width: 480px;
`;

const Emoji = styled.span`
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
`;

const WinText = styled.h2<{ $player?: Player }>`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  flex: 1;
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

interface Props {
  winner: Player | null;
  isDraw: boolean;
  mode: GameMode;
  onPlayAgain: () => void;
}

export default function GameStatus({ winner, isDraw, mode, onPlayAgain }: Props) {
  if (!winner && !isDraw) return null;

  function getMessage() {
    if (isDraw) return "It's a draw!";
    if (mode === "ai") return winner === 1 ? "You win!" : "AI wins!";
    return winner === 1 ? "Red wins!" : "Yellow wins!";
  }

  const emoji = isDraw ? "🤝" : winner === 1 ? "🎉" : mode === "ai" ? "🤖" : "🏆";

  return (
    <Card role="alert" aria-live="assertive">
      <Emoji aria-hidden="true">{emoji}</Emoji>
      <WinText $player={winner ?? undefined}>{getMessage()}</WinText>
      <Button $variant="ghost" $small onClick={onPlayAgain}>Play again</Button>
    </Card>
  );
}
