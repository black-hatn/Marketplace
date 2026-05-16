'use client';

import { LayoutDashboard, ShoppingCart, Tags, Users, BarChart3, ShieldAlert, Settings, Sparkles, Box } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function AdminNav() {
  const pathname = usePathname();
  
  if (!pathname) return null;
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ShoppingCart, label: 'Commandes', href: '/admin/commandes' },
    { icon: Tags, label: 'Vendeurs', href: '/admin/vendeurs' },
    { icon: Users, label: 'Clients', href: '/admin/clients' },
    { icon: BarChart3, label: 'Analyses', href: '/admin/analyses' },
    { icon: ShieldAlert, label: 'Audit & Log', href: '/admin/audit' },
    { icon: Settings, label: 'Paramètres', href: '/admin/profil' },
  ];

  return (
    <aside className="hidden lg:flex w-72 bg-[#050505] border-r border-white/5 flex-col fixed inset-y-0 z-50 overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/10 blur-[60px] pointer-events-none" />

      <div className="relative z-10">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tighter">Immersive</h1>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarLinks.map((link, idx) => {
            const currentPath = pathname.replace(/^\/(fr|en|ar)/, '') || '/';
            const isActive = link.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(link.href);
            
            return (
              <Link 
                key={idx} 
                href={link.href as any} 
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${
                  isActive ? 'text-white' : 'text-white/30 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  />
                )}
                <link.icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-white'}`} />
                <span className="text-sm font-bold relative z-10">{link.label}</span>
                {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] relative z-10" />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Status Card */}
      <div className="mt-auto p-6 relative z-10">
        <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Administrateur</p>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En Ligne
              </p>
            </div>
          </div>
          <div className="h-px bg-white/5" />
          <Link href="/produits" className="flex items-center justify-between text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">
            Boutique Live <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
