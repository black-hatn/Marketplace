'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { brands } from '@/lib/content';
import PageTransition from '@/components/PageTransition';

export default function BrandsPage() {
  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.07] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-10 lg:py-20 space-y-12">
          {/* Header Section */}
          <div className="glass-card relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.05] dark:from-cyan-500/[0.1] via-transparent to-transparent" />
            <div className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
                  <Globe className="h-4 w-4" /> Notre Écosystème
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-tight">
                  Un univers de marques <span className="text-cyan-600 dark:text-cyan-400">inspirantes</span>.
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  Parcourez des partenaires choisis pour leur engagement design, leur identité marque unique et leur promesse d’expérience haut de gamme.
                </p>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-[3rem] bg-cyan-500/10 blur-2xl" />
                <div className="relative aspect-video overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-950 shadow-2xl">
                  <Image
                    src={brands[0].image}
                    alt={brands[0].name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-2xl">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                      <Sparkles className="h-3 w-3" /> Focus de la semaine
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{brands[0].name}</h3>
                  </div>
                </div>
              </div>
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
                  className="glass-card group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-black/5 dark:border-white/5">
                    <Image 
                      src={brand.image} 
                      alt={brand.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
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
                    
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                      {brand.tagline}
                    </p>
                    
                    <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                      {brand.impact}
                    </p>
                    
                    <div className="mt-auto pt-8">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-white dark:text-slate-900 transition-all hover:bg-cyan-500 hover:text-white">
                        Découvrir
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
