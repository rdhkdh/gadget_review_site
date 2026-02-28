import { useEffect, useState } from 'react';
import type { Category, Brand } from '../types';
import { brands as brandsApi, gadgets as gadgetsApi } from '../api/client';

interface AddGadgetModalProps {
  categories: Category[];
  onClose: () => void;
  onSuccess: (categoryId: number) => void;
}

interface SpecRow {
  key: string;
  value: string;
}

export function AddGadgetModal({ categories, onClose, onSuccess }: AddGadgetModalProps) {
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id ?? 0);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState<number>(0);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [specs, setSpecs] = useState<SpecRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState('');

  // Fetch brands whenever category changes
  useEffect(() => {
    setBrandId(0);
    setShowNewBrand(false);
    setNewBrandName('');
    setBrandError('');
    brandsApi.list(categoryId).then((data) => {
      setBrands(data);
      if (data.length > 0) setBrandId(data[0].id);
    });
  }, [categoryId]);

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setBrandError('Brand name is required.');
      return;
    }
    setBrandLoading(true);
    setBrandError('');
    try {
      const created = await brandsApi.create(newBrandName.trim());
      setBrands((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setBrandId(created.id);
      setNewBrandName('');
      setShowNewBrand(false);
    } catch (e) {
      setBrandError(e instanceof Error ? e.message : 'Failed to create brand');
    } finally {
      setBrandLoading(false);
    }
  };

  const addSpecRow = () => setSpecs((prev) => [...prev, { key: '', value: '' }]);
  const removeSpecRow = (i: number) => setSpecs((prev) => prev.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
    setSpecs((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const handleSubmit = async () => {
    if (!name.trim() || !model.trim() || !price || brandId === 0) {
      setError('Name, model, price and brand are required.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a valid positive number.');
      return;
    }

    const performanceSpecs: Record<string, unknown> = {};
    for (const row of specs) {
      if (row.key.trim()) performanceSpecs[row.key.trim()] = row.value.trim();
    }

    setLoading(true);
    setError('');
    try {
      await gadgetsApi.create({
        name: name.trim(),
        brandId,
        categoryId,
        model: model.trim(),
        price: parsedPrice,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        performanceSpecs: Object.keys(performanceSpecs).length > 0 ? performanceSpecs : undefined,
      });
      onSuccess(categoryId);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add gadget');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">Add a Gadget</h2>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Brand</label>
              <button
                type="button"
                onClick={() => { setShowNewBrand((v) => !v); setBrandError(''); setNewBrandName(''); }}
                className="text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
              >
                {showNewBrand ? '× Cancel' : '+ New brand'}
              </button>
            </div>
            {showNewBrand ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                    placeholder="Brand name (e.g. Sony)"
                    autoFocus
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddBrand}
                    disabled={brandLoading}
                    className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
                  >
                    {brandLoading ? '…' : 'Add'}
                  </button>
                </div>
                {brandError && <p className="text-red-500 text-xs">{brandError}</p>}
              </div>
            ) : (
              <select
                value={brandId}
                onChange={(e) => setBrandId(Number(e.target.value))}
                disabled={brands.length === 0}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              >
                {brands.length === 0 ? (
                  <option value={0}>No brands available</option>
                ) : (
                  brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))
                )}
              </select>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. iPhone 16 Pro"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              Model <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. A3293"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              Price (USD) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 999"
              min="0"
              step="0.01"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of the gadget…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              Image URL <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Performance specs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Performance Specs <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
              >
                + Add spec
              </button>
            </div>
            {specs.length > 0 && (
              <div className="space-y-2">
                {specs.map((row, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={row.key}
                      onChange={(e) => updateSpec(i, 'key', e.target.value)}
                      placeholder="Key (e.g. RAM)"
                      className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                    />
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => updateSpec(i, 'value', e.target.value)}
                      placeholder="Value (e.g. 8GB)"
                      className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecRow(i)}
                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-lg leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm dark:text-red-400">{error}</p>}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-violet-100 bg-white rounded-b-2xl flex gap-3 dark:bg-slate-900 dark:border-slate-700">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Adding…' : 'Add Gadget'}
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
