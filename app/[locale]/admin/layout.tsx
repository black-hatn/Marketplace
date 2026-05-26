import { Search, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AdminNav } from './AdminNav';
import { SignOutButton } from '@/components/SignOutButton';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NotificationBell } from '@/components/NotificationBell';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;
  
  if (!session || session.user.role !== 'ADMIN') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[50%] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[50%] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      <AdminNav userName={session.user?.name ?? 'Administrateur'} />

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full relative z-10">
        {/* Top Header */}
        <header className="h-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Left: Brand (mobile) */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center lg:hidden">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div className="hidden lg:block">
              <h2 className="text-sm font-black text-white leading-none">Administration</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] mt-0.5">Plateforme Premium</p>
            </div>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-medium text-white placeholder-white/20 outline-none focus:border-white/10 focus:bg-white/8 transition-all w-56" 
              />
            </div>

            <div className="h-6 w-px bg-white/5" />

            {/* Notifications */}
            <NotificationBell brandId="admin" />

            <SignOutButton className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-all text-xs font-bold" />
          </div>
        </header>


        {/* Content */}
        <div className="p-6 lg:p-10 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
