'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Sparkles, Instagram, Twitter, Youtube, CreditCard, Truck, RotateCcw, HeadphonesIcon, Facebook, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations('Footer');
  const th = useTranslations('Header');

  if (!pathname) return null;
  if (pathname.includes('/admin') || pathname.includes('/vendeur')) return null;
  
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
    { icon: Truck, label: t('fast_delivery'), sub: '1-7 Jours' },
    { icon: RotateCcw, label: t('free_return'), sub: '14 Jours' },
    { icon: ShieldCheck, label: t('secure_payment'), sub: 'Chiffré' },
    { icon: HeadphonesIcon, label: t('customer_support_247'), sub: '24h/24' },
  ];

  return (
    <footer className="relative bg-background border-t border-white/5 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Trust bar */}
      <div className="border-b border-white/5 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500">
                  <badge.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">{badge.label}</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-tighter mt-1">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-2xl">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tighter uppercase">Immersive</h2>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Marketplace Pro</p>
              </div>
            </Link>
            
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm">
              L&apos;excellence du e-commerce au Tchad. Une sélection rigoureuse de marques et créateurs pour une expérience shopping hors du commun.
            </p>

            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Navigation</h3>
            <ul className="space-y-4">
              {footerLinks.boutique.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Assistance</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Informations</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Bar */}
        <div className="mt-20 p-10 glass-card rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-white">Rejoindre l&apos;Insider</h3>
            <p className="text-sm text-white/40 font-light mt-1">Recevez nos dernières collections en avant-première.</p>
          </div>
          <form className="flex w-full md:w-auto gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="votre@email.com"
              className="flex-1 md:w-64 px-6 py-4 rounded-2xl glass text-white placeholder-white/20 outline-none focus:border-white/20 text-sm" 
            />
            <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all">
              S&apos;abonner
            </button>
          </form>
        </div>

        {/* Bottom Rights */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center sm:text-left">
            © 2026 Immersive Marketplace. N&apos;Djaména, Tchad. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Visa', 'Mastercard', 'Stripe', 'Airtel Money', 'Moov Money'].map((pay) => (
              <span key={pay} className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">{pay}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
