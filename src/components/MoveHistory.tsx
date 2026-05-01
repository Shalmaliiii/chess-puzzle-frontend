interface Move {
  number: number;
  playerMove: string;
  opponentMove?: string;
  correct: boolean;
}

export default function MoveHistory({ moves }: { moves: Move[] }) {
  if (moves.length === 0) {
    return (
      <div className="text-sm text-[var(--color-text-muted)] italic p-3">
        Make your first move...
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-48 overflow-y-auto p-2">
      {moves.map((move) => (
        <div key={move.number} className="flex items-center gap-2 text-sm font-mono">
          <span className="text-[var(--color-text-muted)] w-6 text-right">{move.number}.</span>
          <span className={move.correct ? 'text-green-400' : 'text-red-400'}>
            {move.playerMove}
          </span>
          {move.opponentMove && (
            <span className="text-[var(--color-text-muted)]">{move.opponentMove}</span>
          )}
        </div>
      ))}
    </div>
  );
}
