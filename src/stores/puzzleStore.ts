import { create } from 'zustand';
import type { Puzzle, PuzzleDifficulty, MoveValidationResponse } from '../types';
import { puzzleService } from '../services/puzzleService';

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  moveNumber: number;
  isLoading: boolean;
  isSolved: boolean;
  isFailed: boolean;
  error: string | null;
  startTime: number | null;
  lastValidation: MoveValidationResponse | null;
  ratingChange: number | null;
  solutionLine: string[] | null;
  showingSolution: boolean;
  fetchPuzzle: (difficulty?: PuzzleDifficulty) => Promise<void>;
  validateMove: (move: string) => Promise<MoveValidationResponse>;
  solvePuzzle: () => Promise<void>;
  resetPuzzle: () => void;
  retryPuzzle: () => void;
  fetchSolution: () => Promise<string[] | null>;
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  currentPuzzle: null,
  moveNumber: 1,
  isLoading: false,
  isSolved: false,
  isFailed: false,
  error: null,
  startTime: null,
  lastValidation: null,
  ratingChange: null,
  solutionLine: null,
  showingSolution: false,

  fetchPuzzle: async (difficulty?) => {
    set({ isLoading: true, error: null, isSolved: false, isFailed: false, moveNumber: 1, lastValidation: null, ratingChange: null, solutionLine: null, showingSolution: false });
    try {
      const puzzle = await puzzleService.getNextPuzzle(difficulty);
      set({ currentPuzzle: puzzle, isLoading: false, startTime: Date.now() });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load puzzle';
      set({ error: message, isLoading: false });
    }
  },

  validateMove: async (move: string) => {
    const { currentPuzzle, moveNumber } = get();
    if (!currentPuzzle) throw new Error('No puzzle loaded');
    const result = await puzzleService.validateMove(currentPuzzle.id, { move, moveNumber });
    if (result.correct) {
      set({ moveNumber: moveNumber + 1, lastValidation: result });
      if (result.puzzleComplete) {
        set({ isSolved: true });
      }
    } else {
      set({ isFailed: true, lastValidation: result });
    }
    return result;
  },

  solvePuzzle: async () => {
    const { currentPuzzle, startTime } = get();
    if (!currentPuzzle || !startTime) return;
    try {
      const timeMs = Date.now() - startTime;
      const result = await puzzleService.solvePuzzle(currentPuzzle.id, timeMs);
      set({ ratingChange: result.ratingChange });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit solve';
      set({ error: message });
    }
  },

  retryPuzzle: () => {
    set({
      moveNumber: 1,
      isFailed: false,
      isSolved: false,
      error: null,
      lastValidation: null,
      ratingChange: null,
      solutionLine: null,
      showingSolution: false,
      startTime: Date.now(),
    });
  },

  fetchSolution: async () => {
    const { currentPuzzle } = get();
    if (!currentPuzzle) return null;
    try {
      const data = await puzzleService.getSolution(currentPuzzle.id);
      set({ solutionLine: data.solutionLine, showingSolution: true });
      return data.solutionLine;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch solution';
      set({ error: message });
      return null;
    }
  },

  resetPuzzle: () => {
    set({
      currentPuzzle: null,
      moveNumber: 1,
      isLoading: false,
      isSolved: false,
      isFailed: false,
      error: null,
      startTime: null,
      lastValidation: null,
      ratingChange: null,
      solutionLine: null,
      showingSolution: false,
    });
  },
}));
