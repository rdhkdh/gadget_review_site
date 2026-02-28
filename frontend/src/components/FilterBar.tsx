import type { Brand } from '../types';
import type { SortOption } from '../types';

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  brands: Brand[];
  selectedBrandId: number | null;
  onBrandChange: (id: number | null) => void;
  minRating: number | null;
  onMinRatingChange: (v: number | null) => void;
  sortBy: SortOption | null;
  onSortByChange: (v: SortOption | null) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'rating_asc', label: 'Rating (low to high)' },
  { value: 'rating_desc', label: 'Rating (high to low)' },
];

export function FilterBar({
  search,
  onSearchChange,
  brands,
  selectedBrandId,
  onBrandChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-6 p-4 bg-white rounded-xl border border-violet-200 shadow-sm shadow-violet-100 dark:bg-slate-900 dark:border-violet-900/50">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Search</label>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Name or model..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
        />
      </div>
      <div className="w-40">
        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Brand</label>
        <select
          value={selectedBrandId ?? ''}
          onChange={(e) => onBrandChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
        >
          <option value="">All</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className="w-36">
        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Min rating</label>
        <select
          value={minRating ?? ''}
          onChange={(e) => onMinRatingChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>★ {n}+</option>
          ))}
        </select>
      </div>
      <div className="w-48">
        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Sort by</label>
        <select
          value={sortBy ?? ''}
          onChange={(e) => onSortByChange((e.target.value || null) as SortOption | null)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
        >
          <option value="">Default</option>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
