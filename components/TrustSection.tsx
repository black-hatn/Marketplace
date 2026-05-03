'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Star, Headset, Lock } from 'lucide-react';

const trustFeatures = [
  {
    title: 'Avis 5 étoiles',
    copy: 'Plus de 12 000 retours authentiques de clients satisfaits.',
    highlight: 'Note moyenne 4.9/5',
    icon: Star
  },
  {
    title: 'Sécurité renforcée',
    copy: 'Paiements certifiés PCI DSS, cryptage et politique RGPD claire.',
    highlight: 'Protection maximale',
    icon: Lock
  },
  {
    title: 'Support premium',
    copy: 'Accompagnement multi-vendeur avec SLA accéléré et assistance dédiée.',
    highlight: 'Expertise continue',
    icon: Headset
  }
];

export function TrustSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-card rounded-[2rem] p-8 shadow-lg dark:shadow-glow"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Confiance & transparence</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Une expérience e-commerce premium et responsable.</h2>
        </div>
        <span className="rounded-full bg-slate-100 dark:bg-slate-800/70 px-4 py-2 text-sm text-slate-600 dark:text-slate-200">
          Multi-vendeurs unifié
        </span>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {trustFeatures.map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-slate-950/70 p-6 transition hover:bg-black/[0.04] dark:hover:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.copy}</p>
            <p className="mt-4 text-sm font-semibold text-cyan-600 dark:text-cyan-200">{item.highlight}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-6 rounded-[2rem] border border-cyan-500/10 bg-cyan-500/5 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Certification & confiance</p>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 max-w-2xl">
            Badges dynamiques, contrôle qualité rigoureux et transparence totale sur l'origine des produits à chaque étape de votre commande.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-white/50 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border border-black/5 dark:border-white/10">ISO 9001</span>
          <span className="rounded-full bg-white/50 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border border-black/5 dark:border-white/10">PCI DSS</span>
          <span className="rounded-full bg-white/50 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border border-black/5 dark:border-white/10">RGPD COMPLIANT</span>
        </div>
      </div>
    </motion.section>
  );
}
