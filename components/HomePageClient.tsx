'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Zap, Shield, Star, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  vendor: string;
  stock: number;
}

interface HomePageClientProps {
  products: Product[];
  clientsCount: number;
  produitsCount: number;
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HomePageClient({ products, clientsCount, produitsCount }: HomePageClientProps) {
  const t = useTranslations('Home');

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden selection:bg-white/20 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation spacer */}
      <div className="h-24 sm:h-32"></div>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
        
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-24 lg:pt-24 lg:pb-40 flex flex-col items-center justify-center text-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="flex flex-col items-center max-w-4xl mx-auto space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium tracking-wide text-white/80">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Le futur du commerce est là
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
              L'excellence <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                sans compromis.
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Découvrez une sélection exclusive de produits premium. Un design épuré, des performances inégalées et une expérience d'achat repensée.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 pt-8 w-full max-w-md mx-auto sm:max-w-none justify-center">
              <Link href="/produits" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wide hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                Explorer la collection <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="relative w-full sm:w-auto group">
                <div className="absolute inset-0 rounded-full bg-white/20 blur transition-all group-hover:bg-white/30"></div>
                <button className="relative w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Search className="w-4 h-4 text-white/60" /> Rechercher
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* METRICS SECTION */}
        <section className="py-12 border-y border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Membres Actifs', value: clientsCount > 0 ? \`+\${clientsCount}\` : '10k+' },
              { label: 'Produits Premium', value: produitsCount > 0 ? \`+\${produitsCount}\` : '500+' },
              { label: 'Villes Couvertes', value: '12+' },
              { label: 'Support Client', value: '24/7' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{stat.value}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Sélection Premium</h2>
              <p className="text-muted-foreground text-lg max-w-xl">Une curation minutieuse des pièces les plus exceptionnelles de notre catalogue, pensée pour vous.</p>
            </div>
            <Link href="/produits" className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              Voir tout le catalogue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={product.id} 
                  className="group relative flex flex-col gap-4 rounded-3xl p-4 glass-card hover:border-white/20 transition-all duration-500 cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-surface-light">
                    {/* Placeholder image representation since we don't know the exact URLs */}
                    <Image 
                      src={product.image.startsWith('http') ? product.image : '/placeholder.png'} 
                      alt={product.title}
                      fill
                      unoptimized={true}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full glass text-xs font-medium text-white shadow-sm backdrop-blur-md">
                        {product.category}
                      </span>
                    </div>
                    <button className="absolute top-4 right-4 p-2.5 rounded-full glass text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{product.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-muted-foreground text-sm">{product.vendor}</span>
                      <span className="text-lg font-medium text-white">{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="w-full py-24 flex items-center justify-center glass-card rounded-3xl">
              <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </section>

        {/* FEATURES BENTO GRID */}
        <section className="py-24 mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-16 text-center">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-3xl p-8 flex flex-col md:col-span-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Qualité Certifiée</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">Chaque produit de notre plateforme est rigoureusement vérifié par nos experts pour vous garantir une authenticité totale et une qualité irréprochable.</p>
              <div className="mt-auto h-32 w-full rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              </div>
            </div>
            
            <div className="glass-card rounded-3xl p-8 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Livraison Éclair</h3>
              <p className="text-muted-foreground text-lg">Recevez vos commandes en un temps record grâce à notre réseau logistique optimisé.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Service VIP</h3>
              <p className="text-muted-foreground text-lg">Un support client dédié disponible 24/7 pour répondre à toutes vos exigences.</p>
            </div>
            
            <div className="glass-card rounded-3xl p-8 flex flex-col md:col-span-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">Devenez Partenaire</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md">Vous êtes un créateur ou une marque premium ? Rejoignez notre écosystème et proposez vos produits à une clientèle exclusive.</p>
                <Link href="/vendre" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
                  Ouvrir ma boutique <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
