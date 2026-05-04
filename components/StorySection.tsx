'use client';

import Image from 'next/image';

export function StorySection() {
  return (
    <section className="glass-card relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-14">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 dark:from-cyan-500/10 via-transparent to-transparent" />
      <div className="relative z-10 grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 sm:px-4 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-300">
            Notre Philosophie
          </span>
          <h2 className="mt-4 sm:mt-8 text-2xl sm:text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
            Plus qu&apos;une marketplace, un <span className="text-cyan-600 dark:text-cyan-400">écosystème</span> de valeurs.
          </h2>
          <p className="mt-4 sm:mt-8 text-sm sm:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
            Nous sélectionnons chaque marque pour son engagement envers l&apos;innovation et l&apos;éthique. Notre plateforme ne vend pas seulement des produits, elle raconte des histoires.
          </p>
          <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 sm:p-6 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">100%</span>
              <span className="mt-1 block text-xs sm:text-sm text-slate-500 dark:text-slate-400">Marques vérifiées</span>
            </div>
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 sm:p-6 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">0%</span>
              <span className="mt-1 block text-xs sm:text-sm text-slate-500 dark:text-slate-400">Intermédiaires inutiles</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-slate-100 dark:bg-slate-900 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80"
            alt="Collaboration et innovation"
            fill
            className="object-cover opacity-80 dark:opacity-60"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </section>
  );
}
