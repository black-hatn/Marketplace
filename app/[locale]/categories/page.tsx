'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { navigationSections } from '@/lib/content';

export default function CategoriesPage() {
  return (
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
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
                <Layers className="h-4 w-4" /> Exploration Sectorielle
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-tight">
                Tous les secteurs en un seul <span className="text-cyan-600 dark:text-cyan-400">écosystème</span>.
              </h1>
              <p className="mt-8 text-xl leading-relaxed text-slate-600 dark:text-slate-300">
                Une navigation fluide à travers nos univers produits, conçue pour vous offrir une expérience de découverte sans précédent.
              </p>
            </div>
            <div className="hidden lg:block">
              <Sparkles className="h-20 w-20 text-cyan-500/20" />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {navigationSections.map((section, index) => (
            <motion.article
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card group flex flex-col rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Layers className="h-7 w-7" />
                </div>
                <Link
                  href={section.href}
                  className="rounded-full bg-slate-900 dark:bg-white p-3 text-white dark:text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  {section.description}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
