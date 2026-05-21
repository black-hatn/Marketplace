'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { brands } from '@/lib/content';
import PageTransition from '@/components/PageTransition';

export default function BrandsPage() {
  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] overflow-hidden selection:bg-white/20 selection:text-white pb-24">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        {/* Navigation spacer */}
        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 space-y-24">
          {/* Header Section */}
          <section className="flex flex-col items-center text-center space-y-8 py-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-bold uppercase tracking-widest text-blue-400"
            >
              <Globe className="w-4 h-4" /> 
              Notre Écosystème
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight text-white max-w-4xl"
            >
              Un univers de marques <br className="hidden sm:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                inspirantes.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto font-light"
            >
              Parcourez des partenaires choisis pour leur engagement design, leur identité marque unique et leur promesse d'expérience haut de gamme.
            </motion.p>
          </section>

          {/* Brands Grid */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/marques/${brand.slug}`}
                  className="group relative flex flex-col h-full glass-card rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative h-72 w-full overflow-hidden bg-surface-light">
                    <Image 
                      src={brand.image} 
                      alt={brand.name} 
                      fill 
                      unoptimized={true}
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                        Partenaire Officiel
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {brand.name}
                      </h3>
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">
                      {brand.tagline}
                    </p>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed font-light line-clamp-3 mb-8">
                      {brand.impact}
                    </p>
                    
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black">
                        Découvrir la maison
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
