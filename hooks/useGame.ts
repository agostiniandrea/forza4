"use client";

import { useCallback, useReducer, useRef } from "react";
import { GameState, createInitialState, dropPiece } from "@/lib/game-engine";
import { AiDifficulty, getBestMove } from "@/lib/ai";

export type GameMode = "2p" | "ai";

interface FullState {
  game: GameState;
  mode: GameMode;
  aiDifficulty: AiDifficulty;
  scores: { 1: number; 2: number };
  isAiThinking: boolean;
}

type Action =
  | { type: "DROP"; col: number }
  | { type: "AI_DROP"; col: number }
  | { type: "RESET" }
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "SET_DIFFICULTY"; difficulty: AiDifficulty }
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
      // Confirming setup (first time, or via "Change players") starts a new
      // match, so the running score resets here too — otherwise a rename or
      // a mode switch carries over a tally that belongs to the previous
      // pair of players. "Play again" (the RESET case above) intentionally
      // does NOT reset scores: that's the same match, next round.
      return {
        ...state,
        mode: action.mode,
        game: createInitialState(),
        scores: { 1: 0, 2: 0 },
        isAiThinking: false,
      };
    case "SET_DIFFICULTY":
      return { ...state, aiDifficulty: action.difficulty, game: createInitialState(), isAiThinking: false };
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

      // `state` here is still the pre-move snapshot (dispatch hasn't applied
      // yet), so `state.game.status` is always "playing" — the drop() guard
      // above already ensured that. Whether the human's move just won or drew
      // the game is checked for real below, via `testGame`, once we recompute
      // the post-move board.
      if (state.mode === "ai" && currentPlayer === 1) {
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
        }, 600);
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

  return {
    ...state,
    drop,
    reset,
    setMode,
    setDifficulty,
  };
}
