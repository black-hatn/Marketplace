'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { allProducts, heroSuggestions } from '@/lib/content';

export function SearchHero() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    
    const products = allProducts
      .filter(p => p.title.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery))
      .slice(0, 3);
      
    const staticSuggestions = heroSuggestions
      .filter(s => s.label.toLowerCase().includes(lowerQuery))
      .slice(0, 2);

    return [
      ...products.map(p => ({ label: p.title, category: p.category, image: p.image, href: p.href, type: 'product' })), 
      ...staticSuggestions.map(s => ({ label: s.label, category: s.category, image: s.image, href: '#', type: 'suggestion' }))
    ];
  }, [query]);

  const showOverlay = isFocused || searchResults.length > 0;

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 p-4 sm:p-8 shadow-lg dark:shadow-glow backdrop-blur-xl transition-all duration-500">
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

      <div className="absolute inset-y-0 right-0 hidden w-1/2 rounded-l-[2.5rem] bg-gradient-to-l from-cyan-500/10 dark:from-cyan-500/15 to-transparent lg:block" />
      
      <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        {/* Left: Text & Search */}
        <div className="space-y-4 sm:space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-700 dark:text-cyan-100">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Expérience 2025
          </span>

          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-5xl leading-tight">
            Recherche prédictive &amp;{' '}
            <span className="text-cyan-600 dark:text-cyan-400">navigation instantanée.</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-lg">
            Une barre intelligente qui suggère des produits et s&apos;adapte à votre secteur.
          </p>

          <div className={`relative z-50 transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="hero-search">Rechercher un produit</label>
              <div className={`relative flex-1 rounded-2xl border transition-all duration-300 bg-slate-100 dark:bg-slate-950/80 px-4 py-3 shadow-inner ${
                isFocused ? 'border-cyan-400 ring-2 ring-cyan-500/10' : 'border-black/5 dark:border-white/10'
              }`}>
                <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                  isFocused ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'
                }`} />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sneakers, Casque audio..."
                  className="w-full bg-transparent pl-8 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  aria-label="Recherche prédictive"
                />
              </div>
              <button
                type="button"
                className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-95 whitespace-nowrap"
              >
                Rechercher
              </button>
            </div>

            {/* Floating Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-3xl"
                >
                  <p className="px-2 pb-2 text-xs font-medium uppercase tracking-widest text-cyan-400">Suggestions</p>
                  <div className="grid gap-1">
                    {searchResults.map((item, i) => (
                      <Link
                        key={`${item.label}-${i}`}
                        href={item.href}
                        className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/10"
                        onClick={() => { setQuery(''); setIsFocused(false); }}
                      >
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                          <Image src={item.image} alt={item.label} fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{item.label}</span>
                          <span className="text-xs text-slate-400">{item.category}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-cyan-400 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Preview — hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="hidden lg:block relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_35%)]" />
          <div className="relative z-10 grid gap-4">
            <div className="flex items-center justify-between text-slate-100">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">Aperçu</span>
              <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs">Instantané</span>
            </div>
            <div className="relative h-64 overflow-hidden rounded-[1.75rem] bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
                alt="Produit en vedette"
                fill
                priority
                className="object-cover"
                sizes="400px"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Produit mis en avant</p>
              <h2 className="text-xl font-semibold text-white">Écouteurs immersifs haut de gamme</h2>
              <p className="text-sm leading-6 text-slate-300">
                Visualisez les tendances avec une interface fluide.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
