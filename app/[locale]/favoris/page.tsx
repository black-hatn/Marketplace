import { Metadata } from 'next';
import { getWishlist } from '@/lib/actions';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ProductCard } from '@/components/ProductCard';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Ma Liste de Favoris | Plateforme Immersive',
  description: 'Retrouvez tous vos produits favoris sauvegardés.',
};

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  // On passe une chaîne vide pour le moment (récupération globale pour la démo)
  const wishlistItems = await getWishlist("");

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30 pb-24">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/5 pb-10">
            <div>
              <Link href="/produits" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour au catalogue
              </Link>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter flex items-center gap-4">
                <Heart className="h-10 w-10 text-red-500 fill-red-500/20" /> Mes Favoris
              </h1>
              <p className="text-white/40 font-medium mt-3 text-lg">{wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} sauvegardé{wishlistItems.length > 1 ? 's' : ''}</p>
            </div>
            
            <Link href="/produits" className="glass-card px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex items-center gap-3 w-fit group shadow-xl">
              <ShoppingCart className="h-5 w-5 text-white/60 group-hover:text-cyan-400 transition-colors" /> 
              <span className="text-xs font-black uppercase tracking-widest text-white">Continuer mes achats</span>
            </Link>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-32 glass-card rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.05),_transparent_60%)]" />
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-white/20" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Votre liste est vide</h2>
                <p className="text-white/40 font-medium max-w-sm mx-auto mb-10">Parcourez notre catalogue premium et ajoutez des produits à vos favoris pour les retrouver ici.</p>
                <Link href="/produits" className="inline-flex h-14 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  Découvrir le catalogue
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item: any) => (
                <div key={item.id} className="relative group/card">
                  <ProductCard
                    product={{
                      id: item.produit.id,
                      title: item.produit.nom,
                      price: Number(item.produit.prix_ttc),
                      image: item.produit.images[0] || '/placeholder.png',
                      category: item.produit.category?.name || 'Général',
                      vendor: item.produit.brand?.name || 'Immersive',
                    }}
                  />
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <div className="h-10 w-10 rounded-full bg-[#030303]/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl">
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
