import { Product as PrismaProduct } from '@prisma/client';

declare global {
  namespace PrismaJson {
    // You can define JSON types here if needed
  }
}

// Extends the Product type to include missing fields for the IDE
export type Product = PrismaProduct & {
  stock: number;
  images: string;
};
