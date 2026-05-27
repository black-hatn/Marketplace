import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Star, ShieldCheck, Truck, MessageCircle, MapPin, ShieldAlert, BadgeCheck } from 'lucide-react';
import { ProductGallery } from '@/components/ProductGallery';
import { WishlistButton } from '@/components/WishlistButton';
import { isWishlisted } from '@/lib/actions';
import { Metadata } from 'next';
import { AddToCartButton } from '@/components/AddToCartButton';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { ReviewSection } from '@/components/ReviewSection';
import dynamicImport from 'next/dynamic';
import PageTransition from '@/components/PageTransition';
import { ProductJsonLd } from '@/components/JsonLd'; // E

// Lazy-load du composant 3D : Three.js (~150kB gz) n'est chargé qu'au besoin
const ThreeDButton = dynamicImport(
  () => import('@/components/ThreeDButton').then((m) => m.ThreeDButton),
  { ssr: false, loading: () => <div className="h-48 rounded-3xl bg-white/5 animate-pulse" /> }
);

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
  const brand = product.brand;
  
  const whatsappMessage = `Bonjour, je suis intéressé par l'annonce "${product.nom}" (réf: ${product.id.slice(-6)}) affichée à ${Number(product.prix_ttc).toLocaleString()} FCFA sur votre boutique. Est-il toujours disponible ?`;
  const brandPhone = brand?.phone?.replace(/\D/g, '') || '23560909092';
  const whatsappUrl = `https://wa.me/${brandPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <PageTransition>
      {/* E — Données structurées produit pour Google Shopping */}
      <ProductJsonLd product={{ ...product, prix_ttc: Number(product.prix_ttc) }} />
      <div className="relative w-full min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30 pb-24">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.08),_transparent_70%)] pointer-events-none" />

        {/* Navigation spacer */}
        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
          {/* Breadcrumbs / Back */}
          <div className="mb-12">
            <Link href="/produits" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour au catalogue
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] gap-12 lg:gap-20">
            {/* Left: Gallery */}
            <div className="space-y-8">
              <ProductGallery images={images} title={product.nom} />
            </div>

            {/* Right: Info & Actions */}
            <div className="flex flex-col space-y-8">
              {/* Headings */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                    {product.categories[0] || 'Premium'}
                  </span>
                  {lowStock && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Stock Limité ({product.stock})
                    </span>
                  )}
                  {inStock && !lowStock && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      En Stock
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight">
                    {product.nom}
                  </h1>
                  <ThreeDButton title={product.nom} style={(product.threeDStyle as any) ?? 'cube'} />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-black">4.9</span>
                    <span className="text-amber-400/50 text-[10px] font-bold uppercase tracking-wider ml-1">({product.avis.length} avis)</span>
                  </div>
                  <span className="text-white/10">|</span>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>N'Djaména, Tchad</span>
                  </div>
                </div>
              </div>

              {/* Price & Description */}
              <div className="space-y-4">
                <div className="text-5xl font-black text-white tracking-tighter flex items-end gap-2">
                  {Number(product.prix_ttc).toLocaleString()} <span className="text-lg font-bold text-white/30 uppercase tracking-widest mb-1.5">FCFA</span>
                </div>
                <p className="text-white/60 leading-relaxed text-base font-medium">
                  {product.description}
                </p>
              </div>

              {/* Fixed Bottom Action Bar for Mobile & Inline for Desktop */}
              <div className="pt-4 space-y-4">
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#030303]/90 backdrop-blur-xl border-t border-white/5 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-none lg:backdrop-blur-none flex flex-col sm:flex-row gap-3">
                  <AddToCartButton product={{
                    id: product.id,
                    title: product.nom,
                    price: Number(product.prix_ttc),
                    image: product.images[0] || '/placeholder.png'
                  }} disabled={!inStock} />
                  
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 sm:py-0 rounded-2xl bg-[#25D366] text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] text-xs h-[60px]"
                  >
                    <MessageCircle className="w-5 h-5" /> Contacter
                  </a>
                  
                  <div className="hidden sm:block">
                    <WishlistButton productId={product.id} initialWishlisted={wishlisted} size="lg" />
                  </div>
                </div>
                {/* Wishlist Mobile Fallback */}
                <div className="sm:hidden flex justify-center">
                   <WishlistButton productId={product.id} initialWishlisted={wishlisted} size="md" />
                </div>

                <div className="flex flex-col gap-3 py-6 border-y border-white/5">
                  <div className="flex items-center gap-3 text-white/50 text-[11px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Paiement à la livraison possible
                  </div>
                  <div className="flex items-center gap-3 text-white/50 text-[11px] font-black uppercase tracking-widest">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    Livraison sécurisée sous 24h-48h
                  </div>
                </div>
              </div>

              {/* Vendor Profile Block */}
              {brand && (
                <div className="glass-card p-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white/60">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Vendu par</p>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {brand.name}
                        {brand.isVerified && (
                          <BadgeCheck className="w-5 h-5 text-emerald-400" />
                        )}
                      </h3>
                    </div>
                    <div className="ml-auto">
                      <Link href={`/marques/${brand.slug || brand.id}`} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest">
                        Boutique
                      </Link>
                    </div>
                  </div>
                  {brand.isVerified && (
                    <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5" /> Vendeur vérifié par la plateforme
                    </p>
                  )}
                </div>
              )}

              {/* Safety Alert */}
              <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Conseil de sécurité</span>
                </div>
                <p className="text-[11px] text-amber-400/70 font-bold leading-relaxed uppercase tracking-wider">
                  Privilégiez les transactions en mains propres dans des lieux publics. Ne payez jamais d'avance sans avoir vu l'article.
                </p>
              </div>
            </div>
          </div>

          {/* Details Tabs / Sections */}
          <div className="mt-32 space-y-24">
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-white tracking-tight">Avis de la communauté</h2>
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

            <SmartRecommendations productId={product.id} />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
