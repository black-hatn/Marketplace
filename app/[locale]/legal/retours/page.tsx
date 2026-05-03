import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, PackageCheck, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Retour | Marketplace Immersive',
  description: 'Retours simples et remboursement rapide. 14 jours pour changer d\'avis sur vos achats.',
};

const steps = [
  { icon: Clock, title: '1. Initiez le retour', desc: 'Envoyez un email à retours@marketplace-immersive.com avec votre numéro de commande et le motif du retour. Délai : 14 jours après réception.' },
  { icon: PackageCheck, title: '2. Préparez le colis', desc: 'Emballez le produit dans son emballage d\'origine. Joignez le bon de retour que nous vous enverrons par email. Le produit doit être intact et non utilisé.' },
  { icon: RotateCcw, title: '3. Renvoyez le produit', desc: 'Déposez le colis auprès du transporteur indiqué. Les frais de retour sont à votre charge sauf en cas de produit défectueux ou d\'erreur de notre part.' },
  { icon: CheckCircle, title: '4. Remboursement', desc: 'Dès réception et vérification du colis (2-3 jours), nous procédons au remboursement intégral sous 14 jours maximum sur votre moyen de paiement original.' },
];

export default function RetoursPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Service Client</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Politique de Retour</h1>
            </div>
          </div>
        </div>

        {/* Promise banner */}
        <div className="glass-card rounded-3xl border border-blue-500/10 bg-blue-500/5 p-8 text-center">
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">14 jours</p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">pour changer d'avis, sans questions.</p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Conformément à la réglementation sur la vente à distance, vous bénéficiez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation.
          </p>
        </div>

        {/* Process steps */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Comment faire un retour ?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {i < steps.length - 1 && <div className="hidden sm:block w-px flex-1 bg-slate-200 dark:bg-slate-700" />}
                </div>
                <div className="pb-6">
                  <p className="font-bold text-slate-900 dark:text-white">{step.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Conditions de retour</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Retours acceptés
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  'Produits dans leur état d\'origine',
                  'Emballage d\'origine conservé',
                  'Retour dans les 14 jours',
                  'Produits défectueux (frais offerts)',
                  'Erreur de notre part (frais offerts)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-500 dark:text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Exceptions (non remboursables)
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  'Produits personnalisés ou sur mesure',
                  'Produits descellés (hygiène, santé)',
                  'Produits endommagés par le client',
                  'Produits utilisés et portant des traces',
                  'Retour après 14 jours',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Remboursement */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Délais de remboursement</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { method: 'Stripe (carte)', delay: '5 à 10 jours ouvrés' },
              { method: 'Avoir Marketplace', delay: '24-48h — utilisable immédiatement' },
              { method: 'Mobile Money', delay: '3 à 5 jours ouvrés' },
            ].map((item) => (
              <div key={item.method} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{item.method}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.delay}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Une question sur votre retour ?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Notre équipe répond en moins de 24h ouvrées.</p>
          </div>
          <a
            href="mailto:retours@marketplace-immersive.com"
            className="flex-shrink-0 px-6 py-3 rounded-2xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-400 transition-colors"
          >
            Contacter le service retours
          </a>
        </div>

        <div className="flex flex-wrap gap-4 text-sm pt-4">
          <Link href="/legal/cgv" className="text-cyan-600 dark:text-cyan-400 hover:underline">CGV</Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/mentions-legales" className="text-cyan-600 dark:text-cyan-400 hover:underline">Mentions Légales</Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/confidentialite" className="text-cyan-600 dark:text-cyan-400 hover:underline">Confidentialité</Link>
        </div>
      </div>
    </main>
  );
}
