'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag, Zap, Shield, Star, Search, LayoutGrid, Sparkles, Box, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

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

export default function HomePageClient({ products, clientsCount, produitsCount }: HomePageClientProps) {
  const t = useTranslations('Home');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#030303] overflow-hidden selection:bg-blue-500/30 selection:text-white">
      
      {/* 1. IMMERSIVE HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/hero_abstract_bg_1778938363957.png" 
            alt="Hero Background" 
            fill 
            priority
            className="object-cover opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/20 via-transparent to-[#030303]" />
        </motion.div>

        {/* Content */}
        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">L&apos;expérience Ultime au Tchad</span>
          </div>
          
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black tracking-tighter text-white leading-[0.8] mb-8 italic">
            IMMER<span className="text-transparent stroke-text">SIVE</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed mb-12 tracking-wide">
            Définir les standards de l&apos;élégance digitale. <br/> 
            Une curation exclusive des objets les plus convoités.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/produits" className="group relative px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Explorer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button className="px-12 py-5 rounded-full glass border-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
              Visions 2026
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-white/40" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Scroll</span>
        </motion.div>
      </section>

      {/* 2. UNIVERSES (BENTO CATEGORIES) */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">Nos Univers</h2>
            <p className="text-white/30 text-lg max-w-md font-light">Naviguez à travers des mondes conçus pour l&apos;excellence.</p>
          </div>
          <Link href="/produits" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-colors flex items-center gap-2">
            Tout parcourir <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[800px]">
          {/* Main Universe: Tech */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-8 relative rounded-[3rem] overflow-hidden group border border-white/5"
          >
            <Image src="/universe_tech_1778938607086.png" alt="Tech" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 space-y-4">
              <span className="px-4 py-1 rounded-full glass text-[10px] font-black uppercase tracking-widest text-blue-400">Innovation</span>
              <h3 className="text-4xl font-bold text-white">Tech Immersive</h3>
              <p className="text-white/40 max-w-xs text-sm font-light">Le futur à portée de main. Des dispositifs qui redéfinissent le possible.</p>
            </div>
          </motion.div>

          {/* Secondary Universe: Style */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-4 relative rounded-[3rem] overflow-hidden group border border-white/5"
          >
            <div className="absolute inset-0 bg-[#111]" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <div className="absolute bottom-12 left-12 space-y-4">
              <span className="px-4 py-1 rounded-full glass text-[10px] font-black uppercase tracking-widest text-purple-400">Signature</span>
              <h3 className="text-3xl font-bold text-white">Style & Mode</h3>
              <p className="text-white/40 text-sm font-light italic">L&apos;expression de soi par le design.</p>
            </div>
          </motion.div>

          {/* Third Universe: Lifestyle */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-12 relative rounded-[3rem] overflow-hidden group border border-white/5 h-[300px]"
          >
            <div className="absolute inset-0 bg-white/[0.02]" />
            <div className="absolute inset-0 flex items-center justify-center">
               <h3 className="text-[10rem] font-black text-white/[0.02] absolute left-0 uppercase tracking-tighter -translate-x-1/4">Lifestyle</h3>
               <div className="relative z-10 text-center space-y-4">
                 <h4 className="text-4xl font-bold text-white">Art de Vivre</h4>
                 <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3 rounded-full glass border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">
                   Découvrir <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CURATED SELECTION (HORIZONTAL SCROLL) */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 mb-20">
          <div className="flex items-center gap-6">
             <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white italic">Curated <span className="font-light text-white/20">List</span></h2>
             <div className="flex-1 h-px bg-white/5" />
             <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors cursor-pointer">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </div>
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors cursor-pointer">
                  <ArrowRight className="w-4 h-4" />
                </div>
             </div>
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto px-6 sm:px-12 lg:px-24 no-scrollbar pb-12">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[350px] md:min-w-[450px] group"
            >
              <Link href={`/produit/${product.id}`} className="block space-y-6">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5">
                  <Image src={product.image || '/placeholder.png'} alt={product.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full glass text-[9px] font-black uppercase tracking-[0.2em] text-white">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-start justify-between px-2">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{product.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{product.vendor}</p>
                  </div>
                  <span className="text-xl font-black text-white">{product.price.toLocaleString()} F</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. METRICS / TRUST (MINIMAL) */}
      <section className="py-40 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Immersive Experience</h5>
            <p className="text-3xl font-bold text-white leading-tight">La référence de l&apos;excellence au Tchad depuis 2024.</p>
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <Shield className="w-5 h-5" /> Garanti 100% Authentique
            </div>
          </div>
          
          <div className="flex flex-col justify-center gap-12">
            <div className="space-y-1">
              <span className="text-5xl font-black text-white tracking-tighter">+{clientsCount}</span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Clients Satisfaits</p>
            </div>
            <div className="space-y-1">
              <span className="text-5xl font-black text-white tracking-tighter">+{produitsCount}</span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Produits d&apos;Exceptions</p>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <p className="text-white/20 font-light leading-relaxed">
              Nous ne vendons pas seulement des produits, nous proposons une vision. Chaque pièce est sélectionnée pour son histoire, sa qualité et son impact.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 blur-[200px]" />
        <div className="relative z-10 text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Prêt à élever vos standards ?</h2>
          <Link href="/produits" className="inline-flex items-center gap-4 px-12 py-6 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">
            Découvrir la collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
