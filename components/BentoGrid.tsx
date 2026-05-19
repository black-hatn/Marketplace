'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { bentoItems } from '@/lib/content';

export function BentoGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
      {/* Main Feature Card — full width on mobile, spans 2 cols on lg */}
      <motion.article
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[280px] sm:min-h-[380px] lg:min-h-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
          alt="Innovation Tech"
          fill
          className="object-cover opacity-60 dark:opacity-40 transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8 lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-500 backdrop-blur-md border border-amber-500/10 shimmer-effect">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" /> Découverte 2025
            </div>
            <h3 className="mt-4 sm:mt-6 text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl lg:text-5xl max-w-2xl">
              Explorer les tendances <span className="text-gradient-gold">hybrides</span> par secteur.
            </h3>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 hidden sm:block">
              Une sélection exclusive où l&apos;innovation technologique rencontre l&apos;élégance du design durable.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 sm:gap-3">
            {['Luxe Durable', 'Audio Spatial', 'Bien-être IA'].map((tag) => (
              <span key={tag} className="rounded-full bg-white/20 dark:bg-white/5 px-3 py-1.5 sm:px-5 sm:py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 backdrop-blur-xl border border-black/5 dark:border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>

      {/* Smaller Accent Cards */}
      {bentoItems.map((item, index) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          className="glass-card group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 min-h-[160px] sm:min-h-[200px]"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover opacity-40 dark:opacity-30 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500">{item.tag}</p>
                <h3 className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h3>
              </div>
              <div className="rounded-full bg-white/50 dark:bg-white/10 p-1.5 sm:p-2 text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
              {item.description}
            </p>
          </div>
        </motion.article>
      ))}
    </section>
  );
}
