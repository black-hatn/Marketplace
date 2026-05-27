"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./upload";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { stripe } from './stripe';
import { checkRateLimit } from './rateLimit';
import { v4 as uuidv4 } from 'uuid';
import {
  sendOrderConfirmation,
  sendShippingNotification,
  sendOrderCancellation,
} from './email';

// --- HELPERS ---

/** #20 — Slug robuste : gère accents, caractères spéciaux, longueur max */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 64);
}

/** #20 — Garantit l'unicité du slug en ajoutant un suffixe si nécessaire */
async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let attempt = 0;
  while (await prisma.brand.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${slugify(base)}-${attempt}`;
  }
  return slug;
}

/** #7 — Recalcule rating et reviews depuis la table Review (source de vérité) */
async function recalculateProductRating(productId: string): Promise<void> {
  const avis = await prisma.review.findMany({ where: { produit_id: productId } });
  const avg = avis.length > 0
    ? avis.reduce((acc, r) => acc + r.rating, 0) / avis.length
    : 0;
  await prisma.produit.update({
    where: { id: productId },
    data: { rating: avg, reviews: avis.length },
  });
}

/** #3 — Session persistante pour les visiteurs non-connectés (via cookie) */
async function getGuestSessionId(): Promise<string> {
  const session = await getServerSession(authOptions) as any;
  if (session?.user?.id) return session.user.id as string;

  const cookieStore = await cookies();
  const existing = cookieStore.get('guest_sid')?.value;
  if (existing) return existing;

  const { v4: uuidv4 } = await import('uuid');
  const guestId = uuidv4();
  cookieStore.set('guest_sid', guestId, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return guestId;
}

// --- SCHEMAS TYPÉS (#19) ---

const productSchema = z.object({
  nom: z.string().min(2, "Le nom est trop court"),
  sku: z.string().min(3, "Le SKU est requis"),
  prix_ht: z.preprocess((v) => parseFloat(v as string), z.number().positive("Prix invalide")),
  tva: z.preprocess((v) => parseFloat(v as string), z.number().min(0).max(100).default(18)),
  stock: z.preprocess((v) => parseInt(v as string), z.number().int().nonnegative("Stock invalide")),
  description: z.string().min(10, "Description trop courte"),
  categories: z.array(z.string()).optional(),
});

type ProductInput = {
  title?: string;
  nom?: string;
  sku?: string;
  prix_ht?: number | string;
  price?: number | string;
  tva?: number | string;
  prix_ttc?: number | string;
  stock: number | string;
  description: string;
  categories?: string[];
  category?: string;
  images?: string;
  image?: string;
  brandId?: string;
  threeDStyle?: string;
};

type OrderInput = {
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerPhone?: string;
  paymentMethod?: string;
  total: number;
  items: {
    productId: string;
    title?: string;
    price: number;
    quantity: number;
    brandId?: string;
  }[];
};

// --- ACTIONS PRODUITS ---

export async function createProduct(data: ProductInput) {
  const session = await getServerSession(authOptions) as any;
  if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    throw new Error("Non autorisé");
  }

  const parsed = productSchema.safeParse({
    nom: data.title || data.nom,
    sku: data.sku,
    prix_ht: data.price || data.prix_ht,
    tva: data.tva ?? 18,
    stock: data.stock,
    description: data.description,
    categories: data.categories,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(' | '));
  }

  const brandId = session.user.role === "VENDOR" ? session.user.id : data.brandId;
  const prix_ht = parseFloat(String(data.price || data.prix_ht));
  const tva = parseFloat(String(data.tva ?? 18));
  const prix_ttc = parseFloat(String(data.prix_ttc)) || parseFloat((prix_ht * (1 + tva / 100)).toFixed(2));
  const rawCategory = data.category || data.categories?.[0];
  const categories = rawCategory ? [rawCategory] : [];

  // #6 — Synchroniser categoryId avec la table Category
  let categoryId: string | undefined;
  if (rawCategory) {
    const cat = await prisma.category.findFirst({ where: { name: rawCategory } });
    categoryId = cat?.id;
  }

  const product = await prisma.produit.create({
    data: {
      sku: data.sku || `SKU-${Date.now()}`,
      nom: data.title || data.nom || '',
      description: data.description,
      prix_ht,
      tva,
      prix_ttc,
      stock: parseInt(String(data.stock)),
      images: data.images
        ? data.images.split(',').map((u) => u.trim()).filter(Boolean)
        : data.image ? [data.image] : [],
      categories,
      brandId: brandId ?? null,
      categoryId: categoryId ?? null,
      threeDStyle: data.threeDStyle || "cube",
    },
  });
  revalidatePath('/admin');
  revalidatePath('/produits');
  return product;
}

export async function updateProduct(id: string, data: ProductInput) {
  const session = await getServerSession(authOptions) as any;
  if (!session) throw new Error("Non autorisé");

  const existingProduct = await prisma.produit.findUnique({ where: { id } });
  if (!existingProduct) throw new Error("Produit introuvable");

  const parsed = productSchema.safeParse({
    nom: data.title || data.nom,
    sku: data.sku || existingProduct.sku,
    prix_ht: data.price || data.prix_ht,
    tva: data.tva ?? 18,
    stock: data.stock,
    description: data.description,
    categories: data.categories,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(' | '));
  }

  if (session.user.role === "VENDOR" && existingProduct.brandId !== session.user.id) {
    throw new Error("Accès refusé");
  }

  const prix_ht = parseFloat(String(data.price || data.prix_ht));
  const tva = parseFloat(String(data.tva ?? existingProduct.tva.toString()));
  const prix_ttc = parseFloat(String(data.prix_ttc)) || parseFloat((prix_ht * (1 + tva / 100)).toFixed(2));

  // #6 — Synchroniser categoryId
  const rawCategory = data.category || data.categories?.[0];
  let categoryId: string | null | undefined = undefined;
  if (rawCategory) {
    const cat = await prisma.category.findFirst({ where: { name: rawCategory } });
    categoryId = cat?.id ?? null;
  }

  const product = await prisma.produit.update({
    where: { id },
    data: {
      nom: data.title || data.nom,
      description: data.description,
      prix_ht,
      prix_ttc,
      stock: parseInt(String(data.stock)),
      images: data.images
        ? data.images.split(',').map((u) => u.trim()).filter(Boolean)
        : data.image ? [data.image] : undefined,
      threeDStyle: data.threeDStyle,
      ...(categoryId !== undefined && { categoryId }),
    },
  });
  revalidatePath('/admin');
  revalidatePath(`/produit/${id}`);
  revalidatePath('/produits');
  return product;
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions) as any;
  if (!session) throw new Error("Non autorisé");

  const existingProduct = await prisma.produit.findUnique({ where: { id } });
  if (!existingProduct) return;

  if (session.user.role === "VENDOR" && existingProduct.brandId !== session.user.id) {
    throw new Error("Accès refusé");
  }

  await prisma.produit.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/produits');
}

/** #13 — Pagination ajoutée */
export async function getProduitsByCategory(
  category: string,
  page = 1,
  limit = 12
) {
  const skip = (page - 1) * limit;
  const [produits, total] = await Promise.all([
    prisma.produit.findMany({
      where: { categories: { has: category }, actif: true },
      include: { brand: true },
      skip,
      take: limit,
      orderBy: { date_creation: 'desc' },
    }),
    prisma.produit.count({
      where: { categories: { has: category }, actif: true },
    }),
  ]);
  return { produits, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getVendorProducts(brandId: string) {
  const produits = await prisma.produit.findMany({
    where: { brandId },
    orderBy: { date_creation: 'desc' },
  });
  return produits.map((p) => ({
    ...p,
    title: p.nom,
    price: Number(p.prix_ttc),
    image: p.images[0],
    category: { name: p.categories[0] },
  }));
}

// --- ACTIONS AVIS ---

/** #5 — Auth requise + validation + déduplication + #4 rate limiting */
export async function addReview(
  productId: string,
  data: { rating: number; comment: string; authorName: string }
) {
  const session = await getServerSession(authOptions) as any;

  // Rate limiting : 3 avis max par heure par utilisateur/IP
  // Pour les anonymes, on utilise l'IP réelle pour éviter qu'une clé partagée
  // "review:anon:<productId>" bloque tous les invités en même temps.
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headersList.get('x-real-ip')
    || 'unknown';
  const rateLimitKey = `review:${session?.user?.id || `anon:${ip}`}:${productId}`;
  if (!checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000)) {
    throw new Error("Trop de tentatives. Réessayez dans une heure.");
  }

  // Validation du rating
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    throw new Error("La note doit être un entier entre 1 et 5");
  }
  if (!data.comment || data.comment.trim().length < 5) {
    throw new Error("Le commentaire est trop court (minimum 5 caractères)");
  }

  // Déduplication : un avis par client par produit
  if (session?.user?.id) {
    const existing = await prisma.review.findFirst({
      where: { produit_id: productId, clientId: session.user.id },
    });
    if (existing) throw new Error("Vous avez déjà laissé un avis sur ce produit");
  }

  const review = await prisma.review.create({
    data: {
      produit_id: productId,
      rating: data.rating,
      comment: data.comment.trim(),
      userName: session?.user?.name || data.authorName,
      clientId: session?.user?.id ?? null,
    },
  });

  // #7 — Recalcul depuis la DB
  await recalculateProductRating(productId);

  const product = await prisma.produit.findUnique({ where: { id: productId } });
  if (product?.brandId) {
    await createNotification(
      product.brandId,
      'REVIEW',
      'Nouvel avis client',
      `${session?.user?.name || data.authorName} a laissé une note de ${data.rating}/5 sur ${product.nom}.`
    );
  }

  revalidatePath(`/produit/${productId}`);
  return review;
}

// --- ACTIONS COMMANDES ---

/** #8 Vérification de stock + #9 mot de passe guest sécurisé + emails (#15) */
export async function createOrder(data: OrderInput) {
  // Tout est dans une seule transaction atomique pour éviter la race condition
  // entre la vérification du stock et la création de la commande.
  const commande = await prisma.$transaction(async (tx) => {
    // #8 — Vérification ET réservation du stock dans la même transaction
    for (const item of data.items) {
      const product = await tx.produit.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Produit introuvable : ${item.productId}`);
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuffisant pour « ${product.nom} » (disponible : ${product.stock})`);
      }
    }

    let client = await tx.client.findUnique({ where: { email: data.customerEmail } });
    if (!client) {
      // #9 — Mot de passe invité cryptographiquement inutilisable (pas de login possible)
      const guestHash = await bcrypt.hash(`guest:${uuidv4()}`, 10);
      client = await tx.client.create({
        data: {
          email: data.customerEmail,
          nom: data.customerName.split(' ')[0] || data.customerName,
          prenom: data.customerName.split(' ').slice(1).join(' ') || '',
          mot_de_passe_hash: guestHash,
          telephone: data.customerPhone || null,
          role: 'CLIENT',
        },
      });
    }

    return tx.commande.create({
      data: {
        numero_commande: `CMD-${Date.now()}`,
        client_id: client.id,
        adresse_livraison: `${data.customerAddress}, ${data.customerCity}`,
        adresse_facturation: `${data.customerAddress}, ${data.customerCity}`,
        statut: 'EN_ATTENTE',
        montant_total: data.total,
        lignes_commande: {
          create: data.items.map((item) => ({
            produit_id: item.productId,
            quantite: item.quantity,
            prix_unitaire_ht: item.price,
            tva_appliquee: 18,
          })),
        },
      },
      include: { lignes_commande: { include: { produit: true } } },
    });
  });

  // Notifications vendeurs (hors transaction car non critiques)
  const vendorIds = [...new Set(data.items.map((i) => i.brandId).filter(Boolean))];
  for (const brandId of vendorIds) {
    await createNotification(
      brandId as string,
      'ORDER',
      'Nouvelle commande reçue !',
      `Une nouvelle commande (${commande.numero_commande}) vient d'être passée pour vos produits.`
    );
  }

  // #15 — Email de confirmation (non bloquant)
  sendOrderConfirmation({
    to: data.customerEmail,
    name: data.customerName,
    orderNumber: commande.numero_commande,
    total: data.total,
    items: data.items.map((i) => ({
      title: i.title || i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
  }).catch(() => {/* non bloquant */});

  revalidatePath('/admin');
  return commande;
}

export async function processOrderPayment(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.commande.findUnique({
      where: { id: orderId },
      include: {
        client: true,
        lignes_commande: { include: { produit: true } },
      },
    });

    if (!order) throw new Error("Commande introuvable");

    if (['PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE'].includes(order.statut)) {
      return order;
    }

    const updatedOrder = await tx.commande.update({
      where: { id: orderId },
      data: { statut: 'PAYEE' },
    });

    const COMMISSION_RATE = 0.05;
    const vendorIds = new Set<string>();

    for (const line of order.lignes_commande) {
      const product = line.produit;
      if (product) {
        await tx.produit.update({
          where: { id: product.id },
          data: { stock: Math.max(0, product.stock - line.quantite) },
        });

        if (product.brandId) {
          vendorIds.add(product.brandId);
          const lineTotal = Number(line.prix_unitaire_ht) * line.quantite;
          const netEarnings = lineTotal * (1 - COMMISSION_RATE);

          const wallet = await tx.wallet.findUnique({ where: { brandId: product.brandId } });
          if (wallet) {
            await tx.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: netEarnings } },
            });
          } else {
            await tx.wallet.create({
              data: { brandId: product.brandId, balance: netEarnings },
            });
          }
        }
      }
    }

    for (const brandId of vendorIds) {
      await tx.notification.create({
        data: {
          brandId,
          type: 'ORDER',
          title: 'Commande Payée !',
          message: `La commande (${order.numero_commande}) a été payée. Vos gains nets ont été crédités.`,
        },
      });
    }

    // #15 — Email confirmation si on a l'email du client
    if (order.client?.email) {
      sendOrderConfirmation({
        to: order.client.email,
        name: `${order.client.nom} ${order.client.prenom}`.trim(),
        orderNumber: order.numero_commande,
        total: Number(order.montant_total),
        items: order.lignes_commande.map((l) => ({
          title: l.produit?.nom || 'Produit',
          quantity: l.quantite,
          price: Number(l.prix_unitaire_ht),
        })),
      }).catch(() => {});
    }

    return updatedOrder;
  });
}

