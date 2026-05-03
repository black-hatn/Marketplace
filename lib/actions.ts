"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./upload";
import { z } from "zod";

// --- SCHEMAS ---
const productSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court"),
  sku: z.string().min(3, "Le SKU est requis"),
  prix_ht: z.preprocess((v) => parseFloat(v as string), z.number().positive()),
  tva: z.preprocess((v) => parseFloat(v as string), z.number().default(18)),
  stock: z.preprocess((v) => parseInt(v as string), z.number().int().nonnegative()),
  description: z.string().min(10),
  categories: z.array(z.string()).optional(),
});

// --- ACTIONS PRODUITS ---

export async function createProduct(data: any) {
  const product = await prisma.produit.create({
    data: {
      sku: data.sku || `SKU-${Date.now()}`,
      nom: data.title || data.nom,
      description: data.description,
      prix_ht: parseFloat(data.price || data.prix_ht),
      tva: 18,
      prix_ttc: parseFloat(data.price || data.prix_ttc),
      stock: parseInt(data.stock),
      images: data.images ? data.images.split(',').map((u: string) => u.trim()).filter(Boolean) : [data.image].filter(Boolean),
      categories: [data.category || data.categories?.[0]],
      brandId: data.brandId,
    }
  });
  revalidatePath('/admin');
  revalidatePath('/produits');
  return product;
}

export async function updateProduct(id: string, data: any) {
  const product = await prisma.produit.update({
    where: { id },
    data: {
      nom: data.title || data.nom,
      description: data.description,
      prix_ht: parseFloat(data.price || data.prix_ht),
      prix_ttc: parseFloat(data.price || data.prix_ttc),
      stock: parseInt(data.stock),
      images: data.images ? data.images.split(',').map((u: string) => u.trim()).filter(Boolean) : (data.image ? [data.image] : undefined),
    }
  });
  revalidatePath('/admin');
  revalidatePath(`/produit/${id}`);
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.produit.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/produits');
}

export async function getProduitsByCategory(category: string) {
  return prisma.produit.findMany({
    where: {
      categories: { has: category },
      actif: true
    }
  });
}

export async function getVendorProducts(brandId: string) {
  const produits = await prisma.produit.findMany({
    where: { brandId },
    orderBy: { date_creation: 'desc' }
  });
  // Map fields for UI compatibility if needed
  return produits.map(p => ({
    ...p,
    title: p.nom,
    price: Number(p.prix_ttc),
    image: p.images[0],
    category: { name: p.categories[0] }
  }));
}

// --- ACTIONS AVIS ---

export async function addReview(productId: string, data: { rating: number; comment: string; authorName: string; authorEmail?: string }) {
  const review = await prisma.review.create({
    data: {
      produit_id: productId,
      rating: data.rating,
      comment: data.comment,
      userName: data.authorName
    }
  });

  const product = await prisma.produit.findUnique({
    where: { id: productId },
    include: { avis: true }
  });

  if (product) {
    const avg = product.avis.reduce((acc, r) => acc + r.rating, 0) / product.avis.length;
    await prisma.produit.update({
      where: { id: productId },
      data: { 
        rating: avg,
        reviews: product.avis.length
      }
    });
  }

  revalidatePath(`/produit/${productId}`);
  return review;
}

// --- ACTIONS COMMANDES ---

export async function createOrder(data: any) {
  let client = await prisma.client.findUnique({ where: { email: data.customerEmail } });
  if (!client) {
    client = await prisma.client.create({
      data: {
        email: data.customerEmail,
        nom: data.customerName,
        prenom: '',
        mot_de_passe_hash: 'guest',
        role: 'CLIENT'
      }
    });
  }

  const commande = await prisma.commande.create({
    data: {
      numero_commande: `CMD-${Date.now()}`,
      client_id: client.id,
      adresse_livraison: `${data.customerAddress}, ${data.customerCity}`,
      adresse_facturation: `${data.customerAddress}, ${data.customerCity}`,
      statut: 'EN_ATTENTE',
      montant_total: data.total,
      lignes_commande: {
        create: data.items.map((item: any) => ({
          produit_id: item.productId,
          quantite: item.quantity,
          prix_unitaire_ht: item.price,
          tva_appliquee: 18
        }))
      }
    }
  });

  revalidatePath('/admin');
  return commande;
}

