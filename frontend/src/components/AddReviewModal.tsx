import { useEffect, useState, useRef } from 'react';
import type { Gadget } from '../types';
import { gadgets as gadgetsApi, reviews as reviewsApi } from '../api/client';

interface AddReviewModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function num(x: number | string): number {
  return typeof x === 'string' ? parseFloat(x) : x;
}

export function AddReviewModal({ onClose, onSuccess }: AddReviewModalProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Gadget[]>([]);
  const [selected, setSelected] = useState<Gadget | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial fetch — all gadgets
  useEffect(() => {
    setSearching(true);
    gadgetsApi.list({}).then(setResults).finally(() => setSearching(false));
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      gadgetsApi.list({ search: search.trim() || undefined })
        .then(setResults)
        .finally(() => setSearching(false));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await reviewsApi.create(selected.id, rating, comment.trim() || undefined);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const specs = selected?.performanceSpecs && typeof selected.performanceSpecs === 'object'
    ? selected.performanceSpecs as Record<string, unknown>
    : null;
  const specEntries = specs ? Object.entries(specs).slice(0, 3) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl shadow-violet-900/20 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto border border-violet-100 dark:bg-slate-900 dark:border-violet-900/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-t-2xl" />

        <div className="p-6 space-y-5">
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">Add a Review</h2>

          {/* Gadget selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              Search for a gadget
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
              placeholder="Type to search..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />

            {/* Results list — shown when no gadget selected */}
            {!selected && (
              <div className="mt-1.5 max-h-56 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50 dark:border-slate-700 dark:divide-slate-800">
                {searching ? (
                  <p className="text-slate-400 text-sm px-3 py-3">Searching…</p>
                ) : results.length === 0 ? (
                  <p className="text-slate-400 text-sm px-3 py-3">No gadgets found.</p>
                ) : (
                  results.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelected(g)}
                      className="w-full text-left px-3 py-2.5 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors"
                    >
                      <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{g.name}</span>
                      <span className="block text-xs text-slate-400 dark:text-slate-500">
                        {g.brand?.name} · ${num(g.price).toFixed(2)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Selected gadget card */}
            {selected && (
              <div className="mt-2 border border-violet-200 rounded-xl p-3 bg-violet-50/50 dark:bg-violet-950/20 dark:border-violet-900/50">
                <div className="flex gap-3">
                  {selected.imageUrl ? (
                    <img
                      src={selected.imageUrl}
                      alt={selected.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0 dark:from-indigo-950 dark:to-violet-950">
                      <span className="text-2xl text-violet-400">📦</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm dark:text-slate-100 truncate">{selected.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selected.brand?.name} · {selected.model}</p>
                    <p className="text-xs font-medium text-brand-600 dark:text-violet-400 mt-0.5">
                      ${num(selected.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-amber-500 mt-0.5">
                      ★ {num(selected.averageRating).toFixed(1)} ({selected.reviewCount} reviews)
                    </p>
                  </div>
                </div>
                {specEntries.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {specEntries.map(([k, v]) => (
                      <li key={k} className="flex justify-between text-xs">
                        <span className="text-slate-500 capitalize dark:text-slate-400">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-slate-700 dark:text-slate-300">{String(v)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-2 text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                >
                  Change gadget
                </button>
              </div>
            )}
          </div>

          {/* Review form — shown only when gadget is selected */}
          {selected && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
                  Comment <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm dark:text-red-400">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-violet-100 bg-white rounded-b-2xl flex gap-3 dark:bg-slate-900 dark:border-slate-700">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
