import { prisma } from '@/lib/db';
import { Tags, ShieldAlert, CheckCircle, Clock, Store } from 'lucide-react';
import Image from 'next/image';
import { AdminBrandActions } from '@/components/AdminBrandActions';

export const dynamic = 'force-dynamic';

export default async function VendeursPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Partenaires</p>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Store className="w-8 h-8 text-cyan-400" />
            Gestion des Vendeurs
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white">
            <span className="text-cyan-400">{brands.length}</span> Boutiques
          </div>
        </div>
      </div>

      {/* ── Vendors Table ─────────────────────────────────── */}
      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-5">Boutique</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Statut</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {brands.map((brand: any) => (
                <tr key={brand.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                        <Image src={brand.image || '/placeholder.png'} alt={brand.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{brand.name}</span>
                        <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest mt-0.5">ID: {brand.id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-xs font-medium text-white/60">
                    {brand.email || 'Non renseigné'}
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${brand.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {brand.isVerified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {brand.isVerified ? 'Certifié' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-end">
                      <AdminBrandActions brandId={brand.id} isVerified={brand.isVerified} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {brands.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-sm font-medium text-white/30">
                    Aucun vendeur enregistré sur la plateforme.
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