/** #2 Auth admin + #16 remboursement Stripe + #15 emails de statut */
export async function updateOrderStatus(orderId: string, status: string) {
  // #2 — Vérification de session
  const session = await getServerSession(authOptions) as any;
  if (!session || session.user.role !== 'ADMIN') throw new Error("Non autorisé");

  if (status === 'PAYEE' || status === 'VALIDEE') {
    await processOrderPayment(orderId);
    return;
  }

  // #16 — Remboursement Stripe si annulation
  if (status === 'ANNULEE') {
    const paiement = await prisma.paiement.findFirst({
      where: { commande_id: orderId, statut: 'REUSSI' },
    });
    if (paiement?.transaction_id_stripe) {
      try {
        await stripe.refunds.create({ payment_intent: paiement.transaction_id_stripe });
      } catch (err) {
        console.error('Stripe refund failed:', err);
      }
    }

    // #15 — Email d'annulation
    const commande = await prisma.commande.findUnique({
      where: { id: orderId },
      include: { client: true },
    });
    if (commande?.client?.email) {
      sendOrderCancellation({
        to: commande.client.email,
        name: `${commande.client.nom} ${commande.client.prenom}`.trim(),
        orderNumber: commande.numero_commande,
      }).catch(() => {});
    }
  }

  // #15 — Email d'expédition
  if (status === 'EXPEDIEE') {
    const commande = await prisma.commande.findUnique({
      where: { id: orderId },
      include: { client: true },
    });
    if (commande?.client?.email) {
      sendShippingNotification({
        to: commande.client.email,
        name: `${commande.client.nom} ${commande.client.prenom}`.trim(),
        orderNumber: commande.numero_commande,
        trackingNumber: commande.numero_suivi ?? undefined,
      }).catch(() => {});
    }
  }

  await prisma.commande.update({
    where: { id: orderId },
    data: { statut: status as any },
  });
  revalidatePath('/admin');
}

