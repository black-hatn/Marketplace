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
  const products = await prisma.produit.findMany({
    where: { actif: true },
    orderBy: { date_creation: 'desc' },
    take: 100,
    include: {
      brand: true,
      category: true,
    },
  });

  const serializedProducts = products.map((p: any) => ({
    id: p.id,
    title: p.nom,
    price: Number(p.prix_ttc),
    image: p.images[0] || '/placeholder.png',
    category: p.category?.name || 'Général',
    vendor: p.brand?.name || 'Immersive',
    stock: p.stock,
    rating: p.rating,
    reviews: p.reviews,
    badge: null,
    tagline: p.description.slice(0, 50) + '...',
    href: `/produit/${p.id}`,
    city: "N'Djaména"
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
