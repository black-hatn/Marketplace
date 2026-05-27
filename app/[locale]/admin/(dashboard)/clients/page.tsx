import { prisma } from '@/lib/db';
import { Users, Mail, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    where: { role: 'CLIENT' },
    orderBy: { date_inscription: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Utilisateurs</p>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Gestion des Clients
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white">
            <span className="text-cyan-400">{clients.length}</span> Membres Inscrits
          </div>
        </div>
      </div>

      {/* ── Clients Table ─────────────────────────────────── */}
      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-5">Nom complet</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Date d'inscription</th>
                <th className="px-8 py-5 text-right">Téléphone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                      {client.prenom} {client.nom}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                      <Mail className="h-3.5 w-3.5 text-white/30" /> {client.email}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[11px] font-medium text-white/60 uppercase tracking-wide">
                      <Calendar className="h-3.5 w-3.5 text-white/30" />
                      {new Date(client.date_inscription).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-xs font-bold text-white/40">
                      {client.telephone || '-'}
                    </span>
                  </td>
                </tr>
              ))}

              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-sm font-medium text-white/30">
                    Aucun client inscrit pour le moment.
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
