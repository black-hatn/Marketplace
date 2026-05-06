'use client';

import { useState } from 'react';
import { Menu, X, ShieldAlert, Heart, ShoppingCart, Rocket, LayoutDashboard, Sparkles, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { CartSlideOver } from '@/components/CartSlideOver';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MegaMenu } from '@/components/MegaMenu';
import { GlobalSearch } from '@/components/GlobalSearch';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCartStore } from '@/lib/store';

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations('Header');

  const { data: session } = useSession() as any;
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  if (pathname?.includes('/admin')) return null;


  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const linkClass = (href: string) => `text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
    isLinkActive(href) 
      ? 'text-cyan-600 dark:text-cyan-400' 
      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
  }`;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500">
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-black/5 dark:border-white/10" />
      
      {/* Upper Navigation */}
      <div className="relative mx-auto max-w-[1600px] px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="group flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-slate-900" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase">
                Immersive<span className="text-cyan-500">.</span>
              </h1>
              <p className="hidden sm:block text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">Marketplace Pro</p>
            </div>
          </Link>
        </div>

        {/* Search — only on md+ */}
        <div className="flex-1 max-w-xl hidden md:block">
          <GlobalSearch />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop nav links */}
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
                <Rocket className="h-3.5 w-3.5" /> {t('become_partner')}
              </Link>
            )}
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
            <Link href="/favoris" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-colors">
              <Heart className="h-3.5 w-3.5" /> {t('discover')}
            </Link>
            {!session && (
              <>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
                <Link href="/admin/login" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-colors">
                  {t('login')}
                </Link>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />
                <Link href="/register" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold hover:bg-cyan-500/5 transition-colors">
                  {t('register')}
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

          <LanguageSwitcher />
          <ThemeToggle />
          <CartSlideOver />

          {/* Mobile menu button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl"
          >
            {menuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar — shown only on mobile */}
      <div className="relative border-t border-black/5 dark:border-white/5 px-3 py-2 md:hidden">
        <GlobalSearch />
      </div>

      {/* Lower Navigation — desktop only */}
      <div className="relative border-t border-black/5 dark:border-white/5 hidden md:block">
        <div className="mx-auto max-w-[1600px] px-6 h-12 flex items-center justify-center">
          <nav className="flex items-center gap-8">
            <Link href="/" className={linkClass('/')}>{t('discover')}</Link>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <Menu className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300" />
              {t('categories')}
            </button>
            <Link href="/produits" className={linkClass('/produits')}>{t('shop')}</Link>
            <Link href="/marques" className={linkClass('/marques')}>{t('brands')}</Link>
            <div className="h-3 w-px bg-black/10 dark:bg-white/10 mx-2" />
            <Link href="/produits?badge=Nouveauté" className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest animate-pulse hover:underline">{t('news')}</Link>
          </nav>
        </div>
      </div>

      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
