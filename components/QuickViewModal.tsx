'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/lib/content';
import { useCartStore } from '@/lib/store';

type QuickViewModalProps = {
  product: Product | null;
  onClose: () => void;
};

import { ShinyButton } from '@/components/ShinyButton';

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 rounded-full bg-slate-800/80 p-2 text-white transition hover:bg-slate-700"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid h-full grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-8 md:p-12">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
                  <span>{product.category}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span>{product.vendor}</span>
                </div>
                <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{product.title}</h2>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg font-medium text-white">{product.rating}</span>
                  </div>
                  <span className="text-sm text-slate-400">({product.reviews} avis vérifiés)</span>
                </div>
                <p className="mt-8 text-lg leading-relaxed text-slate-300">
                  {product.tagline}
                </p>
                <div className="mt-auto pt-10">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">{product.price.toLocaleString()} FCFA</span>
                    <ShinyButton
                      variant="primary"
                      onClick={() => {
                        addItem({ ...product, quantity: 1 });
                        onClose();
                      }}
                      icon={ShoppingCart}
                      className="px-8 py-4"
                    >
                      Ajouter au panier
                    </ShinyButton>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
