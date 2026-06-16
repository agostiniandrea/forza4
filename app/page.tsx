"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styled from "styled-components";
import type { Player } from "@/lib/game-engine";
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
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(var(--space-2), 1.5vh, var(--space-6));
  padding: clamp(var(--space-2), 1.5vh, var(--space-6)) var(--space-4);
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(var(--space-2), 1.5vh, var(--space-6));
  width: 100%;
  max-width: 640px;
  min-height: 0;
`;

// Fixed height so the layout never shifts when win card replaces TurnLabel.
// Win card: padding 12*2 + content ~28px + border 2px ≈ 54px.
const StatusArea = styled.div`
  height: 54px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const TurnLabel = styled.p<{ $player: 1 | 2 }>`
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: ${({ $player }) => ($player === 1 ? "var(--color-p1)" : "var(--color-p2)")};
  letter-spacing: 0.04em;
  transition: color var(--transition-normal);
`;

const BoardSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const subscribeToNothing = () => () => {};

export default function GamePage() {
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

  const { enabled: soundEnabled, toggle: toggleSound, playDrop, playWin, playDraw, playReset } = useSound();
  const [droppingCell, setDroppingCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCol, setHoveredCol] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supportsFullscreen = useSyncExternalStore(
    subscribeToNothing,
    () => "requestFullscreen" in document.documentElement,
    () => false,
  );
  const prevStatusRef = useRef(game.status);
  // Tracks last processed lastMove to avoid re-firing on unrelated re-renders.
  const prevLastMoveRef = useRef(game.lastMove);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Handles animation + sound for every drop (human and AI) by watching lastMove.
  // The ref guard prevents spurious re-fires when sound callbacks change reference.
  useEffect(() => {
    if (game.lastMove === prevLastMoveRef.current) return;
    prevLastMoveRef.current = game.lastMove;
    if (!game.lastMove) return;

    const { row, col } = game.lastMove;
    const player = game.board[row][col] as Player;

    playDrop(player);
    const playerName =
      mode === "ai"
        ? player === 1 ? "You" : "AI"
        : player === 1 ? "Red" : "Yellow";
    announce(`${playerName} dropped in column ${col + 1}`);

    const tStart = setTimeout(() => setDroppingCell({ row, col }), 0);
    const tEnd = setTimeout(() => setDroppingCell(null), 600);
    return () => { clearTimeout(tStart); clearTimeout(tEnd); };
  }, [game.lastMove, game.board, playDrop, announce, mode]);

  useEffect(() => {
    if (game.status === prevStatusRef.current) return;
    prevStatusRef.current = game.status;
    if (game.status === "won") {
      const name =
        mode === "ai"
          ? game.winner === 1 ? "You" : "AI"
          : game.winner === 1 ? "Red" : "Yellow";
      announce(`${name} wins!`);
      playWin();
    } else if (game.status === "draw") {
      announce("It's a draw!");
      playDraw();
    }
  }, [game.status, game.winner, mode, announce, playWin, playDraw]);

  function handleColumnClick(col: number) {
    if (game.status !== "playing" || isAiThinking) return;
    drop(col);
  }

  function handleColumnHover(col: number) {
    if (col !== hoveredCol) {
      setHoveredCol(col);
      selectCol(col);
    }
  }

  function handleReset() {
    playReset();
    reset();
  }

  const isGameOver = game.status === "won" || game.status === "draw";
  const gameInProgress = game.status === "playing" && game.lastMove !== null;

  function getTurnText(): string {
    if (mode === "ai") return isAiThinking ? "AI thinking…" : "Your turn";
    return "";
  }

  return (
    <PageWrapper>
      <SkipLink />
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={supportsFullscreen ? toggleFullscreen : undefined}
      />

      <ClientOnly>
        <Confetti active={game.status === "won"} />
      </ClientOnly>

      <Main id="main-content">
        <GameArea>
          <PlayerIndicator
            currentPlayer={game.currentPlayer}
            winner={game.winner}
            scores={scores}
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
                {getTurnText()}
              </TurnLabel>
            )}
          </StatusArea>

          <GameControls
            mode={mode}
            difficulty={aiDifficulty}
            gameInProgress={gameInProgress}
            onSetMode={setMode}
            onSetDifficulty={setDifficulty}
            onReset={handleReset}
          />
        </GameArea>
      </Main>
    </PageWrapper>
  );
}
