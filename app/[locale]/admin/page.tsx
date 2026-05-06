import { prisma } from '@/lib/db';
import { Package, Tags, ShoppingCart, Activity, ShieldAlert, TrendingUp, BarChart3, Users, Search, Bell, ChevronRight, LayoutDashboard, Database, Lock, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { Link } from '@/i18n/routing';
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
    { name: 'Chiffre d\'Affaires', value: `${analyticsData.stats.totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: 'bg-violet-100 dark:bg-violet-500/10', iconColor: 'text-violet-600 dark:text-violet-400', trend: '+12.5%', isUp: true },
    { name: 'Panier Moyen', value: `${analyticsData.stats.avgOrderValue.toLocaleString()} F`, icon: Activity, color: 'bg-orange-100 dark:bg-orange-500/10', iconColor: 'text-orange-600 dark:text-orange-400', trend: '+5.2%', isUp: true },
    { name: 'Commandes', value: commandesCount, icon: ShoppingCart, color: 'bg-emerald-100 dark:bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400', trend: '-2.1%', isUp: false },
    { name: 'Nouveaux Clients', value: clientCount, icon: Users, color: 'bg-blue-100 dark:bg-blue-500/10', iconColor: 'text-blue-600 dark:text-blue-400', trend: '+18.4%', isUp: true },
  ];

  return (
    <div className="space-y-8 bg-[#f8fafc] dark:bg-[#020617] min-h-screen pb-12 -mx-4 px-4 sm:-mx-8 sm:px-8 pt-6">
      
      {/* Header Area (TikTok Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Pages</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 dark:text-white">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bonjour, {session.user.name?.split(' ')[0] || 'Admin'} 👋</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors border border-violet-100 dark:border-violet-500/20"
          >
            <ArrowUpRight className="h-4 w-4" />
            Retour au site
          </Link>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm w-48 focus:w-64"
            />
          </div>
          <button className="h-10 w-10 shrink-0 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-colors shadow-sm relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>
      </div>

      {/* Stats Cards (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.isUp ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-red-50 dark:bg-red-500/10 text-red-600'}`}>
                {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vue d'ensemble</h3>
              <p className="text-sm text-slate-500">Revenus générés sur les 12 derniers mois</p>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 min-h-[300px]">
            <RevenueChart data={analyticsData.chartData} />
          </div>
        </div>

        {/* System & Alerts */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activité Système</h3>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider">Temps Réel</span>
          </div>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">Base de données</span>
                  <span className="block text-xs text-slate-500">Latence: 12ms</span>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">Sécurité TLS</span>
                  <span className="block text-xs text-slate-500">Certificat valide</span>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          <div className="mt-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dernières alertes</h4>
            <div className="relative pl-4 border-l-2 border-violet-200 dark:border-violet-900/50 space-y-4">
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-violet-500 ring-4 ring-white dark:ring-slate-900"></div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Sauvegarde automatique</p>
                <p className="text-xs text-slate-500 mt-0.5">Complétée avec succès • 14:30</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900"></div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Mise à jour catalogue</p>
                <p className="text-xs text-slate-500 mt-0.5">34 produits synchronisés • 09:15</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Partenaires */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Partenaires Récents</h3>
            <Link href="/admin/partenaires" className="text-sm font-semibold text-violet-600 hover:text-violet-700">Voir tout</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[350px]">
            {brands.slice(0, 5).map((brand: any) => (
              <div key={brand.id} className="flex items-center justify-between p-3.5 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                    <Image src={brand.image || '/placeholder.png'} alt={brand.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{brand.name}</p>
                    <p className="text-xs text-slate-500 truncate">{brand.email}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${brand.isVerified ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'}`}>
                  {brand.isVerified ? 'Certifié' : 'En attente'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers Produits */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Derniers Produits</h3>
            <AdminProductModal brands={brands} />
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[350px]">
            {recentProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3.5 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Image src={p.images[0] || '/placeholder.png'} fill className="object-cover" alt={p.nom} sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.nom}</p>
                    <p className="text-xs text-slate-500 truncate">{p.brand?.name}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{Number(p.prix_ttc).toLocaleString()} F</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{p.stock} en stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

