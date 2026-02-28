import { useEffect, useState } from 'react';
import type { Gadget, Review } from '../types';
import { gadgets as gadgetsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ReviewForm } from './ReviewForm';

interface GadgetModalProps {
  gadgetId: number;
  onClose: () => void;
  onReviewAdded?: () => void;
  onDeleted?: () => void;
}

function num(x: number | string): number {
  return typeof x === 'string' ? parseFloat(x) : x;
}

export function GadgetModal({ gadgetId, onClose, onReviewAdded, onDeleted }: GadgetModalProps) {
  const [gadget, setGadget] = useState<Gadget & { reviews?: Review[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { isLoggedIn } = useAuth();

  async function handleDelete() {
    if (!gadget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await gadgetsApi.remove(gadget.id);
      onDeleted?.();
      onClose();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Failed to delete gadget');
      setDeleting(false);
    }
  }

  useEffect(() => {
    gadgetsApi.getById(gadgetId).then(setGadget).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, [gadgetId]);

  const handleReviewAdded = () => {
    gadgetsApi.getById(gadgetId).then(setGadget);
    onReviewAdded?.();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
          <p className="text-red-600">{error || 'Not found'}</p>
          <button type="button" onClick={onClose} className="mt-4 text-brand-600 font-medium">Close</button>
        </div>
      </div>
    );
  }

  const rating = num(gadget.averageRating);
  const price = num(gadget.price);
  const specs = gadget.performanceSpecs && typeof gadget.performanceSpecs === 'object'
    ? gadget.performanceSpecs as Record<string, unknown>
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl shadow-violet-900/20 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto border border-violet-100 dark:bg-slate-900 dark:border-violet-900/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-t-2xl" />
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">{gadget.name}</h2>
              <p className="text-slate-500 dark:text-slate-400">{gadget.brand?.name} · {gadget.model}</p>
              <p className="mt-2 text-lg font-semibold text-brand-600 dark:text-violet-400">${price.toFixed(2)}</p>
              <p className="flex items-center gap-1 text-amber-600 mt-1">★ {rating.toFixed(1)} ({gadget.reviewCount} reviews)</p>
            </div>
            {gadget.imageUrl && (
              <img src={gadget.imageUrl} alt={gadget.name} className="w-32 h-32 object-cover rounded-xl flex-shrink-0" />
            )}
          </div>

          {gadget.description && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-900 mb-1 dark:text-slate-200">Description</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400">{gadget.description}</p>
            </div>
          )}

          {specs && Object.keys(specs).length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-900 mb-2 dark:text-slate-200">Performance specs</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm bg-violet-50/60 rounded-lg p-3 dark:bg-violet-950/30 dark:border dark:border-violet-900/50">
                {Object.entries(specs).map(([k, v]) => (
                  <li key={k} className="flex justify-between border-b border-violet-100 py-1 dark:border-violet-900/50">
                    <span className="text-slate-500 capitalize dark:text-slate-400">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-slate-900 dark:text-slate-200">{String(v)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold text-slate-900 mb-2 dark:text-slate-200">Reviews</h3>
            {isLoggedIn && (
              <ReviewForm gadgetId={gadget.id} onSuccess={handleReviewAdded} className="mb-4" />
            )}
            <ul className="space-y-3">
              {(gadget.reviews ?? []).length === 0 ? (
                <li className="text-slate-500 text-sm">No reviews yet.</li>
              ) : (
                (gadget.reviews ?? []).map((r) => (
                  <li key={r.id} className="border border-slate-100 rounded-lg p-3 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{r.user?.name ?? 'User'}</span>
                      <span className="text-amber-600 text-sm">★ {r.rating}</span>
                    </div>
                    {r.comment && <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">{r.comment}</p>}
                    <p className="text-slate-400 text-xs mt-1 dark:text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="sticky bottom-0 p-4 border-t border-violet-100 bg-white rounded-b-2xl dark:bg-slate-900 dark:border-slate-700 space-y-3">
          {confirmDelete && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 space-y-2">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                Delete <span className="font-semibold">{gadget.name}</span>? This will remove all associated reviews and cannot be undone.
              </p>
              {deleteError && <p className="text-xs text-red-600 dark:text-red-400">{deleteError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button
                  type="button"
                  onClick={() => { setConfirmDelete(false); setDeleteError(''); }}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            {isLoggedIn && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="py-2 px-4 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-violet-500/30"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
