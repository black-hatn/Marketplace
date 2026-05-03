import { prisma } from '../lib/db';
import { brands, featuredProducts } from '../lib/content';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seed started...');

  const hashedDefaultPassword = await bcrypt.hash("password123", 10);

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
        email: `${b.slug}@example.com`,
        password: hashedDefaultPassword,
      },
    });
  }

  // 2. Create Categories & Products
  for (const p of featuredProducts) {
    const category = await prisma.category.upsert({
      where: { name: p.category },
      update: {},
      create: { name: p.category },
    });

    const brand = await prisma.brand.findFirst({
      where: { name: p.vendor },
    });

    if (brand) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          title: p.title,
          price: p.price,
          rating: p.rating,
          reviews: p.reviews,
          badge: p.badge,
          tagline: p.tagline,
          image: p.image,
          href: p.href,
          categoryId: category.id,
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
