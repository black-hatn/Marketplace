import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getVendorProducts } from "@/lib/actions";
import { Package, Plus, TrendingUp, ShoppingBag, ShieldCheck, ArrowUpRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { AdminProductModal } from "@/components/AdminProductModal";

import Image from 'next/image';

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions) as any;

  if (!session || session.user.role !== "VENDOR") {
    redirect("/admin/login");
  }

  const brand = await prisma.brand.findUnique({
    where: { id: session.user.id },
    include: { produits: true }
  });

  if (!brand) redirect("/");

  const products = await getVendorProducts(brand.id);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-6">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShoppingBag className="h-40 w-40" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-cyan-600" />
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-[10px] font-black uppercase tracking-widest">Compte Vendeur Vérifié</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Bonjour, <span className="text-cyan-600">{brand.name}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">Gérez votre inventaire et suivez vos performances en temps réel sur la marketplace.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paiements Mobiles</p>
              <div className="flex gap-2">
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${brand.airtelMoney ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  Airtel
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${brand.moovMoney ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  Moov
                </div>
              </div>
            </div>
            <Link href="/vendeur/commandes" className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
              <ShoppingCart className="h-4 w-4" /> Mes Commandes
            </Link>
            <AdminProductModal brands={[{ id: brand.id, name: brand.name }]} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Produits Actifs", value: products.length, icon: Package, color: "blue" },
            { label: "Stock Total", value: totalStock, icon: ShoppingBag, color: "emerald" },
            { label: "Vues de la Boutique", value: brand.views, icon: TrendingUp, color: "cyan" }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm group hover:border-cyan-500/30 transition-all cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">+0%</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5">
          <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Package className="h-5 w-5 text-cyan-600" /> Mon Inventaire
            </h2>
            <Link href={`/marques/${brand.slug}`} className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1">
              Voir ma page publique <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  <th className="px-8 py-4">Produit</th>
                  <th className="px-8 py-4">Catégorie</th>
                  <th className="px-8 py-4">Prix</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {products.map((product: any) => (
                  <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-1 ring-black/5">
                          <Image src={product.image} alt={product.title} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {product.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{product.price.toLocaleString()} FCFA</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
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
                <Package className="h-12 w-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white">Aucun produit en ligne</h3>
                <p className="text-sm text-slate-500 mt-1">Commencez par ajouter votre premier article à vendre.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
