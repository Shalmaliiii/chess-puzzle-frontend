import { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

export default function PuzzleTimer({ startTime, stopped }: { startTime: number | null; stopped: boolean }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime || stopped) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, stopped]);

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const display = `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 text-lg font-mono text-[var(--color-text-muted)]">
      <FiClock size={18} />
      <span>{display}</span>
    </div>
  );
}
