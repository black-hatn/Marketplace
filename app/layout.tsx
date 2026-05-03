import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { WebsiteJsonLd } from '@/components/JsonLd';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Plateforme Immersive | Mode, Tech & Design',
    template: '%s | Plateforme Immersive'
  },
  description: 'L’avenir du e-commerce multi-sectoriel. Une expérience immersive, des marques engagées et une navigation visuelle de pointe.',
  keywords: ['e-commerce', 'luxe', 'tech', 'mode durable', 'design immersif'],
  authors: [{ name: 'Plateforme Immersive' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://marketplace-immersive.com',
    siteName: 'Plateforme Immersive',
    title: 'Plateforme Immersive | L’expérience shopping du futur',
    description: 'Découvrez une sélection exclusive de produits premium dans un environnement digital immersif.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Plateforme Immersive',
      },
    ],
  },
};

import { Footer } from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="scroll-smooth">
      <head>
        <WebsiteJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 transition-colors duration-500`}>
        <Providers>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              className: 'glass-card !bg-white/80 dark:!bg-slate-900/80 !text-slate-900 dark:!text-white border border-black/5 dark:border-white/10 !rounded-2xl !px-6 !py-4 shadow-xl',
            }}
          />
          <SiteHeader />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
