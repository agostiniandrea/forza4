import {
  Board,
  Player,
  ROWS,
  COLS,
  WIN_LENGTH,
  applyMove,
  getWinCells,
  isDraw,
  getAvailableColumns,
} from "./game-engine";

export type AiDifficulty = "easy" | "medium" | "hard";

const DEPTH: Record<AiDifficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 7,
};

const AI_PLAYER: Player = 2;
const HUMAN_PLAYER: Player = 1;

function scoreWindow(window: (Player | null)[], player: Player): number {
  const opponent = player === 1 ? 2 : 1;
  const count = window.filter((c) => c === player).length;
  const empty = window.filter((c) => c === null).length;
  const oppCount = window.filter((c) => c === opponent).length;

  if (count === 4) return 100;
  if (count === 3 && empty === 1) return 5;
  if (count === 2 && empty === 2) return 2;
  // Block opponent threats with high priority — must be close to win value
  if (oppCount === 3 && empty === 1) return -80;
  if (oppCount === 2 && empty === 2) return -2;
  return 0;
}

function evaluateBoard(board: Board, player: Player): number {
  let score = 0;

  // Prefer center column
  const centerCol = Math.floor(COLS / 2);
  const centerArray = board.map((row) => row[centerCol]);
  score += centerArray.filter((c) => c === player).length * 3;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - WIN_LENGTH; c++) {
      const window = board[r].slice(c, c + WIN_LENGTH);
      score += scoreWindow(window, player);
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - WIN_LENGTH; r++) {
      const window = Array.from({ length: WIN_LENGTH }, (_, i) => board[r + i][c]);
      score += scoreWindow(window, player);
    }
  }

  // Diagonal ↘
  for (let r = 0; r <= ROWS - WIN_LENGTH; r++) {
    for (let c = 0; c <= COLS - WIN_LENGTH; c++) {
      const window = Array.from({ length: WIN_LENGTH }, (_, i) => board[r + i][c + i]);
      score += scoreWindow(window, player);
    }
  }

  // Diagonal ↗
  for (let r = WIN_LENGTH - 1; r < ROWS; r++) {
    for (let c = 0; c <= COLS - WIN_LENGTH; c++) {
      const window = Array.from({ length: WIN_LENGTH }, (_, i) => board[r - i][c + i]);
      score += scoreWindow(window, player);
    }
  }

  return score;
}

function isTerminal(board: Board): boolean {
  if (isDraw(board)) return true;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null && getWinCells(board, r, c) !== null) return true;
    }
  }
  return false;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || isTerminal(board)) {
    if (depth === 0) return evaluateBoard(board, AI_PLAYER) - evaluateBoard(board, HUMAN_PLAYER);
    if (isDraw(board)) return 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] !== null && getWinCells(board, r, c) !== null) {
          return board[r][c] === AI_PLAYER ? 100000 + depth : -100000 - depth;
        }
      }
    }
    return 0;
  }

  const cols = getAvailableColumns(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const col of cols) {
      const result = applyMove(board, col, AI_PLAYER);
      if (!result) continue;
      const score = minimax(result.board, depth - 1, alpha, beta, false);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const col of cols) {
      const result = applyMove(board, col, HUMAN_PLAYER);
      if (!result) continue;
      const score = minimax(result.board, depth - 1, alpha, beta, true);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

export function getBestMove(board: Board, difficulty: AiDifficulty): number {
  const cols = getAvailableColumns(board);
  if (cols.length === 0) return 0;

  // Easy: sometimes pick randomly
  if (difficulty === "easy" && Math.random() < 0.4) {
    return cols[Math.floor(Math.random() * cols.length)];
  }

  // Always take an immediate win
  for (const col of cols) {
    const result = applyMove(board, col, AI_PLAYER);
    if (result && getWinCells(result.board, result.row, col)) return col;
  }

  // Always block an immediate human win
  for (const col of cols) {
    const result = applyMove(board, col, HUMAN_PLAYER);
    if (result && getWinCells(result.board, result.row, col)) return col;
  }

  const depth = DEPTH[difficulty];
  let bestCol = cols[Math.floor(cols.length / 2)];
  let bestScore = -Infinity;

  for (const col of cols) {
    const result = applyMove(board, col, AI_PLAYER);
    if (!result) continue;
    const score = minimax(result.board, depth - 1, -Infinity, Infinity, false);
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return bestCol;
}
