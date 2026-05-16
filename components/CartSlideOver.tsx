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
        className="group relative flex items-center justify-center w-12 h-12 rounded-full glass text-white hover:bg-white hover:text-black transition-all"
      >
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-background">
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
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-background/80 backdrop-blur-2xl border-l border-white/5"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-8 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-bold text-white">Votre Panier</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {totalItems} article{totalItems > 1 ? 's' : ''} sélectionné{totalItems > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-white/20" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-white">Panier vide</p>
                      <p className="text-sm text-muted-foreground max-w-[200px] mx-auto font-light">
                        Votre sélection d'exception apparaîtra ici.
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 group"
                      >
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-light border border-white/5">
                          <Image src={item.image} alt={item.title} fill unoptimized={true} className="object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col py-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                                {item.vendor}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-white/20 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 glass rounded-full px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-white/40 hover:text-white transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-white/40 hover:text-white transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-white">
                              {(item.price * item.quantity).toLocaleString()} <span className="text-[10px] text-white/40">FCFA</span>
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-8 py-8 border-t border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Sous-total</span>
                    <span className="text-2xl font-black text-white">{total.toLocaleString()} <span className="text-sm font-medium text-white/40">FCFA</span></span>
                  </div>
                  <Link 
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full py-5 rounded-2xl bg-white text-black font-bold tracking-wide hover:bg-white/90 transition-all group"
                  >
                    Procéder au paiement
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em] mt-6">
                    Paiement 100% sécurisé via Stripe
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
