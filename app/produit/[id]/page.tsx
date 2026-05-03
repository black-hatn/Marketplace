import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Sparkles, Package, MessageCircle, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { ProductGallery } from '@/components/ProductGallery';
import { ReviewSection } from '@/components/ReviewSection';
import { WishlistButton } from '@/components/WishlistButton';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { isWishlisted, getRecommendedProducts } from '@/lib/actions';
import { Metadata } from 'next';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Recommendations } from '@/components/Recommendations';
import { ShinyButton } from '@/components/ShinyButton';
import PageTransition from '@/components/PageTransition';
import { ProductCard } from '@/components/ProductCard';
import { RecentlyViewedTrigger } from '@/components/RecentlyViewedTrigger';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { brand: true },
  });
  if (!product) return { title: 'Produit introuvable' };
  return {
    title: `${product.title} | Plateforme Immersive`,
    description: product.tagline || `Découvrez ${product.title} par ${product.brand.name} — disponible sur Plateforme Immersive.`,
    openGraph: {
      title: product.title,
      description: product.tagline || '',
      images: [{ url: product.image }],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: Props) {
  const [product, wishlisted] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        brand: true,
        category: true,
        productReviews: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    }),
    isWishlisted(params.id),
  ]);

  if (!product) notFound();

  const images = (() => { try { const arr = JSON.parse(product.images); return arr.length > 0 ? arr : [product.image]; } catch { return [product.image]; } })();
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const reviewsForClient = product.productReviews.map((r: any) => ({
    ...r,
    createdAt: r.createdAt,
  }));

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.07] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-10 lg:py-20 space-y-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link href="/produits" className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Catalogue
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href={`/marques/${product.brand.slug}`} className="text-sm font-medium text-slate-500 hover:text-cyan-600 transition-colors">{product.brand.name}</Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{product.title}</span>
          </div>

          {/* Main Section */}
          <section className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Gallery */}
            <ProductGallery images={images} title={product.title} />

            {/* Product Info */}
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Badge + Category */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1 rounded-full">
                  {(product.category as any).name}
                </span>
                {(product as any).badge && (
                  <span className="text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 rounded-full shadow-lg shadow-cyan-500/20">
                    {(product as any).badge}
                  </span>
                )}
                {lowStock && <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">⚡ Plus que {product.stock} en stock</span>}
                {!inStock && <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">Rupture de stock</span>}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {product.title}
              </h1>

              {product.tagline && <p className="text-lg text-slate-500 dark:text-slate-400 italic">{product.tagline}</p>}

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-5 w-5 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500">({product.reviews} avis)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{product.price.toLocaleString()} FCFA</span>
                <span className="text-sm text-slate-400 line-through mb-1">{(product.price * 1.2).toLocaleString()} FCFA</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">-20%</span>
              </div>

              {/* Location & Stock indicator */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="h-5 w-5 text-cyan-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-tight">{product.city}</span>
                    {product.neighborhood && <span className="text-xs text-slate-500 font-medium">{product.neighborhood}</span>}
                  </div>
                </div>

                {product.shippingViaAgency && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                    <Truck className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Expédition en province OK</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Package className={`h-4 w-4 ${inStock ? 'text-emerald-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {inStock ? `${product.stock} unités disponibles` : 'Rupture de stock'}
                  </span>
                </div>
              </div>

              {/* Mobile Money Badges */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paiements acceptés par le vendeur</p>
                <div className="flex gap-3">
                  {product.brand.airtelMoney && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/10 border border-red-600/20">
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-xs font-black text-red-600">Airtel Money</span>
                    </div>
                  )}
                  {product.brand.moovMoney && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/10 border border-blue-600/20">
                      <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-xs font-black text-blue-600">Moov Money</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <span className="text-xs font-black text-slate-500 italic">Cash à la livraison</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons - Classified Logic */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <AddToCartButton product={product} disabled={!inStock} />
                  <WishlistButton productId={product.id} initialWishlisted={wishlisted} size="lg" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={`https://wa.me/${(product.brand as any).phone || '23500000000'}?text=${encodeURIComponent(`Bonjour ${product.brand.name},\n\nJe suis très intéressé par votre article "${product.title}" vu sur Plateforme Immersive.\n\nEst-il toujours disponible ?\n\nMerci !`)}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </a>
                  <a 
                    href={`tel:${(product.brand as any).phone || '23500000000'}`}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition-all shadow-lg active:scale-95"
                  >
                    <Phone className="h-5 w-5" /> Appeler
                  </a>
                </div>
              </div>

              {/* Security Tips (Annoncena Logic) */}
              <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20">
                <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="h-5 w-5" />
                  <h3 className="font-bold text-sm">Conseils de sécurité</h3>
                </div>
                <ul className="text-xs space-y-2 text-amber-800/70 dark:text-amber-400/70 list-disc pl-4 font-medium">
                  <li><strong>Ne payez jamais à l&apos;avance</strong> (Moov/Airtel) sans avoir vu l&apos;article.</li>
                  <li>Rencontrez le vendeur dans un lieu public (ex: Place de la Nation).</li>
                  <li>Vérifiez l&apos;état de l&apos;article avant de conclure l&apos;achat.</li>
                </ul>
              </div>

              {/* Brand Link */}
              <Link href={`/marques/${product.brand.slug}`} className="flex items-center gap-3 glass-card rounded-2xl p-4 border border-black/5 dark:border-white/10 hover:border-cyan-500/20 transition-all group">
                <div className="relative">
                  <img src={product.brand.image} alt={product.brand.name} className="h-10 w-10 rounded-xl object-cover" />
                  {product.brand.isVerified && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                      <ShieldCheck className="h-3 w-3 text-blue-600 fill-blue-600/10" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{product.brand.name}</p>
                    {product.brand.isVerified && <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-1 rounded">Certifié</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Vendeur Officiel</p>
                </div>
                <Sparkles className="h-4 w-4 text-slate-300 group-hover:text-cyan-500 ml-auto transition-colors" />
              </Link>
            </div>
          </section>

          {/* Reviews */}
          <section className="space-y-6">
            <div className="border-b border-black/5 dark:border-white/10 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Avis clients</h2>
              <p className="text-slate-500 mt-1 text-sm">Ce que pensent les acheteurs de ce produit</p>
            </div>
            <ReviewSection productId={product.id} initialReviews={reviewsForClient} />
          </section>

          {/* Recommendations */}
          <Recommendations productId={product.id} />
        </div>
      </main>

      <RecentlyViewed currentProductId={product.id} />
    </>
  );
}
