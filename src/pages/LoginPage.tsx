import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error is set in store
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">&#9822;</div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Sign in to continue solving puzzles</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] rounded-2xl p-8 space-y-5 shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
              <span>{error}</span>
              <button type="button" onClick={clearError} className="text-red-400 hover:text-red-300">&times;</button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-surface-alt)] rounded-lg text-white placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-surface-alt)] rounded-lg text-white placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <><FiLogIn size={18} /> Sign In</>}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
