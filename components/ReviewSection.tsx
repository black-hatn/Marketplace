'use client';

import { useState, useTransition } from 'react';
import { Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { addReview } from '@/lib/actions';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Review = {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: Date;
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(star)} className="transition-transform hover:scale-110">
          <Star className={`h-7 w-7 transition-colors ${star <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
        </button>
      ))}
    </div>
  );
}

export function ReviewSection({ productId, initialReviews }: { productId: string; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Veuillez sélectionner une note.'); return; }
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const r = await addReview(productId, { rating, comment: fd.get('comment') as string, authorName: fd.get('authorName') as string, authorEmail: fd.get('authorEmail') as string });
        const newReview = {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          authorName: r.userName,
          createdAt: new Date(r.createdAt)
        };
        setReviews((prev) => [newReview, ...prev]);
        setSubmitted(true);
        toast.success('Avis publié !', { icon: '⭐' });
      } catch { toast.error('Erreur lors de la publication.'); }
    });
  };

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
        <div className="text-center">
          <p className="text-6xl font-black text-slate-900 dark:text-white">{avgRating.toFixed(1)}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1,2,3,4,5].map((s) => <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />)}
          </div>
          <p className="text-sm text-slate-500 mt-1">{reviews.length} avis</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-right text-slate-500 font-medium">{star}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-amber-400" />
                </div>
                <span className="w-6 text-slate-400 text-xs">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold">Merci pour votre avis !</h3>
              <p className="text-slate-500 text-sm mt-1">Votre retour aide la communauté.</p>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Laisser un avis</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Votre note *</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['authorName', 'Nom', 'Jean Dupont'], ['authorEmail', 'Email', 'jean@mail.com']].map(([name, label, ph]) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label} *</label>
                    <input name={name} required placeholder={ph} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Commentaire *</label>
                <textarea name="comment" required rows={4} placeholder="Partagez votre expérience..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none" />
              </div>
              <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition-all disabled:opacity-60 shadow-lg shadow-cyan-500/20">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isPending ? 'Publication...' : 'Publier mon avis'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="glass-card rounded-2xl border border-black/5 dark:border-white/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{review.authorName}</p>
                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />)}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
