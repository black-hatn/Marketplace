'use client';

import { Search } from 'lucide-react';

export function ProductFilterPanel({
  category,
  badge,
  brand,
  search,
  categories,
  badges,
  brands,
  onCategoryChange,
  onBadgeChange,
  onBrandChange,
  onSearchChange
}: {
  category: string;
  badge: string;
  brand: string;
  search: string;
  categories: string[];
  badges: string[];
  brands: string[];
  onCategoryChange: (value: string) => void;
  onBadgeChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <aside className="glass-card rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Filtres actifs</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Affinez votre recherche</h2>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent pl-11 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            placeholder="Rechercher un produit, une marque..."
            aria-label="Recherche de produit"
          />
        </div>

        <div className="grid gap-4">
          <label className="block text-sm font-semibold text-slate-200">Catégorie</label>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-cyan-300 focus:outline-none"
          >
            <option value="Tous">Tous les secteurs</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          <label className="block text-sm font-semibold text-slate-200">Marque</label>
          <select
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-cyan-300 focus:outline-none"
          >
            <option value="Tous">Toutes les marques</option>
            {brands.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          <label className="block text-sm font-semibold text-slate-200">Badge</label>
          <select
            value={badge}
            onChange={(event) => onBadgeChange(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-cyan-300 focus:outline-none"
          >
            <option value="Tous">Tous les styles</option>
            {badges.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
