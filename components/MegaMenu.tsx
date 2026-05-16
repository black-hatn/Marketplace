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
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 top-0 z-[151] glass border-b border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="mx-auto max-w-[1600px] px-8 py-12">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase">Exploration</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16">
                {/* Left: Categories Grid */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {navigationSections.map((section, idx) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="space-y-6 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-all">
                          <Package className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{section.title}</h3>
                      </div>
                      
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="flex items-center justify-between px-4 py-3 rounded-2xl glass hover:bg-white hover:text-black transition-all group/item"
                            >
                              <span className="text-sm font-bold uppercase tracking-widest">{link.label}</span>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Right: Brand & Account Section */}
                <div className="space-y-12">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/20">Votre Compte</h3>
                    
                    {!session ? (
                      <div className="space-y-4">
                        <Link
                          href="/admin/login"
                          onClick={onClose}
                          className="flex items-center justify-center w-full py-4 rounded-2xl bg-white text-black font-bold tracking-wide hover:bg-white/90 transition-all"
                        >
                          <LogIn className="w-4 h-4 mr-2" /> Connexion
                        </Link>
                        <Link
                          href="/register"
                          onClick={onClose}
                          className="flex items-center justify-center w-full py-4 rounded-2xl glass text-white font-bold tracking-wide hover:bg-white/10 transition-all"
                        >
                          <UserPlus className="w-4 h-4 mr-2" /> Créer un compte
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                            {session.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg leading-none">{session.user?.name}</p>
                            <p className="text-xs text-white/40 mt-1">{session.user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/mes-commandes" onClick={onClose} className="flex flex-col items-center justify-center p-4 rounded-2xl glass hover:bg-white/5 transition-all text-center">
                            <Package className="w-5 h-5 text-blue-400 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Commandes</span>
                          </Link>
                          <Link href="/favoris" onClick={onClose} className="flex flex-col items-center justify-center p-4 rounded-2xl glass hover:bg-white/5 transition-all text-center">
                            <Heart className="w-5 h-5 text-red-400 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Favoris</span>
                          </Link>
                        </div>

                        <button
                          onClick={() => { signOut({ callbackUrl: '/' }); onClose(); }}
                          className="flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Se déconnecter
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Promo Banner */}
                  <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt="Promo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold text-white mb-3">
                        <Rocket className="w-3 h-3 text-blue-400" /> Nouveauté Tech
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-4">Découvrez la Collection 2025</h4>
                      <Link href="/produits?category=Tech" onClick={onClose} className="text-sm font-bold text-white flex items-center gap-2 hover:underline">
                        En savoir plus <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
