'use client';

import { Link, useRouter } from '@/i18n/routing';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, MapPin, Grid3X3 } from 'lucide-react';
import { globalSearch } from '@/lib/actions';
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
  const [searchResults, setSearchResults] = useState<{ label: string; category: string; image: string; href: string }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await globalSearch(query);
        setSearchResults(
          results.products.map((p: any) => ({
            label: p.title || p.nom,
            category: p.category?.name || p.categories?.[0] || 'Général',
            image: p.image || p.images?.[0] || '/placeholder.png',
            href: `/produit/${p.id}`
          }))
        );
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
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
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/[0.05] shadow-2xl px-6 py-14 sm:px-12 sm:py-20 text-center glass-premium">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.05),_transparent_60%)] pointer-events-none" />

      {/* Overlay dimmer when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-md"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-[0.3em] shimmer-effect"
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
          <h1 className="text-5xl sm:text-7xl font-black text-gradient-gold tracking-tighter leading-[0.9] italic mt-2">
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
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 p-2 bg-white dark:bg-black/60 rounded-2xl shadow-2xl shadow-slate-200/60 dark:shadow-black/60 border border-black/5 dark:border-white/[0.08] backdrop-blur-xl">

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
            <button type="submit" className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-700 text-slate-950 font-black uppercase tracking-widest text-[11px] px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/10 whitespace-nowrap">
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
                className="absolute left-0 right-0 top-full mt-3 bg-white dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden text-left"
              >
                {searchResults.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    onClick={() => { setQuery(''); setIsFocused(false); }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
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
              className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-primary dark:hover:bg-amber-500/10 dark:hover:text-primary transition-all"
            >
              {tag}
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
