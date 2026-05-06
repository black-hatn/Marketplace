'use client';
// Admin Dashboard System v2.5 - Trigger build


import { LayoutDashboard, ShoppingCart, Tags, Users, BarChart3, ShieldAlert, Settings } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();
  
  if (!pathname) return null;
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ShoppingCart, label: 'Commandes', href: '/admin/commandes' },
    { icon: Tags, label: 'Vendeurs', href: '/admin/vendeurs' },
    { icon: Users, label: 'Clients', href: '/admin/clients' },
    { icon: BarChart3, label: 'Statistiques', href: '/admin/analyses' },
    { icon: Settings, label: 'Profil Admin', href: '/admin/profil' },
    { icon: ShieldAlert, label: 'Audit Sécurité', href: '/admin/audit' },
  ];

  return (
    <aside className="hidden lg:flex w-72 bg-[#0A1128] text-white flex-col fixed inset-y-0 z-50 shadow-2xl">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-xl">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl leading-none">Admin<span className="text-blue-400">Panel</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Marketplace</p>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>
          <nav className="space-y-1">
            {sidebarLinks.map((link, idx) => {
              // Extract the path without locale to match correctly
              const currentPath = pathname.replace(/^\/(fr|en|ar)/, '');
              const pathToCheck = currentPath === '' ? '/' : currentPath;
              const isActive = link.href === '/admin' ? pathToCheck === '/admin' : pathToCheck.startsWith(link.href);
              
              return (
              <Link 
                key={idx} 
                href={link.href as any} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${isActive ? 'bg-[#1E293B] text-white border-l-4 border-blue-500' : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            )})}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Admin Principal</p>
              <p className="text-[10px] text-slate-400 truncate">Superviseur</p>
            </div>
          </div>
        </div>
      </aside>
  );
}
