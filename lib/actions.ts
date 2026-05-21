"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./upload";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import bcrypt from 'bcryptjs';

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
  const session = await getServerSession(authOptions) as any;
  if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    throw new Error("Non autorisé");
  }

  // Validate with Zod before touching the DB
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
    throw new Error(parsed.error.issues.map((e: { message: string }) => e.message).join(' | '));
  }

  const brandId = session.user.role === "VENDOR" ? session.user.id : data.brandId;

  const prix_ht = parseFloat(data.price || data.prix_ht);
  const tva = parseFloat(data.tva ?? '18');
  const prix_ttc = parseFloat(data.prix_ttc) || parseFloat((prix_ht * (1 + tva / 100)).toFixed(2));
  const rawCategory = data.category || data.categories?.[0];
  const categories = rawCategory ? [rawCategory] : [];

  const product = await prisma.produit.create({
    data: {
      sku: data.sku || `SKU-${Date.now()}`,
      nom: data.title || data.nom,
      description: data.description,
      prix_ht,
      tva,
      prix_ttc,
      stock: parseInt(data.stock),
      images: data.images ? data.images.split(',').map((u: string) => u.trim()).filter(Boolean) : (data.image ? [data.image] : []),
      categories,
      brandId: brandId,
      threeDStyle: data.threeDStyle || "cube",
    }
  });
  revalidatePath('/admin');
  revalidatePath('/produits');
  return product;
}

export async function updateProduct(id: string, data: any) {
  const session = await getServerSession(authOptions) as any;
  if (!session) throw new Error("Non autorisé");

  const existingProduct = await prisma.produit.findUnique({ where: { id } });
  if (!existingProduct) throw new Error("Produit introuvable");

  // Validate with Zod before touching the DB
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
    throw new Error(parsed.error.issues.map((e: { message: string }) => e.message).join(' | '));
  }

  // Si c'est un vendeur, il ne peut modifier que ses propres produits
  if (session.user.role === "VENDOR" && existingProduct.brandId !== session.user.id) {
    throw new Error("Accès refusé");
  }

  const prix_ht = parseFloat(data.price || data.prix_ht);
  const tva = parseFloat(data.tva ?? existingProduct.tva.toString());
  const prix_ttc = parseFloat(data.prix_ttc) || parseFloat((prix_ht * (1 + tva / 100)).toFixed(2));

  const product = await prisma.produit.update({
    where: { id },
    data: {
      nom: data.title || data.nom,
      description: data.description,
      prix_ht,
      prix_ttc,
      stock: parseInt(data.stock),
      images: data.images ? data.images.split(',').map((u: string) => u.trim()).filter(Boolean) : (data.image ? [data.image] : undefined),
      threeDStyle: data.threeDStyle,
    }
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

export async function getProduitsByCategory(category: string) {
  return prisma.produit.findMany({
    where: {
      categories: { has: category },
      actif: true
    },
    include: { brand: true }
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
    const avg = product.avis.length > 0 ? product.avis.reduce((acc, r) => acc + r.rating, 0) / product.avis.length : 0;
    await prisma.produit.update({
      where: { id: productId },
      data: { 
        rating: avg,
        reviews: product.avis.length
      }
    });

    // Notify Vendor
    if (product.brandId) {
      await createNotification(
        product.brandId,
        'REVIEW',
        'Nouvel avis client',
        `${data.authorName} a laissé une note de ${data.rating}/5 sur ${product.nom}.`
      );
    }
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

  // Notify Vendors
  const vendorIds = [...new Set(data.items.map((item: any) => item.brandId))];
  for (const brandId of vendorIds) {
    if (brandId) {
      await createNotification(
        brandId as string,
        'ORDER',
        'Nouvelle commande reçue !',
        `Une nouvelle commande (${commande.numero_commande}) vient d'être passée pour vos produits.`
      );
    }
  }

  revalidatePath('/admin');
  return commande;
}

export async function processOrderPayment(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.commande.findUnique({
      where: { id: orderId },
      include: {
        lignes_commande: {
          include: {
            produit: true
          }
        }
      }
    });

    if (!order) throw new Error("Commande introuvable");
    
    if (order.statut === 'PAYEE' || order.statut === 'VALIDEE' || order.statut === 'EXPEDIEE' || order.statut === 'LIVREE') {
      return order;
    }

    const updatedOrder = await tx.commande.update({
      where: { id: orderId },
      data: { statut: 'PAYEE' }
    });

    const COMMISSION_RATE = 0.05;
    const vendorIds = new Set<string>();

    for (const line of order.lignes_commande) {
      const product = line.produit;
      if (product) {
        const newStock = Math.max(0, product.stock - line.quantite);
        await tx.produit.update({
          where: { id: product.id },
          data: { stock: newStock }
        });

        if (product.brandId) {
          vendorIds.add(product.brandId);
          const lineTotal = Number(line.prix_unitaire_ht) * line.quantite;
          const netEarnings = lineTotal * (1 - COMMISSION_RATE);

          const wallet = await tx.wallet.findUnique({
            where: { brandId: product.brandId }
          });

          if (wallet) {
            await tx.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: netEarnings } }
            });
          } else {
            await tx.wallet.create({
              data: {
                brandId: product.brandId,
                balance: netEarnings
              }
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
          message: `La commande (${order.numero_commande}) a été payée. Vos gains nets ont été crédités sur votre portefeuille.`
        }
      });
    }

    return updatedOrder;
  });
}

