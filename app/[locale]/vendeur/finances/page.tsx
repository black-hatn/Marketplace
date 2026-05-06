import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getVendorWallet, requestWithdrawal } from "@/lib/actions";
import { Wallet, ArrowUpRight, DollarSign, History, ChevronRight, Landmark, CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorFinancesPage() {
  const session = await getServerSession(authOptions) as any;

  if (!session) redirect("/admin/login");

  let brandId = session.user.id;
  if (session.user.role === 'ADMIN') {
    const b = await prisma.brand.findFirst();
    brandId = b?.id || "";
  }

  const wallet = await getVendorWallet(brandId);

  async function handleWithdraw(formData: FormData) {
    'use server';
    const amount = parseFloat(formData.get('amount') as string);
    const method = formData.get('method') as string;
    await requestWithdrawal(wallet.id, amount, method);
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          <span>Espace Vendeur</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-emerald-600">Finances & Portefeuille</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight flex items-center gap-4">
          <Wallet className="h-10 w-10 text-emerald-600" /> Gestion de votre Solde
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Consultez vos revenus et gérez vos demandes de paiement.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Wallet Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Landmark className="h-6 w-6 text-emerald-100" />
                </div>
                <span className="px-4 py-2 rounded-xl bg-white/20 text-[10px] font-black uppercase tracking-widest">Compte Certifié</span>
              </div>
              <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-2">Solde Disponible</p>
              <h2 className="text-6xl font-black tracking-tight mb-8">
                {Number(wallet.balance).toLocaleString()} <span className="text-2xl text-emerald-200">FCFA</span>
              </h2>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
                  Transférer vers banque
                </button>
                <button className="px-8 py-4 bg-emerald-500/20 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500/40 transition-all">
                  Historique détaillé
                </button>
              </div>
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/5">
            <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2 uppercase">
                <History className="h-5 w-5 text-slate-400" /> Historique des Retraits
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Montant</th>
                    <th className="px-8 py-4">Méthode</th>
                    <th className="px-8 py-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {wallet.requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-sm font-black">
                        {Number(req.amount).toLocaleString()} F
                      </td>
                      <td className="px-8 py-4">
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                          <CreditCard className="h-3 w-3" /> {req.method}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' :
                          req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {req.status === 'PENDING' ? <Clock className="h-3 w-3" /> : 
                           req.status === 'APPROVED' ? <CheckCircle2 className="h-3 w-3" /> : 
                           <XCircle className="h-3 w-3" />}
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {wallet.requests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-slate-400 text-xs font-bold">Aucune demande de retrait effectuée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-emerald-600" /> Demande de Retrait
            </h3>
            <form action={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Montant à retirer (F)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input name="amount" type="number" required placeholder="Ex: 50000" className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Méthode de paiement</label>
                <select name="method" className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                  <option value="AIRTEL">Airtel Money</option>
                  <option value="MOOV">Moov Money</option>
                  <option value="BANK">Virement Bancaire</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-1">
                Les frais de transfert (2%) seront déduits automatiquement. Traitement sous 24h.
              </p>
              <button 
                type="submit" 
                disabled={Number(wallet.balance) <= 0}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:hover:bg-emerald-600 mt-4"
              >
                Envoyer la demande
              </button>
            </form>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <CreditCard className="h-20 w-20" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">Prochaine étape</h4>
            <p className="text-xs font-bold leading-relaxed text-slate-300">
              Assurez-vous que vos coordonnées de paiement dans votre profil sont à jour pour éviter tout retard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
