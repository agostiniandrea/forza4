"use client";

import { useRef, useCallback, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { useTranslations } from "next-intl";
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

const ColumnIndicator = styled.div`
  display: flex;
  gap: var(--cell-gap);
  padding: 0 var(--board-padding);
  margin-bottom: var(--space-2);
  height: 32px;
`;

const DropArrow = styled.div<{ $visible: boolean; $player: Player }>`
  width: var(--cell-size);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity var(--transition-fast);
  color: ${({ $player }) => ($player === 1 ? "var(--color-p1)" : "var(--color-p2)")};
  animation: ${({ $visible }) =>
    $visible
      ? css`${hoverPulse} 0.8s ease-in-out infinite`
      : "none"};
`;

const BoardFrame = styled.div`
  background: var(--color-board-frame);
  border-radius: var(--board-radius);
  padding: var(--board-padding);
  box-shadow:
    0 0 0 1px var(--color-border),
    0 8px 48px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(0, 50, 180, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
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

const Cell = styled.div<{ $hovering: boolean; $hasWinPiece: boolean }>`
  width: var(--cell-size);
  height: var(--cell-size);
  border-radius: 50%;
  background: var(--color-cell-empty);
  border: 1px solid var(--color-cell-ring);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);

  ${({ $hovering }) =>
    $hovering &&
    css`
      background: rgba(255, 255, 255, 0.04);
      box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.06);
    `}

  ${({ $hasWinPiece }) =>
    $hasWinPiece &&
    css`
      background: rgba(255, 215, 0, 0.04);
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
  const t = useTranslations("Accessibility");
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

  // Auto-focus board on mount so keyboard works immediately
  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  return (
    <BoardWrapper>
      {/* Column drop arrows */}
      <ColumnIndicator aria-hidden="true">
        {Array.from({ length: COLS }, (_, col) => (
          <DropArrow
            key={col}
            $visible={!disabled && hoveredCol === col}
            $player={currentPlayer}
          >
            ▼
          </DropArrow>
        ))}
      </ColumnIndicator>

      <BoardFrame>
        <Grid
          ref={boardRef}
          role="grid"
          aria-label={t("board", { rows: ROWS, cols: COLS })}
          aria-describedby="keyboard-hint"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onBlur={onColumnLeave}
        >
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const cell = board[row][col];
              const isWin = winSet.has(`${row}-${col}`);
              const isDropping =
                droppingCell?.row === row && droppingCell?.col === col;
              const isHovered = !disabled && col === hoveredCol && !cell;

              let ariaLabel: string;
              if (!cell) ariaLabel = t("cellEmpty");
              else if (isWin)
                ariaLabel = t(
                  cell === 1 ? "winCellPlayer1" : "winCellPlayer2"
                );
              else
                ariaLabel = t(cell === 1 ? "cellPlayer1" : "cellPlayer2");

              return (
                <Cell
                  key={`${row}-${col}`}
                  role="gridcell"
                  aria-label={ariaLabel}
                  $hovering={isHovered}
                  $hasWinPiece={isWin}
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

      <p id="keyboard-hint" className="sr-only">
        {t("keyboardHint")}
      </p>
    </BoardWrapper>
  );
}
