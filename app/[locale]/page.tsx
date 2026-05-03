import dynamicImport from 'next/dynamic';
import PageTransition from '@/components/PageTransition';
import { SearchHero } from '@/components/SearchHero';
import { BentoGrid } from '@/components/BentoGrid';
import { SmartFilterSidebar } from '@/components/SmartFilterSidebar';
import { TrustSection } from '@/components/TrustSection';
import { ProductShowcase } from '@/components/ProductShowcase';
import { StorySection } from '@/components/StorySection';
import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';

const ThreePlaceholder = dynamicImport(() => import('@/components/ThreePlaceholder').then(mod => mod.ThreePlaceholder), {
  ssr: false,
  loading: () => <div className="glass-card h-96 w-full animate-pulse bg-slate-900/50 rounded-[2rem]" />
});

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('Home');
  
  // On récupère les données depuis les nouvelles tables "Produit" et "Client"
  const [produits, produitsCount, clientsCount] = await Promise.all([
    prisma.produit.findMany({
      take: 8,
      where: { actif: true }
    }),
    prisma.produit.count(),
    prisma.client.count()
  ]);
  
  // Adaptation des données pour les composants d'affichage
  const serializedProducts = produits.map((p: any) => ({
    id: p.id,
    title: p.nom,
    price: Number(p.prix_ttc),
    image: p.images[0] || '/placeholder.png',
    category: p.categories[0] || 'Général',
    vendor: 'Immersive Pro',
    stock: p.stock
  }));

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.07] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-6 space-y-12 py-10 lg:py-20">
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <SearchHero />
            <div className="hidden lg:block h-[500px]">
              <ThreePlaceholder />
            </div>
          </section>

          {/* Stats Section */}
          <section className="glass-card rounded-[2.5rem] p-8 border border-black/5 dark:border-white/10 flex flex-wrap justify-center gap-12 sm:gap-24">
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">{clientsCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Membres Actifs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-2">{produitsCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('premium_products')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">12</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('cities_covered')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-2">24/7</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('customer_support')}</p>
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[1fr] xl:gap-16">
            <div className="space-y-20">
              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-black/5 dark:border-white/10 pb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      Live Exploration
                    </div>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                      {t('trends_title')}
                    </h2>
                  </div>
                  <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 text-right italic">
                    {t('innovation_quote')}
                  </p>
                </div>
                <BentoGrid />
              </div>

              <div className="space-y-24">
                <TrustSection />
                <StorySection />
                <div className="space-y-12">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('featured_selection_title')}</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">{t('featured_selection_desc')}</p>
                  </div>
                  <ProductShowcase products={serializedProducts} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
