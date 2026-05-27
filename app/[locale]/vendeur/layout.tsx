import { Search, ShoppingBag, Bell, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SignOutButton } from '@/components/SignOutButton';
import { VendorNav } from './VendorNav';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationBell } from '@/components/NotificationBell';
import { prisma } from '@/lib/db';

export default async function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;
  
  if (!session || (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN')) {
    redirect('/admin/login');
  }

  let brandId = session.user.id;
  if (session.user.role === 'ADMIN') {
    const b = await prisma.brand.findFirst();
    brandId = b?.id || "";
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      {/* Background glow effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <VendorNav />

      <main className="flex-1 flex flex-col min-h-screen w-full lg:pl-32 relative z-10">
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="lg:hidden h-10 w-10 bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Espace Vendeur</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Plateforme Premium</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Rechercher une commande..." 
                className="pl-12 pr-4 py-2.5 glass border-white/5 rounded-2xl text-xs font-medium text-white placeholder-white/20 outline-none focus:border-white/20 w-72" 
              />
            </div>

            <div className="flex items-center gap-3 border-l border-white/5 pl-6">
              <NotificationBell brandId={brandId} />
              <SignOutButton className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold" />
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
