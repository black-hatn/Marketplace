'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function ProductCard({ product, className = "", onQuickView }: { product: any; className?: string; onQuickView?: (product: any) => void }) {
  const addItem = useCartStore((state) => state.addItem);

  const title = product.nom || product.title || 'Produit sans nom';
  const price = Number(product.prix_ttc || product.price || 0);
  const image = product.images?.[0] || product.image || '/placeholder.png';
  const category = product.categories?.[0] || product.category || 'Général';
  const vendor = product.brand?.name || product.vendor || 'Immersive';
  const rating = Number(product.rating || 4.5);
  const reviews = Number(product.reviews || 0);
  const href = product.href || `/produit/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, id: product.id, title, price, image, quantity: 1 });
    toast.success(`${title} ajouté !`, { icon: '🛍️' });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative flex h-full flex-col rounded-[1.5rem] sm:rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] overflow-hidden transition-all hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-cyan-500/5 ${className}`}
    >
      {/* Clickable overlay */}
      <Link href={href} className="absolute inset-0 z-10" aria-label={title} />

      {/* Image */}
      <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover overlay buttons */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2 p-3 z-20">
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-100 shadow-xl whitespace-nowrap"
            >
              Aperçu
            </button>
          )}
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-cyan-400 p-2.5 text-slate-950 transition hover:bg-cyan-300 shadow-xl flex-shrink-0"
            title="Ajouter au panier"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-200 shadow-lg backdrop-blur-md z-20">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-5 gap-2 sm:gap-3">
        {/* Category & Vendor */}
        <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <span className="truncate font-bold">{category}</span>
          <span className="truncate font-medium">{vendor}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Bottom area */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-black/5 dark:border-white/5">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 text-amber-400 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              {rating.toFixed(1)}
              {reviews > 0 && <span className="ml-1 opacity-70">({reviews})</span>}
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white whitespace-nowrap">
              {price.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">FCFA</span>
            </span>
            <button
              onClick={handleAddToCart}
              className="relative z-20 flex-shrink-0 rounded-xl bg-slate-900 dark:bg-white px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white dark:text-slate-900 transition hover:bg-cyan-500 dark:hover:bg-cyan-400 active:scale-95 shadow-sm"
            >
              + Panier
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
