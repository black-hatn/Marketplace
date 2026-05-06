'use client';

import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, ShieldCheck, Activity, Settings, Eye } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export function VendorNav() {
  const pathname = usePathname();
  
  if (!pathname) return null;
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/vendeur/dashboard' },
    { icon: ShoppingCart, label: 'Commandes', href: '/vendeur/commandes' },
    { icon: Package, label: 'Inventaire', href: '/vendeur/dashboard' }, // Same for now or separate
    { icon: Activity, label: 'Performances', href: '/vendeur/dashboard' },
    { icon: Settings, label: 'Mon Profil', href: '/vendeur/profil' },
  ];

  return (
    <aside className="hidden lg:flex w-72 bg-[#0A1128] text-white flex-col fixed inset-y-0 z-50 shadow-2xl">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-cyan-500 p-2 rounded-xl">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl leading-none">Vendor<span className="text-cyan-400">Hub</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Marketplace Pro</p>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Espace Vendeur</p>
          <nav className="space-y-1">
            {sidebarLinks.map((link, idx) => {
              const currentPath = pathname.replace(/^\/(fr|en|ar)/, '');
              const pathToCheck = currentPath === '' ? '/' : currentPath;
              const isActive = link.href === '/vendeur/dashboard' ? pathToCheck === '/vendeur/dashboard' : pathToCheck.startsWith(link.href);
              
              return (
              <Link 
                key={idx} 
                href={link.href as any} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive ? 'bg-[#1E293B] text-white border-l-4 border-cyan-500' : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            )})}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
             <Eye className="h-5 w-5" />
             Voir ma boutique
          </Link>
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
            <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white shrink-0 uppercase">
              V
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Ma Boutique</p>
              <p className="text-[10px] text-slate-400 truncate">Vendeur Partenaire</p>
            </div>
          </div>
        </div>
      </aside>
  );
}
