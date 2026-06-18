"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styled from "styled-components";
import type { Player } from "@/lib/game-engine";
import { useGame } from "@/hooks/useGame";
import { useSound } from "@/hooks/useSound";
import { useAnnouncer } from "@/hooks/useAnnouncer";
import { mq } from "@/lib/breakpoints";
import Header from "@/components/layout/Header";
import SkipLink from "@/components/layout/SkipLink";
import Board from "@/components/game/Board";
import PlayerIndicator from "@/components/game/PlayerIndicator";
import PlayerPanel from "@/components/game/PlayerPanel";
import GameStatus from "@/components/game/GameStatus";
import GameControls from "@/components/game/GameControls";
import NameEntry from "@/components/game/NameEntry";
import Confetti from "@/components/game/Confetti";
import ClientOnly from "@/lib/ClientOnly";
import type { GameMode } from "@/hooks/useGame";
import type { AiDifficulty } from "@/lib/ai";

const PageWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* ── Mobile layout ── */
const MobileMain = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(var(--space-2), 1.5vh, var(--space-6));
  padding: clamp(var(--space-2), 1.5vh, var(--space-6)) var(--space-4);

  ${mq.lg} { display: none; }
`;

const MobileGameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(var(--space-2), 1.5vh, var(--space-6));
  width: 100%;
  max-width: 560px;
  min-height: 0;
`;


/* ── Desktop layout ── */
const DesktopMain = styled.main`
  display: none;
  ${mq.lg} {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: clamp(200px, 20vw, 300px) 1fr clamp(200px, 20vw, 300px);
    gap: clamp(var(--space-4), 2vw, var(--space-8));
    padding: clamp(var(--space-4), 2vh, var(--space-8)) clamp(var(--space-6), 3vw, var(--space-10));
    align-items: stretch;
  }
`;

const PanelSlot = styled.div`
  display: flex;
  align-items: stretch;
`;

const BoardColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(var(--space-3), 2vh, var(--space-6));
  min-height: 0;
`;

/* ── Bottom bar — visible on all breakpoints ── */
const BottomBar = styled.div`
  display: flex;
