import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-surface-alt)] py-4 text-center text-sm text-[var(--color-text-muted)]">
        Chess Puzzle Platform &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
