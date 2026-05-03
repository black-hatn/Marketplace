import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, Globe, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales | Marketplace Immersive',
  description: "Mentions légales obligatoires de la Marketplace Immersive.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Juridique</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Mentions Légales</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Dernière mise à jour : 1er mai 2026</p>
        </div>

        {/* Éditeur */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Éditeur du site</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Raison sociale', value: 'Marketplace Immersive SARL' },
              { label: 'Forme juridique', value: 'SARL' },
              { label: 'Capital social', value: '1 000 000 XAF' },
              { label: 'RCCM', value: 'TC-NDJ-2024-B-0001' },
              { label: 'Siège social', value: "Avenue Charles de Gaulle, N'Djaména, Tchad" },
              { label: 'Directeur de publication', value: 'Équipe Marketplace Immersive' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="mailto:contact@marketplace-immersive.com" className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
              <Mail className="h-5 w-5 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400">Email</p>
                <p className="text-xs font-semibold text-slate-900 dark:text-white break-all">contact@marketplace-immersive.com</p>
              </div>
            </a>
            <a href="tel:+23566000000" className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
              <Phone className="h-5 w-5 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400">Téléphone</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">+235 66 00 00 00</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Globe className="h-5 w-5 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400">Site</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">tchad-market.vercel.app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hébergeur */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Hébergeur</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Hébergeur principal', value: 'Vercel Inc. — San Francisco, CA, USA' },
              { label: 'Base de données', value: 'Supabase (PostgreSQL) — Frankfurt, Europe' },
              { label: 'Images & Médias', value: 'Cloudinary Inc. — USA' },
              { label: 'Paiements', value: 'Stripe Inc. — PCI DSS L1, Dublin, Irlande' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Propriété intellectuelle */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Propriété intellectuelle</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            L'ensemble du contenu de ce site (textes, images, vidéos, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est strictement interdite.
          </p>
        </div>

        {/* Cookies */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Cookies</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement (session, panier, thème). Aucun cookie publicitaire tiers n'est déposé sans votre consentement.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 text-sm pt-4">
          <Link href="/legal/cgv" className="text-cyan-600 dark:text-cyan-400 hover:underline">CGV</Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/confidentialite" className="text-cyan-600 dark:text-cyan-400 hover:underline">Confidentialité</Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/retours" className="text-cyan-600 dark:text-cyan-400 hover:underline">Retours</Link>
        </div>
      </div>
    </main>
  );
}