/** #2 — Vérification de session admin */
export async function deleteOrder(id: string) {
  const session = await getServerSession(authOptions) as any;
  if (!session || session.user.role !== 'ADMIN') throw new Error("Non autorisé");

  await prisma.commande.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function getOrdersByEmail(email: string) {
  const client = await prisma.client.findUnique({ where: { email } });
  if (!client) return [];

  return prisma.commande.findMany({
    where: { client_id: client.id },
    include: { lignes_commande: { include: { produit: true } } },
    orderBy: { date_commande: 'desc' },
  });
}

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
      role: 'CLIENT',
    },
  });
}

/** #20 — Slug amélioré (accents + unicité) */
export async function registerVendor(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const tagline = formData.get('tagline') as string;
  const logoFile = formData.get('logoFile') as File | null;

  const existing = await prisma.brand.findUnique({ where: { email } });
  if (existing) throw new Error('Email déjà utilisé');

  const hashedPassword = await bcrypt.hash(password, 10);

  let imageUrl = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80';
  if (logoFile && logoFile.size > 0) {
    try {
      imageUrl = await uploadImage(logoFile);
    } catch (e) {
      console.error("Upload failed in registerVendor:", e);
    }
  }

  const slug = await uniqueSlug(name);

  return prisma.brand.create({
    data: {
      name,
      slug,
      email,
      password: hashedPassword,
      title: name,
      tagline: tagline || 'Luxe & Innovation',
      description: 'Partenaire Immersive',
      story: '...',
      values: '...',
      impact: '...',
      image: imageUrl,
    },
  });
}

