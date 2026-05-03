'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 6;

type RecentProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
};

export function useRecentlyViewed() {
  const addProduct = (product: RecentProduct) => {
    if (typeof window === 'undefined') return;
    const stored: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };
  return { addProduct };
}

export function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter((p) => p.id !== currentProductId);
    setProducts(filtered);
    if (filtered.length > 0) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentProductId]);

  const removeProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-8 z-40 hidden xl:block">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg">
          <History className="h-4 w-4 text-cyan-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Récemment vus</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {visible && products.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <Link
                  href={p.href}
                  className="flex items-center gap-4 p-2 pr-6 rounded-[1.25rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-md hover:shadow-xl transition-all hover:translate-x-1"
                >
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                    <Image 
                      src={p.image} 
                      alt={p.title} 
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{p.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{p.price.toLocaleString()} FCFA</p>
                  </div>
                </Link>
                <button 
                  onClick={() => removeProduct(p.id)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
