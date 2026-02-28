import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from './AuthModal';

interface LayoutProps {
  children: ReactNode;
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Layout({ children }: LayoutProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-950 via-violet-950 to-purple-900 text-white shadow-lg shadow-violet-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              Gadget Review & Compare
            </Link>
            <nav className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggle}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="text-slate-300 text-sm hover:text-white transition">{user?.name}</Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-sm text-slate-300 hover:text-white transition"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <AuthModal />
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-slate-950">
        {children}
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-slate-500 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
        Gadget Review & Compare © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
