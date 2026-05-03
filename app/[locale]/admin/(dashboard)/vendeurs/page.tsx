import { prisma } from '@/lib/db';
import { Tags, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function VendeursPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Tags className="h-6 w-6 text-cyan-500" />
        <h1 className="text-2xl font-bold">Gestion des Vendeurs</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="p-8 border-b border-black/5 dark:border-white/10">
          <h3 className="text-xl font-bold">Liste des Partenaires ({brands.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Boutique</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Statut</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {brands.map((brand: any) => (
                <tr key={brand.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100">
                        <Image src={brand.image || '/placeholder.png'} alt={brand.name} fill className="object-cover" />
                      </div>
                      <span className="font-bold">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500">{brand.email}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${brand.isVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {brand.isVerified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {brand.isVerified ? 'Certifié' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-600 px-3 py-1 bg-blue-500/10 rounded-lg">Gérer</button>
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
