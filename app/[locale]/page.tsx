import { prisma } from '@/lib/db';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let produits = [];
  let produitsCount = 0;
  let clientsCount = 0;

  try {
    const results = await Promise.all([
      prisma.produit.findMany({
        take: 8,
        where: { actif: true }
      }),
      prisma.produit.count(),
      prisma.client.count()
    ]);
    produits = results[0];
    produitsCount = results[1];
    clientsCount = results[2];
  } catch (error) {
    console.error("Database connection error:", error);
  }
  
  // Adaptation des données
  const serializedProducts = produits.map((p: any) => ({
    id: p.id,
    title: p.nom,
    price: Number(p.prix_ttc),
    image: p.images && p.images.length > 0 ? p.images[0] : '/placeholder.png',
    category: p.categories && p.categories.length > 0 ? p.categories[0] : 'Général',
    vendor: 'Boutique Premium',
    stock: p.stock
  }));

  return <HomePageClient products={serializedProducts} clientsCount={clientsCount} produitsCount={produitsCount} />;
}
