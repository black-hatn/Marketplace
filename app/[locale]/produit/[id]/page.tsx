import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Package, MapPin, ShieldAlert, ShoppingBag, Heart } from 'lucide-react';
import { ProductGallery } from '@/components/ProductGallery';
import { WishlistButton } from '@/components/WishlistButton';
import { isWishlisted } from '@/lib/actions';
import { Metadata } from 'next';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Recommendations } from '@/components/Recommendations';
import { ReviewSection } from '@/components/ReviewSection';
import PageTransition from '@/components/PageTransition';

type Props = { params: { id: string, locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.produit.findUnique({
    where: { id: params.id },
    include: { brand: true },
  });
  if (!product) return { title: 'Produit introuvable' };
  
  const imageUrl = product.images[0] || '/placeholder.png';
  
  return {
    title: `${product.nom} | Plateforme Premium`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.nom,
      description: product.description.slice(0, 160),
      images: [{ url: imageUrl }],
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
      <div className="relative w-full min-h-screen bg-background overflow-hidden selection:bg-white/20 selection:text-white pb-24">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        {/* Navigation spacer */}
        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
          {/* Breadcrumbs / Back */}
          <div className="mb-12">
            <Link href="/produits" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour au catalogue
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Gallery */}
            <div className="space-y-8">
              <ProductGallery images={images} title={product.nom} />
            </div>

            {/* Right: Info */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                    {product.categories[0] || 'Premium'}
                  </span>
                  {lowStock && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Stock Limité
                    </span>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  {product.nom}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold">4.8</span>
                    <span className="text-muted-foreground text-xs font-medium ml-1">({product.avis.length} avis)</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>N'Djaména, Tchad</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-4xl font-black text-white">
                  {Number(product.prix_ttc).toLocaleString()} <span className="text-lg font-medium text-white/40 uppercase">FCFA</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <AddToCartButton product={{
                    id: product.id,
                    title: product.nom,
                    price: Number(product.prix_ttc),
                    image: product.images[0] || '/placeholder.png'
                  }} disabled={!inStock} />
                  <WishlistButton productId={product.id} initialWishlisted={wishlisted} size="lg" />
                </div>

                <div className="flex flex-col gap-3 py-6 border-y border-white/5">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    Authenticité certifiée par Immersive
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Truck className="w-5 h-5 text-purple-400" />
                    Livraison sécurisée sous 24h-48h
                  </div>
                </div>
              </div>

              {/* Safety Alert */}
              <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="font-bold text-sm">Conseil de sécurité</span>
                </div>
                <p className="text-xs text-amber-400/70 font-medium leading-relaxed">
                  Pour votre sécurité, privilégiez toujours les transactions en mains propres dans des lieux publics. Ne payez jamais d'avance sans avoir vu l'article.
                </p>
              </div>
            </div>
          </div>

          {/* Details Tabs / Sections */}
          <div className="mt-32 space-y-24">
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-white">Avis de la communauté</h2>
                <div className="h-px flex-1 bg-white/5"></div>
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
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-white">Sélectionné pour vous</h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <Recommendations productId={product.id} />
            </section>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
