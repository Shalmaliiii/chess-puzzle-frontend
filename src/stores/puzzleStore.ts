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
  fetchPuzzle: (difficulty?: PuzzleDifficulty) => Promise<void>;
  validateMove: (move: string) => Promise<MoveValidationResponse>;
  solvePuzzle: () => Promise<void>;
  resetPuzzle: () => void;
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

  fetchPuzzle: async (difficulty?) => {
    set({ isLoading: true, error: null, isSolved: false, isFailed: false, moveNumber: 1, lastValidation: null, ratingChange: null });
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
    try {
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      set({ error: message });
      throw err;
    }
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
    });
  },
}));