export async function updateOrderStatus(orderId: string, status: any) {
  await prisma.commande.update({
    where: { id: orderId },
    data: { statut: status }
  });
  revalidatePath('/admin');
}

export async function deleteOrder(id: string) {
  await prisma.commande.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function getOrdersByEmail(email: string) {
  const client = await prisma.client.findUnique({ where: { email } });
  if (!client) return [];
  
  return prisma.commande.findMany({
    where: { client_id: client.id },
    include: { lignes_commande: { include: { produit: true } } },
    orderBy: { date_commande: 'desc' }
  });
}

import bcrypt from 'bcryptjs';

// --- ACTIONS AUTH ---

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;

  const existing = await prisma.client.findUnique({ where: { email } });
  if (existing) throw new Error('Email déjà utilisé');

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.client.create({
    data: {
      nom: name.split(' ')[0],
      prenom: name.split(' ').slice(1).join(' '),
      email,
      mot_de_passe_hash: hashedPassword,
      telephone: phone,
      role: 'CLIENT'
    }
  });
}

export async function registerVendor(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const existing = await prisma.brand.findUnique({ where: { email } });
  if (existing) throw new Error('Email déjà utilisé');

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.brand.create({
    data: {
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      email,
      password: hashedPassword,
      title: name,
      tagline: 'Luxe & Innovation',
      description: 'Partenaire Immersive',
      story: '...',
      values: '...',
      impact: '...',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    }
  });
}

// --- ACTIONS ANALYTIQUES & DIVERS ---

export async function getAnalyseVentes() {
  const results = await prisma.$queryRaw`SELECT * FROM vue_analyse_ventes ORDER BY mois DESC`;
  return results as any[];
}

export async function getAnalyticsData() {

  const [totalOrders, totalRevenueData, avgOrderData] = await Promise.all([
    prisma.commande.count(),
    prisma.commande.aggregate({
      _sum: { montant_total: true },
      where: { statut: { in: ['PAYEE', 'VALIDEE', 'EXPEDIEE'] } }
    }),
    prisma.commande.aggregate({
      _avg: { montant_total: true }
    })
  ]);

  const salesReport = await prisma.$queryRaw`SELECT * FROM vue_analyse_ventes ORDER BY mois DESC` as any[];
  
  return {
    stats: {
      totalOrders,
      totalRevenue: Number(totalRevenueData._sum.montant_total || 0),
      avgOrderValue: Number(avgOrderData._avg.montant_total || 0),
    },
    chartData: salesReport.map(item => ({
      month: new Date(item.mois).toLocaleDateString('fr-FR', { month: 'short' }),
      revenue: Number(item.ca),
      orders: Number(item.volume_ventes)
    })).reverse()
  };
}

export async function toggleBrandVerification(id: string) {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) return;
  await prisma.brand.update({
    where: { id },
    data: { isVerified: !brand.isVerified }
  });
  revalidatePath('/admin');
}

export async function deleteBrand(id: string) {
  await prisma.brand.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function incrementBrandViews(id: string) {
  await prisma.brand.update({
    where: { id },
    data: { views: { increment: 1 } }
  });
}

export async function globalSearch(query: string) {
  return prisma.produit.findMany({
    where: {
      OR: [
        { nom: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 5
  });
}

// --- ACTIONS WISHLIST ---

export async function toggleWishlist(productId: string) {
  const sessionId = "demo-session"; 
  const existing = await prisma.wishlist.findFirst({
    where: { sessionId, productId }
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return { wishlisted: false };
  } else {
    await prisma.wishlist.create({ data: { sessionId, productId } });
    return { wishlisted: true };
  }
}

export async function isWishlisted(productId: string) {
  const sessionId = "demo-session";
  const existing = await prisma.wishlist.findFirst({
    where: { sessionId, productId }
  });
  return !!existing;
}

export async function getWishlist(sessionId: string) {
  return prisma.wishlist.findMany({
    where: { sessionId },
    include: { produit: { include: { brand: true, category: true } } }
  });
}

export async function getRecommendedProducts(productId: string) {
  const results = await prisma.$queryRaw`
    SELECT p.* FROM "Produit" p
    JOIN vue_recommandations vr ON p.id = vr.recommended_product_id
    WHERE vr.source_product_id = ${productId}
    ORDER BY vr.strength DESC
    LIMIT 4
  ` as any[];
  return results;
}
