import { Metadata } from 'next';
import { getWishlist } from '@/lib/actions';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ProductCard } from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Ma Liste de Favoris | Plateforme Immersive',
  description: 'Retrouvez tous vos produits favoris sauvegardés.',
};

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  // On passe une chaîne vide pour le moment (récupération globale pour la démo)
  const wishlistItems = await getWishlist("");

  return (
    <main className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              <h1 className="text-3xl font-bold">Mes Favoris</h1>
            </div>
            <p className="text-slate-500">{wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} sauvegardé{wishlistItems.length > 1 ? 's' : ''}</p>
          </div>
          <Link href="/produits" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <ShoppingCart className="h-4 w-4" /> Continuer mes achats
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-500">Votre liste est vide</h2>
            <p className="text-slate-400 mt-2 text-sm">Ajoutez des produits à vos favoris pour les retrouver ici.</p>
            <Link href="/produits" className="mt-6 inline-block px-8 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity">
              Découvrir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item: any) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.produit.id,
                  title: item.produit.nom,
                  price: Number(item.produit.prix_ttc),
                  image: item.produit.images[0] || '/placeholder.png',
                  category: item.produit.category?.name || 'Général',
                  vendor: item.produit.brand?.name || 'Immersive',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
