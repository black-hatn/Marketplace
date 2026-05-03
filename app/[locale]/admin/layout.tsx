import { Search, Bell, Moon, LogOut } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AdminNav } from './AdminNav';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Le layout est un Server Component, on utilise la session pour décider d'afficher ou non le dashboard structuré.
  const session = await getServerSession(authOptions) as any;
  
  // If we are on the login page, we don't want the dashboard layout.
  // However, getServerSession will be null on login page.
  // The best way for Server Components is to use route groups, which I just removed.
  // Let's use a simpler check or just accept session check.
  
  if (!session || session.user.role !== 'ADMIN') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans">
      <AdminNav />
      <main className="flex-1 ml-[280px] flex flex-col min-h-screen max-w-[calc(100vw-280px)]">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Panel Administration</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Marketplace Immersive</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-64" />
            </div>
            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-6">
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Bell className="h-5 w-5" /></button>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Moon className="h-5 w-5" /></button>
              <Link href="/api/auth/signout" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors"><LogOut className="h-4 w-4" /> Quitter</Link>
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