export async function updateOrderStatus(orderId: string, status: any) {
  if (status === 'PAYEE' || status === 'VALIDEE') {
    await processOrderPayment(orderId);
  } else {
    await prisma.commande.update({
      where: { id: orderId },
      data: { statut: status }
    });
  }
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

  return prisma.brand.create({
    data: {
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      email,
      password: hashedPassword,
      title: name,
      tagline: tagline || 'Luxe & Innovation',
      description: 'Partenaire Immersive',
      story: '...',
      values: '...',
      impact: '...',
      image: imageUrl,
    }
  });
}

// --- ACTIONS ANALYTIQUES & DIVERS ---

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
        where: { statut: { in: ['PAYEE', 'VALIDEE', 'EXPEDIEE'] } }
      }),
      prisma.commande.aggregate({
        _avg: { montant_total: true }
      })
    ]);

    let salesReport: any[] = [];
    try {
      salesReport = await prisma.$queryRaw`SELECT * FROM vue_analyse_ventes ORDER BY mois DESC` as any[];
    } catch (e) {
      console.warn("View vue_analyse_ventes missing, using empty report.");
    }
    
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
  } catch (error) {
    console.error("Analytics Error:", error);
    return {
      stats: { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      chartData: []
    };
  }
}

export async function getVendorAnalytics(brandId: string) {
  const [ordersCount, revenueData] = await Promise.all([
    prisma.commande.count({
      where: {
        lignes_commande: {
          some: { produit: { brandId } }
        }
      }
    }),
    prisma.ligneCommande.findMany({
      where: {
        produit: { brandId },
        commande: {
          statut: { in: ['PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE'] }
        }
      },
      select: {
        prix_unitaire_ht: true,
        quantite: true
      }
    })
  ]);

  const totalRevenue = revenueData.reduce((acc, curr) => {
    return acc + (Number(curr.prix_unitaire_ht) * curr.quantite);
  }, 0);

  // Get chart data for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const vendorOrders = await prisma.commande.findMany({
    where: {
      lignes_commande: { some: { produit: { brandId } } },
      date_commande: { gte: thirtyDaysAgo }
    },
    include: {
      lignes_commande: {
        where: { produit: { brandId } }
      }
    },
    orderBy: { date_commande: 'asc' }
  });

  // Group by date in JS
  const chartMap = new Map();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    chartMap.set(dateStr, { name: dateStr, revenue: 0, orders: 0 });
  }

  vendorOrders.forEach(order => {
    const dateStr = new Date(order.date_commande).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    if (chartMap.has(dateStr)) {
      const data = chartMap.get(dateStr);
      const orderRevenue = order.lignes_commande.reduce((sum, item) => sum + (Number(item.prix_unitaire_ht) * item.quantite), 0);
      data.revenue += orderRevenue;
      data.orders += 1;
    }
  });

  const chartData = Array.from(chartMap.values()).reverse();

  return {
    totalOrders: ordersCount,
    totalRevenue: totalRevenue,
    chartData: chartData
  };
}

export async function getUserProfile(id: string, role: string) {
  if (role === 'VENDOR') {
    return prisma.brand.findUnique({ where: { id } });
  } else {
    return prisma.client.findUnique({ where: { id } });
  }
}

export async function updateProfile(id: string, role: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const prenom = formData.get('prenom') as string;
  const imageFile = formData.get('imageFile') as File;
  const bannerFile = formData.get('bannerFile') as File;
  const themeColor = formData.get('themeColor') as string;
  let imageUrl = formData.get('existingImage') as string;
  let bannerUrl = formData.get('existingBanner') as string;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  if (bannerFile && bannerFile.size > 0) {
    bannerUrl = await uploadImage(bannerFile);
  }

  if (role === 'VENDOR') {
    await prisma.brand.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        image: imageUrl,
        banner: bannerUrl,
        themeColor: themeColor || "#06B6D4"
      } as any
    });
  } else {
    await prisma.client.update({
      where: { id },
      data: {
        nom: name,
        prenom: prenom || "",
        email,
        telephone: phone,
        image: imageUrl
      } as any
    });
  }
  
  revalidatePath('/[locale]/vendeur/dashboard', 'layout');
  revalidatePath('/[locale]/admin', 'layout');
}

export async function getNotifications(brandId: string) {
  return prisma.notification.findMany({
    where: { brandId },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
}

export async function markAsRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  });
}

