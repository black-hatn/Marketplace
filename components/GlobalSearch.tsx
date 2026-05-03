'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Package, Tags, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { globalSearch } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

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

import Image from 'next/image';

export function GlobalSearch() {
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

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setFocused(false); setQuery(''); setResults(null); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className={`flex items-center gap-3 rounded-2xl border transition-all duration-300 px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg ${
        focused
          ? 'border-cyan-500 ring-4 ring-cyan-500/10 shadow-cyan-500/10'
          : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
      }`}>
        {loading
          ? <Loader2 className="h-5 w-5 text-cyan-500 animate-spin flex-shrink-0" />
          : <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
        }
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Rechercher un produit, une marque, une catégorie..."
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        {query && (
          <button onClick={clear} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
          >
            {loading && !results && (
              <div className="p-6 text-center text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-cyan-500" />
                Recherche en cours...
              </div>
            )}

            {noResults && (
              <div className="p-6 text-center text-sm text-slate-500">
                <Search className="h-6 w-6 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                Aucun résultat pour &quot;<strong>{query}</strong>&quot;
              </div>
            )}

            {hasResults && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[70vh] overflow-y-auto">
                {/* Products */}
                {results.products.length > 0 && (
                  <div>
                    <div className="px-4 py-2 flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Produits</span>
                    </div>
                    {results.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/produit/${p.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-1 ring-black/5">
                          <Image src={p.image} alt={p.title} fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                            {p.title}
                          </p>
                          <p className="text-xs text-slate-500">{p.brand.name} · {p.category.name}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">{p.price.toLocaleString()} FCFA</span>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-cyan-500 transition-all group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Brands */}
                {results.brands.length > 0 && (
                  <div>
                    <div className="px-4 py-2 flex items-center gap-2">
                      <Tags className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Marques</span>
                    </div>
                    {results.brands.map((b) => (
                      <Link
                        key={b.id}
                        href={`/marques/${b.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-1 ring-black/5">
                          <Image src={b.image} alt={b.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{b.name}</p>
                          <p className="text-xs text-slate-500 italic truncate">{b.tagline}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-cyan-500 transition-all group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                  <span className="text-xs text-slate-400">
                    {(results.products.length + results.brands.length)} résultat{(results.products.length + results.brands.length) > 1 ? 's' : ''}
                  </span>
                  <Link
                    href={`/produits?search=${encodeURIComponent(query)}`}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
