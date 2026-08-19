"use client";

import { useRef, useCallback, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import type { Board as BoardType, Player } from "@/lib/game-engine";
import { ROWS, COLS, getDropRow, isColumnFull } from "@/lib/game-engine";
import Piece from "./Piece";

const hoverPulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
`;

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
`;

const BoardDepthWrapper = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 8%;
    right: 8%;
    height: 28px;
    background: radial-gradient(ellipse at center, rgba(20, 80, 255, 0.55) 0%, transparent 70%);
    filter: blur(10px);
    z-index: -1;
    pointer-events: none;
  }
`;

const ColumnIndicator = styled.div`
  display: flex;
  gap: var(--cell-gap);
  padding: 0 var(--board-padding);
  margin-bottom: var(--space-2);
  height: 32px;

  /* No pointer, no pointer affordance. display:none rather than
     visibility:hidden so it stops reserving the row and stops animating. */
  @media (hover: none) { display: none; }
`;

const DropIndicator = styled.div<{ $visible: boolean; $player: Player }>`
  width: var(--cell-size);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity var(--transition-fast);
  color: ${({ $player }) => ($player === 1 ? "var(--color-p1)" : "var(--color-p2)")};
  filter: ${({ $player }) =>
    $player === 1
      ? "drop-shadow(0 0 6px var(--color-p1))"
      : "drop-shadow(0 0 6px var(--color-p2))"};
  animation: ${({ $visible }) =>
    $visible ? css`${hoverPulse} 0.8s ease-in-out infinite` : "none"};
`;

const BoardFrame = styled.div`
  position: relative;
  background:
    /* sheen along the top face of the moulding */
    linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 12%),
    linear-gradient(180deg, #1d34ab 0%, var(--color-board-frame) 26%, #081348 100%);
  border-radius: var(--board-radius);
  padding: var(--board-padding);
  box-shadow:
    /* neon bloom */
    0 0 0 2px rgba(40, 100, 255, 0.65),
    0 0 24px rgba(20, 80, 255, 0.85),
    0 0 60px rgba(0, 60, 220, 0.5),
    0 0 100px rgba(0, 40, 180, 0.25),
    0 12px 60px rgba(0,0,0,0.9),
    /* bevel: a lit top lip and a shaded bottom lip give the slab thickness,
       which a single soft inset could not do on its own */
    inset 0 2px 1px rgba(255,255,255,0.3),
    inset 0 -2px 1px rgba(0,0,0,0.6),
    inset 0 7px 16px rgba(255,255,255,0.06),
    inset 0 -11px 22px rgba(0,0,0,0.55);

  /* the wells are punched into a plate recessed below the moulding */
  &::before {
    content: "";
    position: absolute;
    inset: calc(var(--board-padding) * 0.4);
    border-radius: calc(var(--board-radius) * 0.7);
    box-shadow:
      inset 0 2px 7px rgba(0,0,0,0.5),
      inset 0 -1px 0 rgba(255,255,255,0.06);
    pointer-events: none;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLS}, var(--cell-size));
  grid-template-rows: repeat(${ROWS}, var(--cell-size));
  gap: var(--cell-gap);
`;

const ColumnButton = styled.button<{ $disabled: boolean }>`
  display: contents;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
`;

const Cell = styled.div<{ $hovering: boolean; $hasWinPiece: boolean; $dropping: boolean }>`
  width: var(--cell-size);
  height: var(--cell-size);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 55%, #020408 0%, #070e26 75%);
  border: 1px solid rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow:
    inset 0 6px 16px rgba(0,0,0,0.95),
    inset 0 2px 6px rgba(0,0,0,0.7),
    inset 3px 0 5px rgba(0,0,0,0.3),
    inset -3px 0 5px rgba(0,0,0,0.3),
    inset 0 -1px 3px rgba(80,120,255,0.05);

  ${({ $dropping }) =>
    $dropping && css`
      z-index: 10;
    `}

  ${({ $hovering }) =>
    $hovering && css`
      @media (hover: hover) {
        background: radial-gradient(circle at 50% 60%, #0d1830 0%, rgba(255,255,255,0.05) 70%);
        box-shadow:
          inset 0 5px 12px rgba(0,0,0,0.75),
          inset 0 2px 5px rgba(0,0,0,0.5),
          inset 0 0 14px rgba(255,255,255,0.06);
      }
    `}

  ${({ $hasWinPiece }) =>
    $hasWinPiece && css`
      background: radial-gradient(circle at 50% 60%, #0a0c10 0%, rgba(255,215,0,0.06) 70%);
    `}
`;

interface Props {
  board: BoardType;
  currentPlayer: Player;
  selectedCol: number;
  winCells: [number, number][] | null;
  disabled: boolean;
  droppingCell: { row: number; col: number } | null;
  onColumnClick: (col: number) => void;
  onColumnHover: (col: number) => void;
  onColumnLeave: () => void;
}

export default function Board({
  board,
  currentPlayer,
  selectedCol,
  winCells,
  disabled,
  droppingCell,
  onColumnClick,
  onColumnHover,
  onColumnLeave,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const hoveredCol = selectedCol;

  const winSet = new Set(winCells?.map(([r, c]) => `${r}-${c}`) ?? []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onColumnHover(Math.max(0, selectedCol - 1));
          break;
        case "ArrowRight":
          e.preventDefault();
          onColumnHover(Math.min(COLS - 1, selectedCol + 1));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onColumnClick(selectedCol);
          break;
      }
    },
    [disabled, selectedCol, onColumnClick, onColumnHover]
  );

  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  return (
    <BoardWrapper>
      <ColumnIndicator aria-hidden="true">
        {Array.from({ length: COLS }, (_, col) => (
          <DropIndicator
            key={col}
            $visible={!disabled && hoveredCol === col}
            $player={currentPlayer}
          >
            ▼
          </DropIndicator>
        ))}
      </ColumnIndicator>

      <BoardDepthWrapper>
      <BoardFrame>
        <Grid
          ref={boardRef}
          role="grid"
          aria-label={`Connect Four board, ${ROWS} rows by ${COLS} columns`}
          aria-describedby="keyboard-hint"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onBlur={onColumnLeave}
        >
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const cell = board[row][col];
              const isWin = winSet.has(`${row}-${col}`);
              const isDropping = droppingCell?.row === row && droppingCell?.col === col;
              const isHovered = !disabled && col === hoveredCol && !cell;

              let ariaLabel: string;
              if (!cell) ariaLabel = "Empty";
              else if (isWin) ariaLabel = cell === 1 ? "Red disc — winning piece" : "Yellow disc — winning piece";
              else ariaLabel = cell === 1 ? "Red disc" : "Yellow disc";

              return (
                <Cell
                  key={`${row}-${col}`}
                  role="gridcell"
                  aria-label={ariaLabel}
                  $hovering={isHovered}
                  $hasWinPiece={isWin}
                  $dropping={isDropping}
                  onClick={() => !disabled && onColumnClick(col)}
                  onMouseEnter={() => !disabled && onColumnHover(col)}
                  onMouseLeave={onColumnLeave}
                  style={{ cursor: disabled || cell ? "default" : "pointer" }}
                >
                  {cell && (
                    <Piece
                      player={cell}
                      dropping={isDropping}
                      droppingRow={isDropping ? row : undefined}
                      winning={isWin}
                    />
                  )}
                </Cell>
              );
            })
          )}
        </Grid>
      </BoardFrame>
      </BoardDepthWrapper>

      <p id="keyboard-hint" className="sr-only">
        Use arrow keys to choose column, Enter to drop
      </p>
    </BoardWrapper>
  );
}
