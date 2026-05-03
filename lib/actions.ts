"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./upload";
import bcrypt from "bcryptjs";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(2, "Le titre est trop court"),
  price: z.preprocess((v) => parseFloat(v as string), z.number().positive("Le prix doit être positif")),
  stock: z.preprocess((v) => parseInt(v as string), z.number().int().nonnegative()),
  category: z.string().min(1, "La catégorie est requise"),
  brandId: z.string().min(1, "La marque est requise"),
  description: z.string().min(10, "La description est trop courte"),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
});

const vendorSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
});

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerAddress: z.string().min(5),
  customerCity: z.string().min(2),
  paymentMethod: z.string(),
  total: z.number().positive(),
  items: z.array(z.object({
    productId: z.string(),
    title: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1),
});

export async function createOrder(data: any) {
  const validated = orderSchema.parse(data);
  const order = await prisma.order.create({
    data: {
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerAddress: validated.customerAddress,
      customerCity: validated.customerCity,
      paymentMethod: validated.paymentMethod,
      total: validated.total,
      status: "PAID",
      items: {
        create: validated.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  // Update stock for each product
  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/mes-commandes");
  return order;
}

export async function getOrdersByEmail(email: string) {
  return prisma.order.findMany({
    where: { customerEmail: email },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = productSchema.parse(rawData);
  
  const imageFile = formData.get('imageFile') as File;
  
  let imageUrl = '';
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile);
    } catch (e) {
      console.error("Upload failed", e);
    }
  }

  const images = formData.get('images') as string || '[]';
  const shippingViaAgency = formData.get('shippingViaAgency') === 'on';
  const rating = 4.5;
  const reviews = 0;

  const id = validated.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

  const category = await prisma.category.upsert({
    where: { name: validated.category },
    update: {},
    create: { name: validated.category },
  });

  await prisma.product.create({
    data: {
      id,
      title: validated.title,
      price: validated.price,
      stock: validated.stock,
      image: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      images,
      description: validated.description,
      city: validated.city || "N'Djaména",
      neighborhood: validated.neighborhood,
      shippingViaAgency,
      rating,
      reviews,
      href: `/produit/${id}`,
      categoryId: category.id,
      brandId: validated.brandId,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/vendeur/dashboard');
  revalidatePath('/produits');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/produits');
}

export async function updateProduct(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = productSchema.parse(rawData);

  const shippingViaAgency = formData.get('shippingViaAgency') === 'on';

  let imageUrl = formData.get('image') as string;
  const imageFile = formData.get('imageFile') as File;
  
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  const images = formData.get('images') as string;

  await prisma.product.update({
    where: { id },
    data: {
      title: validated.title,
      price: validated.price,
      stock: validated.stock,
      image: imageUrl,
      images,
      description: validated.description,
      city: validated.city,
      neighborhood: validated.neighborhood,
      shippingViaAgency,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/vendeur/dashboard');
  revalidatePath('/produits');
}

export async function getAnalyticsData() {
  const [totalRevenue, totalOrders, products] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      include: { brand: true }
    })
  ]);

  const chartData = [
    { month: 'Lun', revenue: 400 },
    { month: 'Mar', revenue: 300 },
    { month: 'Mer', revenue: 600 },
    { month: 'Jeu', revenue: 800 },
    { month: 'Ven', revenue: 500 },
    { month: 'Sam', revenue: 900 },
    { month: 'Dim', revenue: 700 },
  ];

  const avgOrderValue = totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0;

  return {
    stats: {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      avgOrderValue,
    },
    chartData,
    topProducts: products
  };
}

export async function isWishlisted(productId: string) {
  return false; // Simulation
}

export async function getRecommendedProducts(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return [];

  return prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId },
    },
    take: 4,
    include: { brand: true, category: true },
  });
}

export async function toggleBrandVerification(brandId: string) {
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) return;

  await prisma.brand.update({
    where: { id: brandId },
    data: { isVerified: !brand.isVerified }
  });

  revalidatePath('/admin');
}

export async function registerVendor(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = vendorSchema.parse(rawData);

  const airtelMoney = formData.get('airtelMoney') as string;
  const moovMoney = formData.get('moovMoney') as string;
  const logoFile = formData.get('logoFile') as File;

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  let logoUrl = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800';
  if (logoFile && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile);
  }

  const slug = validated.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  try {
    await prisma.brand.create({
      data: {
        slug,
        name: validated.name,
        title: `${validated.name}, Boutique Officielle`,
        tagline: validated.tagline,
        description: `Boutique de confiance sur Plateforme Immersive.`,
        story: `Bienvenue chez ${validated.name}. Nous sommes fiers de vous présenter nos produits premium.`,
        values: "Qualité, Service, Intégrité.",
        impact: "Soutien à l'économie locale.",
        image: logoUrl,
        email: validated.email,
        phone: validated.phone,
        airtelMoney,
        moovMoney,
        password: hashedPassword,
      }
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('Une entreprise avec ce nom ou cet email existe déjà.');
    }
    throw error;
  }
}

export async function getVendorProducts(brandId: string) {
  return prisma.product.findMany({
    where: { brandId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function incrementBrandViews(brandId: string) {
  await prisma.brand.update({
    where: { id: brandId },
    data: { views: { increment: 1 } }
  });
}

export async function incrementProductViews(productId: string) {
  await prisma.product.update({
    where: { id: productId },
    data: { views: { increment: 1 } }
  });
}

export async function deleteBrand(brandId: string) {
  await prisma.product.deleteMany({ where: { brandId } });
  await prisma.brand.delete({ where: { id: brandId } });
  revalidatePath('/admin');
}

export async function globalSearch(query: string) {
  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ]
      },
      take: 5,
      include: { brand: true, category: true },
    }),
    prisma.brand.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { tagline: { contains: query } },
        ]
      },
      take: 3,
    })
  ]);
  return { products, brands };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath('/admin/commandes');
}

export async function deleteOrder(orderId: string) {
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath('/admin/commandes');
}

export async function addReview(productId: string, data: any) {
  const review = await prisma.review.create({
    data: {
      productId,
      rating: parseInt(data.rating as string),
      comment: data.comment,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
    }
  });
  revalidatePath(`/produit/${productId}`);
  return review;
}

export async function toggleWishlist(productId: string) {
  // Implementation stub
  return { wishlisted: true };
}

export async function getWishlist() {
  // Implementation stub
  return [];
}
