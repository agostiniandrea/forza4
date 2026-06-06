"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useGame } from "@/hooks/useGame";
import { useSound } from "@/hooks/useSound";
import { useAnnouncer } from "@/hooks/useAnnouncer";
import Header from "@/components/layout/Header";
import SkipLink from "@/components/layout/SkipLink";
import Board from "@/components/game/Board";
import PlayerIndicator from "@/components/game/PlayerIndicator";
import GameStatus from "@/components/game/GameStatus";
import GameControls from "@/components/game/GameControls";
import Confetti from "@/components/game/Confetti";
import ClientOnly from "@/lib/ClientOnly";
import { mq } from "@/lib/breakpoints";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-4) var(--space-10);

  ${mq.md} {
    padding: var(--space-8) var(--space-6) var(--space-12);
    gap: var(--space-8);
  }
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  width: 100%;
  max-width: 640px;

  ${mq.md} {
    gap: var(--space-8);
  }
`;

const StatusArea = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TurnLabel = styled.p<{ $player: 1 | 2 }>`
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: ${({ $player }) =>
    $player === 1 ? "var(--color-p1)" : "var(--color-p2)"};
  letter-spacing: 0.04em;
  transition: color var(--transition-normal);
`;

const BoardSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function GamePage() {
  const t = useTranslations("Game");
  const ta = useTranslations("Accessibility");
  const announce = useAnnouncer();

  const {
    game,
    mode,
    aiDifficulty,
    scores,
    selectedCol,
    isAiThinking,
    drop,
    reset,
    setMode,
    setDifficulty,
    selectCol,
  } = useGame();

  const sound = useSound();
  const [droppingCell, setDroppingCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCol, setHoveredCol] = useState(3);
  const prevStatusRef = useRef(game.status);

  // Announce status changes to screen readers
  useEffect(() => {
    if (game.status === prevStatusRef.current) return;
    prevStatusRef.current = game.status;
    if (game.status === "won") {
      const name =
        mode === "ai"
          ? game.winner === 1
            ? t("you")
            : t("ai")
          : game.winner === 1
          ? t("player1")
          : t("player2");
      announce(t("wins", { name }));
      sound.playWin();
    } else if (game.status === "draw") {
      announce(t("draw"));
      sound.playDraw();
    }
  }, [game.status, game.winner, mode, announce, t, sound]);

  function handleColumnClick(col: number) {
    if (game.status !== "playing" || isAiThinking) return;

    const currentPlayer = game.currentPlayer;
    const dropRow = game.board
      .map((row) => row[col])
      .reduceRight((acc, cell, i) => (acc === -1 && cell === null ? i : acc), -1);

    drop(col, (player) => {
      sound.playDrop(player);
      if (dropRow !== -1) {
        setDroppingCell({ row: dropRow, col });
        setTimeout(() => setDroppingCell(null), 500);
      }
      announce(
        ta("pieceDropped", {
          player: player === 1 ? t("player1") : t("player2"),
          col: col + 1,
        })
      );
    });
  }

  function handleColumnHover(col: number) {
    if (col !== hoveredCol) {
      setHoveredCol(col);
      selectCol(col);
    }
  }

  function handleReset() {
    sound.playReset();
    reset();
  }

  const isGameOver = game.status === "won" || game.status === "draw";

  return (
    <PageWrapper>
      <SkipLink />
      <Header soundEnabled={sound.enabled} onToggleSound={sound.toggle} />

      <ClientOnly>
        <Confetti active={game.status === "won"} />
      </ClientOnly>

      <Main id="main-content">
        <GameArea>
          <PlayerIndicator
            currentPlayer={game.currentPlayer}
            winner={game.winner}
            scores={scores}
            mode={mode}
            isAiThinking={isAiThinking}
          />

          <BoardSection>
            <Board
              board={game.board}
              currentPlayer={game.currentPlayer}
              selectedCol={hoveredCol}
              winCells={game.winCells}
              disabled={isGameOver || isAiThinking}
              droppingCell={droppingCell}
              onColumnClick={handleColumnClick}
              onColumnHover={handleColumnHover}
              onColumnLeave={() => {}}
            />
          </BoardSection>

          <StatusArea>
            {isGameOver ? (
              <GameStatus
                winner={game.winner}
                isDraw={game.status === "draw"}
                mode={mode}
                onPlayAgain={handleReset}
              />
            ) : (
              <TurnLabel $player={game.currentPlayer} aria-live="polite">
                {isAiThinking
                  ? `${t("ai")}...`
                  : mode === "ai" && game.currentPlayer === 1
                  ? t("playerTurn", { player: t("you") })
                  : mode === "ai" && game.currentPlayer === 2
                  ? `${t("ai")}...`
                  : t("playerTurn", { player: game.currentPlayer })}
              </TurnLabel>
            )}
          </StatusArea>

          <GameControls
            mode={mode}
            difficulty={aiDifficulty}
            onSetMode={setMode}
            onSetDifficulty={setDifficulty}
            onReset={handleReset}
          />
        </GameArea>
      </Main>
    </PageWrapper>
  );
}
