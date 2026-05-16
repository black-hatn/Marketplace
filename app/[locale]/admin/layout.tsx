import { Search, Bell, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AdminNav } from './AdminNav';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;
  
  if (!session || session.user.role !== 'ADMIN') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      {/* Sidebar Overlay for Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <AdminNav />

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative z-10">
        {/* Top Header */}
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center lg:hidden">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Administration</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Plateforme Premium</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Rechercher une donnée..." 
                className="pl-12 pr-4 py-2.5 glass border-white/5 rounded-2xl text-xs font-medium text-white placeholder-white/20 outline-none focus:border-white/20 w-72" 
              />
            </div>

            <div className="flex items-center gap-3 border-l border-white/5 pl-6">
              <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Bell className="h-5 w-5" />
              </button>
              <Link 
                href="/api/auth/signout" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
              >
                <LogOut className="h-4 w-4" /> 
                <span className="hidden sm:inline">Quitter</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 lg:p-12 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
