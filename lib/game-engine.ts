export const ROWS = 6;
export const COLS = 7;
export const WIN_LENGTH = 4;

export type Player = 1 | 2;
export type Cell = Player | null;
export type Board = Cell[][];

export type GameStatus = "idle" | "playing" | "won" | "draw";

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winCells: [number, number][] | null;
  lastMove: { row: number; col: number } | null;
}

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
}

export function createInitialState(): GameState {
  return {
    board: createBoard(),
    currentPlayer: 1,
    status: "playing",
    winner: null,
    winCells: null,
    lastMove: null,
  };
}

export function getDropRow(board: Board, col: number): number | null {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) return row;
  }
  return null;
}

export function isColumnFull(board: Board, col: number): boolean {
  return board[0][col] !== null;
}

export function getAvailableColumns(board: Board): number[] {
  return Array.from({ length: COLS }, (_, i) => i).filter(
    (col) => !isColumnFull(board, col)
  );
}

export function applyMove(board: Board, col: number, player: Player): { board: Board; row: number } | null {
  const row = getDropRow(board, col);
  if (row === null) return null;
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return { board: newBoard, row };
}

export function getWinCells(
  board: Board,
  lastRow: number,
  lastCol: number
): [number, number][] | null {
  const player = board[lastRow][lastCol];
  if (!player) return null;

  const directions: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[lastRow, lastCol]];

    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = lastRow + dr * i;
      const c = lastCol + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player)
        break;
      cells.push([r, c]);
    }
    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = lastRow - dr * i;
      const c = lastCol - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player)
        break;
      cells.push([r, c]);
    }

    if (cells.length >= WIN_LENGTH) return cells;
  }

  return null;
}

export function isDraw(board: Board): boolean {
  return board[0].every((cell) => cell !== null);
}

export function dropPiece(state: GameState, col: number): GameState {
  if (state.status !== "playing") return state;

  const result = applyMove(state.board, col, state.currentPlayer);
  if (!result) return state;

  const { board, row } = result;
  const winCells = getWinCells(board, row, col);

  if (winCells) {
    return {
      board,
      currentPlayer: state.currentPlayer,
      status: "won",
      winner: state.currentPlayer,
      winCells,
      lastMove: { row, col },
    };
  }

  if (isDraw(board)) {
    return {
      board,
      currentPlayer: state.currentPlayer,
      status: "draw",
      winner: null,
      winCells: null,
      lastMove: { row, col },
    };
  }

  return {
    board,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    status: "playing",
    winner: null,
    winCells: null,
    lastMove: { row, col },
  };
}
