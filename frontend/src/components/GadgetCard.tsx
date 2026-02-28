import type { Gadget } from '../types';

interface GadgetCardProps {
  gadget: Gadget;
  onClick: () => void;
  compareMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  dimmed?: boolean;
}

function num(x: number | string): number {
  return typeof x === 'string' ? parseFloat(x) : x;
}

function specSummary(specs: Record<string, unknown> | null): string {
  if (!specs || typeof specs !== 'object') return '—';
  const entries = Object.entries(specs).slice(0, 3).map(([k, v]) => `${k}: ${String(v)}`);
  return entries.join(' · ') || '—';
}

export function GadgetCard({ gadget, onClick, compareMode, isSelected, onToggleSelect, dimmed }: GadgetCardProps) {
  const rating = num(gadget.averageRating);
  const price = num(gadget.price);

  return (
    <button
      type="button"
      onClick={compareMode ? onToggleSelect : onClick}
      className={`relative text-left w-full rounded-xl border bg-white shadow-sm hover:shadow-lg hover:shadow-violet-100 transition overflow-hidden focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-900 dark:shadow-none dark:hover:shadow-violet-900/30 ${
        compareMode && isSelected
          ? 'border-violet-500 ring-2 ring-violet-500 hover:border-violet-500 dark:border-violet-500'
          : 'border-violet-100 hover:border-violet-300 dark:border-violet-900/40 dark:hover:border-violet-500'
      } ${dimmed ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {compareMode && isSelected && (
        <span className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">✓</span>
      )}
      <div className="aspect-[4/3] bg-gradient-to-br from-indigo-50 to-violet-100 overflow-hidden">
        {gadget.imageUrl ? (
          <img
            src={gadget.imageUrl}
            alt={gadget.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-violet-300 text-4xl">📱</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-slate-900 truncate dark:text-slate-100">{gadget.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{gadget.brand?.name ?? '—'} · {gadget.model}</p>
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 dark:text-slate-500">{specSummary(gadget.performanceSpecs)}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-600 dark:text-violet-400">${price.toFixed(0)}</span>
          <span className="flex items-center gap-1 text-amber-600 text-sm">
            ★ {rating.toFixed(1)} ({gadget.reviewCount})
          </span>
        </div>
      </div>
    </button>
  );
}
