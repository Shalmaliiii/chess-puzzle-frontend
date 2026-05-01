import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiTarget, FiAward, FiSettings, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to: string, icon: React.ReactNode, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-alt)]'
        }`}
      >
        {icon}
        <span className="hidden md:inline">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-surface-alt)] px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="text-2xl">&#9822;</span>
          <span className="hidden sm:inline">Chess Puzzles</span>
        </Link>

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {navLink('/', <FiHome size={18} />, 'Dashboard')}
              {navLink('/puzzle', <FiTarget size={18} />, 'Solve')}
              {navLink('/leaderboard', <FiAward size={18} />, 'Leaderboard')}
              {user?.role === 'ADMIN' && navLink('/admin', <FiSettings size={18} />, 'Admin')}
              <div className="ml-2 flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <span className="text-[var(--color-gold)] font-semibold">{user?.rating ?? '—'}</span>
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                >
                  <FiLogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {navLink('/login', <FiLogIn size={18} />, 'Login')}
              {navLink('/register', <FiUserPlus size={18} />, 'Register')}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
