'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Scale, Zap, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function ProductCard({ product, className = "", onQuickView }: { product: any; className?: string; onQuickView?: (product: any) => void }) {
  const addItem = useCartStore((state) => state.addItem);

  const title = product.nom || product.title || 'Produit sans nom';
  const price = Number(product.prix_ttc || product.price || 0);
  const image = product.images?.[0] || product.image || '/placeholder.png';
  const category = product.categories?.[0] || product.category || 'Général';
  const vendor = product.brand?.name || product.vendor || 'Boutique Premium';
  const rating = Number(product.rating || 4.5);
  const reviews = Number(product.reviews || 0);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const href = product.href || `/produit/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, id: product.id, title, price, image, quantity: 1, category, vendor });
    toast.success(`${title} ajouté au panier !`, { 
      icon: '🛍️', 
      style: { borderRadius: '10px', background: '#333', color: '#fff' } 
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative flex flex-col h-full rounded-3xl p-4 glass-card hover:border-white/20 transition-all duration-500 cursor-pointer ${className}`}
    >
      <Link href={href} className="absolute inset-0 z-10" aria-label={title} />

      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-surface-light mb-4">
        <Image
          src={image.startsWith('http') ? image : '/placeholder.png'}
          alt={title}
          fill
          unoptimized={true}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Action overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3 z-20">
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
              className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-black shadow-xl"
            >
              Aperçu
            </button>
          )}
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-blue-500 p-2.5 text-white transition hover:bg-blue-400 shadow-xl"
            title="Ajouter au panier"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {isLowStock && (
            <span className="px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white shadow-lg animate-pulse">
              ⚡ Reste {product.stock}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-2 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">{category}</span>
          <div className="flex items-center gap-1 text-[10px] font-medium text-amber-400">
            <Star className="h-3 w-3 fill-amber-400" /> {rating.toFixed(1)}
          </div>
        </div>

        <h3 className="text-base font-semibold text-white truncate mb-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground truncate mb-4">{vendor}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {price.toLocaleString('fr-FR')} <span className="text-xs text-white/60">FCFA</span>
          </span>
          <button
            onClick={handleAddToCart}
            className="relative z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