// --- ACTIONS ANALYTIQUES ---

export async function getAnalyseVentes() {
  const results = await prisma.$queryRaw`SELECT * FROM vue_analyse_ventes ORDER BY mois DESC`;
  return results as any[];
}

export async function getAnalyticsData() {
  try {
    const [totalOrders, totalRevenueData, avgOrderData] = await Promise.all([
      prisma.commande.count(),
      prisma.commande.aggregate({
        _sum: { montant_total: true },
        where: { statut: { in: ['PAYEE', 'VALIDEE', 'EXPEDIEE'] } },
      }),
      prisma.commande.aggregate({ _avg: { montant_total: true } }),
    ]);

    let salesReport: any[] = [];
    try {
      salesReport = await prisma.$queryRaw`SELECT * FROM vue_analyse_ventes ORDER BY mois DESC` as any[];
    } catch {
      console.warn("View vue_analyse_ventes missing, using empty report.");
    }

    return {
      stats: {
        totalOrders,
        totalRevenue: Number(totalRevenueData._sum.montant_total || 0),
        avgOrderValue: Number(avgOrderData._avg.montant_total || 0),
      },
      chartData: salesReport.map((item) => ({
        month: new Date(item.mois).toLocaleDateString('fr-FR', { month: 'short' }),
        revenue: Number(item.ca),
        orders: Number(item.volume_ventes),
      })).reverse(),
    };
  } catch (error) {
    console.error("Analytics Error:", error);
    return { stats: { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 }, chartData: [] };
  }
}

