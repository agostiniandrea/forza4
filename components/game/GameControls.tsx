"use client";

import styled from "styled-components";
import type { GameMode } from "@/hooks/useGame";
import type { AiDifficulty } from "@/lib/ai";
import Button from "@/components/ui/Button";
import { mq } from "@/lib/breakpoints";

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
  background: rgba(7, 8, 15, 0.6);
  backdrop-filter: blur(8px);

  ${mq.lg} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-8);
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  min-width: 0;

  ${mq.lg} {
    align-items: center;
  }
`;

const GroupLabel = styled.span`
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-dim);
`;

const SegmentGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-1);
`;

const SegBtn = styled.button<{ $active: boolean }>`
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: none;
  font-size: var(--font-size-sm);
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
  transition: all var(--transition-fast);
  background: ${({ $active }) => ($active ? "var(--color-accent)" : "transparent")};
  color: ${({ $active }) => ($active ? "#000" : "var(--color-text-muted)")};
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      color: ${({ $active }) => ($active ? "#000" : "var(--color-text)")};
      background: ${({ $active }) => $active ? "var(--color-accent)" : "rgba(255,255,255,0.05)"};
    }
  }

  ${mq.lg} {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }
`;

const CenterAction = styled.div`
  flex-shrink: 0;

  ${mq.lg} {
    order: 0;
  }
`;

interface Props {
  mode: GameMode;
  difficulty: AiDifficulty;
  isGameOver: boolean;
  onSetMode: (mode: GameMode) => void;
  onSetDifficulty: (d: AiDifficulty) => void;
  onChangeSetup: () => void;
}

export default function GameControls({ mode, difficulty, isGameOver, onSetMode, onSetDifficulty, onChangeSetup }: Props) {
  return (
    <Bar>
      <ControlGroup>
        <GroupLabel>Mode</GroupLabel>
        <SegmentGroup role="group" aria-label="Game mode">
          <SegBtn $active={mode === "ai"} onClick={() => onSetMode("ai")} aria-pressed={mode === "ai"}>
            vs AI
          </SegBtn>
          <SegBtn $active={mode === "2p"} onClick={() => onSetMode("2p")} aria-pressed={mode === "2p"}>
            2 Players
          </SegBtn>
        </SegmentGroup>
      </ControlGroup>

      <CenterAction>
        <Button $variant="primary" onClick={onChangeSetup} style={{ width: "100%" }}>
          {isGameOver ? "Play again" : "↺ New game"}
        </Button>
      </CenterAction>

      <ControlGroup>
        <GroupLabel>Difficulty</GroupLabel>
        <SegmentGroup role="group" aria-label="Difficulty">
          {(["easy", "medium", "hard"] as AiDifficulty[]).map((d) => (
            <SegBtn key={d} $active={difficulty === d} onClick={() => onSetDifficulty(d)} aria-pressed={difficulty === d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </SegBtn>
          ))}
        </SegmentGroup>
      </ControlGroup>
    </Bar>
  );
}
