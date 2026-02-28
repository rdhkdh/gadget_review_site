import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { gadgets as gadgetsApi } from '../api/client';
import type { Gadget, Review } from '../types';

function num(x: number | string): number {
  return typeof x === 'string' ? parseFloat(x) : x;
}

function GadgetPanel({ gadget, allSpecKeys }: { gadget: Gadget & { reviews?: Review[] }; allSpecKeys: string[] }) {
  const specs = gadget.performanceSpecs as Record<string, unknown> | null;
  return (
    <div className="rounded-xl border border-violet-100 dark:border-violet-900/40 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      <div className="aspect-[4/3] bg-gradient-to-br from-indigo-50 to-violet-100 overflow-hidden">
        {gadget.imageUrl
          ? <img src={gadget.imageUrl} alt={gadget.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-violet-300 text-4xl">📱</div>}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">{gadget.name}</h2>
          <p className="text-sm text-slate-500">{gadget.brand?.name} · {gadget.model}</p>
        </div>
        <p className="text-xl font-bold text-violet-600 dark:text-violet-400">${num(gadget.price).toFixed(0)}</p>
        <p className="text-amber-600 text-sm">★ {num(gadget.averageRating).toFixed(1)} ({gadget.reviewCount} reviews)</p>
        {gadget.description && <p className="text-sm text-slate-600 dark:text-slate-400">{gadget.description}</p>}
        {allSpecKeys.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Specs</h3>
            <ul className="space-y-1 text-sm">
              {allSpecKeys.map((k) => (
                <li key={k} className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-1">
                  <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">{specs?.[k] != null ? String(specs[k]) : '—'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ids = (searchParams.get('ids') ?? '').split(',').map(Number).filter(Boolean);
  const [gadgets, setGadgets] = useState<(Gadget & { reviews?: Review[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ids.length < 2) {
      setError('Select at least 2 gadgets to compare.');
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => gadgetsApi.getById(id)))
      .then(setGadgets)
      .catch(() => setError('Failed to load gadgets.'))
      .finally(() => setLoading(false));
  }, []); // run once on mount; ids from URL are stable

  const allSpecKeys = Array.from(
    new Set(gadgets.flatMap((g) => g.performanceSpecs ? Object.keys(g.performanceSpecs as Record<string, unknown>) : []))
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={() => navigate(-1)} className="text-sm text-violet-600 dark:text-violet-400 hover:underline">← Back</button>
        <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">Compare Gadgets</h1>
      </div>
      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${gadgets.length}, minmax(0, 1fr))` }}
        >
          {gadgets.map((g) => (
            <GadgetPanel key={g.id} gadget={g} allSpecKeys={allSpecKeys} />
          ))}
        </div>
      )}
    </div>
  );
}
