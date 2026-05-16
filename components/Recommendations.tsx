import { getRecommendedProducts } from '@/lib/actions';
import { ProductCard } from './ProductCard';

export async function Recommendations({ productId }: { productId: string }) {
  const recommendations = await getRecommendedProducts(productId);

  if (recommendations.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {recommendations.map((product: any) => (
        <ProductCard key={product.id} product={product as any} />
      ))}
    </div>
  );
}
