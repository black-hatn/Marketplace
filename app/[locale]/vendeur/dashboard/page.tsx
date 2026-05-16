import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { getVendorProducts, getVendorAnalytics } from "@/lib/actions";
import { Package, Plus, TrendingUp, ShoppingBag, ShieldCheck, ArrowUpRight, ShoppingCart, DollarSign, Activity, Eye, Settings, LogOut, ChevronRight, Bell, Sparkles, Box } from "lucide-react";
import { VendorRevenueChart } from "@/components/VendorRevenueChart";
import { AdminProductModal } from "@/components/AdminProductModal";
import Image from 'next/image';
import PageTransition from "@/components/PageTransition";

export const dynamic = 'force-dynamic';

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions) as any;

  if (!session) redirect("/admin/login");
  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") redirect("/");

  let brand;
  if (session.user.role === "ADMIN") {
    brand = await prisma.brand.findFirst({ include: { produits: true } });
  } else {
    brand = await prisma.brand.findUnique({ where: { id: session.user.id }, include: { produits: true } });
  }

  if (!brand) {
    if (session.user.role === "ADMIN") {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="glass-card p-12 rounded-[3rem] border border-white/5 max-w-md">
            <h1 className="text-2xl font-bold text-white mb-4">Aucune marque trouvée</h1>
            <p className="text-muted-foreground font-light mb-8">En tant qu&apos;Admin, vous devez d&apos;abord créer une marque pour voir ce dashboard.</p>
            <Link href="/admin" className="px-8 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest block">
              Retour au Panel Admin
            </Link>
          </div>
        </div>
      );
    }
    redirect("/");
  }

  const [products, analytics] = await Promise.all([
    getVendorProducts(brand.id),
    getVendorAnalytics(brand.id)
  ]);

  const stats = [
    { label: "Ventes Totales", value: `${analytics.totalRevenue.toLocaleString()} F`, icon: DollarSign, color: "text-emerald-400", trend: "+12%" },
    { label: "Commandes", value: analytics.totalOrders, icon: ShoppingBag, color: "text-blue-400", trend: "+5%" },
    { label: "Articles", value: products.length, icon: Box, color: "text-purple-400", trend: "Stable" },
    { label: "Visibilité", value: brand.views, icon: Eye, color: "text-cyan-400", trend: "+24%" },
  ];

  return (
    <PageTransition>
      <div className="space-y-12">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Bonjour, <span className="text-blue-400">{brand.name}</span>
            </h1>
            <p className="text-muted-foreground font-light mt-2 text-lg">Gérez vos collections et suivez vos performances en temps réel.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/marques/${brand.slug}`} className="px-6 py-3 rounded-2xl glass hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Eye className="w-4 h-4" /> Ma Boutique
            </Link>
            <AdminProductModal brands={[{ id: brand.id, name: brand.name }]} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6 group">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.trend}</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Highlights */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Analyse des Revenus</h2>
                <p className="text-sm text-muted-foreground font-light mt-1">Évolution sur les 30 derniers jours</p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                Performant
              </div>
            </div>
            <div className="h-[350px]">
              <VendorRevenueChart data={analytics.chartData} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative p-10 rounded-[3rem] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
              
              <div className="relative z-10 space-y-6">
                <Sparkles className="w-10 h-10 text-blue-200" />
                <h3 className="text-2xl font-bold text-white leading-tight">Booster votre <br/> visibilité ?</h3>
                <p className="text-sm text-white/70 font-light">Nos algorithmes privilégient les fiches produits avec plus de 3 photos HD.</p>
                <button className="px-6 py-3 bg-white text-blue-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-2xl transition-all">
                  Guide d&apos;optimisation
                </button>
              </div>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Centre de Notifications</h3>
              <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
                <Bell className="w-8 h-8 text-white/5 mx-auto mb-4" />
                <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Aucune alerte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <section className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Box className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Inventaire Local</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-white/20 bg-white/[0.01]">
                  <th className="px-10 py-6">Pièce / Modèle</th>
                  <th className="px-10 py-6">Secteur</th>
                  <th className="px-10 py-6">Prix de Vente</th>
                  <th className="px-10 py-6 text-center">Unités</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product: any) => (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Image src={product.image || '/placeholder.png'} alt={product.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{product.title}</p>
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">#{product.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 rounded-full glass text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-white">
                      {product.price.toLocaleString()} FCFA
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-sm font-bold text-white">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <AdminProductModal 
                        brands={[{ id: brand.id, name: brand.name }]} 
                        product={{ ...product, brandId: brand.id }} 
                        editMode={true} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {products.length === 0 && (
              <div className="p-32 text-center">
                <Box className="w-16 h-16 text-white/5 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Inventaire vide</h3>
                <p className="text-muted-foreground font-light max-w-xs mx-auto">Prêt à lancer votre collection ? Commencez par ajouter votre premier produit.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
