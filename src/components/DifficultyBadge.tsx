import type { PuzzleDifficulty } from '../types';

const config: Record<PuzzleDifficulty, { label: string; color: string }> = {
  BEGINNER: { label: 'Beginner', color: 'bg-green-600' },
  INTERMEDIATE: { label: 'Intermediate', color: 'bg-yellow-600' },
  ADVANCED: { label: 'Advanced', color: 'bg-orange-600' },
  MASTER: { label: 'Master', color: 'bg-red-600' },
};

export default function DifficultyBadge({ difficulty }: { difficulty: PuzzleDifficulty }) {
  const { label, color } = config[difficulty];
  return (
    <span className={`${color} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
      {label}
    </span>
  );
}
