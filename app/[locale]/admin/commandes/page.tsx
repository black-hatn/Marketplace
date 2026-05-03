import { prisma } from '@/lib/db';
import { ShoppingCart, ShieldAlert, ArrowUpRight, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import { OrderStatusChanger } from '@/components/OrderStatusChanger';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; class: string }> = {
  EN_ATTENTE: {
    label: 'En attente',
    icon: <Clock className="h-3.5 w-3.5" />,
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  PAYEE: {
    label: 'Payée',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  VALIDEE: {
    label: 'Validée',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    class: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  EXPEDIEE: {
    label: 'Expédiée',
    icon: <Truck className="h-3.5 w-3.5" />,
    class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  ANNULEE: {
    label: 'Annulée',
    icon: <XCircle className="h-3.5 w-3.5" />,
    class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
                <p className="text-[10px] text-slate-400 -mt-0.5 font-medium uppercase tracking-widest">Gestion Commandes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                ← Tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-cyan-500" />
            Gestion des Commandes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">
            {orders.length} commande{orders.length > 1 ? 's' : ''} au total
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'CA Total', value: `${totalRevenue.toLocaleString()} FCFA`, class: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'En attente', value: countByStatus('EN_ATTENTE'), class: 'text-amber-600 dark:text-amber-400' },
            { label: 'Payées', value: countByStatus('PAYEE'), class: 'text-blue-600 dark:text-blue-400' },
            { label: 'Validées', value: countByStatus('VALIDEE'), class: 'text-cyan-600 dark:text-cyan-400' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/10">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.class}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="glass-card rounded-2xl border border-black/5 dark:border-white/10 p-16 text-center">
            <Package className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-500">Aucune commande</h3>
            <p className="text-slate-400 text-sm mt-1">Les commandes apparaîtront ici au fil des ventes.</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/50">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Articles</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order: any) => {
                    const cfg = STATUS_CONFIG[order.statut] ?? STATUS_CONFIG.EN_ATTENTE;
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{order.client.nom} {order.client.prenom}</p>
                          <p className="text-xs text-slate-500">{order.client.email}</p>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{order.lignes_commande.length} article{order.lignes_commande.length > 1 ? 's' : ''}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{Number(order.montant_total).toLocaleString()} FCFA</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.class}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-xs text-slate-500">
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
      </main>
    </div>
  );
}
