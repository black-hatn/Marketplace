'use client';

import { useEffect, useState } from 'react';
import { getRecommendedProducts } from '@/lib/actions';
import { ProductCard } from './ProductCard';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SmartRecommendations({ productId }: { productId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRecommendedProducts(productId);
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500/50" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Analyse du profil shopping...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400">
            <BrainCircuit className="w-3 h-3" /> Immersive AI Engine
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sélectionné pour vous</h2>
        </div>
        <p className="text-sm text-muted-foreground font-light max-w-xs">
          Nos algorithmes ont analysé les caractéristiques de ce produit pour vous proposer des alternatives d&apos;exception.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
