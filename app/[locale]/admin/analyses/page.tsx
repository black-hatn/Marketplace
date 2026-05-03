import { getAnalyseVentes } from '@/lib/actions';
import { BarChart3, TrendingUp, ShoppingBag, Users, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RevenueChart } from '@/components/RevenueChart';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const data = await getAnalyseVentes() as any[];

  // Formater les données pour le graphique
  const chartData = data.map(item => ({
    month: new Date(item.mois).toLocaleDateString('fr-FR', { month: 'short' }),
    revenue: Number(item.ca),
    orders: Number(item.volume_ventes)
  })).reverse();

  const latestMonth = data[0] || { ca: 0, volume_ventes: 0, panier_moyen: 0 };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-16">
      {/* Header */}
      <nav className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-cyan-600" />
              </div>
              <span className="text-lg font-bold">Rapports Analytiques</span>
            </div>
            <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-[2rem] border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">CA ce mois</p>
                <h3 className="text-2xl font-black">{Number(latestMonth.ca).toLocaleString()} FCFA</h3>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[2rem] border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Volume Ventes</p>
                <h3 className="text-2xl font-black">{latestMonth.volume_ventes} commandes</h3>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[2rem] border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Panier Moyen</p>
                <h3 className="text-2xl font-black">{Number(latestMonth.panier_moyen).toLocaleString()} FCFA</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8">
          <h3 className="text-xl font-bold mb-8 italic uppercase tracking-tight">Évolution du Chiffre d'Affaires</h3>
          <div className="h-[400px]">
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Detailed Table (Direct from SQL View) */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
          <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-xl font-bold">Rapport Mensuel Détaillé</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source: vue_analyse_ventes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Mois</th>
                  <th className="px-8 py-4">Ventes</th>
                  <th className="px-8 py-4">Chiffre d'Affaires</th>
                  <th className="px-8 py-4">Panier Moyen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-cyan-500" />
                      <span className="font-bold">
                        {new Date(row.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium">{row.volume_ventes}</td>
                    <td className="px-8 py-5 font-black text-emerald-600 dark:text-emerald-400">
                      {Number(row.ca).toLocaleString()} FCFA
                    </td>
                    <td className="px-8 py-5 text-slate-500">
                      {Number(row.panier_moyen).toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
