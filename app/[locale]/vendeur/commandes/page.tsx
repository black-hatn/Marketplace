import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { ShoppingCart, Package, MapPin, Calendar, ArrowLeft } from "lucide-react";
import Image from 'next/image';
import PageTransition from "@/components/PageTransition";

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
        <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center pt-20">
          <div className="text-center p-12 glass-card rounded-[3rem] shadow-2xl border border-white/5">
            <h1 className="text-2xl font-black mb-4">Aucune marque trouvée</h1>
            <p className="text-white/40 mb-8 font-medium">En tant qu'Admin, vous devez d'abord créer une marque pour voir les commandes.</p>
            <Link href="/admin" className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-colors">
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
    <PageTransition>
      <div className="space-y-10 relative">
        {/* Background glow for the content area */}
        <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-6 relative z-10">
          <Link href="/vendeur/dashboard" className="h-14 w-14 rounded-2xl glass-card border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center text-white/60 hover:text-white group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
              Gestion des <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Commandes</span>
            </h1>
            <p className="text-white/40 text-sm font-medium mt-1">Suivez les achats de vos produits et préparez les expéditions.</p>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          {orders.map((order) => (
            <div key={order.id} className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
              {/* Order Header */}
              <div className="p-8 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">ID Commande</p>
                    <p className="font-black text-white text-lg tracking-wide">#{order.numero_commande || order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-8">
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Date d'Achat</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      {new Date(order.date_commande).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Statut</p>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.statut === 'LIVREE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      order.statut === 'EXPEDIEE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      order.statut === 'PAYEE' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {order.statut}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Votre Revenu</p>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                      {order.lignes_commande.reduce((acc, item) => acc + (Number(item.prix_unitaire_ht) * item.quantite), 0).toLocaleString()} <span className="text-sm">FCFA</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-8 sm:p-10 grid md:grid-cols-[1fr_1.5fr] gap-12 bg-white/[0.01]">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" /> 
                    </div>
                    Informations Client
                  </h3>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <p className="text-sm font-medium text-white/70 leading-relaxed">{order.adresse_livraison}</p>
                    <p className="text-xs font-bold text-cyan-400 mt-4 pt-4 border-t border-white/5">Client de N'Djaména</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                      <Package className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    Articles Commandés
                  </h3>
                  <div className="space-y-4">
                    {order.lignes_commande.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-5 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                          <Image src={item.produit.images[0] || '/placeholder.png'} alt={item.produit.nom} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate mb-1">{item.produit.nom}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            Qté: <span className="text-white">{item.quantite}</span> × {Number(item.prix_unitaire_ht).toLocaleString()} FCFA
                          </p>
                        </div>
                        <p className="text-sm font-black text-white">
                          {(Number(item.prix_unitaire_ht) * item.quantite).toLocaleString()} FCFA
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="glass-card rounded-[3rem] border border-white/5 py-32 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05),_transparent_60%)]" />
              <div className="relative z-10">
                <div className="h-24 w-24 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5">
                  <Package className="h-10 w-10 text-white/20" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3">Aucune commande pour le moment</h2>
                <p className="text-white/40 font-medium max-w-sm mx-auto mb-10">Dès qu'un client achète l'un de vos produits, l'historique complet apparaîtra ici.</p>
                <Link href="/vendeur/dashboard" className="inline-flex h-14 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs items-center justify-center hover:scale-[1.02] transition-transform">
                  Retour au dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
