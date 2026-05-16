import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { WebsiteJsonLd } from '@/components/JsonLd';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/Providers';
import { Footer } from '@/components/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Marketplace Premium | L’excellence au Tchad',
    template: '%s | Marketplace Premium'
  },
  description: 'Découvrez l’avenir du e-commerce au Tchad. Une sélection exclusive de produits premium et une expérience immersive inédite.',
  keywords: ['e-commerce', 'luxe', 'Tchad', 'N’Djaména', 'premium'],
  authors: [{ name: 'Immersive Team' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://marketplace-immersive.com',
    siteName: 'Marketplace Premium',
    title: 'Marketplace Premium | L’expérience shopping du futur',
    description: 'Une sélection exclusive de produits premium dans un environnement digital immersif.',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth dark">
      <head>
        <WebsiteJsonLd />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground transition-colors duration-500`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                className: 'glass !bg-black/80 !text-white !border-white/5 !rounded-2xl !px-6 !py-4 shadow-2xl backdrop-blur-xl',
              }}
            />
            <SiteHeader />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
