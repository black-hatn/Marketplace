import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check Admin from Env
        const adminEmail = process.env.ADMIN_EMAIL || "nouradinezakariamahamat2@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Fatmah23";

        if (
          credentials?.username === adminEmail && 
          credentials?.password === adminPassword
        ) {
          return { id: "admin", name: "Nouradine Admin", email: adminEmail, role: "ADMIN" }
        }

        // 2. Check Vendors in DB
        const vendor = await prisma.brand.findFirst({
          where: {
            email: credentials?.username
          }
        });

        if (vendor && await bcrypt.compare(credentials?.password || "", vendor.password)) {
          return { id: vendor.id, name: vendor.name, email: vendor.email, role: "VENDOR" }
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
  secret: process.env.NEXTAUTH_SECRET || "super_secret_key_for_dev_only",
}
