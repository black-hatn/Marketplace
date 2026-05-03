import dynamicImport from 'next/dynamic';
import PageTransition from '@/components/PageTransition';
// Force rebuild to clear Prisma stale cache
import { SearchHero } from '@/components/SearchHero';
import { BentoGrid } from '@/components/BentoGrid';
import { SmartFilterSidebar } from '@/components/SmartFilterSidebar';
import { TrustSection } from '@/components/TrustSection';
import { ProductShowcase } from '@/components/ProductShowcase';
import { StorySection } from '@/components/StorySection';
import { BrandShowcase } from '@/components/BrandShowcase';
import { prisma } from '@/lib/db';

const ThreePlaceholder = dynamicImport(() => import('@/components/ThreePlaceholder').then(mod => mod.ThreePlaceholder), {
  ssr: false,
  loading: () => <div className="glass-card h-96 w-full animate-pulse bg-slate-900/50 rounded-[2rem]" />
});

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [brands, products, brandsCount, productsCount] = await Promise.all([
    prisma.brand.findMany({ take: 4 }),
    prisma.product.findMany({
      take: 4,
      include: { brand: true, category: true }
    }),
    prisma.brand.count(),
    prisma.product.count()
  ]);
  
  const serializedProducts = products.map((p: any) => ({
    ...p,
    category: p.category.name,
    vendor: p.brand.name,
  }));
  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.07] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-6 space-y-12 py-10 lg:py-20">
          
          {/* Hero Section */}
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <SearchHero />
            <div className="hidden lg:block h-[500px]">
              <ThreePlaceholder />
            </div>
          </section>

          {/* Social Proof Stats Banner */}
          <section className="glass-card rounded-[2.5rem] p-8 border border-black/5 dark:border-white/10 flex flex-wrap justify-center gap-12 sm:gap-24">
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">{brandsCount * 3 + 15}+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Boutiques Officielles</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-2">{productsCount * 5 + 120}+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Produits Premium</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">12</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Villes Couvertes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-2">24/7</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Support Client</p>
            </div>
          </section>

          {/* Main Experience Grid */}
          <section className="grid gap-10 lg:grid-cols-[340px_1fr] xl:gap-16">
            <SmartFilterSidebar />
            
            <div className="space-y-20">
              {/* Trends Section */}
              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-black/5 dark:border-white/10 pb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      Live Exploration
                    </div>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                      Tendances Immersives.
                    </h2>
                  </div>
                  <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 text-right italic">
                    "L'innovation n'est pas seulement technologique, elle est aussi visuelle et sensorielle."
                  </p>
                </div>
                <BentoGrid />
              </div>

              {/* Content Sections */}
              <div className="space-y-24">
                <TrustSection />
                <div className="space-y-12">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Notre Écosystème de Marques</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Découvrez les créateurs qui repoussent les limites de leur secteur avec passion et intégrité.</p>
                  </div>
                  <BrandShowcase brands={brands} />
                </div>
                <StorySection />
                <div className="space-y-12">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sélection en Vedette</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Une curation rigoureuse des produits les plus marquants de la saison.</p>
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
