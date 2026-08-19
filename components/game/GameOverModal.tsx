"use client";

import { useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import type { Player } from "@/lib/game-engine";
import Button from "@/components/ui/Button";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  /* Lighter than the setup overlay: the winning line is the reward, so the
     board stays readable behind the card instead of being blurred away. */
  background: rgba(7, 8, 15, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: ${fadeIn} 0.2s ease;
  padding: var(--space-4);
`;

const Card = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border-glow);
  border-radius: var(--radius-xl);
  padding: var(--space-10) clamp(var(--space-6), 8vw, var(--space-12));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  max-width: 420px;
  width: 100%;
  animation: ${slideUp} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 80px rgba(0, 212, 255, 0.06), 0 8px 40px rgba(0, 0, 0, 0.6);
`;

const Title = styled.h2<{ $player?: Player }>`
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  ${({ $player }) =>
    $player
      ? css`
          color: ${$player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
          text-shadow: 0 0 24px ${$player === 1 ? "var(--color-p1-glow)" : "var(--color-p2-glow)"};
        `
      : css`
          color: var(--color-text);
        `}
`;

const Score = styled.p`
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
`;

interface Props {
  winner: Player | null;
  isDraw: boolean;
  names: { 1: string; 2: string };
  scores: { 1: number; 2: number };
  onPlayAgain: () => void;
  onChangePlayers: () => void;
}

export default function GameOverModal({
  winner,
  isDraw,
  names,
  scores,
  onPlayAgain,
  onChangePlayers,
}: Props) {
  const playAgainRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    playAgainRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        onPlayAgain();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPlayAgain]);

  const title = isDraw ? "It's a draw" : `${names[winner!]} wins!`;

  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <Card>
        <Title id="game-over-title" $player={isDraw ? undefined : winner ?? undefined}>
          {title}
        </Title>
        <Score>
          {names[1]} {scores[1]} — {scores[2]} {names[2]}
        </Score>
        <Actions>
          <Button ref={playAgainRef} $variant="primary" onClick={onPlayAgain}>
            Play again
          </Button>
          <Button $variant="ghost" onClick={onChangePlayers}>
            ↺ Change players
          </Button>
        </Actions>
      </Card>
    </Overlay>
  );
}