`;

/* ── Shared ── */
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
const LS_P1 = "forza4_p1";
const LS_P2 = "forza4_p2";

export default function GamePage() {
  const announce = useAnnouncer();

  const {
    game,
    mode,
    aiDifficulty,
    scores,
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
  const [setupDone, setSetupDone] = useState(false);
  const [playerNames, setPlayerNames] = useState<{ 1: string; 2: string }>({ 1: "P1", 2: "P2" });

  const supportsFullscreen = useSyncExternalStore(
    subscribeToNothing,
    () => "requestFullscreen" in document.documentElement,
    () => false,
  );
  const prevStatusRef = useRef(game.status);
  const prevLastMoveRef = useRef(game.lastMove);

  useEffect(() => {
    const p1 = localStorage.getItem(LS_P1) ?? "";
    const p2 = localStorage.getItem(LS_P2) ?? "";
    setPlayerNames({ 1: p1 || "P1", 2: p2 || "P2" });
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }

  useEffect(() => {
    if (game.lastMove === prevLastMoveRef.current) return;
    prevLastMoveRef.current = game.lastMove;
    if (!game.lastMove) return;

    const { row, col } = game.lastMove;
    const player = game.board[row][col] as Player;
    playDrop(player);
    announce(`${playerNames[player]} dropped in column ${col + 1}`);

    const tStart = setTimeout(() => setDroppingCell({ row, col }), 0);
    const tEnd = setTimeout(() => setDroppingCell(null), 600);
    return () => { clearTimeout(tStart); clearTimeout(tEnd); };
  }, [game.lastMove, game.board, playDrop, announce, playerNames]);

  useEffect(() => {
    if (game.status === prevStatusRef.current) return;
    prevStatusRef.current = game.status;
    if (game.status === "won") {
      announce(`${playerNames[game.winner!]} wins!`);
      playWin();
    } else if (game.status === "draw") {
      announce("It's a draw!");
      playDraw();
    }
  }, [game.status, game.winner, playerNames, announce, playWin, playDraw]);

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

  function handleSetupConfirm(names: { p1: string; p2: string }, newMode: GameMode, newDifficulty: AiDifficulty) {
    localStorage.setItem(LS_P1, names.p1);
    localStorage.setItem(LS_P2, names.p2);
    setPlayerNames({ 1: names.p1, 2: names.p2 });
    setMode(newMode);
    setDifficulty(newDifficulty);
    setSetupDone(true);
  }

  function handleChangeSetup() {
    playReset();
    reset();
    setSetupDone(false);
  }

  function handlePlayAgain() {
    playReset();
    reset();
  }

  const isGameOver = game.status === "won" || game.status === "draw";
  const isDraw = game.status === "draw";

  function getTurnLabel(forPlayer: Player): string {
    if (isGameOver) return "";
    if (game.currentPlayer !== forPlayer) return "";
    if (mode === "ai" && forPlayer === 2) return isAiThinking ? "Thinking…" : "";
    if (mode === "ai" && forPlayer === 1) return isAiThinking ? "" : "Your turn";
    return "Your turn";
  }

  function getMobileTurnText(): string {
    if (!setupDone) return "";
    if (mode === "ai") return isAiThinking ? "CPU thinking…" : `${playerNames[1]}'s turn`;
    return `${playerNames[game.currentPlayer]}'s turn`;
  }

  const boardDisabled = isGameOver || isAiThinking || !setupDone;

  const sharedBoard = (
    <BoardSection>
      <Board
        board={game.board}
        currentPlayer={game.currentPlayer}
        selectedCol={hoveredCol}
        winCells={game.winCells}
        disabled={boardDisabled}
        droppingCell={droppingCell}
        onColumnClick={handleColumnClick}
        onColumnHover={handleColumnHover}
        onColumnLeave={() => {}}
      />
    </BoardSection>
  );

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

      {!setupDone && (
        <NameEntry
          initialMode={mode}
          initialDifficulty={aiDifficulty}
          initialNames={{ p1: playerNames[1], p2: playerNames[2] }}
          onConfirm={handleSetupConfirm}
        />
      )}

      {/* ── Mobile layout ── */}
      <MobileMain id="main-content">
        <MobileGameArea>
          <PlayerIndicator
            currentPlayer={game.currentPlayer}
            winner={game.winner}
            isDraw={isDraw}
            scores={scores}
            names={playerNames}
            turnLabels={{ 1: getTurnLabel(1), 2: getTurnLabel(2) }}
          />
          {sharedBoard}
          <StatusArea>
            {isGameOver ? (
              <GameStatus onPlayAgain={handlePlayAgain} />
            ) : (
              <TurnLabel $player={game.currentPlayer} aria-live="polite">
                {getMobileTurnText()}
              </TurnLabel>
            )}
          </StatusArea>
        </MobileGameArea>
      </MobileMain>

      {/* ── Desktop layout ── */}
      <DesktopMain>
        <PanelSlot>
          <PlayerPanel
            player={1}
            name={playerNames[1]}
            score={scores[1]}
            isActive={!isGameOver && game.currentPlayer === 1}
            isWinner={game.winner === 1}
            isDraw={isDraw}
            turnLabel={getTurnLabel(1)}
          />
        </PanelSlot>

        <BoardColumn>
          {sharedBoard}
          <StatusArea>
            {isGameOver ? (
              <GameStatus onPlayAgain={handlePlayAgain} />
            ) : null}
          </StatusArea>
        </BoardColumn>

        <PanelSlot>
          <PlayerPanel
            player={2}
            name={playerNames[2]}
            score={scores[2]}
            isActive={!isGameOver && game.currentPlayer === 2}
            isWinner={game.winner === 2}
            isDraw={isDraw}
            turnLabel={getTurnLabel(2)}
          />
        </PanelSlot>
      </DesktopMain>

      {/* ── Desktop bottom bar ── */}
      <BottomBar>
        <GameControls
          mode={mode}
          difficulty={aiDifficulty}
          isGameOver={isGameOver}
          onSetMode={setMode}
          onSetDifficulty={setDifficulty}
          onChangeSetup={handleChangeSetup}
        />
      </BottomBar>
    </PageWrapper>
  );
}
