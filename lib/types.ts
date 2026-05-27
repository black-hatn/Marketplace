import { Produit as PrismaProduct } from '@prisma/client';

declare global {
  namespace PrismaJson {
  }
}

export type Product = PrismaProduct & {
  stock: number;
};

/** Type étendu pour la session NextAuth avec role et id injectés via callbacks JWT */
export type ExtendedSession = {
  user: {
    id: string;
    role: 'ADMIN' | 'VENDOR' | 'CLIENT';
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};
