import {
  ROWS,
  COLS,
  createBoard,
  createInitialState,
  getDropRow,
  isColumnFull,
  getAvailableColumns,
  applyMove,
  getWinCells,
  isDraw,
  dropPiece,
  type Board,
  type Cell,
  type GameState,
} from "@/lib/game-engine";

// ─── helpers ──────────────────────────────────────────────────────────────────

function applyMoves(moves: Array<[number, 1 | 2]>): Board {
  let board = createBoard();
  for (const [col, player] of moves) {
    const result = applyMove(board, col, player);
    if (!result) throw new Error(`Move to col ${col} failed`);
    board = result.board;
  }
  return board;
}

function fillColumn(board: Board, col: number): Board {
  let b = board;
  for (let i = 0; i < ROWS; i++) {
    const result = applyMove(b, col, (i % 2 === 0 ? 1 : 2));
    if (!result) break;
    b = result.board;
  }
  return b;
}

// ─── createBoard ──────────────────────────────────────────────────────────────

describe("createBoard", () => {
  it("returns a ROWS×COLS board filled with null", () => {
    const board = createBoard();
    expect(board).toHaveLength(ROWS);
    board.forEach((row) => {
      expect(row).toHaveLength(COLS);
      row.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

// ─── getDropRow ───────────────────────────────────────────────────────────────

describe("getDropRow", () => {
  it("returns the bottom row for an empty column", () => {
    expect(getDropRow(createBoard(), 0)).toBe(ROWS - 1);
  });

  it("returns the row above existing pieces", () => {
    const board = applyMoves([[3, 1], [3, 2]]);
    expect(getDropRow(board, 3)).toBe(ROWS - 3);
  });

  it("returns null for a full column", () => {
    const board = fillColumn(createBoard(), 0);
    expect(getDropRow(board, 0)).toBeNull();
  });
});

// ─── isColumnFull ─────────────────────────────────────────────────────────────

describe("isColumnFull", () => {
  it("returns false for an empty column", () => {
    expect(isColumnFull(createBoard(), 0)).toBe(false);
  });

  it("returns true when the top cell is occupied", () => {
    const board = fillColumn(createBoard(), 2);
    expect(isColumnFull(board, 2)).toBe(true);
  });
});

// ─── getAvailableColumns ──────────────────────────────────────────────────────

describe("getAvailableColumns", () => {
  it("returns all column indices for an empty board", () => {
    expect(getAvailableColumns(createBoard())).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("excludes full columns", () => {
    let board = fillColumn(createBoard(), 0);
    board = fillColumn(board, 6);
    const available = getAvailableColumns(board);
    expect(available).not.toContain(0);
    expect(available).not.toContain(6);
    expect(available).toHaveLength(COLS - 2);
  });
});

// ─── applyMove ────────────────────────────────────────────────────────────────

describe("applyMove", () => {
  it("places a piece in the bottom row of an empty column", () => {
    const result = applyMove(createBoard(), 3, 1);
    expect(result).not.toBeNull();
    expect(result!.row).toBe(ROWS - 1);
    expect(result!.board[ROWS - 1][3]).toBe(1);
  });

  it("stacks pieces — second piece lands one row above the first", () => {
    const board = applyMoves([[3, 1]]);
    const result = applyMove(board, 3, 2);
    expect(result).not.toBeNull();
    expect(result!.row).toBe(ROWS - 2);
    expect(result!.board[ROWS - 2][3]).toBe(2);
  });

  it("returns null for a full column", () => {
    const board = fillColumn(createBoard(), 0);
    expect(applyMove(board, 0, 1)).toBeNull();
  });

  it("does not mutate the original board", () => {
    const board = createBoard();
    const snapshot = board.map((r) => [...r]);
    applyMove(board, 0, 1);
    expect(board).toEqual(snapshot);
  });
});

// ─── getWinCells ──────────────────────────────────────────────────────────────

describe("getWinCells", () => {
  it("detects a horizontal win", () => {
    // p1 at cols 0–2 (bottom), p2 buffers, then p1 at col 3 wins
    const board = applyMoves([
      [0, 1], [0, 2],
      [1, 1], [1, 2],
      [2, 1], [2, 2],
    ]);
    const result = applyMove(board, 3, 1)!;
    const win = getWinCells(result.board, result.row, 3);
    expect(win).not.toBeNull();
    expect(win).toHaveLength(4);
    win!.forEach(([, c]) => expect(c).toBeGreaterThanOrEqual(0));
  });

  it("detects a vertical win", () => {
    // p1 stacks 4 in col 0, p2 buffers in col 1
    const board = applyMoves([
      [0, 1], [1, 2],
      [0, 1], [1, 2],
      [0, 1], [1, 2],
    ]);
    const result = applyMove(board, 0, 1)!;
    const win = getWinCells(result.board, result.row, 0);
    expect(win).not.toBeNull();
    expect(win).toHaveLength(4);
    win!.forEach(([, c]) => expect(c).toBe(0));
  });

  it("detects a diagonal win (↘)", () => {
    // Build a staircase: col k has k filler pieces so p1 lands on descending diagonal
    const board = applyMoves([
      [1, 2],
      [2, 2], [2, 2],
      [3, 2], [3, 2], [3, 2],
    ]);
    const b1 = applyMove(board, 0, 1)!.board;
    const b2 = applyMove(b1, 1, 1)!.board;
    const b3 = applyMove(b2, 2, 1)!.board;
    const result = applyMove(b3, 3, 1)!;
    const win = getWinCells(result.board, result.row, 3);
    expect(win).not.toBeNull();
    expect(win).toHaveLength(4);
  });

  it("detects a diagonal win (↙)", () => {
    // Mirror: col k has (3-k) filler pieces
    const board = applyMoves([
      [2, 2],
      [1, 2], [1, 2],
      [0, 2], [0, 2], [0, 2],
    ]);
    const b1 = applyMove(board, 3, 1)!.board;
    const b2 = applyMove(b1, 2, 1)!.board;
    const b3 = applyMove(b2, 1, 1)!.board;
    const result = applyMove(b3, 0, 1)!;
    const win = getWinCells(result.board, result.row, 0);
    expect(win).not.toBeNull();
    expect(win).toHaveLength(4);
  });

  it("returns null when no win exists", () => {
    const board = applyMoves([[0, 1], [1, 2], [2, 1]]);
    const result = applyMove(board, 3, 2)!;
    expect(getWinCells(result.board, result.row, 3)).toBeNull();
  });
});

// ─── isDraw ───────────────────────────────────────────────────────────────────

describe("isDraw", () => {
  it("returns false for an empty board", () => {
    expect(isDraw(createBoard())).toBe(false);
  });

  it("returns false when at least one top cell is empty", () => {
    let board = createBoard();
    for (let col = 0; col < COLS - 1; col++) board = fillColumn(board, col);
    expect(isDraw(board)).toBe(false);
  });

  it("returns true when every top cell is filled", () => {
    let board = createBoard();
    for (let col = 0; col < COLS; col++) board = fillColumn(board, col);
    expect(isDraw(board)).toBe(true);
  });
});

// ─── dropPiece ────────────────────────────────────────────────────────────────

describe("dropPiece", () => {
  it("returns the same state reference when status is not playing", () => {
    const state: GameState = {
      ...createInitialState(),
      status: "won",
      winner: 1,
    };
    expect(dropPiece(state, 0)).toBe(state);
  });

  it("returns the same state reference when column is full", () => {
    let state = createInitialState();
    for (let i = 0; i < ROWS; i++) state = dropPiece(state, 0);
    const full = state;
    expect(dropPiece(full, 0)).toBe(full);
  });

  it("advances to the other player after a normal move", () => {
    const next = dropPiece(createInitialState(), 3);
    expect(next.currentPlayer).toBe(2);
    expect(next.status).toBe("playing");
    expect(next.lastMove).toEqual({ row: ROWS - 1, col: 3 });
  });

  it("transitions to won when a player gets four in a row", () => {
    // p1 builds horizontal 4 at cols 0–3; p2 buffers vertically in col 0
    let state = createInitialState();
    state = dropPiece(state, 0); // p1 col0
    state = dropPiece(state, 0); // p2 col0
    state = dropPiece(state, 1); // p1 col1
    state = dropPiece(state, 1); // p2 col1
    state = dropPiece(state, 2); // p1 col2
    state = dropPiece(state, 2); // p2 col2
    state = dropPiece(state, 3); // p1 col3 → win
    expect(state.status).toBe("won");
    expect(state.winner).toBe(1);
    expect(state.winCells).toHaveLength(4);
  });

  it("transitions to draw when the last move fills the board without a win", () => {
    // Paired pattern (11,22,11 / 22,11,22) — max consecutive run is 2, so no four in a row
    // anywhere, including diagonals. Only (0,6) is empty.
    const almostFull: Board = [
      [1, 1, 2, 2, 1, 1, null] as Cell[],
      [2, 2, 1, 1, 2, 2, 1] as Cell[],
      [1, 1, 2, 2, 1, 1, 2] as Cell[],
      [2, 2, 1, 1, 2, 2, 1] as Cell[],
      [1, 1, 2, 2, 1, 1, 2] as Cell[],
      [2, 2, 1, 1, 2, 2, 1] as Cell[],
    ];
    const state: GameState = {
      board: almostFull,
      currentPlayer: 1,
      status: "playing",
      winner: null,
      winCells: null,
      lastMove: null,
    };
    const next = dropPiece(state, 6);
    expect(next.status).toBe("draw");
    expect(next.winner).toBeNull();
  });
});
