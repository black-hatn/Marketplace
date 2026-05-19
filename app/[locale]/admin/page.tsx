import { prisma } from '@/lib/db';
import { 
  Package, ShoppingCart, Activity, TrendingUp, BarChart3, 
  Users, ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  Sparkles, Plus, Database, Lock, Eye, AlertTriangle
} from 'lucide-react';
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

  const [produitsCount, commandesCount, clientCount, recentProducts, brands, analyticsData] = await Promise.all([
    prisma.produit.count(),
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
    { 
      name: "Chiffre d'Affaires", 
      value: `${analyticsData.stats.totalRevenue.toLocaleString()} F`, 
      icon: TrendingUp, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      trend: '+12.5%', 
      isUp: true,
      sub: 'vs mois dernier'
    },
    { 
      name: 'Panier Moyen', 
      value: `${analyticsData.stats.avgOrderValue.toLocaleString()} F`, 
      icon: Activity, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      trend: '+5.2%', 
      isUp: true,
      sub: 'par commande'
    },
    { 
      name: 'Commandes', 
      value: String(commandesCount), 
      icon: ShoppingCart, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      trend: '-2.1%', 
      isUp: false,
      sub: 'total cumulé'
    },
    { 
      name: 'Base Clients', 
      value: String(clientCount), 
      icon: Users, 
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      trend: '+18.4%', 
      isUp: true,
      sub: 'membres actifs'
    },
  ];

  return (
    <div className="space-y-10">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Vue d&apos;ensemble</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Bonjour, <span className="text-blue-400">{session.user.name}</span> 👋
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1">
            Voici les performances de votre plateforme aujourd&apos;hui.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-bold text-white uppercase tracking-widest"
          >
            <Eye className="w-4 h-4" />
            Site Live
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Stats Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`relative overflow-hidden p-7 rounded-3xl border ${stat.border} bg-white/[0.03] backdrop-blur-xl group hover:bg-white/[0.06] transition-all duration-500`}
          >
            {/* Background glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-3xl opacity-40 pointer-events-none`} />
            
            <div className="relative space-y-5">
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${stat.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{stat.name}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] text-white/20 font-medium mt-1">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + System Status ────────────────────────── */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-8 rounded-3xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Performance des Revenus</h2>
              <p className="text-xs text-white/30 font-medium mt-1">Analyse comparative sur les 12 derniers mois</p>
            </div>
            <button className="w-9 h-9 rounded-2xl glass flex items-center justify-center text-white/30 hover:text-white transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[320px]">
            <RevenueChart data={analyticsData.chartData} />
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">État du Système</h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Live
            </span>
          </div>

          {/* System rows */}
          <div className="space-y-3">
            {[
              { icon: Database, label: 'Base de données', detail: 'Latency 8ms', color: 'text-blue-400', bg: 'bg-blue-500/10', status: 'ok' },
              { icon: Lock, label: 'Sécurité TLS', detail: 'Certificat valide', color: 'text-purple-400', bg: 'bg-purple-500/10', status: 'ok' },
              { icon: AlertTriangle, label: 'Alertes actives', detail: '0 incident', color: 'text-amber-400', bg: 'bg-amber-500/10', status: 'warn' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{item.label}</p>
                    <p className="text-[10px] text-white/20 mt-0.5">{item.detail}</p>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'ok' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`} />
              </div>
            ))}
          </div>

          {/* Activity log */}
          <div className="pt-2">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-5">Activité récente</p>
            <div className="space-y-4 pl-5 border-l border-white/5 relative">
              {[
                { time: '14:30', title: 'Backup automatique', desc: 'Système synchronisé', dot: 'bg-blue-400' },
                { time: '09:15', title: 'Mise à jour catalogue', desc: '82 produits mis à jour', dot: 'bg-white/20' },
              ].map((log, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full ${log.dot} ring-4 ring-[#050505]`} />
                  <p className="text-sm font-bold text-white/80 leading-none">{log.title}</p>
                  <p className="text-[10px] text-white/30 mt-1">{log.desc} • {log.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Data ───────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest Brands / Partners */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">Partenaires Récents</h2>
            <Link href="/admin/vendeurs" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              Gérer tout <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {brands.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">Aucun partenaire pour le moment</p>
            ) : brands.map((brand: any) => (
              <div key={brand.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                    <Image src={brand.image || '/placeholder.png'} alt={brand.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{brand.name}</h4>
                    <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest mt-0.5">{brand.email || 'Partenaire'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide ${brand.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {brand.isVerified ? 'Certifié' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Products */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">Derniers Produits</h2>
            <AdminProductModal brands={brands} />
          </div>
          <div className="space-y-2">
            {recentProducts.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">Aucun produit pour le moment</p>
            ) : recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                    <Image src={p.images[0] || '/placeholder.png'} fill className="object-cover" alt={p.nom} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate max-w-[180px] group-hover:text-blue-300 transition-colors">{p.nom}</h4>
                    <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest mt-0.5">{p.brand?.name}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-white">{Number(p.prix_ttc).toLocaleString()} <span className="text-[9px] text-white/20">F</span></p>
                  <p className={`text-[9px] font-black uppercase tracking-wide mt-1 ${p.stock < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                    Stock : {p.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
