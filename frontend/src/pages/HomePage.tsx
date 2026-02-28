import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories as categoriesApi, brands as brandsApi, gadgets as gadgetsApi } from '../api/client';
import type { Category, Brand, Gadget } from '../types';
import type { SortOption } from '../types';
import { CategoryTabs } from '../components/CategoryTabs';
import { FilterBar } from '../components/FilterBar';
import { GadgetCard } from '../components/GadgetCard';
import { GadgetModal } from '../components/GadgetModal';
import { AddReviewModal } from '../components/AddReviewModal';
import { AddGadgetModal } from '../components/AddGadgetModal';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption | null>(null);
  const [modalGadgetId, setModalGadgetId] = useState<number | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAddGadget, setShowAddGadget] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  function toggleCompareMode() {
    if (compareMode) setSelectedIds([]);
    setCompareMode((v) => !v);
  }

  function toggleGadget(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  const fetchCategories = useCallback(async () => {
    const data = await categoriesApi.list();
    setCategories(data);
    if (data.length > 0 && !activeCategoryId) setActiveCategoryId(data[0].id);
  }, [activeCategoryId]);

  const fetchBrands = useCallback(async (categoryId: number | null) => {
    const data = await brandsApi.list(categoryId ?? undefined);
    setBrands(data);
  }, []);

  const fetchGadgets = useCallback(async () => {
    if (activeCategoryId == null) return setGadgets([]);
    setLoading(true);
    try {
      const data = await gadgetsApi.list({
        categoryId: activeCategoryId,
        brandId: selectedBrandId ?? undefined,
        minRating: minRating ?? undefined,
        search: search.trim() || undefined,
        sortBy: sortBy ?? undefined,
      });
      setGadgets(data);
    } finally {
      setLoading(false);
    }
  }, [activeCategoryId, selectedBrandId, minRating, search, sortBy]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchBrands(activeCategoryId); }, [activeCategoryId, fetchBrands]);
  useEffect(() => { fetchGadgets(); }, [fetchGadgets]);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Gadget Review & Compare</h1>
      <p className="text-slate-500 dark:text-slate-400">Browse and compare gadgets by category.</p>

      <div className="mt-4 mb-6 flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={toggleCompareMode}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
            compareMode
              ? 'bg-violet-600 text-white border-violet-600'
              : 'border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/40'
          }`}
        >
          {compareMode ? 'Cancel Compare' : 'Compare'}
        </button>
        {isLoggedIn && (
          <>
            <button
              type="button"
              onClick={() => setShowAddReview(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-violet-500/30 transition-opacity"
            >
              + Add a Review
            </button>
            <button
              type="button"
              onClick={() => setShowAddGadget(true)}
              className="px-4 py-2 rounded-lg border border-violet-300 text-violet-700 text-sm font-medium hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/40 transition-colors"
            >
              + Add a Gadget
            </button>
          </>
        )}
      </div>

      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onSelect={(id) => { setActiveCategoryId(id); setSelectedBrandId(null); setSelectedIds([]); }}
        />
      )}

      {activeCategoryId != null && (
        <>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onBrandChange={setSelectedBrandId}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading gadgets...</p>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${compareMode ? 'pb-28' : ''}`}>
              {gadgets.map((g) => (
                <GadgetCard
                  key={g.id}
                  gadget={g}
                  onClick={() => setModalGadgetId(g.id)}
                  compareMode={compareMode}
                  isSelected={selectedIds.includes(g.id)}
                  onToggleSelect={() => toggleGadget(g.id)}
                  dimmed={compareMode && selectedIds.length >= 3 && !selectedIds.includes(g.id)}
                />
              ))}
            </div>
          )}

          {!loading && gadgets.length === 0 && (
            <p className="text-slate-500 text-center py-12 dark:text-slate-400">No gadgets match your filters.</p>
          )}
        </>
      )}

      {modalGadgetId != null && (
        <GadgetModal
          gadgetId={modalGadgetId}
          onClose={() => setModalGadgetId(null)}
          onReviewAdded={fetchGadgets}
          onDeleted={() => { setModalGadgetId(null); fetchGadgets(); }}
        />
      )}

      {showAddReview && (
        <AddReviewModal
          onClose={() => setShowAddReview(false)}
          onSuccess={fetchGadgets}
        />
      )}

      {showAddGadget && (
        <AddGadgetModal
          categories={categories}
          onClose={() => setShowAddGadget(false)}
          onSuccess={(newCategoryId) => {
            setActiveCategoryId(newCategoryId);
            setSelectedBrandId(null);
          }}
        />
      )}

      {compareMode && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-violet-200 dark:border-violet-800 shadow-xl">
          <div className="flex items-center justify-between gap-6 px-8 py-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 shrink-0 w-24">
              {selectedIds.length} / 3 selected
            </span>
            <div className="flex items-center gap-3 flex-1 justify-center">
              {selectedIds.map((id) => {
                const g = gadgets.find((x) => x.id === id);
                return g ? (
                  <div key={id} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{g.name}</span>
                    <button type="button" onClick={() => toggleGadget(id)} className="text-slate-400 hover:text-red-500 text-xs leading-none">✕</button>
                  </div>
                ) : null;
              })}
            </div>
            <div className="shrink-0 w-36 flex justify-end">
              <button
                type="button"
                disabled={selectedIds.length < 2}
                onClick={() => navigate(`/compare?ids=${selectedIds.join(',')}`)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-violet-500/30 transition whitespace-nowrap"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
