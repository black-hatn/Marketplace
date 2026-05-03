import { prisma } from '@/lib/db';
import { Package, Tags, ShoppingCart, Activity, ArrowUpRight, ShieldAlert, Plus, ExternalLink, TrendingUp, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';
import { AdminProductModal } from '@/components/AdminProductModal';
import { RevenueChart } from '@/components/RevenueChart';
import { getAnalyticsData, deleteBrand } from '@/lib/actions';
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
    { name: 'Chiffre d\'Affaires', value: `${analyticsData.stats.totalRevenue.toLocaleString()} FCFA`, icon: TrendingUp, trend: '+15%', color: 'emerald', href: '/admin/analyses' },
    { name: 'Panier Moyen', value: `${analyticsData.stats.avgOrderValue.toLocaleString()} FCFA`, icon: Activity, trend: '+2%', color: 'violet', href: '/admin/analyses' },
    { name: 'Commandes', value: commandesCount, icon: ShoppingCart, trend: '+28%', color: 'cyan', href: '/admin/commandes' },
    { name: 'Clients Inscrits', value: clientCount, icon: Tags, trend: '+10%', color: 'blue', href: '#' },
  ];

  const recentOrders = await prisma.commande.findMany({
    take: 5,
    orderBy: { date_commande: 'desc' },
  });

  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20',
    violet: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-16">
      <nav className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">Admin<span className="text-cyan-500">Panel</span></span>
                <p className="text-[10px] text-slate-400 -mt-0.5 font-medium uppercase tracking-widest">Marketplace Immersive</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                <ExternalLink className="h-3 w-3" /> Voir le site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Tableau de Bord <span className="text-cyan-500">Global</span></h1>
            <p className="text-slate-500 mt-1">Vue d&apos;ensemble de votre activité e-commerce (Projet 11)</p>
          </div>
          <AdminProductModal brands={brands} />
        </div>

        <div className="glass-card p-6 rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Nouvelle Vue Analytique Disponible</h3>
              <p className="text-sm text-slate-500">Visualisez les performances via la vue SQL native <b>vue_analyse_ventes</b></p>
            </div>
          </div>
          <Link href="/admin/analyses" className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
            Explorer les Rapports
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href} className="glass-card group p-6 rounded-3xl border border-black/5 dark:border-white/10 hover:border-cyan-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colorMap[stat.color]}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">{stat.trend}</span>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.name}</p>
              <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Évolution des Revenus</h3>
              </div>
              <div className="h-[350px]">
                <RevenueChart data={analyticsData.chartData} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5">
              <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Tags className="h-5 w-5 text-cyan-600" /> Partenaires & Vendeurs
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{brands.length} inscrits</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                      <th className="px-8 py-4">Boutique</th>
                      <th className="px-8 py-4">Contact</th>
                      <th className="px-8 py-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {brands.map((brand: any) => (
                      <tr key={brand.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-black/5">
                              <Image src={brand.image} alt={brand.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{brand.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">Slug: {brand.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500">{brand.email}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${brand.isVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                              {brand.isVerified ? 'Certifié' : 'En attente'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold italic uppercase tracking-tight">Derniers Produits</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-black/5 dark:border-white/5">
                      <th className="pb-4">Produit</th>
                      <th className="pb-4">Marque</th>
                      <th className="pb-4">Prix</th>
                      <th className="pb-4">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {recentProducts.map((p) => (
                      <tr key={p.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                              <Image src={p.images[0] || '/placeholder.png'} fill className="object-cover" alt={p.nom} sizes="40px" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">{p.nom}</p>
                              <p className="text-[10px] text-slate-400">{p.categories[0]}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm font-medium text-slate-500">{p.brand?.name}</td>
                        <td className="py-4 text-sm font-black">{Number(p.prix_ttc).toLocaleString()} FCFA</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                            {p.stock} unités
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Clients Récents</h3>
              <div className="space-y-6">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{client.nom} {client.prenom}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{client.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
