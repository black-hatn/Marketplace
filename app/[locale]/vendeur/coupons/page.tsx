import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCoupons, createCoupon, deleteCoupon } from "@/lib/actions";
import { Ticket, Plus, Trash2, Calendar, Percent, ChevronRight, Tag } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function VendorCouponsPage() {
  const session = await getServerSession(authOptions) as any;

  if (!session) redirect("/admin/login");

  let brandId = session.user.id;
  if (session.user.role === 'ADMIN') {
    const b = await prisma.brand.findFirst();
    brandId = b?.id || "";
  }

  const coupons = await getCoupons(brandId);

  async function handleAdd(formData: FormData) {
    'use server';
    await createCoupon(brandId, formData);
  }

  async function handleDelete(id: string) {
    'use server';
    await deleteCoupon(id);
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          <span>Espace Vendeur</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-cyan-600">Promotions & Coupons</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight flex items-center gap-4">
          <Ticket className="h-10 w-10 text-cyan-600" /> Vos Offres Spéciales
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Créez des codes promos pour booster vos ventes.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl sticky top-24">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-cyan-600" /> Nouveau Coupon
            </h3>
            <form action={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Code Promo</label>
                <input name="code" required placeholder="Ex: SUMMER20" className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-cyan-500 font-bold uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Réduction</label>
                  <input name="discount" type="number" required placeholder="20" className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-cyan-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                  <select name="type" className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-cyan-500 font-bold">
                    <option value="PERCENTAGE">% Pourcentage</option>
                    <option value="FIXED">Montant Fixe (F)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expire le</label>
                <input name="expiresAt" type="date" required className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-cyan-500 font-bold" />
              </div>
              <button type="submit" className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20 mt-4">
                Créer le coupon
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Tag className="h-8 w-8 text-cyan-600" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{coupon.code}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Percent className="h-3 w-3" /> {coupon.discount}{coupon.type === 'PERCENTAGE' ? '%' : ' F'} de réduction
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Calendar className="h-3 w-3" /> Expire: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${new Date(coupon.expiresAt) > new Date() ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                  {new Date(coupon.expiresAt) > new Date() ? 'Actif' : 'Expiré'}
                </span>
                <form action={async () => { 'use server'; await deleteCoupon(coupon.id); }}>
                  <button className="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}

          {coupons.length === 0 && (
            <div className="bg-slate-50 dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] p-20 text-center">
              <Ticket className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-400">Aucun coupon actif</h3>
              <p className="text-sm text-slate-500 mt-2">Commencez par créer votre premier code promo à gauche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
