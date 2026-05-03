'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, FilterX, Sparkles, Plus, Scale, X, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import PageTransition from '@/components/PageTransition';

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
};

const ITEMS_PER_PAGE = 8;

import Image from 'next/image';

export default function ProductsClient({ initialProducts }: { initialProducts: ProductProps[] }) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('Tous');
  const [city, setCity] = useState('Tout le Tchad');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [compareList, setCompareList] = useState<ProductProps[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Sync with URL search params
  useEffect(() => {
    const s = searchParams.get('search');
    const b = searchParams.get('badge');
    if (s) setSearch(s);
    if (b) {
      setSearch(b);
    }
  }, [searchParams]);

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(initialProducts.map((p) => p.category))).sort()],
    [initialProducts]
  );

  const cities = useMemo(
    () => ['Tout le Tchad', ...Array.from(new Set(initialProducts.map((p) => p.city || "N'Djaména"))).sort()],
    [initialProducts]
  );

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory = category === 'Tous' || product.category === category;
      const matchesCity = city === 'Tout le Tchad' || (product.city || "N'Djaména") === city;
      const matchesSearch =
        search.trim() === '' ||
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.vendor.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesCity && matchesSearch;
    });
  }, [category, city, search, initialProducts]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const toggleCompare = (product: ProductProps) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 3) return; // Limit to 3
      setCompareList(prev => [...prev, product]);
    }
  };

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 pb-24">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.07] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-6 py-10 lg:py-20 space-y-12">
          <div className="glass-card relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.05] dark:from-cyan-500/[0.1] via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
                  <ShoppingBag className="h-4 w-4" /> Catalogue Immersif
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-tight">
                  L'Excellence à portée de <span className="text-cyan-600 dark:text-cyan-400">découverte</span>.
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-slate-600 dark:text-slate-300">
                  Découvrez des produits premium qui redéfinissent votre quotidien.
                </p>
              </div>
              
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un produit, une marque..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-14 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-xl transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-2">Catégories :</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
                    className={`rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                      category === cat
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-2">Ville :</span>
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setVisibleCount(ITEMS_PER_PAGE); }}
                    className={`rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                      city === c
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-blue-500/10 hover:text-blue-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6">
              <p className="text-sm font-bold text-slate-500">
                <span className="text-slate-900 dark:text-white">{filteredProducts.length}</span> produits correspondent
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              {displayedProducts.length ? (
                <div className="space-y-12">
                  <motion.div 
                    layout
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {displayedProducts.map((product) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group relative"
                      >
                        <ProductCard product={product} />
                        <button 
                          onClick={() => toggleCompare(product)}
                          className={`absolute top-4 left-4 p-2 rounded-xl backdrop-blur-md transition-all ${
                            compareList.find(p => p.id === product.id)
                              ? 'bg-cyan-500 text-white scale-110'
                              : 'bg-black/20 text-white opacity-0 group-hover:opacity-100 hover:bg-black/40'
                          }`}
                          title="Comparer ce produit"
                        >
                          <Scale className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {hasMore && (
                    <div className="flex justify-center pt-8">
                      <button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 text-sm font-bold shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Charger plus de produits
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="rounded-full bg-slate-100 dark:bg-slate-900 p-6 mb-6">
                    <FilterX className="h-12 w-12 text-slate-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aucun résultat trouvé</h2>
                  <button
                    onClick={() => { setCategory('Tous'); setSearch(''); }}
                    className="mt-8 rounded-full bg-cyan-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-cyan-400"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Comparison Bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
            >
              <div className="glass-card rounded-3xl border border-cyan-500/30 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-4 flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 overflow-x-auto">
                  {compareList.map(p => (
                    <div key={p.id} className="relative group flex-shrink-0 w-14 h-14">
                      <Image src={p.image} fill className="rounded-xl object-cover ring-1 ring-black/10" alt={p.title} sizes="56px" />
                      <button 
                        onClick={() => toggleCompare(p)}
                        className="absolute -top-1 -right-1 z-10 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {compareList.length < 3 && (
                    <div className="h-14 w-14 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 hidden sm:block">{compareList.length}/3 sélectionnés</span>
                  <button 
                    disabled={compareList.length < 2}
                    onClick={() => setShowCompare(true)}
                    className="rounded-xl bg-cyan-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-cyan-700 transition-colors"
                  >
                    Comparer
                  </button>
                  <button onClick={() => setCompareList([])} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {showCompare && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={() => setShowCompare(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative glass-card rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3"><Scale className="h-6 w-6 text-cyan-500" /> Comparatif Produits</h2>
                  <button onClick={() => setShowCompare(false)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><X className="h-6 w-6" /></button>
                </div>
                <div className="flex-1 overflow-auto p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-[300px]">
                    {compareList.map(p => (
                      <div key={p.id} className="space-y-8">
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl">
                          <Image src={p.image} fill className="object-cover" alt={p.title} sizes="(max-width: 768px) 100vw, 400px" />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold">{p.title}</h3>
                          <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{p.price.toLocaleString()} FCFA</p>
                          <div className="space-y-2 text-sm text-slate-500">
                            <p><strong>Marque :</strong> {p.vendor}</p>
                            <p><strong>Catégorie :</strong> {p.category}</p>
                            <p><strong>Note :</strong> {p.rating}/5 ({p.reviews} avis)</p>
                          </div>
                          <Link href={`/produit/${p.id}`} className="flex items-center gap-2 text-cyan-500 font-bold hover:underline">Voir le produit <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
