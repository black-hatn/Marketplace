'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { navigationSections } from '@/lib/content';
import PageTransition from '@/components/PageTransition';

export default function CategoriesPage() {
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
              <Layers className="w-4 h-4" /> 
              Exploration Sectorielle
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight text-white max-w-4xl"
            >
              Parcourez nos univers <br className="hidden sm:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                d'exception.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto font-light"
            >
              Une navigation fluide à travers nos écosystèmes produits, conçue pour vous offrir une expérience de découverte sans précédent au Tchad.
            </motion.p>
          </section>

          {/* Categories Grid */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {navigationSections.map((section, index) => (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative flex flex-col p-8 glass-card rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <Link
                    href={section.href}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-10 font-light">
                    {section.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group/link flex items-center justify-between px-6 py-4 rounded-2xl glass hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <span className="text-sm font-bold uppercase tracking-widest">{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
