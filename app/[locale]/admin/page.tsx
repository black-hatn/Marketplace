import { prisma } from '@/lib/db';
import { Package, Tags, ShoppingCart, Activity, ShieldAlert, TrendingUp, BarChart3, Users, Search, Bell, Moon, LogOut, LayoutDashboard, Zap, Database, Lock } from 'lucide-react';
import Link from 'next/link';
import { AdminProductModal } from '@/components/AdminProductModal';
import { RevenueChart } from '@/components/RevenueChart';
import { getAnalyticsData } from '@/lib/actions';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions) as any;

  if (!session) redirect('/admin/login');
  if (session.user.role !== 'ADMIN') redirect('/');

  const [produitsCount, brandsCount, categoriesCount, commandesCount, clientCount, recentProducts, brands, recentClients, analyticsData] = await Promise.all([
    prisma.produit.count(),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.commande.count(),
    prisma.client.count({ where: { role: 'CLIENT' } }),
    prisma.produit.findMany({
      take: 8,
      orderBy: { date_creation: 'desc' },
      include: { brand: true, category: true },
    }),
    prisma.brand.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.client.findMany({ take: 5, orderBy: { date_inscription: 'desc' } }),
    getAnalyticsData(),
  ]);

  const stats = [
    { name: 'Chiffre d\'Affaires', value: `${analyticsData.stats.totalRevenue.toLocaleString()} FCFA`, icon: TrendingUp, color: 'bg-blue-500', iconColor: 'text-white' },
    { name: 'Panier Moyen', value: `${analyticsData.stats.avgOrderValue.toLocaleString()} FCFA`, icon: Activity, color: 'bg-amber-500', iconColor: 'text-white' },
    { name: 'Commandes', value: commandesCount, icon: ShoppingCart, color: 'bg-emerald-500', iconColor: 'text-white' },
    { name: 'Clients Inscrits', value: clientCount, icon: Users, color: 'bg-slate-800', iconColor: 'text-white' },
  ];
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-[#0F4C81] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
          <Zap className="h-48 w-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4 backdrop-blur-sm">
            <ShieldAlert className="h-3 w-3" /> Système de sécurité actif
          </span>
          <h1 className="text-3xl font-black mb-3">Panel Super Administrateur</h1>
          <p className="text-blue-100/80 leading-relaxed text-sm">
            La marketplace est sous surveillance continue. Vous avez <b>{commandesCount} commandes</b> en cours aujourd'hui et <b>{brandsCount} vendeurs</b> partenaires actifs sur la plateforme.
          </p>
        </div>
      </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</p>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-auto">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Évolution de l'activité</h3>
              <div className="h-[300px]">
                <RevenueChart data={analyticsData.chartData} />
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">État du Système</h3>
              <p className="text-xs text-slate-500 mb-6">Surveillance & Audit</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Base de données</span>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">Connectée</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sécurité TLS</span>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest">Activée</span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dernières alertes</p>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Sauvegarde automatique</p>
                  <p className="text-xs text-slate-500 mt-1">Status: OK • Il y a 2h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vendors & Products Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Partenaires</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{brands.length} inscrits</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]">
                {brands.map((brand: any) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/5 bg-slate-100">
                        <Image src={brand.image || '/placeholder.png'} alt={brand.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{brand.name}</p>
                        <p className="text-xs text-slate-500">{brand.email}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${brand.isVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {brand.isVerified ? 'Certifié' : 'En attente'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Derniers Produits</h3>
                <AdminProductModal brands={brands} />
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]">
                {recentProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image src={p.images[0] || '/placeholder.png'} fill className="object-cover" alt={p.nom} sizes="48px" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{p.nom}</p>
                        <p className="text-xs text-slate-500">{p.brand?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{Number(p.prix_ttc).toLocaleString()} F</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{p.stock} en stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  );
}
