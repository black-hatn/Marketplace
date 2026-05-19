import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Share2, ShieldCheck, MapPin, Sparkles, Globe } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Metadata } from 'next';
import { incrementBrandViews } from '@/lib/actions';
import PageTransition from '@/components/PageTransition';

type BrandPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = await prisma.brand.findUnique({ where: { slug: params.slug } });
  if (!brand) return { title: 'Marque introuvable' };
  return {
    title: `${brand.name} | Boutique Officielle`,
    description: brand.tagline || brand.description,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const brand = await prisma.brand.findUnique({
    where: { slug: params.slug },
    include: {
      produits: {
        include: { category: true, brand: true },
        take: 12,
      },
    },
  });

  if (!brand) notFound();

  await incrementBrandViews(brand.id);

  const serializedProducts = brand.produits.map((p: any) => ({
    id: p.id,
    title: p.nom,
    price: Number(p.prix_ttc),
    image: p.images[0] || '/placeholder.png',
    category: p.category?.name || 'Général',
    vendor: brand.name,
    stock: p.stock
  }));

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30 pb-24">
        {/* Hero Background */}
        <div className="absolute top-0 left-0 right-0 h-[60vh] z-0">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/10 via-[#030303]/80 to-[#030303]" />
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none" />
        </div>

        <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 pt-32">
          <Link href="/produits" className="mb-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>

          {/* Brand Header */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 sm:gap-12 mb-20">
            <div className="relative h-32 w-32 sm:h-48 sm:w-48 flex-shrink-0 rounded-[2rem] sm:rounded-[3rem] overflow-hidden glass-card border-4 border-white/10 ring-1 ring-white/20 shadow-2xl">
              <Image src={brand.image} alt={brand.name} fill className="object-cover" sizes="(max-width: 640px) 128px, 192px" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {brand.isVerified && (
                  <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" /> Marque Vérifiée
                  </span>
                )}
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                  Membre depuis 2024
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white">
                {brand.name}<span className="text-cyan-500">.</span>
              </h1>
              <p className="text-lg sm:text-2xl text-white/60 font-medium tracking-wide max-w-2xl">{brand.tagline}</p>
            </div>

            <div className="flex items-center gap-4">
               <button className="h-14 w-14 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-xl">
                  <Share2 className="h-5 w-5" />
               </button>
               <button className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Suivre la marque
               </button>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Left Content */}
            <div className="space-y-16">
              <div className="glass-card p-10 lg:p-14 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-1.5 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                    <h2 className="text-3xl font-black tracking-tight text-white">L'Âme de la Marque</h2>
                  </div>
                  <p className="text-lg leading-relaxed text-white/60 first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-cyan-400 first-line:tracking-widest font-medium">
                    {brand.story || brand.description}
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                  <h2 className="text-4xl font-black tracking-tighter text-white">Catalogue <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Premium</span></h2>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-4 py-2 rounded-xl bg-white/5 border border-white/5">{serializedProducts.length} ARTICLES</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {serializedProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {serializedProducts.length === 0 && (
                  <div className="py-24 text-center glass-card rounded-[3rem] border border-white/5">
                    <Sparkles className="h-12 w-12 text-white/20 mx-auto mb-6" />
                    <p className="text-white/40 font-black uppercase tracking-widest text-sm">Bientôt de nouveaux arrivages...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Performances
                </h3>
                <div className="grid grid-cols-2 gap-8 relative z-10">
                   <div>
                      <p className="text-4xl font-black text-white tracking-tighter mb-2">{brand.views}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Vues Totales</p>
                   </div>
                   <div>
                      <p className="text-4xl font-black text-white tracking-tighter mb-2">{serializedProducts.length}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Produits</p>
                   </div>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                <div className="flex items-start gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Base de la Marque</p>
                      <p className="text-lg font-bold text-white">N'Djaména, Tchad</p>
                   </div>
                </div>
                
                <div className="space-y-6 pt-6 border-t border-white/5">
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> Valeurs
                      </h4>
                      <p className="text-sm font-medium text-white/60 leading-relaxed">{brand.values}</p>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-cyan-400" /> Impact Social
                      </h4>
                      <p className="text-sm font-medium text-white/60 leading-relaxed">{brand.impact}</p>
                   </div>
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_40px_rgba(6,182,212,0.3)] relative overflow-hidden group">
                <Sparkles className="absolute -right-4 -bottom-4 h-32 w-32 opacity-20 group-hover:scale-125 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Boutique Officielle</h3>
                <p className="text-sm text-white/90 leading-relaxed relative z-10 font-medium">
                  Tous les produits vendus ici sont certifiés 100% authentiques et proviennent directement des ateliers du créateur.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
