'use client';

import { LayoutDashboard, ShoppingCart, Package, Activity, Settings, Eye, ChevronRight, Ticket, Wallet, MessageSquare } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export function VendorNav() {
  const pathname = usePathname();
  
  if (!pathname) return null;
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/vendeur/dashboard' },
    { icon: ShoppingCart, label: 'Commandes', href: '/vendeur/commandes' },
    { icon: Package, label: 'Inventaire', href: '/vendeur/dashboard' },
    { icon: Ticket, label: 'Coupons', href: '/vendeur/coupons' },
    { icon: Wallet, label: 'Finances', href: '/vendeur/finances' },
    { icon: MessageSquare, label: 'Avis Clients', href: '/vendeur/avis' },
    { icon: Activity, label: 'Analytics', href: '/vendeur/dashboard' },
    { icon: Settings, label: 'Profil', href: '/vendeur/profil' },
  ];

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[2.5rem] p-4 flex flex-col items-center gap-6 shadow-2xl shadow-black/10">
        
        {/* Brand Icon */}
        <Link href="/" className="h-12 w-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-lg hover:rotate-6 transition-all">
          <Eye className="h-6 w-6 text-white dark:text-slate-900" />
        </Link>

        <div className="w-8 h-px bg-black/5 dark:bg-white/10" />

        {/* Nav Links */}
        <nav className="flex flex-col gap-3">
          {sidebarLinks.map((link, idx) => {
            const currentPath = pathname.replace(/^\/(fr|en|ar)/, '');
            const pathToCheck = currentPath === '' ? '/' : currentPath;
            const isActive = link.href === '/vendeur/dashboard' ? pathToCheck === '/vendeur/dashboard' : pathToCheck.startsWith(link.href);
            
            return (
              <Link 
                key={idx} 
                href={link.href as any} 
                className={`group relative h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <link.icon className="h-6 w-6" />
                
                {/* Tooltip */}
                <div className="absolute left-16 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none shadow-xl whitespace-nowrap z-50">
                  {link.label}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900 dark:border-r-white" />
                </div>
              </Link>
            )})}
        </nav>

        <div className="w-8 h-px bg-black/5 dark:bg-white/10" />

        {/* Bottom Profile */}
        <Link href="/vendeur/profil" className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-black/5 hover:ring-cyan-500 transition-all">
          <div className="h-full w-full flex items-center justify-center font-black text-xs text-slate-400">V</div>
        </Link>
      </div>
    </aside>
  );
}
