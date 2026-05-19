'use client';

import { LayoutDashboard, ShoppingCart, Tags, Users, BarChart3, ShieldAlert, Settings, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function AdminNav({ userName }: { userName?: string }) {
  const pathname = usePathname();
  
  if (!pathname) return null;
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard',   href: '/admin' },
    { icon: ShoppingCart,    label: 'Commandes',   href: '/admin/commandes' },
    { icon: Tags,            label: 'Vendeurs',    href: '/admin/vendeurs' },
    { icon: Users,           label: 'Clients',     href: '/admin/clients' },
    { icon: BarChart3,       label: 'Analyses',    href: '/admin/analyses' },
    { icon: ShieldAlert,     label: 'Audit & Log', href: '/admin/audit' },
    { icon: Settings,        label: 'Paramètres',  href: '/admin/profil' },
  ];

  const currentPath = pathname.replace(/^\/(fr|en|ar)/, '') || '/';

  return (
    <aside className="hidden lg:flex w-64 bg-[#050505] border-r border-white/5 flex-col fixed inset-y-0 z-50">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-600/8 blur-[80px] pointer-events-none" />

      {/* Logo */}
      <div className="relative p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tighter leading-none">Immersive</h1>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      <div className="h-px bg-white/5 mx-6 mb-4" />

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] px-3 mb-3">Navigation</p>
        {sidebarLinks.map((link, idx) => {
          const isActive = link.href === '/admin' 
            ? currentPath === '/admin' 
            : currentPath.startsWith(link.href);
          
          return (
            <Link 
              key={idx} 
              href={link.href as any} 
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? 'text-white' 
                  : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                />
              )}
              <link.icon className={`h-4 w-4 relative z-10 flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-white'}`} />
              <span className="text-sm font-bold relative z-10">{link.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-4 relative">
        <div className="h-px bg-white/5 mb-4" />
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
            {userName?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate leading-none">{userName || 'Administrateur'}</p>
            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En Ligne
            </p>
          </div>
          <Link
            href="/api/auth/signout"
            className="text-white/20 hover:text-red-400 transition-colors"
            title="Déconnexion"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
        <Link href="/produits" className="flex items-center justify-center gap-2 mt-3 text-[9px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest py-2">
          Voir la Boutique Live <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
