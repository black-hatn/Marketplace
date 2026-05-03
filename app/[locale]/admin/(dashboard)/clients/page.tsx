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
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-cyan-500" />
        <h1 className="text-2xl font-bold">Gestion des Clients</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="p-8 border-b border-black/5 dark:border-white/10">
          <h3 className="text-xl font-bold">Base clients ({clients.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Nom complet</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Date d'inscription</th>
                <th className="px-8 py-4">Téléphone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold">{client.prenom} {client.nom}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {client.email}
                  </td>
                  <td className="px-8 py-5 text-slate-500">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(client.date_inscription).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-500">
                    {client.telephone || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
