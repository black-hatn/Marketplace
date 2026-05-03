import { prisma } from '../lib/db';
import { brands, featuredProducts } from '../lib/content';

async function main() {
  console.log('Seed started...');

  // 1. Create Brands
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        name: b.name,
        title: b.title,
        tagline: b.tagline,
        description: b.description,
        story: b.story,
        values: b.values,
        impact: b.impact,
        image: b.image,
        email: `${b.slug}@immersive.pro`,
        password: "password123", // Simplifié
      },
    });
  }

  // 2. Create Products
  for (const p of featuredProducts) {
    const brand = await prisma.brand.findFirst({
      where: { name: p.vendor },
    });

    if (brand) {
      await prisma.produit.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          sku: `SKU-${p.id}`,
          nom: p.title,
          description: p.tagline || p.title,
          prix_ht: p.price / 1.18,
          tva: 18,
          prix_ttc: p.price,
          stock: 100,
          images: [p.image],
          categories: [p.category],
          rating: p.rating,
          reviews: p.reviews,
          brandId: brand.id,
        },
      });
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
