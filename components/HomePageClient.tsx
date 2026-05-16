'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShoppingBag, 
  Zap, 
  Shield, 
  Star, 
  Search, 
  Smartphone, 
  Watch, 
  Home as HomeIcon, 
  Heart, 
  CheckCircle2, 
  Truck, 
  RotateCcw, 
  ChevronRight,
  Monitor,
  Gamepad,
  Shirt
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
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

const categories = [
  { name: 'Mode', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Électronique', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { name: 'Maison', icon: HomeIcon, color: 'bg-amber-100 text-amber-600' },
  { name: 'Santé & Beauté', icon: Heart, color: 'bg-rose-100 text-rose-600' },
  { name: 'Sports', icon: Gamepad, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Informatique', icon: Monitor, color: 'bg-purple-100 text-purple-600' },
];

export default function HomePageClient({ products, clientsCount, produitsCount }: HomePageClientProps) {
  const t = useTranslations('Home');

  return (
    <div className="bg-zinc-50 min-h-screen pb-20">
      
      {/* 1. HERO BANNER - Univers Market Style */}
      <section className="relative bg-[#1e40af] text-white overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1d4ed8] -skew-x-12 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 py-16 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">
              Bienvenue chez Univers Market
            </div>
            <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
              TOUT CE DONT VOUS AVEZ <br/>
              <span className="text-secondary italic underline decoration-white/20 underline-offset-8">BESOIN</span>, EN UN SEUL ENDROIT.
            </h1>
            <p className="text-blue-100 text-lg max-w-xl font-medium leading-relaxed">
              Découvrez notre vaste collection de produits de haute qualité aux meilleurs prix du marché.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/produits" className="btn-secondary text-sm">
                ACHETER MAINTENANT <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/produits" className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all text-sm">
                DÉCOUVRIR LES OFFRES
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative w-full aspect-square max-w-lg hidden lg:block"
          >
             <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
             <div className="relative glass p-6 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
                <Image 
                  src="/universe_tech_1778938607086.png" 
                  alt="Feature" 
                  fill 
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e40af]/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase inline-block mb-3 shadow-lg">Instantané</div>
                  <h3 className="text-2xl font-bold">Écouteurs Immersifs haut de gamme</h3>
                  <p className="text-sm text-blue-100 mt-1">Visualisez les tendances avec une interface fluide.</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES CIRCLES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-wrap items-center justify-center gap-12 lg:gap-20">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${cat.color}`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12 space-y-24">
        
        {/* Vedettes */}
        <div className="space-y-12">
          <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Nos Catégories Vedettes</h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>
            <Link href="/produits" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Tout voir <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, i) => (
              <motion.div 
                key={product.id}
                className="card-premium group relative flex flex-col p-6 h-[400px]"
              >
                <div className="relative flex-1 rounded-xl overflow-hidden bg-zinc-50 mb-6">
                  <Image src={product.image || '/placeholder.png'} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 text-secondary">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-secondary" />)}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400">(45)</span>
                  </div>
                  <h3 className="font-bold text-zinc-900 group-hover:text-primary transition-colors">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-zinc-900">{product.price.toLocaleString()} F</span>
                    <button className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meilleures Ventes */}
        <div className="space-y-12">
          <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Meilleures Ventes</h2>
              <div className="w-20 h-1 bg-secondary rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, i) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-zinc-100 hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-50 mb-4">
                  <Image src={product.image || '/placeholder.png'} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-zinc-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{product.category}</span>
                  <h4 className="text-sm font-bold text-zinc-900 truncate">{product.title}</h4>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-black text-primary">{product.price.toLocaleString()} F</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-secondary">
                      <Star className="w-3 h-3 fill-secondary" /> 4.8
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST FEATURES */}
      <section className="bg-white border-y border-zinc-200 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Livraison Gratuite</h4>
                  <p className="text-xs text-zinc-500">Pour toutes les commandes de +50k F</p>
                </div>
             </div>
             <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <RotateCcw className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Retour Sous 7 Jours</h4>
                  <p className="text-xs text-zinc-500">Garantie satisfait ou remboursé</p>
                </div>
             </div>
             <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Paiement Sécurisé</h4>
                  <p className="text-xs text-zinc-500">Transactions 100% sécurisées</p>
                </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
