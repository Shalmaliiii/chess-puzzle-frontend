import { useEffect, useState } from 'react';
import { FiSettings, FiPlay, FiActivity, FiDatabase } from 'react-icons/fi';
import { puzzleService } from '../services/puzzleService';
import { engineService } from '../services/engineService';
import LoadingSpinner from '../components/LoadingSpinner';
import type { PuzzleDifficulty, PuzzlePoolStats } from '../types';

const DIFFICULTIES: PuzzleDifficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'MASTER'];

const DIFFICULTY_COLORS: Record<PuzzleDifficulty, string> = {
  BEGINNER: 'bg-green-600',
  INTERMEDIATE: 'bg-yellow-600',
  ADVANCED: 'bg-orange-600',
  MASTER: 'bg-red-600',
};

export default function AdminPage() {
  const [poolStats, setPoolStats] = useState<PuzzlePoolStats | null>(null);
  const [engineHealth, setEngineHealth] = useState<{
    status: string;
    engineVersion: string;
    poolSize: number;
    activeWorkers: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generating, setGenerating] = useState<PuzzleDifficulty | null>(null);
  const [genCount, setGenCount] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      puzzleService.getPoolStats().catch(() => null),
      engineService.healthCheck().catch(() => null),
    ]).then(([stats, health]) => {
      setPoolStats(stats);
      setEngineHealth(health);
      setIsLoading(false);
    });
  }, []);

  const handleGenerate = async (difficulty: PuzzleDifficulty) => {
    setGenerating(difficulty);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await puzzleService.triggerGeneration(difficulty, genCount);
      setSuccessMsg(`Triggered generation of ${genCount} ${difficulty.toLowerCase()} puzzles`);
      const stats = await puzzleService.getPoolStats().catch(() => null);
      if (stats) setPoolStats(stats);
    } catch {
      setErrorMsg('Failed to trigger puzzle generation');
    } finally {
      setGenerating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FiSettings className="text-[var(--color-primary)]" size={28} />
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engine Status */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiActivity size={20} className="text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-white">Engine Status</h2>
          </div>
          {engineHealth ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-surface-alt)]">
                <span className="text-[var(--color-text-muted)]">Status</span>
                <span className={`font-semibold ${engineHealth.status === 'UP' ? 'text-green-400' : 'text-red-400'}`}>
                  {engineHealth.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-surface-alt)]">
                <span className="text-[var(--color-text-muted)]">Engine Version</span>
                <span className="text-white">{engineHealth.engineVersion}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-surface-alt)]">
                <span className="text-[var(--color-text-muted)]">Pool Size</span>
                <span className="text-white">{engineHealth.poolSize}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[var(--color-text-muted)]">Active Workers</span>
                <span className="text-white">{engineHealth.activeWorkers}</span>
              </div>
            </div>
          ) : (
            <p className="text-red-400 text-sm">Engine service unavailable</p>
          )}
        </div>

        {/* Puzzle Pool Stats */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiDatabase size={20} className="text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-white">Puzzle Pool</h2>
          </div>
          {poolStats ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-surface-alt)]">
                <span className="text-[var(--color-text-muted)]">Total Puzzles</span>
                <span className="text-white text-xl font-bold">{poolStats.total}</span>
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium text-[var(--color-text-muted)]">By Difficulty</h3>
                {DIFFICULTIES.map((d) => (
                  <div key={d} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${DIFFICULTY_COLORS[d]}`} />
                      <span className="text-sm text-white">{d.charAt(0) + d.slice(1).toLowerCase()}</span>
                    </div>
                    <span className="text-sm text-[var(--color-text-muted)]">{poolStats.byDifficulty[d] ?? 0}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium text-[var(--color-text-muted)]">By Status</h3>
                {(Object.entries(poolStats.byStatus) as [string, number][]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-white">{status}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-400 text-sm">Puzzle service unavailable</p>
          )}
        </div>
      </div>

      {/* Generate Puzzles */}
      <div className="bg-[var(--color-surface)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiPlay size={20} className="text-[var(--color-primary)]" />
          <h2 className="text-lg font-semibold text-white">Generate Puzzles</h2>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          Trigger asynchronous puzzle generation via the Engine Service. Puzzles are generated via Kafka and stored once ready.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Count per batch</label>
          <input
            type="number"
            min={1}
            max={100}
            value={genCount}
            onChange={(e) => setGenCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-32 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-surface-alt)] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => handleGenerate(d)}
              disabled={generating !== null}
              className={`py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${DIFFICULTY_COLORS[d]} hover:opacity-90 disabled:opacity-50`}
            >
              {generating === d ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FiPlay size={16} />
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
