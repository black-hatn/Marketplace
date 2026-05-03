import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité & RGPD | Marketplace Immersive',
  description: 'Politique de confidentialité RGPD-compliant de la Marketplace Immersive. Vos données, vos droits.',
};

const dataTypes = [
  { type: 'Données d\'identification', examples: 'Nom, prénom, email, numéro de téléphone', base: 'Exécution du contrat', retention: '3 ans après la dernière commande' },
  { type: 'Données de commande', examples: 'Adresse de livraison, historique d\'achat, montants', base: 'Obligation légale + contrat', retention: '10 ans (obligation comptable)' },
  { type: 'Données de navigation', examples: 'Adresse IP anonymisée, pages visitées, durée de session', base: 'Intérêt légitime', retention: '13 mois maximum' },
  { type: 'Données de paiement', examples: 'Référence transaction (jamais numéro de carte)', base: 'Contrat + obligation légale', retention: '5 ans' },
];

const rights = [
  { icon: Eye, title: 'Droit d\'accès', desc: 'Obtenir une copie de toutes vos données personnelles que nous détenons.' },
  { icon: UserCheck, title: 'Droit de rectification', desc: 'Corriger toute donnée inexacte ou incomplète vous concernant.' },
  { icon: Database, title: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données (\"droit à l\'oubli\").' },
  { icon: Lock, title: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format structuré et lisible par machine.' },
  { icon: Shield, title: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos données à des fins de prospection.' },
  { icon: Shield, title: 'Droit de limitation', desc: 'Demander la suspension temporaire du traitement de vos données.' },
];

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">RGPD Compliant</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Politique de Confidentialité</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Dernière mise à jour : 1er mai 2026 — Conforme au Règlement Général sur la Protection des Données (RGPD, UE 2016/679)
          </p>
        </div>

        {/* Intro */}
        <div className="glass-card rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-8">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            Marketplace Immersive accorde une importance primordiale à la protection de vos données personnelles. Le responsable du traitement est <strong>Marketplace Immersive SARL</strong>, RCCM TC-NDJ-2024-B-0001, Avenue Charles de Gaulle, N'Djaména, Tchad. Pour toute question : <a href="mailto:privacy@marketplace-immersive.com" className="text-emerald-600 dark:text-emerald-400 underline">privacy@marketplace-immersive.com</a>
          </p>
        </div>

        {/* Data we collect */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Données collectées et finalités</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Type</th>
                  <th className="text-left py-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Exemples</th>
                  <th className="text-left py-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Base légale</th>
                  <th className="text-left py-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dataTypes.map((row) => (
                  <tr key={row.type} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-2 font-semibold text-slate-900 dark:text-white">{row.type}</td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{row.examples}</td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{row.base}</td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Your rights */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Vos droits RGPD</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {rights.map((right) => (
              <div key={right.title} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <right.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{right.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{right.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-500/20">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Pour exercer vos droits, envoyez votre demande à{' '}
              <a href="mailto:privacy@marketplace-immersive.com" className="font-semibold text-emerald-600 dark:text-emerald-400 underline">
                privacy@marketplace-immersive.com
              </a>{' '}
              avec une copie de votre pièce d'identité. Réponse sous 30 jours maximum. Vous pouvez également saisir la CNIL (France) ou votre autorité de contrôle locale.
            </p>
          </div>
        </div>

        {/* Transfers */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Transferts hors UE</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Certains de nos prestataires (Vercel, Cloudinary) sont basés aux États-Unis. Ces transferts sont encadrés par les Clauses Contractuelles Types (CCT) de la Commission Européenne, garantissant un niveau de protection équivalent au RGPD.
          </p>
        </div>

        {/* Security */}
        <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Sécurité des données</h2>
          <div className="flex flex-wrap gap-3">
            {['Chiffrement TLS 1.3', 'Hachage bcrypt des mots de passe', 'Accès restreint aux données', 'Sauvegardes quotidiennes chiffrées', 'Audit de sécurité trimestriel', 'PCI DSS via Stripe'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20">
                <Shield className="h-3 w-3" /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Contact DPO */}
        <div className="glass-card rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Délégué à la Protection des Données (DPO)</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Pour toute question relative à vos données personnelles ou pour exercer vos droits :{' '}
            <a href="mailto:privacy@marketplace-immersive.com" className="text-emerald-600 dark:text-emerald-400 font-semibold underline">
              privacy@marketplace-immersive.com
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm pt-4">
          <Link href="/legal/cgv" className="text-cyan-600 dark:text-cyan-400 hover:underline">CGV</Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/mentions-legales" className="text-cyan-600 dark:text-cyan-400 hover:underline">Mentions Légales</Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/retours" className="text-cyan-600 dark:text-cyan-400 hover:underline">Politique de retour</Link>
        </div>
      </div>
    </main>
  );
}
