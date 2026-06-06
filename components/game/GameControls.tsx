"use client";

import styled from "styled-components";
import { useTranslations } from "next-intl";
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
  background: ${({ $active }) =>
    $active ? "var(--color-accent)" : "transparent"};
  color: ${({ $active }) => ($active ? "#000" : "var(--color-text-muted)")};

  &:hover {
    color: ${({ $active }) => ($active ? "#000" : "var(--color-text)")};
    background: ${({ $active }) =>
      $active ? "var(--color-accent)" : "rgba(255,255,255,0.05)"};
  }
`;

const Label = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: var(--space-2);
`;

interface Props {
  mode: GameMode;
  difficulty: AiDifficulty;
  onSetMode: (mode: GameMode) => void;
  onSetDifficulty: (d: AiDifficulty) => void;
  onReset: () => void;
}

export default function GameControls({
  mode,
  difficulty,
  onSetMode,
  onSetDifficulty,
  onReset,
}: Props) {
  const t = useTranslations("Mode");
  const tg = useTranslations("Game");

  return (
    <Container>
      <Group role="group" aria-label={t("label")}>
        <SegmentBtn
          $active={mode === "2p"}
          onClick={() => onSetMode("2p")}
          aria-pressed={mode === "2p"}
        >
          {t("twoPlayers")}
        </SegmentBtn>
        <SegmentBtn
          $active={mode === "ai"}
          onClick={() => onSetMode("ai")}
          aria-pressed={mode === "ai"}
        >
          {t("vsAi")}
        </SegmentBtn>
      </Group>

      {mode === "ai" && (
        <Group role="group" aria-label={t("difficulty")}>
          {(["easy", "medium", "hard"] as AiDifficulty[]).map((d) => (
            <SegmentBtn
              key={d}
              $active={difficulty === d}
              onClick={() => onSetDifficulty(d)}
              aria-pressed={difficulty === d}
            >
              {t(d)}
            </SegmentBtn>
          ))}
        </Group>
      )}

      <Button variant="ghost" small onClick={onReset}>
        ↺ {tg("newGame")}
      </Button>
    </Container>
  );
}
