'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { allProducts, heroSuggestions } from '@/lib/content';
import { MagneticButton } from '@/components/MagneticButton';

export function SearchHero() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    
    // Mix static suggestions and dynamic products
    const products = allProducts
      .filter(p => p.title.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery))
      .slice(0, 3);
      
    const staticSuggestions = heroSuggestions
      .filter(s => s.label.toLowerCase().includes(lowerQuery))
      .slice(0, 2);

    return [...products.map(p => ({ label: p.title, category: p.category, image: p.image, href: p.href, type: 'product' })), 
            ...staticSuggestions.map(s => ({ label: s.label, category: s.category, image: s.image, href: '#', type: 'suggestion' }))];
  }, [query]);

  const showOverlay = isFocused || searchResults.length > 0;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 p-8 shadow-lg dark:shadow-glow backdrop-blur-xl transition-all duration-500">
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-md"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-y-0 right-0 hidden w-1/2 rounded-l-[2.5rem] bg-gradient-to-l from-cyan-500/10 dark:from-cyan-500/15 to-transparent sm:block" />
      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-700 dark:text-cyan-100">
            <Sparkles className="h-4 w-4" /> Expérience 2025
          </span>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl">Recherche prédictive & navigation instantanée.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Une barre centrale intelligente qui suggère des produits, prévisualise des images et s’adapte automatiquement au secteur choisi.
          </p>

          <div className={`relative z-50 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="hero-search">
                Rechercher un produit
              </label>
              <div className={`relative rounded-3xl border transition-all duration-300 bg-slate-100 dark:bg-slate-950/80 px-4 py-3 shadow-inner ${isFocused ? 'border-cyan-400 ring-4 ring-cyan-500/10' : 'border-black/5 dark:border-white/10'}`}>
                <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${isFocused ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Exemple : Sneakers Aero, Casque Orbital..."
                  className="w-full bg-transparent pl-11 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  aria-label="Recherche prédictive"
                />
              </div>
              <MagneticButton>
                <button
                  type="button"
                  className="inline-flex h-full min-w-[140px] items-center justify-center rounded-3xl bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-95"
                >
                  Rechercher
                </button>
              </MagneticButton>
            </div>

            {/* Floating Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute left-0 right-0 top-full z-50 mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-3xl"
                >
                  <p className="px-3 pb-3 text-xs font-medium uppercase tracking-widest text-cyan-400">Suggestions pertinentes</p>
                  <div className="grid gap-1">
                    {searchResults.map((item, i) => (
                      <Link
                        key={`${item.label}-${i}`}
                        href={item.href}
                        className="group flex items-center justify-between gap-4 rounded-2xl p-3 transition hover:bg-white/10"
                        onClick={() => {
                          setQuery('');
                          setIsFocused(false);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-800">
                            <Image src={item.image} alt={item.label} fill className="object-cover transition group-hover:scale-110" />
                          </div>
                          <div>
                            <span className="block font-semibold text-white group-hover:text-cyan-300 transition-colors">{item.label}</span>
                            <span className="text-xs text-slate-400">{item.category} • {item.type === 'product' ? 'Produit' : 'Suggestion'}</span>
                          </div>
                        </div>
                        <div className="rounded-full bg-cyan-500/10 p-2 opacity-0 group-hover:opacity-100 transition-all">
                          <ArrowRight className="h-4 w-4 text-cyan-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_35%)]" />
          <div className="relative z-10 grid gap-4">
            <div className="flex items-center justify-between text-slate-100">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">Aperçu</span>
              <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs">Instantané</span>
            </div>
            <div className="relative h-72 overflow-hidden rounded-[1.75rem] bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
                alt="Produit en vedette"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Produit mis en avant</p>
              <h2 className="text-2xl font-semibold text-white">Écouteurs immersifs haut de gamme</h2>
              <p className="text-sm leading-6 text-slate-300">
                Visualisez les tendances et la disponibilité avec une interface fluide et animée.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
