import { useState } from 'react';
import { reviews as reviewsApi } from '../api/client';

interface ReviewFormProps {
  gadgetId: number;
  onSuccess: () => void;
  className?: string;
}

export function ReviewForm({ gadgetId, onSuccess, className = '' }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await reviewsApi.create(gadgetId, rating, comment.trim() || undefined);
      setComment('');
      setRating(5);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-lg border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/30 ${className}`}>
      <h4 className="font-medium text-slate-900 mb-2 dark:text-slate-200">Add your review</h4>
      <div className="flex gap-2 items-center mb-2">
        <label className="text-sm text-slate-600 dark:text-slate-300">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded border border-slate-300 px-2 py-1 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Your review (optional)"
        rows={2}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 shadow-sm shadow-violet-500/30"
      >
        {loading ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  );
}
