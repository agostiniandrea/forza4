"use client";

import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import styled, { keyframes } from "styled-components";
import type { GameMode } from "@/hooks/useGame";
import type { AiDifficulty } from "@/lib/ai";
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
  background: rgba(7, 8, 15, 0.92);
  backdrop-filter: blur(12px);
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
  gap: var(--space-8);
  max-width: 460px;
  width: 100%;
  animation: ${slideUp} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 80px rgba(0, 212, 255, 0.06), 0 8px 40px rgba(0, 0, 0, 0.6);
`;

const Label = styled.p`
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0;
`;

const SegmentGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
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
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all var(--transition-fast);
  background: ${({ $active }) => ($active ? "var(--color-accent)" : "transparent")};
  color: ${({ $active }) => ($active ? "#000" : "var(--color-text-muted)")};

  @media (hover: hover) {
    &:hover {
      color: ${({ $active }) => ($active ? "#000" : "var(--color-text)")};
      background: ${({ $active }) => $active ? "var(--color-accent)" : "rgba(255,255,255,0.05)"};
    }
  }
`;

const NamesRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--space-4);
  width: 100%;
  justify-content: center;
`;

const NameField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
`;

const NameLabel = styled.label<{ $player: 1 | 2 }>`
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
`;

const ArcadeInput = styled.input<{ $player: 1 | 2; $disabled?: boolean }>`
  width: 5ch;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  background: var(--color-surface-2);
  border: none;
  border-bottom: 2px solid ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  border-radius: 0;
  color: ${({ $player, $disabled }) =>
    $disabled
      ? "var(--color-text-dim)"
      : $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  padding: var(--space-2) var(--space-1);
  outline: none;
  caret-color: ${({ $player }) => $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  cursor: ${({ $disabled }) => $disabled ? "default" : "text"};

  &:focus {
    box-shadow: 0 4px 12px ${({ $player }) => $player === 1 ? "var(--color-p1-glow-soft)" : "var(--color-p2-glow-soft)"};
  }

  &::placeholder {
    color: var(--color-text-dim);
    opacity: 1;
  }
`;

const VsSep = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 300;
  padding-bottom: var(--space-3);
`;

const PlayBtn = styled.div`
  width: 100%;
`;

interface Props {
  initialMode: GameMode;
  initialDifficulty: AiDifficulty;
  initialNames: { p1: string; p2: string };
  onConfirm: (names: { p1: string; p2: string }, mode: GameMode, difficulty: AiDifficulty) => void;
}

export default function NameEntry({ initialMode, initialDifficulty, initialNames, onConfirm }: Props) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [difficulty, setDifficulty] = useState<AiDifficulty>(initialDifficulty);
  const [p1, setP1] = useState(initialNames.p1);
  const [p2, setP2] = useState(initialNames.p2);
  const p1Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    p1Ref.current?.focus();
    p1Ref.current?.select();
  }, []);

  function confirm() {
    const name1 = p1.trim().toUpperCase() || "P1";
    const name2 = mode === "ai" ? "CPU" : (p2.trim().toUpperCase() || "P2");
    onConfirm({ p1: name1, p2: name2 }, mode, difficulty);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") confirm();
  }

  function handleName(raw: string, set: (v: string) => void) {
    set(raw.toUpperCase().slice(0, 4));
  }

  return (
    <Overlay>
      <Card>
        <Label>Set up game</Label>

        <SegmentGroup role="group" aria-label="Game mode">
          <SegBtn $active={mode === "2p"} onClick={() => setMode("2p")}>2 Players</SegBtn>
          <SegBtn $active={mode === "ai"} onClick={() => setMode("ai")}>vs AI</SegBtn>
        </SegmentGroup>

        {mode === "ai" && (
          <SegmentGroup role="group" aria-label="Difficulty">
            {(["easy", "medium", "hard"] as AiDifficulty[]).map((d) => (
              <SegBtn key={d} $active={difficulty === d} onClick={() => setDifficulty(d)}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </SegBtn>
            ))}
          </SegmentGroup>
        )}

        <NamesRow>
          <NameField>
            <NameLabel $player={1} htmlFor="name-p1">
              {mode === "ai" ? "You" : "Player 1"}
            </NameLabel>
            <ArcadeInput
              id="name-p1"
              $player={1}
              ref={p1Ref}
              value={p1}
              placeholder="P1"
              onChange={(e) => handleName(e.target.value, setP1)}
              onKeyDown={onKey}
              maxLength={4}
              autoComplete="off"
              spellCheck={false}
            />
          </NameField>

          <VsSep>vs</VsSep>

          <NameField>
            <NameLabel $player={2} htmlFor="name-p2">
              {mode === "ai" ? "CPU" : "Player 2"}
            </NameLabel>
            <ArcadeInput
              id="name-p2"
              $player={2}
              $disabled={mode === "ai"}
              value={mode === "ai" ? "CPU" : p2}
              placeholder="P2"
              onChange={(e) => mode !== "ai" && handleName(e.target.value, setP2)}
              onKeyDown={onKey}
              maxLength={4}
              autoComplete="off"
              spellCheck={false}
              readOnly={mode === "ai"}
            />
          </NameField>
        </NamesRow>

        <PlayBtn>
          <Button $variant="primary" onClick={confirm} style={{ width: "100%" }}>
            Let&apos;s play →
          </Button>
        </PlayBtn>
      </Card>
    </Overlay>
  );
}
