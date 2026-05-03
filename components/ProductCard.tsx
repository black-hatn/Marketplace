'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/content';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function ProductCard({ product, className = "", onQuickView }: { product: any; className?: string; onQuickView?: (product: any) => void }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.title} ajouté au panier !`, {
      icon: '🛍️',
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative flex h-full flex-col rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] p-4 transition-all hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-2xl ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-900">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-4 p-4">
          <div className="flex gap-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                className="rounded-full bg-white px-6 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 shadow-xl"
              >
                Aperçu
              </button>
            )}
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-cyan-400 p-2 text-slate-950 transition hover:bg-cyan-300 shadow-xl"
              title="Ajouter au panier"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-100 shadow-lg backdrop-blur-md">
          {product.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          <span>{product.category}</span>
          <span>{product.vendor}</span>
        </div>
        <div>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">{product.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 line-clamp-2">{product.tagline}</p>
        </div>
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between gap-4 text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-500 dark:text-amber-300" />
              <span>{product.rating.toFixed(1)} ({product.reviews})</span>
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">{product.price.toLocaleString()} FCFA</span>
          </div>
          <Link
            href={product.href}
            className="inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 shadow-md"
          >
            Détails
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
