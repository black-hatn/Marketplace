import { prisma } from '@/lib/db';
import HomePageClient from '@/components/HomePageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// F — Métadonnées spécifiques à la page d'accueil
export const metadata: Metadata = {
  title: 'Immersive — Marketplace Premium au Tchad',
  description:
    "Découvrez l'avenir du e-commerce au Tchad. Produits premium, marques locales et internationales, livraison rapide depuis N'Djaména.",
  openGraph: {
    title: 'Immersive — Marketplace Premium au Tchad',
    description:
      "Produits premium, marques locales et internationales. Livraison rapide depuis N'Djaména pour toute l'Afrique.",
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Immersive Marketplace — Tchad',
      },
    ],
  },
  alternates: {
    canonical: '/',
    languages: { fr: '/', en: '/en', ar: '/ar' },
  },
};

export default async function HomePage() {
  let produits: any[] = [];
  let produitsCount = 0;
  let clientsCount = 0;

  try {
    const results = await Promise.all([
      prisma.produit.findMany({
        take: 8,
        where: { actif: true },
        include: { brand: true }
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
    vendor: p.brand?.name || 'Boutique Premium',
    stock: p.stock
  }));

  return <HomePageClient products={serializedProducts} clientsCount={clientsCount} produitsCount={produitsCount} />;
}
