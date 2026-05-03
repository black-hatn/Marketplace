'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Sparkles, Instagram, Twitter, Youtube, CreditCard, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Footer');
  const th = useTranslations('Header');
  
  const footerLinks = {
    boutique: [
      { label: th('discover'), href: '/' },
      { label: th('shop'), href: '/produits' },
      { label: th('categories'), href: '/categories' },
      { label: th('brands'), href: '/marques' },
      { label: th('news'), href: '/produits?badge=Nouveauté' },
      { label: th('become_partner'), href: '/vendre' },
    ],
    support: [
      { label: t('help_center'), href: '#' },
      { label: t('track_order'), href: '/mes-commandes' },
      { label: t('return_policy'), href: '/legal/retours' },
      { label: t('shipping_info'), href: '#' },
      { label: t('contact_us'), href: 'mailto:support@marketplace-immersive.com' },
    ],
    legal: [
      { label: t('terms'), href: '/legal/cgv' },
      { label: t('legal_mentions'), href: '/legal/mentions-legales' },
      { label: t('privacy'), href: '/legal/confidentialite' },
      { label: t('cookies'), href: '/legal/confidentialite' },
    ],
  };

  const trustBadges = [
    { icon: Truck, label: t('fast_delivery'), sub: '1 à 7 jours' },
    { icon: RotateCcw, label: t('free_return'), sub: '14 jours' },
    { icon: CreditCard, label: t('secure_payment'), sub: 'Stripe PCI DSS' },
    { icon: HeadphonesIcon, label: t('customer_support_247'), sub: 'Toujours là' },
  ];

  return (
    <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
      {/* Trust badges bar */}
      <div className="border-b border-black/5 dark:border-white/10 py-6">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{badge.label}</p>
                  <p className="text-xs text-slate-500">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1600px] px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                  Immersive<span className="text-cyan-500">.</span>
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Marketplace Pro</p>
              </div>
            </Link>

            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              {t('newsletter_desc')}
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Newsletter</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t('newsletter_placeholder')}
                  className="flex-1 rounded-full bg-black/5 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white border border-black/5 dark:border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                />
                <button
                  type="submit"
                  className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  OK
                </button>
              </form>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter/X' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  <social.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Boutique links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{th('shop')}</h3>
            <ul className="space-y-3">
              {footerLinks.boutique.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{t('legal_mentions')}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment methods */}
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{t('accepted_payments')}</p>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'MC', 'Amex', 'Stripe'].map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-black/5 dark:border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 Marketplace Immersive SARL — N'Djaména, Tchad. {t('all_rights_reserved')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <Link href="/legal/cgv" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">CGV</Link>
            <Link href="/legal/mentions-legales" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Mentions légales</Link>
            <Link href="/legal/confidentialite" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Confidentialité</Link>
            <Link href="/legal/retours" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Retours</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
