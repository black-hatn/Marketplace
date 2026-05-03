'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

export function CartSlideOver() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex items-center gap-3 rounded-full bg-slate-900 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-slate-900 shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="hidden sm:inline">Panier</span>
        {totalItems > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-black/5 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 px-8 py-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                    <ShoppingBag className="h-3 w-3" /> Votre Sélection
                  </div>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Panier unifié</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-black/5 dark:bg-white/5 p-3 text-slate-500 transition hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="rounded-full bg-slate-100 dark:bg-slate-900 p-8">
                      <ShoppingBag className="h-12 w-12 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">Votre panier est vide</p>
                      <p className="text-sm text-slate-500">Commencez à explorer nos secteurs pour ajouter des articles d'exception.</p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      Continuer mes achats <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card flex items-center gap-4 rounded-3xl p-4"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 ring-1 ring-black/5">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.vendor}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 rounded-full bg-black/5 dark:bg-white/5 px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-bold text-slate-900 dark:text-white w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-black/5 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] px-8 py-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sous-total</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="space-y-3">
                    <Link 
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center rounded-full bg-cyan-500 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                    >
                      Passer la commande unifiée
                    </Link>
                    <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
                      Paiement sécurisé • Expédition multi-vendeurs
                    </p>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
