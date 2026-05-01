import api from './api';
import type {
  Puzzle,
  PuzzleDifficulty,
  MoveValidationRequest,
  MoveValidationResponse,
  PuzzleSolveResponse,
  PuzzlePoolStats,
} from '../types';

export const puzzleService = {
  async getNextPuzzle(difficulty?: PuzzleDifficulty): Promise<Puzzle> {
    const response = await api.get<Puzzle>('/puzzles/next', {
      params: difficulty ? { difficulty } : {},
    });
    return response.data;
  },

  async getPuzzleById(id: string): Promise<Puzzle> {
    const response = await api.get<Puzzle>(`/puzzles/${id}`);
    return response.data;
  },

  async validateMove(puzzleId: string, data: MoveValidationRequest): Promise<MoveValidationResponse> {
    const response = await api.post<MoveValidationResponse>(`/puzzles/${puzzleId}/validate`, data);
    return response.data;
  },

  async solvePuzzle(puzzleId: string, timeMs: number): Promise<PuzzleSolveResponse> {
    const response = await api.post<PuzzleSolveResponse>(`/puzzles/${puzzleId}/solve`, { timeMs });
    return response.data;
  },

  async triggerGeneration(difficulty: PuzzleDifficulty, count = 10): Promise<void> {
    await api.post('/puzzles/generate', { difficulty, count });
  },

  async getPoolStats(): Promise<PuzzlePoolStats> {
    const response = await api.get<PuzzlePoolStats>('/puzzles/stats');
    return response.data;
  },
};
