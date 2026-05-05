import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Sparkles, Package, MessageCircle, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { ProductGallery } from '@/components/ProductGallery';
import { WishlistButton } from '@/components/WishlistButton';
import { isWishlisted, getRecommendedProducts } from '@/lib/actions';
import { Metadata } from 'next';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Recommendations } from '@/components/Recommendations';
import { ReviewSection } from '@/components/ReviewSection';
import PageTransition from '@/components/PageTransition';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.produit.findUnique({
    where: { id: params.id },
    include: { brand: true },
  });
  if (!product) return { title: 'Produit introuvable' };
  
  const imageUrl = product.images[0] || '/placeholder.png';
  
  return {
    title: `${product.nom} | ${Number(product.prix_ttc).toLocaleString()} FCFA`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.nom,
      description: product.description.slice(0, 160),
      url: `https://tchad-market.vercel.app/produit/${params.id}`,
      siteName: 'Plateforme Immersive',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.nom }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.nom,
      description: product.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: Props) {
  const [product, wishlisted] = await Promise.all([
    prisma.produit.findUnique({
      where: { id: params.id },
      include: {
        brand: true,
        category: true,
        avis: {
          orderBy: { createdAt: 'desc' }
        }
      },
    }),
    isWishlisted(params.id),
  ]);

  if (!product) notFound();

  const images = product.images.length > 0 ? product.images : ['/placeholder.png'];
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.07] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10 lg:py-20 space-y-10 sm:space-y-16">
          <div className="flex items-center gap-4">
            <Link href="/produits" className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Catalogue
            </Link>
          </div>

          <section className="grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-start">
            <ProductGallery images={images} title={product.nom} />

            <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1 rounded-full">
                  {product.categories[0]}
                </span>
                {lowStock && <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">⚡ Plus que {product.stock} en stock</span>}
                {!inStock && <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">Rupture de stock</span>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {product.nom}
              </h1>

              <div className="flex items-end gap-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{Number(product.prix_ttc).toLocaleString()} FCFA</span>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="h-5 w-5 text-cyan-600" />
                  <span className="text-sm font-black uppercase tracking-tight">N'Djaména</span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className={`h-4 w-4 ${inStock ? 'text-emerald-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {inStock ? `${product.stock} unités disponibles` : 'Rupture de stock'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <AddToCartButton product={{
                    id: product.id,
                    title: product.nom,
                    price: Number(product.prix_ttc),
                    image: product.images[0] || '/placeholder.png'
                  }} disabled={!inStock} />
                  <WishlistButton productId={product.id} initialWishlisted={wishlisted} size="lg" />
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20">
                <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="h-5 w-5" />
                  <h3 className="font-bold text-sm">Conseils de sécurité</h3>
                </div>
                <ul className="text-xs space-y-2 text-amber-800/70 dark:text-amber-400/70 list-disc pl-4 font-medium">
                  <li><strong>Ne payez jamais à l'avance</strong> sans avoir vu l'article.</li>
                  <li>Vérifiez l'état de l'article avant de conclure l'achat.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid gap-12 lg:grid-cols-[1fr_400px] border-t border-black/5 dark:border-white/10 pt-16">
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                <h2 className="text-2xl font-bold">Avis Clients</h2>
              </div>
              <ReviewSection 
                productId={product.id} 
                initialReviews={product.avis.map(a => ({
                  id: a.id,
                  rating: a.rating,
                  comment: a.comment,
                  authorName: a.userName,
                  createdAt: a.createdAt
                }))} 
              />
            </div>
            
            <div className="hidden lg:block space-y-8">
              <div className="glass-card p-8 rounded-[2.5rem] border border-cyan-500/10">
                <h3 className="text-sm font-black uppercase tracking-widest text-cyan-600 mb-4">Garantie Immersive</h3>
                <ul className="space-y-4">
                  {[
                    { icon: ShieldCheck, text: "Vérification rigoureuse du vendeur" },
                    { icon: Truck, text: "Livraison sécurisée N'Djaména" },
                    { icon: RotateCcw, text: "7 jours pour changer d'avis" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <item.icon className="h-4 w-4 text-cyan-500" /> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Recommendations productId={product.id} />
        </div>
      </main>
    </PageTransition>
  );
}
