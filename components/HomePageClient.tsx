'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Box, ShieldCheck, Star, MapPin } from 'lucide-react';
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

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

  return (
    <div ref={containerRef} className="relative w-full bg-black overflow-hidden selection:bg-white/20 selection:text-white font-sans">
      
      {/* 1. CINEMATIC HERO (The Watch) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/luxury_product_hero_1778939746461.png" 
            alt="Luxury Watch" 
            fill 
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </motion.div>

        <motion.div 
          style={{ y: textY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 glass mb-12">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/80">Immersive Excellence</span>
          </div>
          
          <h1 className="text-7xl sm:text-9xl lg:text-[12rem] font-light tracking-tighter text-white leading-none mb-12">
            L&apos;ÉLÉGANCE <br/>
            <span className="font-serif italic font-normal text-white/30">Absolue.</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-20">
            <Link href="/produits" className="group flex items-center gap-4 text-white text-sm font-black uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all">
              Explorer le catalogue <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-12 left-12 flex items-center gap-6">
           <div className="w-12 h-px bg-white/20" />
           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">N&apos;Djaména / Tchad</span>
        </div>
      </section>

      {/* 2. THE CURATION (Minimalist Horizontal Scroll) */}
      <section className="py-40 bg-black">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24 mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-light text-white tracking-tighter">La Sélection <br/> <span className="text-white/20">du mois.</span></h2>
              <p className="text-white/40 text-lg max-w-sm font-light leading-relaxed">Chaque pièce est une promesse de perfection, rigoureusement authentifiée.</p>
            </div>
            <Link href="/produits" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">Voir Tout</Link>
          </div>
        </div>

        <div className="flex gap-12 overflow-x-auto px-6 sm:px-12 lg:px-24 no-scrollbar pb-20">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="min-w-[300px] md:min-w-[500px] group cursor-pointer"
            >
              <Link href={`/produit/${product.id}`} className="block space-y-8">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <Image src={product.image || '/placeholder.png'} alt={product.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="space-y-3 px-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{product.category}</span>
                    <span className="text-lg font-light text-white">{product.price.toLocaleString()} F</span>
                  </div>
                  <h3 className="text-2xl font-light text-white tracking-tight">{product.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. THE PHILOSOPHY (Typography Section) */}
      <section className="py-60 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-60 bg-gradient-to-b from-white/20 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl space-y-16"
        >
          <h3 className="text-4xl md:text-6xl font-light text-white leading-tight tracking-tight">
            &quot;L&apos;innovation n&apos;est pas seulement technologique, <br/> 
            elle est aussi <span className="font-serif italic text-white/40">visuelle et sensorielle.</span>&quot;
          </h3>
          <div className="w-12 h-12 rounded-full border border-white/20 mx-auto flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white/40" />
          </div>
        </motion.div>
      </section>

      {/* 4. THE UNIVERSES (Full Width Visuals) */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Universe 1 */}
        <div className="relative h-[80vh] group overflow-hidden border-r border-white/5">
          <Image src="/universe_tech_1778938607086.png" alt="Tech" fill className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
            <h4 className="text-5xl font-light text-white tracking-tighter">Technology</h4>
            <p className="text-white/40 text-sm font-light max-w-xs leading-relaxed uppercase tracking-widest">Le futur est un art de vivre.</p>
            <Link href="/produits" className="px-10 py-4 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all">Découvrir</Link>
          </div>
        </div>

        {/* Universe 2 */}
        <div className="relative h-[80vh] group overflow-hidden">
          <Image src="/hero_abstract_bg_1778938363957.png" alt="Abstract" fill className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
            <h4 className="text-5xl font-light text-white tracking-tighter">Art & Style</h4>
            <p className="text-white/40 text-sm font-light max-w-xs leading-relaxed uppercase tracking-widest">L&apos;expression sans limite.</p>
            <Link href="/produits" className="px-10 py-4 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all">Découvrir</Link>
          </div>
        </div>
      </section>

      {/* 5. TRUST / STATS (Extreme Minimalism) */}
      <section className="py-40 bg-black border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <span className="text-5xl font-light text-white">+{clientsCount}</span>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Membres Actifs</p>
            </div>
            <div className="space-y-4">
              <span className="text-5xl font-light text-white">+{produitsCount}</span>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Pièces Uniques</p>
            </div>
            <div className="space-y-4">
              <span className="text-5xl font-light text-white">12</span>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Points de Relais</p>
            </div>
            <div className="space-y-4">
              <span className="text-5xl font-light text-white">24/7</span>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Conciergerie</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-60 flex flex-col items-center text-center px-6 bg-white text-black">
        <h2 className="text-6xl md:text-8xl font-light tracking-tighter mb-16 leading-tight">Rejoignez le cercle <br/> <span className="italic font-serif">Immersive.</span></h2>
        <Link href="/produits" className="group flex items-center gap-6 text-xs font-black uppercase tracking-[0.6em] hover:tracking-[0.8em] transition-all">
          Accéder à la collection <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
        </Link>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
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
