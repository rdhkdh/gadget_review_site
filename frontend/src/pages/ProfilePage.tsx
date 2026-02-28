import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, reviews } from '../api/client';
import type { UserReview } from '../types';
import { PasswordInput } from '../components/PasswordInput';

type Tab = 'details' | 'reviews';

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function UserDetailsTab() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await auth.deleteAccount();
      logout();
      navigate('/');
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Failed to delete account');
      setDeleteLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      await auth.changePassword(currentPassword, newPassword);
      setStatus({ type: 'success', message: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setExpanded(false);
    } catch (e) {
      setStatus({ type: 'error', message: e instanceof Error ? e.message : 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-slate-100">User Details</h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Name</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100 font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100 font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Member since</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100 font-medium">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <button
          type="button"
          onClick={() => { setExpanded(!expanded); setStatus(null); }}
          className="flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition"
        >
          Change Password
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3 max-w-sm">
            {status && (
              <div className={`text-sm px-3 py-2 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {status.message}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
              <PasswordInput
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">New Password</label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving…' : 'Save Password'}
            </button>
          </form>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <button
          type="button"
          onClick={() => { setShowDeleteModal(true); setDeleteError(null); }}
          className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-slate-100">Delete Account</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This will permanently delete your account and all your reviews. This action cannot be undone.
            </p>
            {deleteError && (
              <p className="text-sm px-3 py-2 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {deleteLoading ? 'Deleting…' : 'Delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  onUpdated,
  onDeleted,
}: {
  review: UserReview;
  onUpdated: (updated: UserReview) => void;
  onDeleted: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    setEditRating(review.rating);
    setEditComment(review.comment ?? '');
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await reviews.update(review.id, editRating, editComment || undefined);
      onUpdated({ ...review, rating: editRating, comment: editComment || null });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await reviews.remove(review.id);
      onDeleted(review.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
      {/* Gadget header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {review.gadget.name}{' '}
            <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">
              {review.gadget.model}
            </span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{review.gadget.brand.name}</p>
        </div>
        {!editing && (
          <div className="flex flex-col items-end gap-1">
            <StarRating rating={review.rating} />
            <time className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </time>
          </div>
        )}
      </div>

      {/* View mode */}
      {!editing && (
        <>
          {review.comment && (
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>
          )}
          {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
          {confirmDelete ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Delete this review?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={startEdit}
                className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1 text-xs font-medium rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit mode */}
      {editing && (
        <form onSubmit={handleSave} className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setEditRating(s)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${s <= editRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} hover:text-amber-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Comment</label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function MyReviewsTab() {
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reviews
      .listByUser()
      .then(setUserReviews)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  function handleUpdated(updated: UserReview) {
    setUserReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  function handleDeleted(id: number) {
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400 text-sm">Loading reviews…</p>;
  }
  if (error) {
    return <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-slate-100">My Reviews</h2>
      {userReviews.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">You haven't submitted any reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {userReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('details');

  useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex gap-8 min-h-[60vh]">
      {/* Sidebar tabs */}
      <aside className="w-48 shrink-0">
        <nav className="flex flex-col gap-1 sticky top-8">
          {(['details', 'reviews'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'details' ? 'User Details' : 'My Reviews'}
            </button>
          ))}
        </nav>
      </aside>

      {/* Tab content */}
      <div className="flex-1 min-w-0">
        {activeTab === 'details' ? <UserDetailsTab /> : <MyReviewsTab />}
      </div>
    </div>
  );
}
