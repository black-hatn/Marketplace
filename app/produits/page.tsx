import { prisma } from '@/lib/db';
import ProductsClient from '@/components/ProductsClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/components/Skeletons';

export const metadata: Metadata = {
  title: 'Tous les produits | Plateforme Immersive',
  description: 'Découvrez notre catalogue complet de produits premium.',
};

export const dynamic = 'force-dynamic';

async function ProductsList() {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
    },
  });

  const serializedProducts = products.map((p: any) => ({
    ...p,
    category: p.category.name,
    vendor: p.brand.name,
  }));

  return <ProductsClient initialProducts={serializedProducts} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12"><ProductGridSkeleton count={8} /></div>}>
      <ProductsList />
    </Suspense>
  );
}
