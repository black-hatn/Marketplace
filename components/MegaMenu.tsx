'use client';

import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, Sparkles, ArrowRight, X } from 'lucide-react';
import { navigationSections } from '@/lib/content';

type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-slate-950/40 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 sm:top-[calc(theme(spacing.20)+theme(spacing.8))] left-0 right-0 bottom-0 sm:bottom-auto z-[60] overflow-y-auto border-t border-black/5 dark:border-white/10 bg-white dark:bg-slate-950 sm:bg-white/90 sm:dark:bg-slate-950/90 backdrop-blur-3xl shadow-2xl sm:max-h-[85vh]"
          >
            {/* Mobile close button */}
            <div className="flex items-center justify-between px-4 py-4 sm:hidden border-b border-black/5 dark:border-white/10">
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Navigation</span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Navigation principale" className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 py-6 sm:py-10">
              {/* Top banner — hidden on mobile */}
              <div className="hidden sm:flex flex-col gap-6 rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/40 p-6 shadow-inner sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 px-4 py-1.5 font-semibold text-cyan-700 dark:text-cyan-200">Collection 2025</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" /> Exploration multi-sectorielle
                  </span>
                </div>
                <Link
                  href="/marques"
                  onClick={onClose}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white transition hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                  Toutes nos marques partenaires
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Mobile quick links */}
              <div className="sm:hidden flex flex-col gap-1 mb-6">
                <Link href="/produits" onClick={onClose} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold text-sm">
                  <ArrowRight className="h-4 w-4 text-cyan-500" /> Tous les produits
                </Link>
                <Link href="/marques" onClick={onClose} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold text-sm">
                  <ArrowRight className="h-4 w-4 text-cyan-500" /> Toutes les marques
                </Link>
                <Link href="/vendre" onClick={onClose} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold text-sm">
                  <ArrowRight className="h-4 w-4 text-cyan-500" /> Devenir vendeur
                </Link>
                <Link href="/mes-commandes" onClick={onClose} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold text-sm">
                  <ArrowRight className="h-4 w-4 text-cyan-500" /> Mes commandes
                </Link>
                <Link href="/favoris" onClick={onClose} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold text-sm">
                  <ArrowRight className="h-4 w-4 text-cyan-500" /> Mes favoris
                </Link>
                <div className="h-px bg-black/5 dark:bg-white/10 my-2" />
              </div>

              {/* Category Grid */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                {navigationSections.map((section, idx) => (
                  <motion.article
                    key={section.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group flex flex-col rounded-[1.5rem] sm:rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-4 sm:p-6 transition hover:border-cyan-500/20 dark:hover:border-cyan-500/30 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-slate-950 flex-shrink-0">
                        <ShieldCheck className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                      <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600 dark:text-slate-400 hidden sm:block">
                      {section.description}
                    </p>
                    <div className="mt-4 sm:mt-8 space-y-1.5 sm:space-y-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        >
                          <span>{link.label}</span>
                          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 -rotate-90 opacity-0 transition group-hover:opacity-40" />
                        </Link>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
