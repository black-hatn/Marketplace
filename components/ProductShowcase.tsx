'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductShowcase({ products }: { products: any[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <>
      <section className="space-y-10">
        {/* Decorative Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-black/5 dark:border-white/10 pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" /> Sélection Curatée
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              L'Excellence <span className="text-cyan-600 dark:text-cyan-400">Multi-Secteurs</span>.
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Découvrez des produits qui redéfinissent les standards de qualité et de design, sélectionnés par nos experts.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-slate-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 max-w-[200px] lg:text-right">
              Ajoutez vos favoris instantanément via l'aperçu rapide.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
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