/** #11 — Utilise select{} pour ne charger que les colonnes nécessaires */
export async function getVendorAnalytics(brandId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [ordersCount, revenueLines, vendorOrders] = await Promise.all([
    prisma.commande.count({
      where: { lignes_commande: { some: { produit: { brandId } } } },
    }),
    prisma.ligneCommande.findMany({
      where: {
        produit: { brandId },
        commande: { statut: { in: ['PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE'] } },
      },
      select: { prix_unitaire_ht: true, quantite: true },
    }),
    prisma.commande.findMany({
      where: {
        lignes_commande: { some: { produit: { brandId } } },
        date_commande: { gte: thirtyDaysAgo },
      },
      select: {
        date_commande: true,
        lignes_commande: {
          where: { produit: { brandId } },
          select: { prix_unitaire_ht: true, quantite: true },
        },
      },
      orderBy: { date_commande: 'asc' },
    }),
  ]);

  const totalRevenue = revenueLines.reduce(
    (acc, l) => acc + Number(l.prix_unitaire_ht) * l.quantite,
    0
  );

  // Initialise les 30 derniers jours
  const chartMap = new Map<string, { name: string; revenue: number; orders: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    chartMap.set(key, { name: key, revenue: 0, orders: 0 });
  }

  for (const order of vendorOrders) {
    const key = new Date(order.date_commande).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const entry = chartMap.get(key);
    if (entry) {
      entry.orders += 1;
      entry.revenue += order.lignes_commande.reduce(
        (s, l) => s + Number(l.prix_unitaire_ht) * l.quantite,
        0
      );
    }
  }

  return {
    totalOrders: ordersCount,
    totalRevenue,
    chartData: Array.from(chartMap.values()),
  };
}

