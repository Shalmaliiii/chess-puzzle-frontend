export type PuzzleDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER';
export type UserRole = 'USER' | 'ADMIN';
export type PuzzleStatus = 'PENDING' | 'ACTIVE' | 'RETIRED';

export interface DifficultyStats {
  solved: number;
  attempted: number;
}

export interface UserStats {
  totalSolved: number;
  totalAttempted: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  averageSolveTimeMs: number;
  byDifficulty: Record<PuzzleDifficulty, DifficultyStats>;
}

export interface PuzzleAttempt {
  puzzleId: string;
  solvedAt: string;
  timeMs: number;
  correct: boolean;
  difficulty: PuzzleDifficulty;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  rating: number;
  stats: UserStats;
  recentPuzzles: PuzzleAttempt[];
  createdAt: string;
  updatedAt: string;
}

export interface Puzzle {
  id: string;
  fen: string;
  sideToMove: 'WHITE' | 'BLACK';
  mateIn: number;
  difficulty: PuzzleDifficulty;
  themes?: string[];
  solvedByCount: number;
  attemptedCount: number;
  averageSolveTimeMs: number;
}

export interface MoveValidationRequest {
  move: string;
  moveNumber: number;
}

export interface MoveValidationResponse {
  correct: boolean;
  opponentMove: string | null;
  puzzleComplete: boolean;
  movesRemaining: number;
}

export interface PuzzleSolveResponse {
  ratingChange: number;
  newRating: number;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  rating: number;
  totalSolved: number;
}

export interface PuzzlePoolStats {
  total: number;
  byDifficulty: Record<PuzzleDifficulty, number>;
  byStatus: Record<PuzzleStatus, number>;
}

export interface EngineAnalysisRequest {
  fen: string;
  depth: number;
}

export interface EngineAnalysisResponse {
  bestMove: string;
  evaluation: string;
  principalVariation: string[];
  depth: number;
}
