'use client';

import { useState, useTransition } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function WishlistButton({
  productId,
  initialWishlisted = false,
  size = 'md',
}: {
  productId: string;
  initialWishlisted?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleWishlist(productId);
      setWishlisted(result.wishlisted);
      toast(result.wishlisted ? '❤️ Ajouté aux favoris' : '💔 Retiré des favoris', {
        duration: 2000,
        style: {
          background: result.wishlisted ? '#fef2f2' : '#f8fafc',
          color: result.wishlisted ? '#991b1b' : '#475569',
          fontSize: '0.875rem',
          fontWeight: '600',
        },
      });
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleToggle}
      disabled={isPending}
      title={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`relative flex items-center justify-center rounded-2xl border transition-all duration-300 ${sizeClasses[size]} ${
        wishlisted
          ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
          : 'border-black/10 bg-white/80 text-slate-400 hover:border-red-200 hover:text-red-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-red-400'
      } disabled:opacity-60`}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className={`${iconSizes[size]} animate-spin`} />
          </motion.span>
        ) : (
          <motion.span
            key={wishlisted ? 'filled' : 'empty'}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Heart className={`${iconSizes[size]} ${wishlisted ? 'fill-current' : ''}`} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
