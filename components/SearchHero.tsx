'use client';

import { Link, useRouter } from '@/i18n/routing';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, MapPin, Grid3X3 } from 'lucide-react';
import { allProducts } from '@/lib/content';
import Image from 'next/image';

const VILLES = [
  "Tout le Tchad", "N'Djaména", "Moundou", "Abéché",
  "Sarh", "Koumra", "Pala", "Bongor", "Am Timan",
];

const CATEGORIES = [
  "Toutes catégories", "Immobilier", "Véhicules", "Électronique",
  "Mode & Beauté", "Emploi", "Services", "Maison", "Divers",
];

export function SearchHero() {
  const router = useRouter();
  const [query, setQuery]       = useState('');
  const [ville, setVille]       = useState(VILLES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFocused, setIsFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return allProducts
      .filter(p => p.title.toLowerCase().includes(q))
      .slice(0, 4)
      .map(p => ({ label: p.title, category: p.category, image: p.image, href: p.href }));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category && category !== 'Toutes catégories') {
      const catVal = category === 'Mode & Beauté' ? 'Mode' : category;
      params.set('category', catVal);
    }
    router.push(`/produits?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/50 border border-black/5 dark:border-white/10 shadow-xl px-6 py-14 sm:px-12 sm:py-20 text-center">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.07),_transparent_60%)] pointer-events-none" />

      {/* Overlay dimmer when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400 text-[11px] font-black uppercase tracking-[0.3em]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          La Marketplace N°1 au Tchad
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h1 className="text-5xl sm:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.9] italic">
            Trouvez tout
          </h1>
          <h1 className="text-5xl sm:text-7xl font-black text-cyan-600 tracking-tighter leading-[0.9] italic mt-1">
            Partout<span className="text-slate-950 dark:text-white">.</span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed"
        >
          Immobilier, véhicules, tech ou emploi — des milliers d&apos;annonces de qualité, directement au Tchad.
        </motion.p>

        {/* ── SEARCH FORM ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-50"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/60 dark:shadow-black/40 border border-black/5 dark:border-white/10">

            {/* Text input */}
            <div className="flex items-center gap-3 flex-[2] px-4 py-3">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={e => setQuery(e.target.value)}
                placeholder="Que cherchez-vous ?"
                className="w-full bg-transparent text-slate-900 dark:text-white font-semibold text-base outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-slate-100 dark:bg-white/5 self-stretch my-2" />

            {/* Category */}
            <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
              <Grid3X3 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-slate-100 dark:bg-white/5 self-stretch my-2" />

            {/* Location */}
            <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={ville}
                onChange={e => setVille(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
              >
                {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {/* CTA button */}
            <button type="submit" className="bg-slate-950 dark:bg-cyan-500 text-white dark:text-slate-950 font-black uppercase tracking-widest text-[11px] px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap">
              Rechercher
            </button>
          </form>

          {/* Floating autocomplete */}
          <AnimatePresence>
            {query.length >= 2 && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-full mt-3 bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden text-left"
              >
                {searchResults.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    onClick={() => { setQuery(''); setIsFocused(false); }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <Image src={r.image} alt={r.label} fill className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{r.label}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{r.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick category tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {['Immobilier', 'Véhicules', 'Électronique', 'Emploi', 'Mode'].map(tag => (
            <Link
              key={tag}
              href={`/produits?category=${tag}` as any}
              className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400 transition-all"
            >
              {tag}
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