export async function getUserProfile(id: string, role: string) {
  if (role === 'VENDOR') return prisma.brand.findUnique({ where: { id } });
  if (role === 'ADMIN') {
    const dbAdmin = await prisma.client.findFirst({ where: { role: 'ADMIN' } });
    return {
      id: dbAdmin?.id || 'admin',
      nom: dbAdmin?.nom || process.env.ADMIN_NAME || 'Administrateur',
      prenom: dbAdmin?.prenom || '',
      email: dbAdmin?.email || process.env.ADMIN_EMAIL || '',
      telephone: dbAdmin?.telephone || null,
      image: dbAdmin?.image || null,
      role: 'ADMIN',
    };
  }
  return prisma.client.findUnique({ where: { id } });
}

export async function updateProfile(id: string, role: string, formData: FormData) {
  // Sécurité : seul l'utilisateur lui-même ou un admin peut modifier un profil
  const session = await getServerSession(authOptions) as any;
  if (!session) throw new Error("Non autorisé");
  if (session.user.role !== 'ADMIN' && session.user.id !== id) {
    throw new Error("Accès refusé : vous ne pouvez modifier que votre propre profil");
  }
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const prenom = formData.get('prenom') as string;
  const imageFile = formData.get('imageFile') as File;
  const bannerFile = formData.get('bannerFile') as File;
  const themeColor = formData.get('themeColor') as string;
  let imageUrl = formData.get('existingImage') as string;
  let bannerUrl = formData.get('existingBanner') as string;

  if (imageFile && imageFile.size > 0) imageUrl = await uploadImage(imageFile);
  if (bannerFile && bannerFile.size > 0) bannerUrl = await uploadImage(bannerFile);

  if (role === 'VENDOR') {
    await prisma.brand.update({
      where: { id },
      data: { name, email, phone, image: imageUrl, banner: bannerUrl, themeColor: themeColor || "#06B6D4" } as any,
    });
  } else if (role === 'ADMIN') {
    const dbAdmin = await prisma.client.findFirst({ where: { role: 'ADMIN' } });
    if (dbAdmin) {
      await prisma.client.update({
        where: { id: dbAdmin.id },
        data: { nom: name, prenom: prenom || "", email, telephone: phone, image: imageUrl } as any,
      });
    } else {
      await prisma.client.create({
        data: {
          nom: name,
          prenom: prenom || "",
          email: email || process.env.ADMIN_EMAIL || 'admin@immersive.com',
          mot_de_passe_hash: '', // Unused for admin since auth reads from env
          telephone: phone,
          image: imageUrl,
          role: 'ADMIN',
        },
      });
    }
  } else {
    await prisma.client.update({
      where: { id },
      data: { nom: name, prenom: prenom || "", email, telephone: phone, image: imageUrl } as any,
    });
  }

  revalidatePath('/[locale]/vendeur/dashboard', 'layout');
  revalidatePath('/[locale]/admin', 'layout');
}

