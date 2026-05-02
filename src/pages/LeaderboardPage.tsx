import { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import type { LeaderboardEntry } from '../types';
import { useAuthStore } from '../stores/authStore';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    userService
      .getLeaderboard(50)
      .then(setEntries)
      .catch(() => setError('Failed to load leaderboard'))
      .finally(() => setIsLoading(false));
  }, []);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-[var(--color-gold)]';
    if (rank === 2) return 'text-[var(--color-silver)]';
    if (rank === 3) return 'text-[var(--color-bronze)]';
    return 'text-[var(--color-text-muted)]';
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FiAward className="text-[var(--color-gold)]" size={32} />
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
      </div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[entries[1], entries[0], entries[2]].map((entry, idx) => {
            const podiumOrder = [2, 1, 3];
            const rank = podiumOrder[idx];
            const height = rank === 1 ? 'h-32' : rank === 2 ? 'h-24' : 'h-20';
            return (
              <div key={entry.username} className="flex flex-col items-center">
                <div className={`text-center mb-2 ${currentUser?.username === entry.username ? 'ring-2 ring-[var(--color-primary)] rounded-lg p-2' : 'p-2'}`}>
                  <div className={`text-2xl font-bold ${getMedalColor(rank)}`}>{getRankDisplay(rank)}</div>
                  <div className="text-white font-semibold text-sm mt-1 truncate max-w-[120px]">{entry.username}</div>
                  <div className="text-[var(--color-gold)] font-bold">{entry.rating}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{entry.totalSolved} solved</div>
                </div>
                <div className={`w-full ${height} bg-[var(--color-surface)] rounded-t-lg`} />
              </div>
            );
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="bg-[var(--color-surface)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-surface-alt)]">
              <th className="text-left py-4 px-4 w-16">Rank</th>
              <th className="text-left py-4 px-4">Player</th>
              <th className="text-right py-4 px-4">Rating</th>
              <th className="text-right py-4 px-4">Solved</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isCurrentUser = currentUser?.username === entry.username;
              return (
                <tr
                  key={entry.rank}
                  className={`border-b border-[var(--color-surface-alt)]/50 transition-colors ${
                    isCurrentUser
                      ? 'bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20'
                      : 'hover:bg-[var(--color-surface-alt)]/20'
                  }`}
                >
                  <td className={`py-3 px-4 font-bold ${getMedalColor(entry.rank)}`}>
                    {getRankDisplay(entry.rank)}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {entry.username}
                    {isCurrentUser && <span className="ml-2 text-xs text-[var(--color-primary)]">(you)</span>}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--color-gold)] font-semibold">{entry.rating}</td>
                  <td className="py-3 px-4 text-right text-[var(--color-text-muted)]">{entry.totalSolved}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {entries.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">No players on the leaderboard yet.</div>
        )}
      </div>
    </div>
  );
}
