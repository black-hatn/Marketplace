import { getAnalyseVentes } from '@/lib/actions';
import { BarChart3, TrendingUp, ShoppingBag, Users, Calendar, ArrowLeft } from 'lucide-react';
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
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Statistiques</p>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Rapports Analytiques
          </h1>
        </div>
      </div>

      {/* ── Key Metrics ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl opacity-40 pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">CA ce mois</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{Number(latestMonth.ca).toLocaleString()} <span className="text-sm text-white/30">F</span></h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl opacity-40 pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Volume Ventes</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{latestMonth.volume_ventes} <span className="text-sm text-white/30">cmd</span></h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl opacity-40 pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Panier Moyen</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{Number(latestMonth.panier_moyen).toLocaleString()} <span className="text-sm text-white/30">F</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ─────────────────────────────────────────── */}
      <div className="glass-card rounded-[2.5rem] p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Évolution du Chiffre d'Affaires</h3>
        <div className="h-[400px]">
          <RevenueChart data={chartData} />
        </div>
      </div>

      {/* ── Detailed Table ────────────────────────────────── */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">Rapport Mensuel Détaillé</h3>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">vue_analyse_ventes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-5">Mois</th>
                <th className="px-8 py-5">Ventes</th>
                <th className="px-8 py-5">Chiffre d'Affaires</th>
                <th className="px-8 py-5">Panier Moyen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-cyan-400/50" />
                    <span className="font-bold text-white capitalize">
                      {new Date(row.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-white/80">{row.volume_ventes}</td>
                  <td className="px-8 py-5 font-black text-emerald-400">
                    {Number(row.ca).toLocaleString()} <span className="text-[10px] text-white/30">FCFA</span>
                  </td>
                  <td className="px-8 py-5 font-bold text-white/60">
                    {Number(row.panier_moyen).toLocaleString()} <span className="text-[10px] text-white/30">FCFA</span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-sm font-medium text-white/30">
                    Aucune donnée disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
