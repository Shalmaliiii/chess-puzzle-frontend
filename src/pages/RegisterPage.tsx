import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    try {
      await register(email, username, password);
      navigate('/');
    } catch {
      // error is set in store
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">&#9822;</div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Start your puzzle journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] rounded-2xl p-8 space-y-5 shadow-xl">
          {displayError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
              <span>{displayError}</span>
              <button type="button" onClick={() => { clearError(); setLocalError(''); }} className="text-red-400 hover:text-red-300">&times;</button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                placeholder="chessmaster42"
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-surface-alt)] rounded-lg text-white placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

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
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-surface-alt)] rounded-lg text-white placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your password"
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-surface-alt)] rounded-lg text-white placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <><FiUserPlus size={18} /> Create Account</>}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-primary)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
