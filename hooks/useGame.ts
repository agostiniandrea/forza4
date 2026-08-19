"use client";

import { useCallback, useReducer, useRef } from "react";
import { GameState, createInitialState, dropPiece, COLS } from "@/lib/game-engine";
import { AiDifficulty, getBestMove } from "@/lib/ai";

export type GameMode = "2p" | "ai";

interface FullState {
  game: GameState;
  mode: GameMode;
  aiDifficulty: AiDifficulty;
  scores: { 1: number; 2: number };
  selectedCol: number;
  isAiThinking: boolean;
}

type Action =
  | { type: "DROP"; col: number }
  | { type: "AI_DROP"; col: number }
  | { type: "RESET" }
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "SET_DIFFICULTY"; difficulty: AiDifficulty }
  | { type: "SELECT_COL"; col: number }
  | { type: "AI_THINKING"; value: boolean };

function reducer(state: FullState, action: Action): FullState {
  switch (action.type) {
    case "DROP":
    case "AI_DROP": {
      const nextGame = dropPiece(state.game, action.col);
      if (nextGame === state.game) return state;
      const scores = { ...state.scores };
      if (nextGame.winner) scores[nextGame.winner]++;
      return {
        ...state,
        game: nextGame,
        scores,
        isAiThinking: false,
      };
    }
    case "RESET":
      return { ...state, game: createInitialState(), isAiThinking: false };
    case "SET_MODE":
      return { ...state, mode: action.mode, game: createInitialState(), isAiThinking: false };
    case "SET_DIFFICULTY":
      return { ...state, aiDifficulty: action.difficulty, game: createInitialState(), isAiThinking: false };
    case "SELECT_COL":
      return { ...state, selectedCol: action.col };
    case "AI_THINKING":
      return { ...state, isAiThinking: action.value };
    default:
      return state;
  }
}

const initial: FullState = {
  game: createInitialState(),
  mode: "2p",
  aiDifficulty: "medium",
  scores: { 1: 0, 2: 0 },
  selectedCol: 3,
  isAiThinking: false,
};

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const drop = useCallback(
    (col: number) => {
      if (state.game.status !== "playing") return;
      if (state.isAiThinking) return;

      const currentPlayer = state.game.currentPlayer;
      dispatch({ type: "DROP", col });

      if (
        state.mode === "ai" &&
        state.game.status === "playing" &&
        currentPlayer === 1
      ) {
        dispatch({ type: "AI_THINKING", value: true });
        const board = state.game.board;
        const difficulty = state.aiDifficulty;

        if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = setTimeout(() => {
          const testGame = dropPiece({ ...state.game, board }, col);
          if (testGame.status !== "playing") {
            dispatch({ type: "AI_THINKING", value: false });
            return;
          }
          const aiCol = getBestMove(testGame.board, difficulty);
          dispatch({ type: "AI_DROP", col: aiCol });
          /* 600ms read as sluggish: it stacked on top of the player's drop
             animation and the AI's own, pushing a round trip past two seconds.
             280ms still lands as a deliberate beat rather than an instant reply. */
        }, 280);
      }
    },
    [state, dispatch]
  );

  const reset = useCallback(() => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    dispatch({ type: "RESET" });
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const setDifficulty = useCallback((difficulty: AiDifficulty) => {
    dispatch({ type: "SET_DIFFICULTY", difficulty });
  }, []);

  const selectCol = useCallback((col: number) => {
    const clamped = Math.max(0, Math.min(COLS - 1, col));
    dispatch({ type: "SELECT_COL", col: clamped });
  }, []);

  return {
    ...state,
    drop,
    reset,
    setMode,
    setDifficulty,
    selectCol,
  };
}
