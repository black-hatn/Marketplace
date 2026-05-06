import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { ShoppingCart, Package, MapPin, Calendar, ArrowLeft } from "lucide-react";
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions) as any;

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  let brand;
  if (session.user.role === "ADMIN") {
    brand = await prisma.brand.findFirst();
  } else {
    brand = await prisma.brand.findUnique({
      where: { id: session.user.id }
    });
  }

  if (!brand) {
    if (session.user.role === "ADMIN") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-black/5 dark:border-white/10">
            <h1 className="text-2xl font-black mb-4">Aucune marque trouvée</h1>
            <p className="text-slate-500 mb-8">En tant qu'Admin, vous devez d'abord créer une marque pour voir les commandes.</p>
            <Link href="/admin" className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-bold uppercase tracking-widest">
              Retour au Panel Admin
            </Link>
          </div>
        </div>
      );
    }
    redirect("/");
  }

  // Fetch orders that contain products from this vendor
  const orders = await prisma.commande.findMany({
    where: {
      lignes_commande: {
        some: {
          produit: {
            brandId: brand.id
          }
        }
      }
    },
    include: {
      lignes_commande: {
        where: {
          produit: {
            brandId: brand.id
          }
        },
        include: {
          produit: true
        }
      }
    },
    orderBy: { date_commande: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/vendeur/dashboard" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 hover:bg-slate-50 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tight">Gestion des <span className="text-cyan-500">Commandes</span></h1>
            <p className="text-slate-500 text-sm">Suivez les achats de vos produits par les clients.</p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5">
              <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] border-b border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Commande</p>
                    <p className="font-bold">#{order.numero_commande || order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(order.date_commande).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                      {order.statut}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Votre Part</p>
                    <p className="text-lg font-black text-cyan-600">
                      {order.lignes_commande.reduce((acc, item) => acc + (Number(item.prix_unitaire_ht) * item.quantite), 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Informations de Livraison
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{order.adresse_livraison}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Articles Commandés
                  </h3>
                  <div className="space-y-4">
                    {order.lignes_commande.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          <Image src={item.produit.images[0] || '/placeholder.png'} alt={item.produit.nom} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.produit.nom}</p>
                          <p className="text-xs text-slate-500">Qté: {item.quantite} x {Number(item.prix_unitaire_ht).toLocaleString()} FCFA</p>
                        </div>
                        <p className="text-sm font-black">{(Number(item.prix_unitaire_ht) * item.quantite).toLocaleString()} FCFA</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="glass-card rounded-[2.5rem] py-32 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
              <h2 className="text-2xl font-bold">Aucune commande pour le moment</h2>
              <p className="text-slate-500 mt-2">Dès qu'un client achète l'un de vos produits, il apparaîtra ici.</p>
              <Link href="/vendeur/dashboard" className="mt-8 inline-block text-cyan-600 font-bold hover:underline">Retour au dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
