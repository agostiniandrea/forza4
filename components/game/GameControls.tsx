"use client";

import styled from "styled-components";
import type { GameMode } from "@/hooks/useGame";
import type { AiDifficulty } from "@/lib/ai";
import Button from "@/components/ui/Button";
import { mq } from "@/lib/breakpoints";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);

  ${mq.md} {
    gap: var(--space-4);
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-1);
`;

const SegmentBtn = styled.button<{ $active: boolean }>`
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: none;
  font-size: var(--font-size-sm);
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all var(--transition-fast);
  background: ${({ $active }) => ($active ? "var(--color-accent)" : "transparent")};
  color: ${({ $active }) => ($active ? "#000" : "var(--color-text-muted)")};

  &:hover {
    color: ${({ $active }) => ($active ? "#000" : "var(--color-text)")};
    background: ${({ $active }) =>
      $active ? "var(--color-accent)" : "rgba(255,255,255,0.05)"};
  }
`;

interface Props {
  mode: GameMode;
  difficulty: AiDifficulty;
  gameInProgress: boolean;
  onSetMode: (mode: GameMode) => void;
  onSetDifficulty: (d: AiDifficulty) => void;
  onReset: () => void;
}

export default function GameControls({ mode, difficulty, gameInProgress, onSetMode, onSetDifficulty, onReset }: Props) {
  return (
    <Container>
      {!gameInProgress && (
        <>
          <Group role="group" aria-label="Game mode">
            <SegmentBtn $active={mode === "2p"} onClick={() => onSetMode("2p")} aria-pressed={mode === "2p"}>
              2 Players
            </SegmentBtn>
            <SegmentBtn $active={mode === "ai"} onClick={() => onSetMode("ai")} aria-pressed={mode === "ai"}>
              vs AI
            </SegmentBtn>
          </Group>

          {mode === "ai" && (
            <Group role="group" aria-label="Difficulty">
              {(["easy", "medium", "hard"] as AiDifficulty[]).map((d) => (
                <SegmentBtn
                  key={d}
                  $active={difficulty === d}
                  onClick={() => onSetDifficulty(d)}
                  aria-pressed={difficulty === d}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </SegmentBtn>
              ))}
            </Group>
          )}
        </>
      )}

      <Button $variant="ghost" $small onClick={onReset}>
        ↺ New game
      </Button>
    </Container>
  );
}
