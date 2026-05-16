'use client';

import { LayoutDashboard, ShoppingCart, Package, Activity, Settings, Eye, ChevronRight, Ticket, Wallet, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

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
    { icon: Settings, label: 'Profil', href: '/vendeur/profil' },
  ];

  return (
    <aside className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="glass rounded-[3rem] p-4 flex flex-col items-center gap-6 border border-white/5 shadow-2xl">
        
        {/* Brand Icon */}
        <Link href="/" className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl hover:rotate-6 transition-all group">
          <Sparkles className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
        </Link>

        <div className="w-8 h-px bg-white/10" />

        {/* Nav Links */}
        <nav className="flex flex-col gap-4">
          {sidebarLinks.map((link, idx) => {
            const currentPath = pathname.replace(/^\/(fr|en|ar)/, '') || '/';
            const isActive = link.href === '/vendeur/dashboard' ? currentPath === '/vendeur/dashboard' : currentPath.startsWith(link.href);
            
            return (
              <Link 
                key={idx} 
                href={link.href as any} 
                className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-white text-black shadow-xl' : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5 relative z-10" />
                
                {/* Active Indicator Glow */}
                {isActive && (
                  <motion.div 
                    layoutId="vendor-nav-active"
                    className="absolute inset-0 bg-white rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  />
                )}

                {/* Tooltip */}
                <div className="absolute left-20 px-4 py-2 rounded-xl glass border border-white/10 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none shadow-2xl whitespace-nowrap z-50">
                  {link.label}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white/10" />
                </div>
              </Link>
            )})}
        </nav>

        <div className="w-8 h-px bg-white/10" />

        {/* Bottom Profile */}
        <Link href="/vendeur/profil" className="w-14 h-14 rounded-[1.5rem] overflow-hidden glass border border-white/10 flex items-center justify-center group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-[10px] text-white group-hover:scale-110 transition-transform">
            V
          </div>
        </Link>
      </div>
    </aside>
  );
}
