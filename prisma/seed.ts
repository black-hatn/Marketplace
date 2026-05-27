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
  const categoriesData = [
    { name: 'Électronique', description: 'Smartphones, laptops, accessoires tech' },
    { name: 'Mode & Vêtements', description: 'Vêtements et accessoires de mode' },
    { name: 'Beauté & Bien-être', description: 'Soins, cosmétiques, parfums' },
    { name: 'Alimentation', description: 'Produits alimentaires locaux et importés' },
    { name: 'Maison & Déco', description: 'Mobilier, décoration, électroménager' },
  ];
  const categories = [];
  for (const data of categoriesData) {
    categories.push(await prisma.category.create({ data }));
  }
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
      values: 'Innovation, Qualité, Service client',
      impact: '+5000 clients satisfaits, 3 villes couvertes',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80',
      email: 'contact@tchad-tech.td',
      password: hashedPassword,
      phone: '+235 60 00 00 01',
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
      story: 'Sahel Mode célèbre la richesse textile de l\'Afrique en créant des pièces uniques.',
      values: 'Authenticité, Artisanat, Durabilité',
      impact: 'Support de 30 artisans locaux tchadiens',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
      email: 'hello@sahel-mode.td',
      password: hashedPassword,
      phone: '+235 60 00 00 02',
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
      description: 'Cosmétiques naturels formulés avec des ingrédients africains.',
      story: 'Née d\'une passion pour les remèdes naturels traditionnels.',
      values: 'Naturalité, Efficacité',
      impact: 'Zéro ingrédient chimique agressif, emballages recyclables',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=80',
      email: 'contact@ndjamena-beauty.td',
      password: hashedPassword,
      phone: '+235 60 00 00 03',
      isVerified: true,
      themeColor: '#ec4899',
    },
  });

  const foodBrand = await prisma.brand.create({
    data: {
      slug: 'saveurs-afrique',
      name: "Saveurs d'Afrique",
      title: 'Le meilleur du terroir',
      tagline: 'Authenticité & Goût',
      description: 'Produits alimentaires locaux et épices d\'exception.',
      story: 'Valoriser les produits agricoles locaux en proposant une qualité supérieure.',
      values: 'Local, Bio, Équitable',
      impact: 'Coopératives agricoles soutenues dans 5 régions',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80',
      email: 'contact@saveurs-afrique.td',
      password: hashedPassword,
      phone: '+235 60 00 00 04',
      isVerified: true,
      themeColor: '#10b981',
    },
  });

  const homeBrand = await prisma.brand.create({
    data: {
      slug: 'deco-tchad',
      name: "Déco Tchad",
      title: 'L\'Art de vivre',
      tagline: 'Meubles et Décoration premium',
      description: 'Mobilier moderne et artisanat pour embellir votre intérieur.',
      story: 'Des artisans menuisiers et décorateurs locaux au service de votre maison.',
      values: 'Design, Confort, Robustesse',
      impact: '100% bois certifié et éco-responsable',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80',
      email: 'hello@deco-tchad.td',
      password: hashedPassword,
      phone: '+235 60 00 00 05',
      isVerified: true,
      themeColor: '#8b5cf6',
    },
  });

  console.log('✅ 5 marques créées');

  // ─── PORTEFEUILLES VENDEURS ──────────────────────────────────────────────
  for (const data of [
    { brandId: techBrand.id, balance: 485000 },
    { brandId: modeBrand.id, balance: 127500 },
    { brandId: beautyBrand.id, balance: 63000 },
    { brandId: foodBrand.id, balance: 35000 },
    { brandId: homeBrand.id, balance: 890000 },
  ]) {
    await prisma.wallet.create({ data });
  }
  console.log('✅ Portefeuilles créés');

  // ─── PRODUITS (40+) ────────────────────────────────────────────────────────
  const productData = [
    // --- TECH (10 produits) ---
    { sku: 'TECH-SP-001', nom: 'Samsung Galaxy A54 5G', prix_ht: 185000, stock: 25, brandId: techBrand.id, catId: categories[0].id, rating: 4.8, reviews: 15, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'] },
    { sku: 'TECH-LP-002', nom: 'Laptop Lenovo IdeaPad 3', prix_ht: 320000, stock: 12, brandId: techBrand.id, catId: categories[0].id, rating: 4.6, reviews: 8, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'] },
    { sku: 'TECH-TW-003', nom: 'Écouteurs TWS Pro ANC', prix_ht: 25000, stock: 50, brandId: techBrand.id, catId: categories[0].id, rating: 4.5, reviews: 22, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'] },
    { sku: 'TECH-WA-004', nom: 'Smartwatch Ultra Pro', prix_ht: 45000, stock: 30, brandId: techBrand.id, catId: categories[0].id, rating: 4.3, reviews: 10, images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'] },
    { sku: 'TECH-TV-005', nom: 'Smart TV Samsung 55" 4K', prix_ht: 450000, stock: 8, brandId: techBrand.id, catId: categories[0].id, rating: 4.9, reviews: 5, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80'] },
    { sku: 'TECH-TB-006', nom: 'iPad Air M1 64GB', prix_ht: 420000, stock: 15, brandId: techBrand.id, catId: categories[0].id, rating: 4.8, reviews: 12, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'] },
    { sku: 'TECH-SP-007', nom: 'iPhone 13 Pro 128GB', prix_ht: 650000, stock: 10, brandId: techBrand.id, catId: categories[0].id, rating: 4.9, reviews: 20, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'] },
    { sku: 'TECH-CM-008', nom: 'Appareil Photo Sony Alpha 7', prix_ht: 1200000, stock: 4, brandId: techBrand.id, catId: categories[0].id, rating: 5.0, reviews: 3, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'] },
    { sku: 'TECH-CO-009', nom: 'Console PlayStation 5', prix_ht: 550000, stock: 6, brandId: techBrand.id, catId: categories[0].id, rating: 4.8, reviews: 18, images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80'] },
    { sku: 'TECH-RO-010', nom: 'Routeur Wi-Fi 6 TP-Link', prix_ht: 35000, stock: 40, brandId: techBrand.id, catId: categories[0].id, rating: 4.4, reviews: 7, images: ['https://images.unsplash.com/photo-1614064010892-3489b03cbab6?w=800&q=80'] },

    // --- MODE (10 produits) ---
    { sku: 'MODE-BOU-001', nom: 'Boubou Grand Bazin Royal', prix_ht: 45000, stock: 15, brandId: modeBrand.id, catId: categories[1].id, rating: 4.9, reviews: 11, images: ['https://images.unsplash.com/photo-1519671282429-b8d31a4fbc7b?w=800&q=80'] },
    { sku: 'MODE-SAC-002', nom: 'Sac Cuir Artisanal Premium', prix_ht: 38000, stock: 8, brandId: modeBrand.id, catId: categories[1].id, rating: 4.7, reviews: 6, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'] },
    { sku: 'MODE-RBE-003', nom: 'Robe de Soirée Élégance', prix_ht: 65000, stock: 12, brandId: modeBrand.id, catId: categories[1].id, rating: 4.8, reviews: 4, images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80'] },
    { sku: 'MODE-CSM-004', nom: 'Costume Homme Sur-Mesure', prix_ht: 85000, stock: 10, brandId: modeBrand.id, catId: categories[1].id, rating: 4.9, reviews: 9, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'] },
    { sku: 'MODE-CHN-005', nom: 'Chaussures en Cuir Véritable', prix_ht: 32000, stock: 25, brandId: modeBrand.id, catId: categories[1].id, rating: 4.6, reviews: 14, images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'] },
    { sku: 'MODE-MON-006', nom: 'Montre Classique Or/Argent', prix_ht: 55000, stock: 18, brandId: modeBrand.id, catId: categories[1].id, rating: 4.5, reviews: 7, images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'] },
    { sku: 'MODE-LUN-007', nom: 'Lunettes de Soleil Aviator', prix_ht: 15000, stock: 40, brandId: modeBrand.id, catId: categories[1].id, rating: 4.4, reviews: 20, images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'] },
    { sku: 'MODE-CHT-008', nom: 'Chemisier en Soie Blanche', prix_ht: 25000, stock: 20, brandId: modeBrand.id, catId: categories[1].id, rating: 4.7, reviews: 5, images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80'] },
    { sku: 'MODE-JE-009', nom: 'Jeans Denim Vintage', prix_ht: 18000, stock: 35, brandId: modeBrand.id, catId: categories[1].id, rating: 4.3, reviews: 16, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'] },
    { sku: 'MODE-CHM-010', nom: 'Chapeau Panama Estival', prix_ht: 12000, stock: 22, brandId: modeBrand.id, catId: categories[1].id, rating: 4.5, reviews: 3, images: ['https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&q=80'] },

    // --- BEAUTÉ (8 produits) ---
    { sku: 'BEAU-CR-001', nom: 'Crème Karité & Argan Bio', prix_ht: 8500, stock: 100, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.8, reviews: 35, images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'] },
    { sku: 'BEAU-PA-002', nom: 'Parfum Désert d\'Or', prix_ht: 22000, stock: 30, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.9, reviews: 21, images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80'] },
    { sku: 'BEAU-SER-003', nom: 'Sérum Anti-Âge Vitamine C', prix_ht: 15000, stock: 45, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.7, reviews: 19, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'] },
    { sku: 'BEAU-MAS-004', nom: 'Masque Purifiant Argile', prix_ht: 6500, stock: 60, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.6, reviews: 28, images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80'] },
    { sku: 'BEAU-HUI-005', nom: 'Huile de Ricin Pure', prix_ht: 5000, stock: 80, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.5, reviews: 40, images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80'] },
    { sku: 'BEAU-SAV-006', nom: 'Savon Noir Africain', prix_ht: 3500, stock: 150, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.9, reviews: 55, images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&q=80'] },
    { sku: 'BEAU-LEV-007', nom: 'Baume à Lèvres Karité', prix_ht: 2000, stock: 200, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.4, reviews: 15, images: ['https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80'] },
    { sku: 'BEAU-SHA-008', nom: 'Shampoing Doux Aloe Vera', prix_ht: 7000, stock: 75, brandId: beautyBrand.id, catId: categories[2].id, rating: 4.6, reviews: 22, images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'] },

    // --- ALIMENTATION (6 produits) ---
    { sku: 'ALIM-EPI-001', nom: 'Coffret Épices du Sahel', prix_ht: 12000, stock: 50, brandId: foodBrand.id, catId: categories[3].id, rating: 4.8, reviews: 18, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80'] },
    { sku: 'ALIM-CAF-002', nom: 'Café Arabica Torréfié', prix_ht: 8500, stock: 80, brandId: foodBrand.id, catId: categories[3].id, rating: 4.7, reviews: 25, images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80'] },
    { sku: 'ALIM-MIE-003', nom: 'Miel Pur de la Brousse', prix_ht: 9000, stock: 40, brandId: foodBrand.id, catId: categories[3].id, rating: 4.9, reviews: 30, images: ['https://images.unsplash.com/photo-1587049352847-4d4b126a71dc?w=800&q=80'] },
    { sku: 'ALIM-THE-004', nom: 'Thé Vert Menthe Traditionnel', prix_ht: 3500, stock: 120, brandId: foodBrand.id, catId: categories[3].id, rating: 4.6, reviews: 15, images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80'] },
    { sku: 'ALIM-DAT-005', nom: 'Dattes Deglet Nour Premium', prix_ht: 6000, stock: 90, brandId: foodBrand.id, catId: categories[3].id, rating: 4.8, reviews: 22, images: ['https://images.unsplash.com/photo-1601002379373-b3c9d81d2fb2?w=800&q=80'] },
    { sku: 'ALIM-CAC-006', nom: 'Chocolat Noir Artisanal 70%', prix_ht: 4500, stock: 65, brandId: foodBrand.id, catId: categories[3].id, rating: 4.7, reviews: 19, images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80'] },

    // --- MAISON & DÉCO (8 produits) ---
    { sku: 'MAIS-CAN-001', nom: 'Canapé Design 3 Places', prix_ht: 350000, stock: 5, brandId: homeBrand.id, catId: categories[4].id, rating: 4.9, reviews: 8, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'] },
    { sku: 'MAIS-LAM-002', nom: 'Lampe de Chevet Moderne', prix_ht: 25000, stock: 35, brandId: homeBrand.id, catId: categories[4].id, rating: 4.6, reviews: 12, images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'] },
    { sku: 'MAIS-TAP-003', nom: 'Tapis Berbère Authentique', prix_ht: 120000, stock: 10, brandId: homeBrand.id, catId: categories[4].id, rating: 4.8, reviews: 15, images: ['https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&q=80'] },
    { sku: 'MAIS-TAB-004', nom: 'Table Basse en Bois Massif', prix_ht: 85000, stock: 8, brandId: homeBrand.id, catId: categories[4].id, rating: 4.7, reviews: 9, images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80'] },
    { sku: 'MAIS-VA-005', nom: 'Vase en Céramique Artisanale', prix_ht: 18000, stock: 25, brandId: homeBrand.id, catId: categories[4].id, rating: 4.5, reviews: 6, images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'] },
    { sku: 'MAIS-MIR-006', nom: 'Miroir Mural Soleil', prix_ht: 32000, stock: 15, brandId: homeBrand.id, catId: categories[4].id, rating: 4.8, reviews: 11, images: ['https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=800&q=80'] },
    { sku: 'MAIS-DR-007', nom: 'Parure de Lit en Lin', prix_ht: 45000, stock: 20, brandId: homeBrand.id, catId: categories[4].id, rating: 4.6, reviews: 14, images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'] },
    { sku: 'MAIS-CHA-008', nom: 'Chaise de Salle à Manger Scandinave', prix_ht: 28000, stock: 40, brandId: homeBrand.id, catId: categories[4].id, rating: 4.4, reviews: 22, images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80'] },
  ];

  const produits: any[] = [];
  
  for (const prod of productData) {
    const created = await prisma.produit.create({
      data: {
        sku: prod.sku,
        nom: prod.nom,
        description: `Produit d'exception sélectionné par nos experts. ${prod.nom} allie qualité, esthétique et durabilité. Retrouvez ce classique incontournable de la catégorie chez notre partenaire privilégié.`,
        prix_ht: prod.prix_ht,
        tva: 18,
        prix_ttc: prod.prix_ht * 1.18,
        stock: prod.stock,
        categories: [categories.find(c => c.id === prod.catId)?.name || ''],
        images: prod.images,
        brandId: prod.brandId,
        categoryId: prod.catId,
        rating: prod.rating,
        reviews: prod.reviews,
      }
    });
    produits.push(created);
  }
  
  console.log(`✅ ${produits.length} produits créés avec succès`);

  // ─── VARIANTES ───────────────────────────────────────────────────────────
  for (const data of [
    { produit_id: produits[0].id, nom: 'Couleur', valeur: 'Noir Carbone', stock: 10, sku_suffix: '-BLK' },
    { produit_id: produits[0].id, nom: 'Couleur', valeur: 'Lavande', stock: 15, sku_suffix: '-LAV' },
    { produit_id: produits[10].id, nom: 'Taille', valeur: 'S', stock: 5, sku_suffix: '-S' },
    { produit_id: produits[10].id, nom: 'Taille', valeur: 'M', stock: 7, sku_suffix: '-M' },
    { produit_id: produits[10].id, nom: 'Taille', valeur: 'L', stock: 3, sku_suffix: '-L' },
  ]) {
    await prisma.variante.create({ data });
  }
  console.log('✅ Variantes créées');

  // ─── CLIENTS ────────────────────────────────────────────────────────────
  const clientHash = await bcrypt.hash('Client2024!', 10);
  const clientsData = [
    {
      email: 'amina.hassan@email.td', mot_de_passe_hash: clientHash,
      nom: 'Hassan', prenom: 'Amina', telephone: '+235 66 11 22 33', role: 'CLIENT' as const,
    },
    {
      email: 'ibrahim.moussa@email.td', mot_de_passe_hash: clientHash,
      nom: 'Moussa', prenom: 'Ibrahim', telephone: '+235 66 44 55 66', role: 'CLIENT' as const,
    },
    {
      email: 'fatima.ali@email.td', mot_de_passe_hash: clientHash,
      nom: 'Ali', prenom: 'Fatima', telephone: '+235 66 77 88 99', role: 'CLIENT' as const,
    },
    {
      email: 'jean.dupont@email.td', mot_de_passe_hash: clientHash,
      nom: 'Dupont', prenom: 'Jean', telephone: '+235 66 88 11 22', role: 'CLIENT' as const,
    },
  ];
  const clients = [];
  for (const data of clientsData) {
    clients.push(await prisma.client.create({ data }));
  }
  console.log(`✅ ${clients.length} clients créés`);

  // ─── AVIS PRODUITS ──────────────────────────────────────────────────────
  for (const data of [
    {
      produit_id: produits[0].id, clientId: clients[0].id,
      rating: 5, userName: 'Amina H.',
      comment: 'Excellent smartphone ! La caméra est incroyable, les photos sont d\'une netteté parfaite même la nuit. Livraison très rapide, emballage soigné.',
    },
    {
      produit_id: produits[0].id, clientId: clients[1].id,
      rating: 5, userName: 'Ibrahim M.',
      comment: 'Très satisfait de cet achat. La batterie tient facilement 2 jours. Le 5G est vraiment rapide. Je recommande vivement !',
      reply: 'Merci Ibrahim pour ce retour positif ! N\'hésitez pas à nous contacter pour tout besoin. 🙏',
    },
    {
      produit_id: produits[10].id, clientId: clients[0].id,
      rating: 5, userName: 'Amina H.',
      comment: 'La qualité du tissu est exceptionnelle, exactement comme sur les photos. Les broderies sont magnifiques. Je l\'ai porté à un mariage, j\'ai eu beaucoup de compliments !',
    },
    {
      produit_id: produits[20].id, clientId: clients[2].id,
      rating: 5, userName: 'Fatima A.',
      comment: 'Crème vraiment efficace ! Ma peau est transformée en 2 semaines. L\'odeur est délicate et naturelle. Je rachète dès que possible !',
    },
    {
      produit_id: produits[1].id, clientId: clients[2].id,
      rating: 4, userName: 'Fatima A.',
      comment: 'Très bon laptop, rapide et fiable. Petit bémol sur l\'autonomie de la batterie (environ 5h). Sinon parfait pour le travail.',
    },
    {
      produit_id: produits[34].id, clientId: clients[3].id,
      rating: 5, userName: 'Jean D.',
      comment: 'Un canapé d\'une qualité remarquable. Le tissu est doux et la structure solide. Livré monté et en parfait état.',
    },
    {
      produit_id: produits[28].id, clientId: clients[1].id,
      rating: 4, userName: 'Ibrahim M.',
      comment: 'Les épices sont très parfumées et relèvent parfaitement les plats. Petit bémol sur l\'emballage qui pourrait être plus hermétique.',
    },
  ]) {
    await prisma.review.create({ data });
  }
  console.log('✅ Avis créés');

  // ─── COUPONS ────────────────────────────────────────────────────────────
  const inOneYear = new Date();
  inOneYear.setFullYear(inOneYear.getFullYear() + 1);

  for (const data of [
    {
      code: 'DEMO20', discount: 20, type: 'PERCENTAGE' as const,
      expiresAt: inOneYear, maxUses: 100, brandId: techBrand.id,
    },
    {
      code: 'BIENVENUE', discount: 5000, type: 'FIXED' as const,
      expiresAt: inOneYear, maxUses: 50, brandId: modeBrand.id,
    },
    {
      code: 'BEAUTY10', discount: 10, type: 'PERCENTAGE' as const,
      expiresAt: inOneYear, maxUses: null, brandId: beautyBrand.id,
    },
    {
      code: 'FOOD15', discount: 15, type: 'PERCENTAGE' as const,
      expiresAt: inOneYear, maxUses: 200, brandId: foodBrand.id,
    },
  ]) {
    await prisma.coupon.create({ data });
  }
  console.log('✅ Coupons créés (DEMO20, BIENVENUE, BEAUTY10, FOOD15)');

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
  for (const data of [
    {
      brandId: techBrand.id, type: 'ORDER' as const,
      title: 'Nouvelle commande reçue !',
      message: 'Une nouvelle commande CMD-1716000001 vient d\'être passée pour vos produits.',
    },
    {
      brandId: modeBrand.id, type: 'REVIEW' as const,
      title: 'Nouvel avis client',
      message: 'Amina H. a laissé une note de 5/5 sur Boubou Grand Bazin Royal.',
    },
    {
      brandId: homeBrand.id, type: 'ORDER' as const,
      title: 'Alerte Stock',
      message: 'Le produit Canapé Design 3 Places a atteint un seuil critique (5 restants).',
    },
  ]) {
    await prisma.notification.create({ data });
  }
  console.log('✅ Notifications créées');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('─────────────────────────────────────────');
  console.log('📊 Résumé :');
  console.log(`   • ${categories.length} catégories`);
  console.log(`   • 5 marques vérifiées`);
  console.log(`   • ${produits.length} produits avec variantes`);
  console.log(`   • ${clients.length} clients de démo`);
  console.log(`   • 7 avis produits`);
  console.log(`   • 4 coupons actifs : DEMO20, BIENVENUE, BEAUTY10, FOOD15`);
  console.log('─────────────────────────────────────────');
  console.log('🌐 Site : https://marketplacetd.vercel.app/fr');
}

main()
  .catch((e) => { console.error('❌ Erreur seed :', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
