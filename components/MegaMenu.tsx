'use client';

import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Sparkles, ArrowRight, X,
  ShoppingBag, Store, Package, Heart,
  LogIn, UserPlus, LayoutDashboard, ShieldAlert, Rocket, LogOut
} from 'lucide-react';
import { navigationSections } from '@/lib/content';
import { useSession, signOut } from 'next-auth/react';

type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const { data: session } = useSession() as any;

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
            className="fixed inset-0 z-[55] bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Panel — slides from top on mobile, dropdown on desktop */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 sm:top-auto sm:left-0 sm:right-0 left-0 right-0 bottom-0 sm:bottom-auto z-[60] overflow-y-auto bg-white dark:bg-[#0B1222] sm:bg-white/95 sm:dark:bg-[#0B1222]/95 backdrop-blur-3xl shadow-2xl border-b border-black/5 dark:border-white/10 sm:max-h-[90vh]"
          >
            {/* ── MOBILE HEADER ── */}
            <div className="sm:hidden flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Immersive.</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 py-5 sm:py-10">

              {/* ── DESKTOP TOP BANNER ── */}
              <div className="hidden sm:flex items-center justify-between rounded-[2rem] border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-6 py-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-cyan-500/10 px-4 py-1.5 font-semibold text-cyan-700 dark:text-cyan-300 text-xs uppercase tracking-widest">Collection 2025</span>
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-500" /> Exploration multi-sectorielle
                  </span>
                </div>
                <Link href="/marques" onClick={onClose} className="group inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Toutes nos marques <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* ── MOBILE: ACCOUNT SECTION ── */}
              <div className="sm:hidden mb-5">
                {!session ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/admin/login"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black uppercase tracking-wider shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      <LogIn className="h-4 w-4" /> Connexion
                    </Link>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 text-sm font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 active:scale-[0.98] transition-all"
                    >
                      <UserPlus className="h-4 w-4" /> S&apos;inscrire
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                        {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); onClose(); }}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── MOBILE: QUICK NAV LINKS ── */}
              <div className="sm:hidden mb-5">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 px-1 mb-2">Navigation rapide</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: ShoppingBag, label: 'Catalogue', href: '/produits', color: 'text-cyan-600 bg-cyan-500/10' },
                    { icon: Store, label: 'Marques', href: '/marques', color: 'text-violet-600 bg-violet-500/10' },
                    { icon: Package, label: 'Mes commandes', href: '/mes-commandes', color: 'text-emerald-600 bg-emerald-500/10' },
                    { icon: Heart, label: 'Favoris', href: '/favoris', color: 'text-red-500 bg-red-500/10' },
                    ...(session?.user?.role === 'VENDOR' ? [{ icon: LayoutDashboard, label: 'Dashboard', href: '/vendeur/dashboard', color: 'text-emerald-600 bg-emerald-500/10' }] : []),
                    ...(session?.user?.role === 'ADMIN' ? [{ icon: ShieldAlert, label: 'Admin Panel', href: '/admin', color: 'text-violet-600 bg-violet-500/10' }] : []),
                    ...(!session ? [{ icon: Rocket, label: 'Vendre ici', href: '/vendre', color: 'text-amber-600 bg-amber-500/10' }] : []),
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── CATEGORY GRID (shared mobile+desktop) ── */}
              <div className="sm:hidden mb-2">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 px-1 mb-2">Catégories</p>
              </div>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                {navigationSections.map((section, idx) => (
                  <motion.article
                    key={section.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group flex flex-col rounded-[1.25rem] sm:rounded-[1.75rem] border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-white/[0.015] p-4 sm:p-6 transition-all hover:border-cyan-500/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition-all group-hover:bg-cyan-500 group-hover:text-white flex-shrink-0">
                        <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{section.title}</h2>
                    </div>

                    <p className="hidden sm:block mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {section.description}
                    </p>

                    <div className="mt-3 sm:mt-5 space-y-1">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* ── MOBILE BOTTOM SPACER ── */}
              <div className="sm:hidden h-6" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
