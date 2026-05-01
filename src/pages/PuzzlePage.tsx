import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi';
import { usePuzzleStore } from '../stores/puzzleStore';
import LoadingSpinner from '../components/LoadingSpinner';
import DifficultyBadge from '../components/DifficultyBadge';
import PuzzleTimer from '../components/PuzzleTimer';
import MoveHistory from '../components/MoveHistory';
import type { Puzzle, PuzzleDifficulty } from '../types';

interface MoveRecord {
  number: number;
  playerMove: string;
  opponentMove?: string;
  correct: boolean;
}

const DIFFICULTIES: PuzzleDifficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'MASTER'];

function PuzzleBoard({ puzzle, startTime }: { puzzle: Puzzle; startTime: number | null }) {
  const { isSolved, isFailed, ratingChange, validateMove, solvePuzzle } = usePuzzleStore();

  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState('Your turn — find the best move!');
  const [isProcessing, setIsProcessing] = useState(false);
  const boardOrientation = puzzle.sideToMove === 'WHITE' ? 'white' : 'black';

  useEffect(() => {
    if (isSolved) {
      solvePuzzle();
    }
  }, [isSolved, solvePuzzle]);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: { piece: { pieceType: string; isSparePiece: boolean; position: string }; sourceSquare: string; targetSquare: string | null }) => {
      if (isSolved || isFailed || isProcessing || !targetSquare) return false;

      const preMovefen = game.fen();
      const gameCopy = new Chess(preMovefen);
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (!move) return false;

      setGame(gameCopy);
      setIsProcessing(true);
      setStatusMessage('Checking move...');

      const uciMove = sourceSquare + targetSquare + (move.promotion || '');

      validateMove(uciMove)
        .then((result) => {
          const newMoveRecord: MoveRecord = {
            number: moves.length + 1,
            playerMove: move.san,
            correct: result.correct,
          };

          if (result.correct) {
            if (result.puzzleComplete) {
              setMoves((prev) => [...prev, newMoveRecord]);
              setStatusMessage('Puzzle solved!');
            } else if (result.opponentMove) {
              const opponentGame = new Chess(gameCopy.fen());
              const from = result.opponentMove.slice(0, 2);
              const to = result.opponentMove.slice(2, 4);
              const opponentMoveResult = opponentGame.move({ from, to, promotion: 'q' });
              if (opponentMoveResult) {
                newMoveRecord.opponentMove = opponentMoveResult.san;
                setGame(opponentGame);
              }
              setMoves((prev) => [...prev, newMoveRecord]);
              setStatusMessage('Correct! Keep going...');
            }
          } else {
            setGame(new Chess(preMovefen));
            setMoves((prev) => [...prev, newMoveRecord]);
            setStatusMessage('Incorrect move. Puzzle failed.');
          }
        })
        .catch(() => {
          setGame(new Chess(preMovefen));
          setStatusMessage('Error validating move. Please try again.');
        })
        .finally(() => {
          setIsProcessing(false);
        });

      return true;
    },
    [game, isSolved, isFailed, isProcessing, moves, validateMove]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-6">
          <div className="max-w-[600px] mx-auto">
            <Chessboard
              options={{
                position: game.fen(),
                onPieceDrop: onDrop,
                boardOrientation: boardOrientation,
                boardStyle: { borderRadius: '8px' },
                darkSquareStyle: { backgroundColor: '#769656' },
                lightSquareStyle: { backgroundColor: '#eeeed2' },
                animationDurationInMs: 200,
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--color-surface)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <DifficultyBadge difficulty={puzzle.difficulty} />
            <PuzzleTimer startTime={startTime} stopped={isSolved || isFailed} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
              <div className="text-[var(--color-text-muted)]">Mate in</div>
              <div className="text-xl font-bold text-white">{puzzle.mateIn}</div>
            </div>
            <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
              <div className="text-[var(--color-text-muted)]">Play as</div>
              <div className="text-xl font-bold text-white">{puzzle.sideToMove === 'WHITE' ? '\u2654' : '\u265A'}</div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 text-center font-medium ${
          isSolved
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : isFailed
            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
        }`}>
          {isSolved && <FiCheckCircle className="inline mr-2" size={20} />}
          {isFailed && <FiXCircle className="inline mr-2" size={20} />}
          {statusMessage}
          {ratingChange !== null && (
            <div className="mt-2 text-lg">
              Rating: <span className={ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                {ratingChange >= 0 ? '+' : ''}{ratingChange}
              </span>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">Move History</h3>
          <MoveHistory moves={moves} />
        </div>
      </div>
    </div>
  );
}

export default function PuzzlePage() {
  const {
    currentPuzzle,
    isLoading,
    error,
    startTime,
    isSolved,
    isFailed,
    fetchPuzzle,
    resetPuzzle,
  } = usePuzzleStore();

  const [selectedDifficulty, setSelectedDifficulty] = useState<PuzzleDifficulty | undefined>();

  const handleNewPuzzle = () => {
    resetPuzzle();
    fetchPuzzle(selectedDifficulty);
  };

  if (!currentPuzzle && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[var(--color-surface)] rounded-2xl p-8 text-center">
          <div className="text-6xl mb-6">&#9822;</div>
          <h1 className="text-3xl font-bold text-white mb-4">Ready to Solve?</h1>
          <p className="text-[var(--color-text-muted)] mb-8">Select a difficulty and start solving chess puzzles</p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedDifficulty(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedDifficulty
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              Any
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === d
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchPuzzle(selectedDifficulty)}
            className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Start Puzzle
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-[var(--color-text-muted)] mt-4">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-[var(--color-surface)] rounded-xl p-8">
          <FiXCircle className="mx-auto text-red-400 mb-4" size={48} />
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={handleNewPuzzle} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {currentPuzzle && (
        <PuzzleBoard key={currentPuzzle.id} puzzle={currentPuzzle} startTime={startTime} />
      )}
      <div className="max-w-7xl mx-auto mt-4 flex justify-center">
        <button
          onClick={handleNewPuzzle}
          className="px-6 py-3 bg-[var(--color-surface-alt)] hover:bg-[var(--color-primary)] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {isSolved || isFailed ? (
            <><FiArrowRight size={16} /> Next Puzzle</>
          ) : (
            <><FiRefreshCw size={16} /> Skip</>
          )}
        </button>
      </div>
    </div>
  );
}
