'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';

export function ProductShowcase({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <>
      <section className="space-y-6 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 dark:border-white/10 pb-6 sm:pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Sélection Curatée
            </div>
            <h2 className="mt-2 sm:mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              L&apos;Excellence <span className="text-cyan-600 dark:text-cyan-400">Multi-Secteurs</span>.
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Découvrez des produits qui redéfinissent les standards de qualité.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-10 w-10 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-slate-400 flex">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 max-w-[180px] text-right">
              Ajoutez vos favoris via l&apos;aperçu rapide.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <ProductCard
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
