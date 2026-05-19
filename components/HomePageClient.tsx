'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Smartphone, 
  CheckCircle2, 
  Sparkles,
  Car,
  Building2,
  Briefcase,
  MessageCircle,
  Phone,
  Home as HomeIcon,
  Package
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { SearchHero } from './SearchHero';
import { ProductCard } from './ProductCard';
import { BentoGrid } from './BentoGrid';

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
  { name: 'Immobilier',    icon: Building2,    bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Véhicules',     icon: Car,           bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Emploi',        icon: Briefcase,     bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Services',      icon: CheckCircle2,  bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Électronique',  icon: Smartphone,    bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Mode',          icon: Sparkles,      bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Maison',        icon: HomeIcon,      bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
  { name: 'Divers',        icon: Package,       bg: 'bg-amber-500/5 dark:bg-amber-500/5',   color: 'text-amber-500'   },
];

export default function HomePageClient({ products, clientsCount, produitsCount }: HomePageClientProps) {
  const t = useTranslations('Home');

  return (
    <div className="bg-white dark:bg-[#030303] min-h-screen pb-32 font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* 1. HERO */}
      <section className="relative pt-16 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.03),_transparent_70%)] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <SearchHero />

          {/* STATS - compact row */}
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            {[
              { label: 'Annonces actives', value: `${produitsCount.toLocaleString()}+`, color: 'text-amber-500' },
              { label: 'Membres',          value: `${clientsCount.toLocaleString()}+`,  color: 'text-amber-500' },
              { label: 'Vendeurs Pro',     value: '150+',                              color: 'text-amber-500' },
              { label: 'Villes',           value: '23',                                color: 'text-amber-500' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/[0.04] shadow-sm">
                <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES — horizontal icon row, exactly like the design */}
      <section className="border-y border-black/5 dark:border-white/[0.04] bg-white dark:bg-[#030303] py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-start justify-between gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex-shrink-0 min-w-[80px]"
              >
                <Link 
                  href={`/produits?category=${encodeURIComponent(cat.name)}` as any}
                  className="flex flex-col items-center gap-2 group"
                >
                  {/* Colored circle */}
                  <div className={`w-16 h-16 rounded-full ${cat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md border border-amber-500/10 group-hover:border-amber-500/30 transition-all duration-300 ${cat.color}`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-amber-500 transition-colors text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 BENTO TRENDS SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Inspirations du Moment</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">Nos Tendances <span className="text-gradient-gold">Sélectionnées.</span></h2>
        </div>
        <BentoGrid />
      </section>

      {/* 3. RECENT ADS */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 space-y-10">
        <div className="flex items-end justify-between border-b border-black/5 dark:border-white/[0.04] pb-6">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Fraîchement publiées</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">Dernières <span className="text-gradient-gold">Annonces.</span></h2>
          </div>
          <Link href="/produits" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-all">
            Voir tout <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="max-w-[1400px] mx-auto px-6 mb-20">
        <div className="bg-black/90 dark:bg-black/45 rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 border border-white/[0.04] glass-premium">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.1),_transparent_60%)] pointer-events-none" />
          <div className="flex-1 space-y-5 relative z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Publiez votre annonce<br/><span className="text-gradient-gold">gratuitement.</span>
            </h2>
            <p className="text-slate-400 text-base font-medium max-w-md">
              Rejoignez des milliers de vendeurs actifs au Tchad et vendez rapidement grâce à notre plateforme intuitive.
            </p>
            <Link
              href="/vendre"
              className="inline-flex h-12 px-8 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-700 text-slate-950 font-black uppercase tracking-widest text-[10px] items-center gap-2 hover:scale-105 transition-transform shadow-2xl shadow-amber-500/10"
            >
              Publier maintenant <Sparkles className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              alt="Dashboard vendeur"
              fill
              className="object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-xl font-black text-white tracking-tight">Dashboard Vendeur Pro</p>
              <p className="text-xs text-amber-500 font-black uppercase tracking-widest mt-1">Inclus gratuitement</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
