import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiTrendingUp, FiZap, FiAward, FiClock, FiPercent } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import DifficultyBadge from '../components/DifficultyBadge';
import type { PuzzleDifficulty } from '../types';

const DIFFICULTY_COLORS: Record<PuzzleDifficulty, string> = {
  BEGINNER: '#16a34a',
  INTERMEDIATE: '#ca8a04',
  ADVANCED: '#ea580c',
  MASTER: '#dc2626',
};

export default function DashboardPage() {
  const { user, loadUser, isLoading } = useAuthStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      loadUser().then(() => setLoaded(true));
    }
  }, [loadUser, loaded]);

  if (isLoading || !loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-text-muted)]">Unable to load profile.</p>
      </div>
    );
  }

  const { stats } = user;

  const statCards = [
    { icon: <FiTarget size={24} />, label: 'Puzzles Solved', value: stats.totalSolved, color: 'text-green-400' },
    { icon: <FiPercent size={24} />, label: 'Accuracy', value: `${stats.accuracy.toFixed(1)}%`, color: 'text-blue-400' },
    { icon: <FiTrendingUp size={24} />, label: 'Rating', value: user.rating, color: 'text-[var(--color-gold)]' },
    { icon: <FiZap size={24} />, label: 'Current Streak', value: stats.currentStreak, color: 'text-purple-400' },
    { icon: <FiAward size={24} />, label: 'Best Streak', value: stats.bestStreak, color: 'text-orange-400' },
    { icon: <FiClock size={24} />, label: 'Avg. Time', value: `${(stats.averageSolveTimeMs / 1000).toFixed(0)}s`, color: 'text-cyan-400' },
  ];

  const difficultyData = (Object.entries(stats.byDifficulty) as [PuzzleDifficulty, { solved: number; attempted: number }][]).map(
    ([difficulty, data]) => ({
      name: difficulty.charAt(0) + difficulty.slice(1).toLowerCase(),
      solved: data.solved,
      attempted: data.attempted,
      fill: DIFFICULTY_COLORS[difficulty],
    })
  );

  const pieData = difficultyData.map((d) => ({ name: d.name, value: d.solved, fill: d.fill }));

  const recentPuzzles = user.recentPuzzles.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user.username}</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Here's your puzzle performance overview</p>
        </div>
        <Link
          to="/puzzle"
          className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <FiTarget size={18} /> Solve Puzzle
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[var(--color-surface)] rounded-xl p-4 text-center">
            <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Performance by Difficulty</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={difficultyData}>
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#16213e', border: '1px solid #0f3460', borderRadius: '8px', color: '#e4e4e7' }}
              />
              <Bar dataKey="solved" name="Solved" fill="#1b9e4b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attempted" name="Attempted" fill="#0f3460" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Solve Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#16213e', border: '1px solid #0f3460', borderRadius: '8px', color: '#e4e4e7' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Puzzles */}
      <div className="bg-[var(--color-surface)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Puzzles</h2>
        {recentPuzzles.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-center py-8">
            No puzzles solved yet.{' '}
            <Link to="/puzzle" className="text-[var(--color-primary)] hover:underline">
              Start solving!
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-surface-alt)]">
                  <th className="text-left py-3 px-2">Difficulty</th>
                  <th className="text-left py-3 px-2">Result</th>
                  <th className="text-left py-3 px-2">Time</th>
                  <th className="text-left py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPuzzles.map((puzzle, i) => (
                  <tr key={i} className="border-b border-[var(--color-surface-alt)]/50 hover:bg-[var(--color-surface-alt)]/20">
                    <td className="py-3 px-2">
                      <DifficultyBadge difficulty={puzzle.difficulty} />
                    </td>
                    <td className="py-3 px-2">
                      <span className={puzzle.correct ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                        {puzzle.correct ? 'Solved' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[var(--color-text-muted)] font-mono">
                      {(puzzle.timeMs / 1000).toFixed(1)}s
                    </td>
                    <td className="py-3 px-2 text-[var(--color-text-muted)]">
                      {new Date(puzzle.solvedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
