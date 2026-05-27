/**
 * Seed de données de démonstration — Immersive Marketplace
 * Exécuter avec : npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...\n');

  // ─── NETTOYAGE (ordre respectant les FK) ────────────────────────────────
  await prisma.review.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.variante.deleteMany();
  await prisma.ligneCommande.deleteMany().catch(() => {});
  await prisma.lignePanier.deleteMany().catch(() => {});
  await prisma.paiement.deleteMany().catch(() => {});
  await prisma.commande.deleteMany().catch(() => {});
  await prisma.panier.deleteMany().catch(() => {});
  await prisma.notification.deleteMany();
  await prisma.produit.deleteMany();
  await prisma.category.deleteMany();
  await prisma.withdrawalRequest.deleteMany().catch(() => {});
  await prisma.wallet.deleteMany().catch(() => {});
  await prisma.brand.deleteMany();
  await prisma.client.deleteMany();
  console.log('🗑️  Tables nettoyées\n');

  // ─── CATÉGORIES ─────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Électronique', description: 'Smartphones, laptops, accessoires tech' } }),
    prisma.category.create({ data: { name: 'Mode & Vêtements', description: 'Vêtements et accessoires de mode' } }),
    prisma.category.create({ data: { name: 'Beauté & Bien-être', description: 'Soins, cosmétiques, parfums' } }),
    prisma.category.create({ data: { name: 'Alimentation', description: 'Produits alimentaires locaux et importés' } }),
    prisma.category.create({ data: { name: 'Maison & Déco', description: 'Mobilier, décoration, électroménager' } }),
  ]);
  console.log(`✅ ${categories.length} catégories créées`);

  // ─── MARQUES VENDEURS ────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Demo2024!', 10);

  const techBrand = await prisma.brand.create({
    data: {
      slug: 'tchad-tech',
      name: 'Tchad Tech',
      title: 'Leader Technologique au Tchad',
      tagline: 'Innovation & Excellence Numérique',
      description: 'Fournisseur officiel de produits tech premium pour le marché tchadien et africain.',
      story: 'Fondée en 2020 à N\'Djaména, Tchad Tech a pour mission de démocratiser l\'accès à la technologie premium en Afrique centrale.',
      values: 'Innovation, Qualité, Service client d\'excellence',
      impact: '+5000 clients satisfaits, 3 villes couvertes',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80',
      email: 'contact@tchad-tech.td',
      password: hashedPassword,
      phone: '+235 60 00 00 01',
      airtelMoney: '+235 60 00 00 01',
      isVerified: true,
      themeColor: '#6366f1',
    },
  });

  const modeBrand = await prisma.brand.create({
    data: {
      slug: 'sahel-mode',
      name: 'Sahel Mode',
      title: 'La Mode Africaine au Sommet',
      tagline: 'Élégance Africaine Contemporaine',
      description: 'Collections exclusives alliant tradition africaine et tendances mondiales.',
      story: 'Sahel Mode célèbre la richesse textile de l\'Afrique en créant des pièces uniques qui traversent les frontières.',
      values: 'Authenticité, Artisanat, Durabilité',
      impact: 'Support de 30 artisans locaux tchadiens',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
      email: 'hello@sahel-mode.td',
      password: hashedPassword,
      phone: '+235 60 00 00 02',
      moovMoney: '+235 60 00 00 02',
      isVerified: true,
      themeColor: '#f59e0b',
    },
  });

  const beautyBrand = await prisma.brand.create({
    data: {
      slug: 'ndjamena-beauty',
      name: "N'Djaména Beauty",
      title: 'Votre Beauté, Notre Passion',
      tagline: 'Cosmétiques Naturels d\'Afrique',
      description: 'Cosmétiques naturels formulés avec des ingrédients africains authentiques.',
      story: 'Née d\'une passion pour les remèdes naturels traditionnels, N\'Djaména Beauty propose des soins clean beauty.',
      values: 'Naturalité, Efficacité, Respect de la peau',
      impact: 'Zéro ingrédient chimique agressif, emballages recyclables',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=80',
      email: 'contact@ndjamena-beauty.td',
      password: hashedPassword,
      phone: '+235 60 00 00 03',
      airtelMoney: '+235 60 00 00 03',
      isVerified: true,
      themeColor: '#ec4899',
    },
  });

  console.log('✅ 3 marques créées');

  // ─── PORTEFEUILLES VENDEURS ──────────────────────────────────────────────
  await Promise.all([
    prisma.wallet.create({ data: { brandId: techBrand.id, balance: 485000 } }),
    prisma.wallet.create({ data: { brandId: modeBrand.id, balance: 127500 } }),
    prisma.wallet.create({ data: { brandId: beautyBrand.id, balance: 63000 } }),
  ]);
  console.log('✅ Portefeuilles créés');

  // ─── PRODUITS ────────────────────────────────────────────────────────────
  const produits = await Promise.all([
    // TECH
    prisma.produit.create({ data: {
      sku: 'TECH-SP-001',
      nom: 'Samsung Galaxy A54 5G',
      description: 'Smartphone 5G avec écran Super AMOLED 6.4", caméra 50MP, batterie 5000mAh. Le meilleur rapport qualité-prix du marché africain.',
      prix_ht: 185000, tva: 18, prix_ttc: 218300,
      stock: 25, categories: ['Électronique'],
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
               'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
      brandId: techBrand.id, categoryId: categories[0].id,
      rating: 4.8, reviews: 3, threeDStyle: 'phone',
    }}),
    prisma.produit.create({ data: {
      sku: 'TECH-LP-002',
      nom: 'Laptop Lenovo IdeaPad 3',
      description: 'Ordinateur portable Intel Core i5, 8GB RAM, SSD 512GB, écran 15.6" FHD. Idéal pour les étudiants et professionnels.',
      prix_ht: 320000, tva: 18, prix_ttc: 377600,
      stock: 12, categories: ['Électronique'],
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
      brandId: techBrand.id, categoryId: categories[0].id,
      rating: 4.6, reviews: 2, threeDStyle: 'cube',
    }}),
    prisma.produit.create({ data: {
      sku: 'TECH-TW-003',
      nom: 'Écouteurs TWS Pro',
      description: 'Écouteurs True Wireless avec réduction de bruit active (ANC), autonomie 30h, résistance à l\'eau IPX5.',
      prix_ht: 25000, tva: 18, prix_ttc: 29500,
      stock: 50, categories: ['Électronique'],
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
      brandId: techBrand.id, categoryId: categories[0].id,
      rating: 4.5, reviews: 1, threeDStyle: 'torus',
    }}),
    // MODE
    prisma.produit.create({ data: {
      sku: 'MODE-BOU-001',
      nom: 'Boubou Grand Bazin Royal',
      description: 'Boubou traditionnel en tissu Grand Bazin de qualité supérieure, broderies artisanales faites main. Disponible en bleu royal et blanc cassé.',
      prix_ht: 45000, tva: 18, prix_ttc: 53100,
      stock: 15, categories: ['Mode & Vêtements'],
      images: ['https://images.unsplash.com/photo-1519671282429-b8d31a4fbc7b?w=800&q=80'],
      brandId: modeBrand.id, categoryId: categories[1].id,
      rating: 4.9, reviews: 2, threeDStyle: 'cube',
    }}),
    prisma.produit.create({ data: {
      sku: 'MODE-SAC-002',
      nom: 'Sac Cuir Artisanal',
      description: 'Sac à main en cuir véritable tanné localement, coutures renforcées, doublure en coton. Pièce unique fabriquée par nos artisans de N\'Djaména.',
      prix_ht: 38000, tva: 18, prix_ttc: 44840,
      stock: 8, categories: ['Mode & Vêtements'],
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
      brandId: modeBrand.id, categoryId: categories[1].id,
      rating: 4.7, reviews: 1,
    }}),
    // BEAUTÉ
    prisma.produit.create({ data: {
      sku: 'BEAU-CR-001',
      nom: 'Crème Karité & Argan',
      description: 'Crème hydratante intense formulée avec 40% de beurre de karité pur du Burkina et huile d\'argan du Maroc. Sans parabène, sans sulfate.',
      prix_ht: 8500, tva: 18, prix_ttc: 10030,
      stock: 100, categories: ['Beauté & Bien-être'],
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'],
      brandId: beautyBrand.id, categoryId: categories[2].id,
      rating: 4.8, reviews: 2, threeDStyle: 'sphere',
    }}),
    prisma.produit.create({ data: {
      sku: 'BEAU-PA-002',
      nom: 'Parfum Désert d\'Or',
      description: 'Eau de parfum inspirée des épices du Sahel. Notes de tête : bergamote & cardamome. Cœur : rose & oud. Fond : ambre & vanille.',
      prix_ht: 22000, tva: 18, prix_ttc: 25960,
      stock: 30, categories: ['Beauté & Bien-être'],
      images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80'],
      brandId: beautyBrand.id, categoryId: categories[2].id,
      rating: 4.9, reviews: 1,
    }}),
  ]);
  console.log(`✅ ${produits.length} produits créés`);

  // ─── VARIANTES ───────────────────────────────────────────────────────────
  await Promise.all([
    prisma.variante.create({ data: { produit_id: produits[0].id, nom: 'Couleur', valeur: 'Noir Carbone', stock: 10, sku_suffix: '-BLK' } }),
    prisma.variante.create({ data: { produit_id: produits[0].id, nom: 'Couleur', valeur: 'Lavande', stock: 15, sku_suffix: '-LAV' } }),
    prisma.variante.create({ data: { produit_id: produits[3].id, nom: 'Taille', valeur: 'S', stock: 5, sku_suffix: '-S' } }),
    prisma.variante.create({ data: { produit_id: produits[3].id, nom: 'Taille', valeur: 'M', stock: 7, sku_suffix: '-M' } }),
    prisma.variante.create({ data: { produit_id: produits[3].id, nom: 'Taille', valeur: 'L', stock: 3, sku_suffix: '-L' } }),
  ]);
  console.log('✅ Variantes créées');

  // ─── CLIENTS ────────────────────────────────────────────────────────────
  const clientHash = await bcrypt.hash('Client2024!', 10);
  const clients = await Promise.all([
    prisma.client.create({ data: {
      email: 'amina.hassan@email.td', mot_de_passe_hash: clientHash,
      nom: 'Hassan', prenom: 'Amina', telephone: '+235 66 11 22 33', role: 'CLIENT',
    }}),
    prisma.client.create({ data: {
      email: 'ibrahim.moussa@email.td', mot_de_passe_hash: clientHash,
      nom: 'Moussa', prenom: 'Ibrahim', telephone: '+235 66 44 55 66', role: 'CLIENT',
    }}),
    prisma.client.create({ data: {
      email: 'fatima.ali@email.td', mot_de_passe_hash: clientHash,
      nom: 'Ali', prenom: 'Fatima', telephone: '+235 66 77 88 99', role: 'CLIENT',
    }}),
  ]);
  console.log(`✅ ${clients.length} clients créés`);

  // ─── AVIS PRODUITS ──────────────────────────────────────────────────────
  await Promise.all([
    prisma.review.create({ data: {
      produit_id: produits[0].id, clientId: clients[0].id,
      rating: 5, userName: 'Amina H.',
      comment: 'Excellent smartphone ! La caméra est incroyable, les photos sont d\'une netteté parfaite même la nuit. Livraison très rapide, emballage soigné.',
    }}),
    prisma.review.create({ data: {
      produit_id: produits[0].id, clientId: clients[1].id,
      rating: 5, userName: 'Ibrahim M.',
      comment: 'Très satisfait de cet achat. La batterie tient facilement 2 jours. Le 5G est vraiment rapide. Je recommande vivement !',
      reply: 'Merci Ibrahim pour ce retour positif ! N\'hésitez pas à nous contacter pour tout besoin. 🙏',
    }}),
    prisma.review.create({ data: {
      produit_id: produits[3].id, clientId: clients[0].id,
      rating: 5, userName: 'Amina H.',
      comment: 'La qualité du tissu est exceptionnelle, exactement comme sur les photos. Les broderies sont magnifiques. Je l\'ai porté à un mariage, j\'ai eu beaucoup de compliments !',
    }}),
    prisma.review.create({ data: {
      produit_id: produits[5].id, clientId: clients[2].id,
      rating: 5, userName: 'Fatima A.',
      comment: 'Crème vraiment efficace ! Ma peau est transformée en 2 semaines. L\'odeur est délicate et naturelle. Je rachète dès que possible !',
    }}),
    prisma.review.create({ data: {
      produit_id: produits[1].id, clientId: clients[2].id,
      rating: 4, userName: 'Fatima A.',
      comment: 'Très bon laptop, rapide et fiable. Petit bémol sur l\'autonomie de la batterie (environ 5h). Sinon parfait pour le travail.',
    }}),
  ]);
  console.log('✅ Avis créés');

  // ─── COUPONS ────────────────────────────────────────────────────────────
  const inOneYear = new Date();
  inOneYear.setFullYear(inOneYear.getFullYear() + 1);

  await Promise.all([
    prisma.coupon.create({ data: {
      code: 'DEMO20', discount: 20, type: 'PERCENTAGE',
      expiresAt: inOneYear, maxUses: 100, brandId: techBrand.id,
    }}),
    prisma.coupon.create({ data: {
      code: 'BIENVENUE', discount: 5000, type: 'FIXED',
      expiresAt: inOneYear, maxUses: 50, brandId: modeBrand.id,
    }}),
    prisma.coupon.create({ data: {
      code: 'BEAUTY10', discount: 10, type: 'PERCENTAGE',
      expiresAt: inOneYear, maxUses: null, brandId: beautyBrand.id,
    }}),
  ]);
  console.log('✅ Coupons créés (DEMO20, BIENVENUE, BEAUTY10)');

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
  await Promise.all([
    prisma.notification.create({ data: {
      brandId: techBrand.id, type: 'ORDER',
      title: 'Nouvelle commande reçue !',
      message: 'Une nouvelle commande CMD-1716000001 vient d\'être passée pour vos produits.',
    }}),
    prisma.notification.create({ data: {
      brandId: modeBrand.id, type: 'REVIEW',
      title: 'Nouvel avis client',
      message: 'Amina H. a laissé une note de 5/5 sur Boubou Grand Bazin Royal.',
    }}),
  ]);
  console.log('✅ Notifications créées');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('─────────────────────────────────────────');
  console.log('📊 Résumé :');
  console.log(`   • ${categories.length} catégories`);
  console.log(`   • 3 marques vérifiées`);
  console.log(`   • ${produits.length} produits avec variantes`);
  console.log(`   • ${clients.length} clients de démo`);
  console.log(`   • 5 avis produits`);
  console.log(`   • 3 coupons actifs : DEMO20, BIENVENUE, BEAUTY10`);
  console.log('─────────────────────────────────────────');
  console.log('🌐 Site : https://marketplacetd.vercel.app/fr');
}

main()
  .catch((e) => { console.error('❌ Erreur seed :', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
