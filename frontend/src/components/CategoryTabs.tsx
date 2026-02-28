import type { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 border-b border-violet-200 mb-6 dark:border-violet-900">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 font-medium rounded-t-lg transition ${
            activeId === cat.id
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-violet-400/30'
              : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-900/30'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
