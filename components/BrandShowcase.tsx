'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import { Brand } from '@/lib/content';

export function BrandShowcase({ brands }: { brands: Brand[] }) {
  return (
    <section className="space-y-10">
      {/* Header Banner */}
      <div className="glass-card relative overflow-hidden rounded-[2.5rem] p-8 lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 dark:from-cyan-500/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
              <Globe className="h-4 w-4" /> Écosystème Partenaire
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Des créateurs qui renforcent la confiance.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Accédez à des pages de marque dédiées pour explorer leur histoire, leurs engagements et leurs produits phares.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={`/marques/${brand.slug}`}
              className="glass-card group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 active:scale-[0.98]"
            >
              <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                <Image 
                  src={brand.image} 
                  alt={brand.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
              
              <div className="flex flex-1 flex-col p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {brand.name}
                  </h3>
                  <div className="rounded-full bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
                
                <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  {brand.title.split(',')[1] || brand.tagline}
                </p>
                
                <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                  {brand.description}
                </p>
                
                <div className="mt-auto pt-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-white dark:text-slate-900 transition-all hover:bg-cyan-500 hover:text-white">
                    Découvrir l'univers
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