export async function toggleBrandVerification(brandId: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions) as any;
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized");
  
  await prisma.brand.update({
    where: { id: brandId },
    data: { isVerified: !currentStatus }
  });
  
  revalidatePath('/admin/vendeurs');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteBrand(brandId: string) {
  const session = await getServerSession(authOptions) as any;
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized");
  
  await prisma.produit.deleteMany({ where: { brandId } });
  await prisma.brand.delete({ where: { id: brandId } });
  
  revalidatePath('/admin/vendeurs');
  revalidatePath('/admin');
  return { success: true };
}

export async function incrementBrandViews(id: string) {
  await prisma.brand.update({
    where: { id },
    data: { views: { increment: 1 } }
  });
}

export async function globalSearch(query: string) {
  const [products, brands] = await Promise.all([
    prisma.produit.findMany({
      where: {
        OR: [
          { nom: { contains: query } },
          { description: { contains: query } }
        ]
      },
      include: {
        brand: true,
      },
      take: 6
    }),
    prisma.brand.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { tagline: { contains: query } }
        ]
      },
      take: 3
    })
  ]);

  return {
    products: products.map(p => ({
      ...p,
      title: p.nom,
      price: Number(p.prix_ttc),
      image: p.images[0] || '/placeholder.png',
      brand: { name: p.brand?.name || 'Immersive Pro' },
      category: { name: p.categories[0] || 'Général' }
    })),
    brands: brands.map(b => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      tagline: b.tagline,
      image: b.image
    }))
  };
}

// --- ACTIONS WISHLIST ---

export async function toggleWishlist(productId: string) {
  const session = await getServerSession(authOptions) as any;
  const sessionId = session?.user?.id || "demo-session";
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
  const session = await getServerSession(authOptions) as any;
  const sessionId = session?.user?.id || "demo-session";
  const existing = await prisma.wishlist.findFirst({
    where: { sessionId, productId }
  });
  return !!existing;
}

export async function getWishlist(sessionId?: string) {
  let idToUse = sessionId;
  if (!idToUse) {
    const session = await getServerSession(authOptions) as any;
    idToUse = session?.user?.id || "demo-session";
  }
  return prisma.wishlist.findMany({
    where: { sessionId: idToUse },
    include: { produit: { include: { brand: true, category: true } } }
  });
}

export async function getRecommendedProducts(productId: string) {
  try {
    const product = await prisma.produit.findUnique({
      where: { id: productId },
      select: { categories: true, brandId: true }
    });

    if (!product) return [];

    return prisma.produit.findMany({
      where: {
        OR: [
          { categories: { hasSome: product.categories } },
          { brandId: product.brandId }
        ],
        id: { not: productId },
        actif: true
      },
      take: 6,
      include: { brand: true, category: true }
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return prisma.produit.findMany({
      where: { actif: true },
      take: 6,
      include: { brand: true, category: true }
    });
  }
}

// --- ADVANCED VENDOR ACTIONS ---

export async function getCoupons(brandId: string) {
  return prisma.coupon.findMany({
    where: { brandId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createCoupon(brandId: string, formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase();
  const discount = parseFloat(formData.get('discount') as string);
  const type = formData.get('type') as string;
  const expiresAt = new Date(formData.get('expiresAt') as string);

  await prisma.coupon.create({
    data: {
      code,
      discount,
      type,
      expiresAt,
      brandId
    }
  });
  revalidatePath('/vendeur/dashboard');
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/vendeur/dashboard');
}

export async function replyToReview(reviewId: string, reply: string) {
  await prisma.review.update({
    where: { id: reviewId },
    data: { reply }
  });
}

export async function getVendorWallet(brandId: string) {
  let wallet = await prisma.wallet.findUnique({
    where: { brandId },
    include: { requests: { orderBy: { createdAt: 'desc' } } }
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { brandId, balance: 0 },
      include: { requests: { orderBy: { createdAt: 'desc' } } }
    });
  }
  return wallet;
}

export async function requestWithdrawal(walletId: string, amount: number, method: string) {
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
  if (!wallet || Number(wallet.balance) < amount) {
    throw new Error("Solde insuffisant");
  }

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: walletId },
      data: { balance: { decrement: amount } }
    }),
    prisma.withdrawalRequest.create({
      data: { walletId, amount, method }
    })
  ]);
  revalidatePath('/vendeur/dashboard');
}

export async function createNotification(brandId: string, type: string, title: string, message: string) {
  return prisma.notification.create({
    data: { brandId, type, title, message }
  });
}

export async function validateCouponCode(code: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
    include: { brand: true }
  });

  if (!coupon) {
    throw new Error("Code promo introuvable");
  }

  if (!coupon.isActive) {
    throw new Error("Ce code promo est inactif");
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    throw new Error("Ce code promo a expiré");
  }

  return {
    id: coupon.id,
    code: coupon.code,
    discount: coupon.discount,
    type: coupon.type,
    brandId: coupon.brandId,
    brandName: coupon.brand.name
  };
}



