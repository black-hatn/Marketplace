import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rateLimit";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is not set.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // C — Rate limiting : 10 tentatives par compte par 15 min
        if (!checkRateLimit(`auth:${credentials.username}`, 10, 15 * 60 * 1000)) {
          throw new Error("Trop de tentatives. Réessayez dans 15 minutes.");
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword && credentials.username === adminEmail) {
          // Support both bcrypt hash ($2b$…) and legacy plaintext in ADMIN_PASSWORD env var
          const isAdminValid = adminPassword.startsWith('$2')
            ? await bcrypt.compare(credentials.password, adminPassword)
            : credentials.password === adminPassword;
          if (isAdminValid) {
            return { id: "admin", name: "Nouradine Admin", email: adminEmail, role: "ADMIN" };
          }
        }

        // Check Vendors in DB
        const vendor = await prisma.brand.findFirst({
          where: { email: credentials.username }
        });

        if (vendor) {
          const isPasswordValid = await bcrypt.compare(credentials.password, vendor.password);
          if (isPasswordValid) {
            return { id: vendor.id, name: vendor.name, email: vendor.email, role: "VENDOR" }
          }
        }

        // Check Customers (Clients) in DB
        const client = await prisma.client.findFirst({
          where: { email: credentials.username }
        });

        if (client) {
          const isPasswordValid = await bcrypt.compare(credentials.password, client.mot_de_passe_hash);
          if (isPasswordValid) {
            return { id: client.id, name: `${client.nom} ${client.prenom}`, email: client.email, role: client.role }
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
