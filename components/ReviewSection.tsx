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
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button 
          key={star} 
          type="button" 
          onMouseEnter={() => setHovered(star)} 
          onMouseLeave={() => setHovered(0)} 
          onClick={() => onChange(star)} 
          className="transition-transform hover:scale-110"
        >
          <Star className={`h-8 w-8 transition-colors ${star <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
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
        const r = await addReview(productId, {
          rating,
          comment: fd.get('comment') as string,
          authorName: fd.get('authorName') as string,
        });
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
    <div className="space-y-16">
      {/* Summary Stats */}
      <div className="grid sm:grid-cols-[200px_1fr] gap-12 items-center">
        <div className="flex flex-col items-center justify-center space-y-2 p-8 glass-card rounded-[2.5rem]">
          <span className="text-6xl font-black text-white">{avgRating.toFixed(1)}</span>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />)}
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{reviews.length} avis</span>
        </div>
        
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-4 group">
                <span className="text-sm font-bold text-white/40 w-4">{star}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${pct}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }} 
                    className="h-full bg-amber-400" 
                  />
                </div>
                <span className="text-xs font-bold text-white/20 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16">
        {/* Reviews List */}
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <div className="py-12 text-center glass-card rounded-3xl border-dashed border-white/10">
              <p className="text-muted-foreground italic font-light">Soyez le premier à partager votre expérience.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={review.id} 
                  className="p-8 glass-card rounded-[2rem]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-blue-400">
                        {review.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{review.authorName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-white/5'}`} />)}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-light">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Form */}
        <div className="sticky top-24 h-fit">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center p-12 glass-card rounded-[2.5rem] border-emerald-500/20"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Avis publié !</h3>
                <p className="text-muted-foreground text-sm font-light">Votre retour est précieux pour la communauté.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-8 glass-card rounded-[2.5rem]"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-8">Partagez votre avis</h3>
                  
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Votre Note</span>
                    <StarRating value={rating} onChange={setRating} />
                  </div>

                  <div className="space-y-4 pt-4">
                    <input 
                      name="authorName" 
                      required 
                      placeholder="Votre nom complet" 
                      className="w-full px-5 py-4 rounded-2xl glass text-white placeholder-white/20 outline-none focus:border-white/20 transition-all text-sm" 
                    />
                    <input 
                      name="authorEmail" 
                      type="email"
                      required 
                      placeholder="votre@email.com" 
                      className="w-full px-5 py-4 rounded-2xl glass text-white placeholder-white/20 outline-none focus:border-white/20 transition-all text-sm" 
                    />
                    <textarea 
                      name="comment" 
                      required 
                      rows={5} 
                      placeholder="Racontez-nous votre expérience..." 
                      className="w-full px-5 py-4 rounded-2xl glass text-white placeholder-white/20 outline-none focus:border-white/20 transition-all text-sm resize-none" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full py-5 rounded-2xl bg-white text-black font-bold tracking-wide hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Envoyer l'avis <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
