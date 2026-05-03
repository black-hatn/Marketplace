import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scale, FileText, Shield, Package, RotateCcw, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: "Conditions Générales de Vente de la Marketplace Immersive. Lisez nos CGV avant toute commande.",
};

const sections = [
  {
    icon: Scale,
    title: '1. Champ d\'application',
    content: `Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les ventes conclues sur la plateforme Marketplace Immersive (ci-après "la Plateforme") entre la société éditrice et tout acheteur (ci-après "le Client") effectuant une commande via le site.

En passant commande, le Client accepte sans réserve les présentes CGV. La Plateforme se réserve le droit de modifier ces conditions à tout moment ; les CGV applicables sont celles en vigueur à la date de la commande.`,
  },
  {
    icon: Package,
    title: '2. Produits et disponibilité',
    content: `Les produits présentés sur la Plateforme sont proposés dans la limite des stocks disponibles. En cas d'indisponibilité après validation de la commande, le Client sera informé par email dans les 48 heures ouvrées et pourra opter pour un remboursement intégral ou un avoir.

Les photographies des produits sont fournies à titre illustratif. Des légères variations de couleur peuvent exister selon les paramètres de votre écran.`,
  },
  {
    icon: CreditCard,
    title: '3. Prix et paiement',
    content: `Les prix sont indiqués en Francs CFA (XAF) toutes taxes comprises (TTC). La Plateforme se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la validation de la commande.

Le paiement s'effectue en ligne via Stripe, plateforme sécurisée certifiée PCI DSS. Aucune donnée bancaire n'est stockée sur nos serveurs. Les paiements acceptés sont : Visa, Mastercard, American Express, Apple Pay et Google Pay.`,
  },
  {
    icon: Package,
    title: '4. Livraison',
    content: `Les commandes sont expédiées dans un délai de 24 à 72 heures ouvrées après confirmation du paiement. Les délais de livraison varient selon la destination :

• N'Djaména et banlieue : 1 à 3 jours ouvrés
• Autres villes du Tchad : 3 à 7 jours ouvrés
• International (zone CEMAC) : 7 à 14 jours ouvrés

Les frais de livraison sont offerts pour toute commande supérieure à 100 000 XAF.`,
  },
  {
    icon: RotateCcw,
    title: '5. Droit de rétractation et retours',
    content: `Conformément aux dispositions légales applicables, le Client dispose d'un délai de 14 jours à compter de la réception du colis pour exercer son droit de rétractation, sans avoir à justifier de motif.

Pour exercer ce droit, le Client doit notifier sa décision par email à retours@marketplace-immersive.com. Les produits doivent être retournés dans leur état d'origine, complets et dans leur emballage d'origine.

Le remboursement sera effectué dans un délai de 14 jours suivant la réception du retour, par le même moyen de paiement utilisé lors de l'achat.

Exceptions : les produits personnalisés, les denrées périssables et les produits hygiéniques descellés ne peuvent pas être retournés.`,
  },
  {
    icon: Shield,
    title: '6. Garanties',
    content: `Tous les produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, conformément à la réglementation en vigueur. En cas de défaut de conformité, le Client peut demander la réparation ou le remplacement du produit dans un délai de 2 ans à compter de la livraison.`,
  },
  {
    icon: Scale,
    title: '7. Responsabilité',
    content: `La responsabilité de la Plateforme ne saurait être engagée pour les dommages résultant d'une utilisation inappropriée des produits, d'un cas de force majeure, ou du fait d'un tiers. La Plateforme ne saurait être tenue responsable des retards ou manquements dus à des circonstances hors de son contrôle raisonnable.`,
  },
  {
    icon: Scale,
    title: '8. Propriété intellectuelle',
    content: `L'ensemble des contenus présents sur la Plateforme (textes, images, logos, vidéos) sont protégés par le droit de la propriété intellectuelle. Toute reproduction, totale ou partielle, est strictement interdite sans l'autorisation préalable et écrite de la Plateforme.`,
  },
  {
    icon: Scale,
    title: '9. Données personnelles',
    content: `La collecte et le traitement des données personnelles sont régis par notre Politique de Confidentialité, accessible depuis le bas de chaque page. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données.`,
  },
  {
    icon: Scale,
    title: '10. Droit applicable et litiges',
    content: `Les présentes CGV sont soumises au droit tchadien. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents de N'Djaména seront seuls compétents.

Pour toute réclamation, contactez notre service client à : support@marketplace-immersive.com`,
  },
];

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Juridique</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Conditions Générales de Vente
              </h1>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-black/5 dark:border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Dernière mise à jour :</span>{' '}
              1er mai 2026
            </p>
            <span className="hidden sm:block text-slate-300 dark:text-slate-600">•</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Version :</span> 2.0
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="glass-card rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-8 mb-8">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Marketplace Immersive (SARL au capital de 1 000 000 XAF, immatriculée au RCCM de N'Djaména sous le numéro TC-NDJ-2024-B-0001, dont le siège social est situé Avenue Charles de Gaulle, N'Djaména, Tchad) exploite la plateforme de commerce électronique accessible à l'adresse <span className="font-semibold text-cyan-600 dark:text-cyan-400">tchad-market.vercel.app</span>.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-sm">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link href="/legal/mentions-legales" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Mentions Légales
          </Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/confidentialite" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Politique de confidentialité
          </Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link href="/legal/retours" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Politique de retour
          </Link>
        </div>
      </div>
    </main>
  );
}
