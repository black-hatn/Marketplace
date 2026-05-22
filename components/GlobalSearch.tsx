'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Package, Tags, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { globalSearch } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type SearchResult = {
  products: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
    brand: { name: string };
    category: { name: string };
  }>;
  brands: Array<{
    id: string;
    slug: string;
    name: string;
    tagline: string;
    image: string;
  }>;
};

export function GlobalSearch() {
  const t = useTranslations('Header');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await globalSearch(q);
      setResults(data as any as SearchResult);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const clear = () => {
    setQuery('');
    setResults(null);
    inputRef.current?.focus();
  };

  const hasResults = results && (results.products.length > 0 || results.brands.length > 0);
  const noResults = results && results.products.length === 0 && results.brands.length === 0;
  const showDropdown = focused && query.length >= 2;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setFocused(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative w-full max-w-xl">
      {/* Search Input Container */}
      <div className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl glass transition-all duration-500 border ${
        focused ? 'border-blue-500/50 ring-4 ring-blue-500/10' : 'border-white/5 hover:border-white/10'
      }`}>
        {loading ? (
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        ) : (
          <Search className={`w-5 h-5 transition-colors ${focused ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-white/20'}`} />
        )}
        
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Rechercher une pièce rare..."
          className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-white/40 outline-none"
        />

        {query && (
          <button 
            onClick={clear}
            className="w-6 h-6 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Shortcut hint */}
        {!focused && !query && (
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-white/30 tracking-tighter">
            <span>⌘</span>
            <span>K</span>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-3 z-[100] glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            <div className="overflow-y-auto custom-scrollbar">
              {loading && !results && (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-light">Exploration de la base de données...</p>
                </div>
              )}

              {noResults && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white/10" />
                  </div>
                  <h3 className="text-white font-bold mb-1">Aucun résultat</h3>
                  <p className="text-xs text-muted-foreground font-light">Nous n&apos;avons rien trouvé pour &quot;{query}&quot;</p>
                </div>
              )}

              {hasResults && (
                <div className="p-2 space-y-1">
                  {/* Products Section */}
                  {results.products.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 flex items-center gap-2 mb-2">
                        <Package className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Produits d&apos;exception</span>
                      </div>
                      <div className="space-y-1">
                        {results.products.map((p) => (
                          <Link
                            key={p.id}
                            href={`/produit/${p.id}`}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-light border border-white/5 flex-shrink-0">
                              <Image src={p.image} alt={p.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{p.title}</h4>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.brand.name} · {p.category.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-white">{p.price.toLocaleString()} <span className="text-[10px] text-white/30">FCFA</span></p>
                              <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto mt-1" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brands Section */}
                  {results.brands.length > 0 && (
                    <div className="p-2 border-t border-white/5">
                      <div className="px-3 py-2 flex items-center gap-2 mb-2">
                        <Tags className="w-3 h-3 text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Maisons & Créateurs</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {results.brands.map((b) => (
                          <Link
                            key={b.id}
                            href={`/marques/${b.slug}`}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group"
                          >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                              <Image src={b.image} alt={b.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">{b.name}</h4>
                              <p className="text-[9px] text-muted-foreground truncate">{b.tagline}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {hasResults && (
              <Link 
                href={`/produits?search=${encodeURIComponent(query)}`}
                className="px-6 py-4 bg-white/5 flex items-center justify-center gap-2 text-xs font-bold text-white hover:bg-white hover:text-black transition-all group"
              >
                Voir tous les résultats
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