export async function getNotifications(brandId: string) {
  if (brandId === 'admin') {
    return prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
  return prisma.notification.findMany({
    where: { brandId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}


export async function markAsRead(notificationId: string) {
  const session = await getServerSession(authOptions) as any;
  if (!session) throw new Error("Non autorisé");

  // Vérifier que la notification appartient bien à l'utilisateur courant
  const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notif) throw new Error("Notification introuvable");
  if (
    session.user.role !== 'ADMIN' &&
    notif.brandId !== session.user.id
  ) {
    throw new Error("Accès refusé");
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function toggleBrandVerification(brandId: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions) as any;
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized");

  await prisma.brand.update({ where: { id: brandId }, data: { isVerified: !currentStatus } });
  revalidatePath('/admin/vendeurs');
  revalidatePath('/admin');
  return { success: true };
}

/** #21 — deleteBrand wrapped dans une $transaction */
export async function deleteBrand(brandId: string) {
  const session = await getServerSession(authOptions) as any;
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    await tx.produit.deleteMany({ where: { brandId } });
    await tx.brand.delete({ where: { id: brandId } });
  });

  revalidatePath('/admin/vendeurs');
  revalidatePath('/admin');
  return { success: true };
}

/** #14 — Déduplication des vues : 1 vue par session de 24h */
export async function incrementBrandViews(id: string) {
  const cookieStore = await cookies();
  const viewedKey = 'viewed_brands';
  const viewedRaw = cookieStore.get(viewedKey)?.value || '[]';

  let viewed: string[] = [];
  try { viewed = JSON.parse(viewedRaw); } catch { viewed = []; }

  if (viewed.includes(id)) return; // déjà compté

  await prisma.brand.update({ where: { id }, data: { views: { increment: 1 } } });

  viewed.push(id);
  cookieStore.set(viewedKey, JSON.stringify(viewed), {
    maxAge: 60 * 60 * 24, // reset après 24h
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

/** #12 — Recherche insensible à la casse */
export async function globalSearch(query: string) {
  const [products, brands] = await Promise.all([
    prisma.produit.findMany({
      where: {
        OR: [
          { nom: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { brand: true },
      take: 6,
    }),
    prisma.brand.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { tagline: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 3,
    }),
  ]);

  return {
    products: products.map((p) => ({
      ...p,
      title: p.nom,
      price: Number(p.prix_ttc),
      image: p.images[0] || '/placeholder.png',
      brand: { name: p.brand?.name || 'Immersive Pro' },
      category: { name: p.categories[0] || 'Général' },
    })),
    brands: brands.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      tagline: b.tagline,
      image: b.image,
    })),
  };
}

// --- ACTIONS WISHLIST (#3 guest session corrigée) ---

export async function toggleWishlist(productId: string) {
  const sessionId = await getGuestSessionId();
  const existing = await prisma.wishlist.findFirst({ where: { sessionId, productId } });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return { wishlisted: false };
  }
  await prisma.wishlist.create({ data: { sessionId, productId } });
  return { wishlisted: true };
}

export async function isWishlisted(productId: string) {
  const sessionId = await getGuestSessionId();
  const existing = await prisma.wishlist.findFirst({ where: { sessionId, productId } });
  return !!existing;
}

/** #13 — Pagination ajoutée */
export async function getWishlist(sessionId?: string) {
  const idToUse = sessionId || await getGuestSessionId();
  return prisma.wishlist.findMany({
    where: { sessionId: idToUse },
    include: { produit: { include: { brand: true, category: true } } },
  });
}

export async function getRecommendedProducts(productId: string) {
  try {
    const product = await prisma.produit.findUnique({
      where: { id: productId },
      select: { categories: true, brandId: true },
    });
    if (!product) return [];

    return prisma.produit.findMany({
      where: {
        OR: [
          { categories: { hasSome: product.categories } },
          { brandId: product.brandId },
        ],
        id: { not: productId },
        actif: true,
      },
      take: 6,
      include: { brand: true, category: true },
    });
  } catch {
    return prisma.produit.findMany({ where: { actif: true }, take: 6, include: { brand: true, category: true } });
  }
}

// --- ADVANCED VENDOR ACTIONS ---

export async function getCoupons(brandId: string) {
  return prisma.coupon.findMany({ where: { brandId }, orderBy: { createdAt: 'desc' } });
}

export async function createCoupon(brandId: string, formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase();
  const discount = parseFloat(formData.get('discount') as string);
  const type = formData.get('type') as string;
  const expiresAt = new Date(formData.get('expiresAt') as string);
  const maxUsesRaw = formData.get('maxUses') as string;
  const maxUses = maxUsesRaw ? parseInt(maxUsesRaw) : null;

  await prisma.coupon.create({ data: { code, discount, type, expiresAt, brandId, maxUses } });
  revalidatePath('/vendeur/dashboard');
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/vendeur/dashboard');
}

export async function replyToReview(reviewId: string, reply: string) {
  await prisma.review.update({ where: { id: reviewId }, data: { reply } });
}

export async function getVendorWallet(brandId: string) {
  let wallet = await prisma.wallet.findUnique({
    where: { brandId },
    include: { requests: { orderBy: { createdAt: 'desc' } } },
  });
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { brandId, balance: 0 },
      include: { requests: { orderBy: { createdAt: 'desc' } } },
    });
  }
  return wallet;
}

