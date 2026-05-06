import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { getVendorProducts, getVendorAnalytics } from "@/lib/actions";
import { Package, Plus, TrendingUp, ShoppingBag, ShieldCheck, ArrowUpRight, ShoppingCart, DollarSign, Activity, Eye, Settings, LogOut, ChevronRight } from "lucide-react";
import { AdminProductModal } from "@/components/AdminProductModal";
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions) as any;

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  let brand;
  if (session.user.role === "ADMIN") {
    brand = await prisma.brand.findFirst({
      include: { produits: true }
    });
  } else {
    brand = await prisma.brand.findUnique({
      where: { id: session.user.id },
      include: { produits: true }
    });
  }

  if (!brand) {
    if (session.user.role === "ADMIN") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-black/5 dark:border-white/10">
            <h1 className="text-2xl font-black mb-4">Aucune marque trouvée</h1>
            <p className="text-slate-500 mb-8">En tant qu'Admin, vous devez d'abord créer une marque pour voir ce dashboard.</p>
            <Link href="/admin" className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-bold uppercase tracking-widest">
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

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const stats = [
    { label: "Chiffre d'Affaires", value: `${analytics.totalRevenue.toLocaleString()} F`, icon: DollarSign, color: "bg-emerald-100 dark:bg-emerald-500/10", iconColor: "text-emerald-600", trend: "+12%" },
    { label: "Commandes", value: analytics.totalOrders, icon: ShoppingBag, color: "bg-blue-100 dark:bg-blue-500/10", iconColor: "text-blue-600", trend: "+5%" },
    { label: "Produits Actifs", value: products.length, icon: Package, color: "bg-violet-100 dark:bg-violet-500/10", iconColor: "text-violet-600", trend: "Stable" },
    { label: "Vues Boutique", value: brand.views, icon: Eye, color: "bg-cyan-100 dark:bg-cyan-500/10", iconColor: "text-cyan-600", trend: "+24%" },
  ];

  return (
    <div className="space-y-10">
        
        {/* Modern Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
              <span>Dashboard Vendeur</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan-600">Vue d'ensemble</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
              Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{brand.name}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Votre boutique performe bien ce mois-ci.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <ArrowUpRight className="h-4 w-4" /> Retour au site
            </Link>
            <Link href="/vendeur/commandes" className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 dark:shadow-white/5">
              <ShoppingCart className="h-4 w-4" /> Voir Commandes
            </Link>
            <AdminProductModal brands={[{ id: brand.id, name: brand.name }]} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 h-24 w-24 bg-gradient-to-br from-slate-500/5 to-transparent rounded-full" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase">{stat.trend}</span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Inventory Table */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5">
            <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Package className="h-5 w-5 text-cyan-600" /> Mon Inventaire
              </h2>
              <Link href={`/marques/${brand.slug}`} className="text-xs font-bold text-slate-400 hover:text-cyan-600 transition-colors flex items-center gap-1">
                Aperçu public <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                    <th className="px-8 py-4">Produit</th>
                    <th className="px-8 py-4">Catégorie</th>
                    <th className="px-8 py-4">Prix</th>
                    <th className="px-8 py-4 text-center">Stock</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {products.map((product: any) => (
                    <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-1 ring-black/5">
                            <Image src={product.image || '/placeholder.png'} alt={product.title || 'Produit'} fill className="object-cover" sizes="48px" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">#{product.sku || product.id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                          {typeof product.category === 'object' ? product.category?.name : product.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{product.price.toLocaleString()} F</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{product.stock}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
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
                <div className="p-20 text-center">
                  <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Aucun produit en ligne</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Commencez à ajouter vos produits pour les rendre visibles sur la marketplace.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Info & Quick Actions */}
          <div className="space-y-8">
            {/* Payment Status Card */}
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden group">
              <Activity className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-4">Statut de la boutique</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic tracking-tight text-xl leading-none">Certifiée</h4>
                    <p className="text-xs opacity-70 mt-1">Partenaire Immersive Pro</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold opacity-80">Modes de paiement actifs :</p>
                  <div className="flex gap-2">
                    {brand.airtelMoney && <span className="px-3 py-1.5 rounded-xl bg-white/10 text-[10px] font-black uppercase">Airtel Money</span>}
                    {brand.moovMoney && <span className="px-3 py-1.5 rounded-xl bg-white/10 text-[10px] font-black uppercase">Moov Money</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Paramètres rapides</h3>
              <div className="space-y-2">
                {[
                  { label: "Modifier le profil", icon: Settings, href: "/vendeur/profil" },
                  { label: "Historique ventes", icon: Activity, href: "/vendeur/commandes" },
                  { label: "Voir la boutique", icon: Eye, href: `/marques/${brand.slug}` },
                ].map((action, i) => (
                  <Link 
                    key={i} 
                    href={action.href}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-500/10 transition-colors">
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{action.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-cyan-600 transform group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
