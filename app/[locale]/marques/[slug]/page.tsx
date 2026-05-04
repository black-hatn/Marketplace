import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Globe, Sparkles, ShieldCheck, Heart, Share2, MapPin } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Metadata } from 'next';
import { incrementBrandViews } from '@/lib/actions';

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

  // Increment views
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-700 pb-12 sm:pb-20">
      <div className="relative h-[50vh] sm:h-[60vh] min-h-[350px] sm:min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover scale-105 blur-sm brightness-[0.3] dark:brightness-[0.2]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-50 dark:to-slate-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] h-full px-4 sm:px-6 flex flex-col justify-end pb-8 sm:pb-12 lg:pb-20">
          <Link href="/marques" className="mb-6 sm:mb-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Retour aux marques
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 sm:gap-10">
            <div className="relative h-28 w-28 sm:h-40 sm:w-40 lg:h-56 lg:w-56 flex-shrink-0 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-white/10 backdrop-blur-xl ring-1 ring-white/20">
              <Image src={brand.image} alt={brand.name} fill className="object-cover" sizes="(max-width: 640px) 112px, (max-width: 1024px) 160px, 224px" />
            </div>
            
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  <ShieldCheck className="inline h-3 w-3 mr-1" /> Marque Vérifiée
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                  Membre depuis 2024
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase italic">
                {brand.name}<span className="text-cyan-500">.</span>
              </h1>
              <p className="text-base sm:text-xl lg:text-2xl text-cyan-400 font-bold italic tracking-wide">{brand.tagline}</p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 lg:pb-4">
               <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
               </button>
               <button className="h-12 px-5 sm:h-14 sm:px-8 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                  Suivre la marque
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-[1600px] px-4 sm:px-6 mt-8 sm:mt-12 grid gap-8 sm:gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-16">
          <div className="bg-white dark:bg-slate-900/50 p-8 lg:p-12 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-cyan-500 rounded-full" />
              <h2 className="text-2xl font-black uppercase tracking-tight italic">L'Âme de la Marque</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-cyan-500">
                {brand.story || brand.description}
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-end justify-between border-b border-black/5 dark:border-white/10 pb-6">
              <h2 className="text-3xl font-black tracking-tighter italic">Le Catalogue <span className="text-cyan-600">Premium</span></h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{serializedProducts.length} ARTICLES EN LIGNE</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {serializedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {serializedProducts.length === 0 && (
              <div className="py-20 text-center glass-card rounded-[3rem]">
                <Sparkles className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest">Bientôt de nouveaux arrivages...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-60">Performances Globales</h3>
            <div className="grid grid-cols-2 gap-8 relative z-10">
               <div>
                  <p className="text-3xl font-black italic">{brand.views}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Vues Totales</p>
               </div>
               <div>
                  <p className="text-3xl font-black italic">{serializedProducts.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Produits</p>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-cyan-600" />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base de la Marque</p>
                  <p className="font-black text-slate-900 dark:text-white">N'Djaména, Tchad</p>
               </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Valeurs Fondamentales</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{brand.values}</p>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Impact Social</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{brand.impact}</p>
               </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -bottom-4 h-24 w-24 opacity-20 group-hover:scale-125 transition-transform duration-500" />
            <h3 className="text-xl font-black mb-2 relative z-10">Boutique Officielle</h3>
            <p className="text-sm text-white/80 leading-relaxed relative z-10">Tous les produits sont certifiés authentiques et proviennent directement du créateur.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
