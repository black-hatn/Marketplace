import { Search, Bell, Moon, LogOut, ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { VendorNav } from './VendorNav';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;
  
  // Restricted to VENDOR and ADMIN
  if (!session || (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN')) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans">
      <VendorNav />
      <main className="flex-1 flex flex-col min-h-screen w-full lg:pl-32 pr-4 sm:pr-8">
        <header className="h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-black/5 dark:border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="lg:hidden h-10 w-10 bg-cyan-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Espace <span className="text-cyan-600">Vendeur</span></h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Marketplace Immersive</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none w-64" />
            </div>
            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><Bell className="h-5 w-5" /></button>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><Moon className="h-5 w-5" /></button>
              <Link href="/api/auth/signout" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all shadow-sm shadow-red-500/5">
                <LogOut className="h-4 w-4" /> Quitter
              </Link>
            </div>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