export async function requestWithdrawal(walletId: string, amount: number, method: string) {
  const session = await getServerSession(authOptions) as any;
  if (!session || (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN')) {
    throw new Error("Non autorisé");
  }

  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
  if (!wallet) throw new Error("Portefeuille introuvable");

  // Vérifier que le wallet appartient bien au vendeur connecté
  if (session.user.role === 'VENDOR' && wallet.brandId !== session.user.id) {
    throw new Error("Accès refusé");
  }

  if (Number(wallet.balance) < amount) throw new Error("Solde insuffisant");
  if (amount <= 0) throw new Error("Montant invalide");

  await prisma.$transaction([
    prisma.wallet.update({ where: { id: walletId }, data: { balance: { decrement: amount } } }),
    prisma.withdrawalRequest.create({ data: { walletId, amount, method } }),
  ]);
  revalidatePath('/vendeur/dashboard');
}

export async function createNotification(brandId: string, type: string, title: string, message: string) {
  return prisma.notification.create({ data: { brandId, type, title, message } });
}

/** #10 — Vérifie maxUses et incrémente usedCount */
export async function validateCouponCode(code: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
    include: { brand: true },
  });

  if (!coupon) throw new Error("Code promo introuvable");
  if (!coupon.isActive) throw new Error("Ce code promo est inactif");
  if (new Date(coupon.expiresAt) < new Date()) throw new Error("Ce code promo a expiré");
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    throw new Error("Ce code promo a atteint sa limite d'utilisation");
  }

  return {
    id: coupon.id,
    code: coupon.code,
    discount: coupon.discount,
    type: coupon.type,
    brandId: coupon.brandId,
    brandName: coupon.brand.name,
  };
}

/** #10 — Incrémente usedCount lors de l'application d'un coupon */
export async function applyCoupon(couponId: string) {
  await prisma.coupon.update({
    where: { id: couponId },
    data: { usedCount: { increment: 1 } },
  });
}
