'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, FilterX, Sparkles, Plus, Scale, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
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
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const categories = useMemo(() => {
    const predefined = ['Immobilier', 'Véhicules', 'Emploi', 'Services', 'Électronique', 'Mode', 'Maison', 'Divers'];
    const fromProducts = Array.from(new Set((initialProducts || []).map((p) => p.category)));
    const merged = Array.from(new Set([...predefined, ...fromProducts])).sort();
    return ['Tous', ...merged];
  }, [initialProducts]);

  useEffect(() => {
    if (!searchParams) return;
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    
    if (s) setSearch(s);
    if (c && categories.length > 0) {
      const found = categories.find(cat => cat.toLowerCase() === c.toLowerCase());
      if (found) {
        setCategory(found);
      } else {
        // Fallback for custom category not in list
        setCategory(c);
      }
    }
  }, [searchParams, categories]);

  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    let result = initialProducts.filter((product) => {
      const matchesCategory = category === 'Tous' || product.category === category;
      const matchesSearch =
        search.trim() === '' ||
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.vendor.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // newest as default if no date
    });
  }, [category, search, sortBy, initialProducts]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden selection:bg-white/20 selection:text-white pb-24">
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation spacer */}
      <div className="h-24 sm:h-32"></div>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 space-y-12">
        {/* Header Section */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">La Boutique</h1>
            <p className="text-lg text-muted-foreground">L'intégralité de notre catalogue premium, soigneusement sélectionné pour vous.</p>
          </div>
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une pièce rare..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass text-white placeholder-white/40 outline-none focus:border-white/30 transition-all"
            />
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-white text-black'
                    : 'glass text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="glass px-4 py-2.5 rounded-xl text-sm font-medium text-white outline-none w-full sm:w-auto"
            >
              <option value="newest" className="bg-background text-white">Nouveautés</option>
              <option value="price-asc" className="bg-background text-white">Prix croissant</option>
              <option value="price-desc" className="bg-background text-white">Prix décroissant</option>
            </select>
          </div>
        </section>

        <div className="text-sm font-medium text-muted-foreground">
          {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </div>

        {/* Product Grid */}
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
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center text-center glass-card rounded-3xl"
            >
              <FilterX className="w-16 h-16 text-white/20 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Aucune pièce trouvée</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">Nous n'avons pas trouvé de produit correspondant à vos critères actuels. Essayez de modifier vos filtres.</p>
              <button
                onClick={() => { setCategory('Tous'); setSearch(''); }}
                className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
              >
                Réinitialiser la recherche
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && (
          <div className="flex justify-center pt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              className="px-10 py-4 rounded-full glass text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Charger la suite <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
