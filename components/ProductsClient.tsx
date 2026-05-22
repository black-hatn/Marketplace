'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterX, Plus, Star, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

type ProductProps = {
  id: string;
  title: string;
  category: string;
  vendor: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string | null;
  tagline?: string | null;
  image: string;
  href?: string | null;
  description?: string | null;
  city?: string;
  stock?: number;
};

const ITEMS_PER_PAGE = 12;

export default function ProductsClient({ initialProducts }: { initialProducts: ProductProps[] }) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  // O — Filtres avancés
  const prices = useMemo(() => initialProducts.map((p) => p.price), [initialProducts]);
  const globalMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const globalMax = prices.length ? Math.ceil(Math.max(...prices)) : 10_000_000;
  const [priceMin, setPriceMin] = useState(globalMin);
  const [priceMax, setPriceMax] = useState(globalMax);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = useMemo(() => {
    const fromProducts = Array.from(new Set(initialProducts.map((p) => p.category)));
    return ['Tous', ...fromProducts.sort()];
  }, [initialProducts]);

  useEffect(() => {
    if (!searchParams) return;
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s) setSearch(s);
    if (c) {
      const found = categories.find((cat) => cat.toLowerCase() === c.toLowerCase());
      if (found) setCategory(found);
    }
  }, [searchParams, categories]);

  // Sync price bounds when products load
  useEffect(() => {
    setPriceMin(globalMin);
    setPriceMax(globalMax);
  }, [globalMin, globalMax]);

  const resetFilters = useCallback(() => {
    setCategory('Tous');
    setSearch('');
    setPriceMin(globalMin);
    setPriceMax(globalMax);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('newest');
    setVisibleCount(ITEMS_PER_PAGE);
  }, [globalMin, globalMax]);

  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((p) => {
      const matchCat = category === 'Tous' || p.category === category;
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price >= priceMin && p.price <= priceMax;
      const matchRating = minRating === 0 || p.rating >= minRating;
      const matchStock = !inStockOnly || (p.stock ?? 1) > 0;
      return matchCat && matchSearch && matchPrice && matchRating && matchStock;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [category, search, priceMin, priceMax, minRating, inStockOnly, sortBy, initialProducts]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeFilterCount = [
    category !== 'Tous',
    search.trim() !== '',
    priceMin > globalMin,
    priceMax < globalMax,
    minRating > 0,
    inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="relative w-full min-h-screen bg-[#030303] overflow-hidden selection:bg-white/20 selection:text-white pb-24">
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="h-24 sm:h-32" />

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 space-y-10">
        {/* Header */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">La Boutique</h1>
            <p className="text-lg text-white/60">L'intégralité de notre catalogue premium, soigneusement sélectionné.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-80">
              <input
                type="search"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                className="w-full pl-4 pr-4 py-4 rounded-2xl glass text-white placeholder-white/40 outline-none focus:border-white/30 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Filtres avancés"
              aria-expanded={showFilters}
              className={`relative flex items-center gap-2 px-4 py-4 rounded-2xl glass font-medium text-sm transition-all ${showFilters ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* O — Panneau filtres avancés */}
        <AnimatePresence>
          {showFilters && (
            <motion.section
              key="filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-3xl p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Prix */}
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">Prix (FCFA)</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={globalMin}
                        max={priceMax}
                        value={priceMin}
                        onChange={(e) => { setPriceMin(Number(e.target.value)); setVisibleCount(ITEMS_PER_PAGE); }}
                        className="w-full px-3 py-2 rounded-xl glass text-white text-sm outline-none"
                        placeholder="Min"
                        aria-label="Prix minimum"
                      />
                      <span className="text-white/40 text-xs shrink-0">—</span>
                      <input
                        type="number"
                        min={priceMin}
                        max={globalMax}
                        value={priceMax}
                        onChange={(e) => { setPriceMax(Number(e.target.value)); setVisibleCount(ITEMS_PER_PAGE); }}
                        className="w-full px-3 py-2 rounded-xl glass text-white text-sm outline-none"
                        placeholder="Max"
                        aria-label="Prix maximum"
                      />
                    </div>
                    <input
                      type="range"
                      min={globalMin}
                      max={globalMax}
                      value={priceMax}
                      onChange={(e) => { setPriceMax(Number(e.target.value)); setVisibleCount(ITEMS_PER_PAGE); }}
                      className="w-full accent-blue-500"
                      aria-label="Curseur prix maximum"
                    />
                  </div>
                </div>

                {/* Note minimale */}
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">Note minimale</p>
                  <div className="flex flex-wrap gap-2">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => { setMinRating(r); setVisibleCount(ITEMS_PER_PAGE); }}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          minRating === r ? 'bg-amber-500 text-black' : 'glass text-white/70 hover:text-white'
                        }`}
                      >
                        {r === 0 ? 'Tous' : <><Star className="w-3 h-3 fill-current" />{r}+</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">Disponibilité</p>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      role="checkbox"
                      aria-checked={inStockOnly}
                      onClick={() => { setInStockOnly((v) => !v); setVisibleCount(ITEMS_PER_PAGE); }}
                      className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${inStockOnly ? 'bg-blue-500' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${inStockOnly ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">En stock uniquement</span>
                  </label>
                </div>

                {/* Trier + reset */}
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">Trier par</p>
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value as any); setVisibleCount(ITEMS_PER_PAGE); }}
                    className="w-full glass px-4 py-3 rounded-xl text-sm text-white outline-none"
                  >
                    <option value="newest" className="bg-zinc-900">Nouveautés</option>
                    <option value="price-asc" className="bg-zinc-900">Prix croissant</option>
                    <option value="price-desc" className="bg-zinc-900">Prix décroissant</option>
                    <option value="rating" className="bg-zinc-900">Mieux notés</option>
                  </select>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors font-bold"
                    >
                      <X className="w-3 h-3" /> Réinitialiser ({activeFilterCount})
                    </button>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Catégories */}
        <section className="flex flex-wrap items-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                category === cat ? 'bg-white text-black' : 'glass text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        <div className="text-sm font-medium text-white/50">
          {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
        </div>

        {/* Grille produits */}
        <AnimatePresence mode="wait">
          {displayedProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center glass-card rounded-3xl"
            >
              <FilterX className="w-16 h-16 text-white/20 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Aucun produit trouvé</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8">Modifiez vos filtres pour élargir la recherche.</p>
              <button
                onClick={resetFilters}
                className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && (
          <div className="flex justify-center pt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="px-10 py-4 rounded-full glass text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Voir plus <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
