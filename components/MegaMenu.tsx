'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-slate-950/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-0 right-0 z-[60] overflow-hidden border-t border-black/5 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 backdrop-blur-3xl shadow-2xl"
          >
            <nav aria-label="Navigation principale" className="mx-auto w-full max-w-[1800px] px-6 py-10">
              <div className="flex flex-col gap-6 rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/40 p-8 shadow-inner sm:flex-row sm:items-center sm:justify-between">
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

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {navigationSections.map((section, idx) => (
                  <motion.article
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex flex-col rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-6 transition hover:border-cyan-500/20 dark:hover:border-cyan-500/30 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-slate-950">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300">
                      {section.description}
                    </p>
                    <div className="mt-8 space-y-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        >
                          <span>{link.label}</span>
                          <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 transition group-hover:opacity-40" />
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
