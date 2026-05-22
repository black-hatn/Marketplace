'use client';

import { Link, useRouter } from '@/i18n/routing';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, MapPin, Grid3X3, TrendingUp, Users, BadgeCheck } from 'lucide-react';
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

const QUICK_TAGS = [
  { label: 'Immobilier', emoji: '🏠' },
  { label: 'Véhicules',  emoji: '🚗' },
  { label: 'Électronique', emoji: '📱' },
  { label: 'Emploi',    emoji: '💼' },
  { label: 'Mode',      emoji: '👗' },
];

export function SearchHero() {
  const router = useRouter();
  const [query, setQuery]         = useState('');
  const [ville, setVille]         = useState(VILLES[0]);
  const [category, setCategory]   = useState(CATEGORIES[0]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { label: string; category: string; image: string; href: string }[]
  >([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) { setSearchResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await globalSearch(query);
        setSearchResults(
          results.products.map((p: any) => ({
            label:    p.title || p.nom,
            category: p.category?.name || p.categories?.[0] || 'Général',
            image:    p.image || p.images?.[0] || '/placeholder.png',
            href:     `/produit/${p.id}`,
          }))
        );
      } catch { setSearchResults([]); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category && category !== 'Toutes catégories') {
      params.set('category', category === 'Mode & Beauté' ? 'Mode' : category);
    }
    router.push(`/produits?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[88vh] flex flex-col items-center justify-center overflow-hidden rounded-3xl">

      {/* ── BACKGROUND IMAGE ─────────────────────────────── */}
      <Image
        src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=2000&q=80"
        alt="Marché au Tchad"
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      {/* ── OVERLAYS ─────────────────────────────────────── */}
      {/* Bottom-to-top dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 z-10" />
      {/* Subtle amber tint at top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12),_transparent_55%)] z-10 pointer-events-none" />

      {/* ── BLUR OVERLAY when search focused ─────────────── */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div className="relative z-50 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-8 py-16">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          La Marketplace N°1 au Tchad
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.88]">
            Trouvez tout.
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.88] text-gradient-gold">
            Achetez partout.
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base sm:text-lg text-white/60 font-medium max-w-xl leading-relaxed"
        >
          Immobilier, véhicules, tech ou emploi — des milliers d&apos;annonces de qualité,
          directement dans votre ville au Tchad.
        </motion.p>

        {/* ── SEARCH FORM ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative z-50 w-full"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-1 p-1.5 bg-white rounded-2xl shadow-2xl shadow-black/40"
          >
            {/* Text input */}
            <div className="flex items-center gap-3 flex-[2] px-4 py-3">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={e => setQuery(e.target.value)}
                placeholder="Que cherchez-vous ?"
                className="w-full bg-transparent text-slate-900 font-semibold text-base outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            <div className="hidden sm:block w-px bg-slate-100 self-stretch my-2" />

            {/* Category */}
            <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
              <Grid3X3 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="hidden sm:block w-px bg-slate-100 self-stretch my-2" />

            {/* Location */}
            <div className="flex items-center gap-2 px-4 py-3 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={ville}
                onChange={e => setVille(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
              >
                {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-black uppercase tracking-widest text-[11px] px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-500/30 whitespace-nowrap"
            >
              Rechercher
            </button>
          </form>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {query.length >= 2 && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden text-left z-50"
              >
                {searchResults.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    onClick={() => { setQuery(''); setIsFocused(false); }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-amber-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image src={r.image} alt={r.label} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate text-sm">{r.label}</p>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-0.5">{r.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <span className="text-[11px] font-bold text-white/40 self-center mr-1">Populaire :</span>
          {QUICK_TAGS.map(tag => (
            <Link
              key={tag.label}
              href={`/produits?category=${tag.label}` as any}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-white hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              <span>{tag.emoji}</span> {tag.label}
            </Link>
          ))}
        </motion.div>

        {/* Inline stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap justify-center gap-6 pt-4 border-t border-white/10 w-full"
        >
          {[
            { icon: TrendingUp, label: 'annonces actives',   value: '2 500+', color: 'text-amber-400' },
            { icon: Users,      label: 'membres inscrits',   value: '1 200+', color: 'text-blue-400'  },
            { icon: BadgeCheck, label: 'vendeurs certifiés', value: '150+',   color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
              <span className="text-[11px] text-white/40 font-medium">{s.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
