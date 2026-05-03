import { getRecommendedProducts } from '@/lib/actions';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

export async function Recommendations({ productId }: { productId: string }) {
  const recommendations = await getRecommendedProducts(productId);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-16 border-t border-black/5 dark:border-white/10">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-cyan-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vous aimerez aussi</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sélectionnés spécialement pour vous selon vos préférences.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product: any) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </section>
  );
}
