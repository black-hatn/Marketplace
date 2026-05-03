import { Produit as PrismaProduct } from '@prisma/client';

declare global {
  namespace PrismaJson {
  }
}

export type Product = PrismaProduct & {
  stock: number;
};
