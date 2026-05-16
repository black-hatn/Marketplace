import { prisma } from '@/lib/db';
import { Package, Tags, ShoppingCart, Activity, ShieldAlert, TrendingUp, BarChart3, Users, Search, Bell, ChevronRight, LayoutDashboard, Database, Lock, ArrowUpRight, ArrowDownRight, MoreHorizontal, Sparkles, Plus } from 'lucide-react';
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

  const [produitsCount, brandsCount, categoriesCount, commandesCount, clientCount, recentProducts, brands, analyticsData] = await Promise.all([
    prisma.produit.count(),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.commande.count(),
    prisma.client.count({ where: { role: 'CLIENT' } }),
    prisma.produit.findMany({
      take: 5,
      orderBy: { date_creation: 'desc' },
      include: { brand: true, category: true },
    }),
    prisma.brand.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    getAnalyticsData(),
  ]);

  const stats = [
    { name: 'Chiffre d\'Affaires', value: `${analyticsData.stats.totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: 'text-blue-400', trend: '+12.5%', isUp: true },
    { name: 'Panier Moyen', value: `${analyticsData.stats.avgOrderValue.toLocaleString()} F`, icon: Activity, color: 'text-purple-400', trend: '+5.2%', isUp: true },
    { name: 'Commandes Total', value: commandesCount, icon: ShoppingCart, color: 'text-emerald-400', trend: '-2.1%', isUp: false },
    { name: 'Base Clients', value: clientCount, icon: Users, color: 'text-amber-400', trend: '+18.4%', isUp: true },
  ];

  return (
    <div className="space-y-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Vue d&apos;ensemble</h1>
          <p className="text-muted-foreground font-light mt-2">Bonjour {session.user.name}, voici les performances de votre écosystème aujourd&apos;hui.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl glass hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ArrowUpRight className="w-4 h-4" />
            Voir le site live
          </Link>
          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6 group">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-black tracking-tighter ${stat.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{stat.name}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
        {/* Main Analytics Chart */}
        <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Performance des Revenus</h2>
              <p className="text-sm text-muted-foreground font-light mt-1">Analyse comparative sur les 12 derniers mois</p>
            </div>
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[400px]">
            <RevenueChart data={analyticsData.chartData} />
          </div>
        </div>

        {/* System & Logs */}
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">État du Système</h3>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Live</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-white">Base de données</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/20">LATENCY 8MS</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-bold text-white">Sécurité TLS</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Logs d&apos;activité</h4>
              <div className="space-y-6 relative pl-6 border-l border-white/5">
                {[
                  { time: '14:30', title: 'Backup automatique', desc: 'Système synchronisé', color: 'bg-blue-400' },
                  { time: '09:15', title: 'Mise à jour catalogue', desc: '82 produits mis à jour', color: 'bg-white/20' }
                ].map((log, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[29px] top-1.5 w-3 h-3 rounded-full ${log.color} ring-4 ring-background`} />
                    <p className="text-sm font-bold text-white leading-none">{log.title}</p>
                    <p className="text-xs text-muted-foreground font-light mt-1">{log.desc} • {log.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Data Row */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Latest Partners */}
        <section className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white">Maisons de Création</h2>
            <Link href="/admin/vendeurs" className="text-xs font-bold text-blue-400 hover:underline">Gérer tout</Link>
          </div>
          <div className="space-y-4">
            {brands.map((brand: any) => (
              <div key={brand.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/[0.03] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <Image src={brand.image || '/placeholder.png'} alt={brand.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-light uppercase tracking-widest mt-0.5">{brand.email}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${brand.isVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {brand.isVerified ? 'Certifié' : 'Vérification'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Products */}
        <section className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white">Dernières Pièces</h2>
            <AdminProductModal brands={brands} />
          </div>
          <div className="space-y-4">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/[0.03] transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-surface-light">
                    <Image src={p.images[0] || '/placeholder.png'} fill className="object-cover" alt={p.nom} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{p.nom}</h4>
                    <p className="text-[10px] text-muted-foreground font-light uppercase tracking-widest mt-0.5">{p.brand?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{Number(p.prix_ttc).toLocaleString()} <span className="text-[10px] text-white/30">FCFA</span></p>
                  <p className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${p.stock < 5 ? 'text-red-400' : 'text-blue-400'}`}>
                    Stock: {p.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
