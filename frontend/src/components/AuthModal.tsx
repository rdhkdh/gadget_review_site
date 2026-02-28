import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PasswordInput } from './PasswordInput';

export function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
      setOpen(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setError(''); setMode('login'); }}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 transition shadow-sm shadow-violet-500/30"
      >
        Log in
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display font-bold text-xl text-slate-900 mb-4 dark:text-slate-100">
              {mode === 'login' ? 'Log in' : 'Create account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 shadow-sm shadow-violet-500/30"
                >
                  {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Register'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="text-brand-600 font-medium hover:underline"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              >
                {mode === 'login' ? 'Register' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
