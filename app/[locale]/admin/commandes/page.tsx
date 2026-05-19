import { prisma } from '@/lib/db';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; class: string }> = {
  EN_ATTENTE: {
    label: 'En attente',
    icon: <Clock className="h-3 w-3" />,
    class: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  PAYEE: {
    label: 'Payée',
    icon: <CheckCircle className="h-3 w-3" />,
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  VALIDEE: {
    label: 'Validée',
    icon: <CheckCircle className="h-3 w-3" />,
    class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  EXPEDIEE: {
    label: 'Expédiée',
    icon: <Truck className="h-3 w-3" />,
    class: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  ANNULEE: {
    label: 'Annulée',
    icon: <XCircle className="h-3 w-3" />,
    class: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
};

export default async function OrdersPage() {
  const orders = await prisma.commande.findMany({
    orderBy: { date_commande: 'desc' },
    include: { lignes_commande: true, client: true },
  });

  const totalRevenue = orders
    .filter((o: any) => o.statut === 'PAYEE' || o.statut === 'VALIDEE' || o.statut === 'EXPEDIEE')
    .reduce((sum: number, o: any) => sum + Number(o.montant_total), 0);

  const countByStatus = (status: string) => orders.filter((o: any) => o.statut === status).length;

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Transactions</p>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-cyan-400" />
            Gestion des Commandes
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white">
            <span className="text-cyan-400">{orders.length}</span> Total Commandes
          </div>
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'CA Total', value: `${totalRevenue.toLocaleString()} F`, class: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'En attente', value: countByStatus('EN_ATTENTE'), class: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Payées', value: countByStatus('PAYEE'), class: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Validées', value: countByStatus('VALIDEE'), class: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
        ].map((s) => (
          <div key={s.label} className={`rounded-3xl p-6 border bg-white/[0.03] backdrop-blur-xl ${s.bg}`}>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black mt-2 tracking-tighter ${s.class}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Orders Table ──────────────────────────────────── */}
      {orders.length === 0 ? (
        <div className="glass-card rounded-[2rem] border border-white/5 p-16 text-center">
          <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white/60">Aucune commande</h3>
          <p className="text-white/40 text-sm mt-1">Les commandes apparaîtront ici au fil des ventes.</p>
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5">
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5 hidden sm:table-cell">Articles</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5">Statut</th>
                  <th className="px-8 py-5 text-right hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order: any) => {
                  const cfg = STATUS_CONFIG[order.statut] ?? STATUS_CONFIG.EN_ATTENTE;
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{order.client.nom} {order.client.prenom}</p>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-white/30 mt-0.5">{order.client.email}</p>
                      </td>
                      <td className="px-8 py-5 hidden sm:table-cell">
                        <span className="text-xs font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                          {order.lignes_commande.length} article{order.lignes_commande.length > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-white">{Number(order.montant_total).toLocaleString()} <span className="text-[10px] text-white/30">FCFA</span></span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${cfg.class}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right hidden md:table-cell">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                          {new Date(order.date_commande).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
