'use client';

import { useState } from 'react';
import { Filter, ChevronRight, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';

interface SmartFilterSidebarProps {
  categories?: { id: string; name: string }[];
  productsCount?: number;
  brandsCount?: number;
}

export function SmartFilterSidebar({ categories = [], productsCount = 0, brandsCount = 0 }: SmartFilterSidebarProps) {
  const [active, setActive] = useState('tous');

  return (
    <aside className="glass-card h-fit rounded-[2.5rem] p-8 lg:sticky lg:top-32 shadow-xl shadow-black/[0.02]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Filter className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Navigation</h2>
            <p className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">Secteurs actifs</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActive('tous')}
            className={`group relative flex w-full items-center justify-between rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 ${
              active === 'tous' 
                ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/[0.03]' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
            }`}
          >
            <div className="relative z-10 flex items-center gap-4">
              <span className={`h-1.5 w-1.5 rounded-full ${active === 'tous' ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span>Tous les produits</span>
            </div>
          </button>

          {categories.map((category) => {
            const isActive = active === category.id;
            return (
              <Link
                key={category.id}
                href={`/produits?category=${encodeURIComponent(category.name)}`}
                className={`group relative flex w-full items-center justify-between rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/[0.03]' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-500 scale-125 shadow-glow-sm' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  <span>{category.name}</span>
                </div>
                <ChevronRight
                  className={`relative z-10 h-4 w-4 transition-all duration-500 ${
                    isActive ? 'rotate-90 text-cyan-600 dark:text-cyan-400 scale-110' : 'opacity-20 -translate-x-2'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Insights temps réel</p>
          
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
              <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <span className="block text-lg font-bold text-slate-900 dark:text-white">{productsCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produits actifs</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
              <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <span className="block text-lg font-bold text-slate-900 dark:text-white">{brandsCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marques partenaires</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
