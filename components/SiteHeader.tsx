'use client';

import { useState } from 'react';
import { Menu, X, ShieldAlert, Heart, ShoppingCart, Rocket, LayoutDashboard, Sparkles, LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartSlideOver } from '@/components/CartSlideOver';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MegaMenu } from '@/components/MegaMenu';
import { GlobalSearch } from '@/components/GlobalSearch';
import { ShinyButton } from '@/components/ShinyButton';
import { signOut } from 'next-auth/react';

import { useCartStore } from '@/lib/store';

export function SiteHeader() {
  const { data: session } = useSession() as any;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) => `text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
    isLinkActive(href) 
      ? 'text-cyan-600 dark:text-cyan-400' 
      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
  }`;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500">
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-black/5 dark:border-white/10" />
      
      {/* Upper Navigation: Brand & Core Actions */}
      <div className="relative mx-auto max-w-[1600px] px-6 h-20 flex items-center justify-between gap-10">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href="/" className="group flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
              <Sparkles className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase">
                Immersive<span className="text-cyan-500">.</span>
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Marketplace Pro</p>
            </div>
          </Link>
        </div>

        {/* Centered Search (Expanded & Refined) */}
        <div className="flex-1 max-w-xl hidden md:block">
          <GlobalSearch />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
            {session?.user?.role === "VENDOR" ? (
              <Link href="/vendeur/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-white dark:bg-slate-900 shadow-sm border border-emerald-500/10">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard Pro
              </Link>
            ) : session?.user?.role === "ADMIN" ? (
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-violet-600 bg-white dark:bg-slate-900 shadow-sm border border-violet-500/10">
                <ShieldAlert className="h-3.5 w-3.5" /> Panel Admin
              </Link>
            ) : (
              <Link href="/vendre" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-colors">
                <Rocket className="h-3.5 w-3.5" /> Vendre sur Immersive
              </Link>
            )}
            
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
            
            <Link href="/mes-commandes" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-colors">
              Mes Achats
            </Link>

            {!session && (
              <>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
                <Link href="/admin/login" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-600 hover:bg-cyan-500/5 transition-colors">
                  Connexion
                </Link>
              </>
            )}

            {session && (
              <>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/favoris" title="Favoris" className="hidden sm:flex p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-black/5 dark:border-white/10 hover:border-red-500/30 transition-all group">
              <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-red-500 transition-colors" />
            </Link>
            
            <ThemeToggle />
            <CartSlideOver />

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Navigation: Categories & Links */}
      <div className="relative border-t border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-[1600px] px-6 h-12 flex items-center justify-center">
          <nav className="flex items-center gap-8">
            <Link href="/" className={linkClass('/')}>Découvrir</Link>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <Menu className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300" />
              Collections
            </button>
            <Link href="/produits" className={linkClass('/produits')}>Boutique</Link>
            <Link href="/marques" className={linkClass('/marques')}>Marques</Link>
            <div className="h-3 w-px bg-black/10 dark:bg-white/10 mx-2" />
            <Link href="/produits?badge=Nouveauté" className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest animate-pulse hover:underline">Nouveautés</Link>
          </nav>
        </div>
      </div>

      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
