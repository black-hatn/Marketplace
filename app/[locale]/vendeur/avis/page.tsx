import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { replyToReview } from "@/lib/actions";
import { MessageSquare, Star, User, ChevronRight, CornerDownRight, Send } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorReviewsPage() {
  const session = await getServerSession(authOptions) as any;

  if (!session) redirect("/admin/login");

  let brandId = session.user.id;
  if (session.user.role === 'ADMIN') {
    const b = await prisma.brand.findFirst();
    brandId = b?.id || "";
  }

  const reviews = await prisma.review.findMany({
    where: { produit: { brandId } },
    include: { produit: true },
    orderBy: { createdAt: 'desc' }
  });

  async function handleReply(formData: FormData) {
    'use server';
    const reviewId = formData.get('reviewId') as string;
    const reply = formData.get('reply') as string;
    await replyToReview(reviewId, reply);
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          <span>Espace Vendeur</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-blue-600">Avis & Retours Clients</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight flex items-center gap-4">
          <MessageSquare className="h-10 w-10 text-blue-600" /> Vos Évaluations
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Répondez à vos clients pour instaurer la confiance.</p>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl shadow-black/5">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{review.userName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Produit concerné</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{review.produit.nom}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">"{review.comment}"</p>
                </div>

                <div className="mt-8 space-y-4">
                  {(review as any).reply ? (
                    <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl relative">
                      <CornerDownRight className="absolute -left-6 top-6 h-5 w-5 text-blue-500/30" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Votre réponse</p>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{(review as any).reply}</p>
                    </div>
                  ) : (
                    <form action={handleReply} className="flex gap-3">
                      <input type="hidden" name="reviewId" value={review.id} />
                      <input 
                        name="reply" 
                        required 
                        placeholder="Écrivez votre réponse ici..." 
                        className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" 
                      />
                      <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2">
                        <Send className="h-4 w-4" /> Répondre
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-slate-50 dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] p-20 text-center">
            <MessageSquare className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-400">Aucun avis pour le moment</h3>
            <p className="text-sm text-slate-500 mt-2">Les avis clients apparaîtront ici dès que vos produits seront évalués.</p>
          </div>
        )}
      </div>
    </div>
  );
}
