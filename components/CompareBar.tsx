'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '@/lib/compareStore';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export function CompareBar() {
  const { items, remove, clear } = useCompareStore();

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-2xl"
          role="region"
          aria-label="Comparateur de produits"
        >
          <div className="glass-card rounded-3xl px-6 py-4 flex items-center gap-4 shadow-2xl border border-white/10">
            <div className="flex items-center gap-2 text-white shrink-0">
              <Scale className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-bold hidden sm:inline">Comparer</span>
              <span className="text-xs text-white/50">{items.length}/4</span>
            </div>

            {/* Thumbnails */}
            <div className="flex-1 flex items-center gap-3 overflow-x-auto">
              {items.map((p) => (
                <div key={p.id} className="relative flex-shrink-0 group">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <Image src={p.image} alt={p.title} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Retirer ${p.title} du comparateur`}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/20 text-[10px] font-bold shrink-0"
                >
                  +
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={clear}
                aria-label="Vider le comparateur"
                className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link
                href="/comparer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all"
              >
                Voir <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
