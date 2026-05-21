'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight, ShoppingBag, Sparkles, Car, Building2, Briefcase,
  CheckCircle2, Smartphone, Home as HomeIcon, Package, Shield,
  MessageCircle, MapPin, Star, BadgeCheck, Truck, Zap, Users,
  Phone, TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { SearchHero } from './SearchHero';

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

const categories = [
  { name: 'Immobilier',   icon: Building2,   color: 'bg-amber-50   text-amber-600   border-amber-100',   hover: 'hover:bg-amber-100'   },
  { name: 'Véhicules',    icon: Car,          color: 'bg-blue-50    text-blue-600    border-blue-100',    hover: 'hover:bg-blue-100'    },
  { name: 'Électronique', icon: Smartphone,   color: 'bg-violet-50  text-violet-600  border-violet-100',  hover: 'hover:bg-violet-100'  },
  { name: 'Emploi',       icon: Briefcase,    color: 'bg-emerald-50 text-emerald-600 border-emerald-100', hover: 'hover:bg-emerald-100' },
  { name: 'Services',     icon: CheckCircle2, color: 'bg-cyan-50    text-cyan-600    border-cyan-100',    hover: 'hover:bg-cyan-100'    },
  { name: 'Mode',         icon: Sparkles,     color: 'bg-pink-50    text-pink-600    border-pink-100',    hover: 'hover:bg-pink-100'    },
  { name: 'Maison',       icon: HomeIcon,     color: 'bg-orange-50  text-orange-600  border-orange-100',  hover: 'hover:bg-orange-100'  },
  { name: 'Divers',       icon: Package,      color: 'bg-slate-50   text-slate-600   border-slate-200',   hover: 'hover:bg-slate-100'   },
];

const steps = [
  {
    step: '01',
    icon: ShoppingBag,
    title: 'Parcourez les annonces',
    desc: 'Des milliers d\'offres dans toutes les villes du Tchad. Filtrez par catégorie, ville ou prix.',
    color: 'bg-amber-500',
  },
  {
    step: '02',
    icon: MessageCircle,
    title: 'Contactez le vendeur',
    desc: 'Un seul clic pour contacter via WhatsApp ou appel direct. Rapide, simple, sans intermédiaire.',
    color: 'bg-emerald-500',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Finalisez la transaction',
    desc: 'Rencontrez en mains propres ou faites-vous livrer. Paiement à la livraison disponible.',
    color: 'bg-blue-500',
  },
];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: 'Vendeurs vérifiés',
    desc: 'Chaque boutique partenaire est contrôlée et certifiée par notre équipe avant publication.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Achats sécurisés',
    desc: 'Paiement en ligne sécurisé par Stripe ou Mobile Money (Airtel / Moov). Données chiffrées.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    icon: Truck,
    title: 'Livraison rapide',
    desc: 'Livraison sous 24h–48h à N\'Djaména et dans les principales villes du Tchad.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    icon: Phone,
    title: 'Support local',
    desc: 'Notre équipe est joignable directement sur WhatsApp pour vous assister en français.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
  },
];

const testimonials = [
  {
    name: 'Aïcha M.',
    city: 'N\'Djaména',
    rating: 5,
    text: 'J\'ai vendu mon téléphone en moins de 2 heures ! La plateforme est très simple et les acheteurs sont sérieux.',
    role: 'Vendeuse',
  },
  {
    name: 'Mahamat D.',
    city: 'Moundou',
    rating: 5,
    text: 'Excellent site, j\'ai trouvé exactement la pièce auto que je cherchais depuis des mois. Contact rapide via WhatsApp.',
    role: 'Acheteur',
  },
  {
    name: 'Fatime K.',
    city: 'N\'Djaména',
    rating: 5,
    text: 'Je gère ma boutique de mode depuis le dashboard vendeur. Mes commandes ont augmenté de 40% en 1 mois.',
    role: 'Vendeuse Pro',
  },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

function HomeProductCard({ product }: { product: Product }) {
  const title = product.title || 'Produit sans nom';
  const price = Number(product.price || 0);
  const image = product.image || '/placeholder.png';
  const category = product.category || 'Général';

  return (
    <Link
      href={`/produit/${product.id}` as any}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-white/5">
        <Image
          src={(image.startsWith('http') || image.startsWith('/')) ? image : '/placeholder.png'}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 shadow-sm">
          {category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-snug">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-white/30">
          <MapPin className="w-3 h-3 text-amber-500" />
          <span>{(product as any).city || "N'Djaména"}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-base font-black text-slate-900 dark:text-white">
            {price > 0 ? price.toLocaleString('fr-FR') : '—'}
            <span className="text-[10px] font-semibold text-slate-400 dark:text-white/40 ml-1">FCFA</span>
          </p>
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
            <Star className="w-3 h-3 fill-amber-400" /> 4.5
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePageClient({ products, clientsCount, produitsCount }: HomePageClientProps) {
  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen font-sans selection:bg-primary/20 selection:text-primary">

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06),_transparent_65%)] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <SearchHero />

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, label: 'Annonces actives',  value: `${produitsCount > 0 ? produitsCount.toLocaleString() : '500'}+`, color: 'text-amber-500' },
              { icon: Users,      label: 'Membres inscrits',  value: `${clientsCount > 0 ? clientsCount.toLocaleString() : '2 000'}+`, color: 'text-blue-500' },
              { icon: BadgeCheck, label: 'Vendeurs certifiés',value: '150+',   color: 'text-emerald-500' },
              { icon: MapPin,     label: 'Villes couvertes',  value: '23',     color: 'text-violet-500' },
            ].map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="show"
                variants={FADE_UP}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] shadow-sm"
              >
                <div className={`w-8 h-8 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center flex-shrink-0 shadow-sm ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-lg font-black leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-semibold text-slate-400 leading-tight mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORIES ───────────────────────────────────── */}
      <section className="border-y border-slate-100 dark:border-white/[0.04] bg-white dark:bg-[#050505] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Explorez par catégorie</h2>
            <Link href="/categories" className="text-[11px] font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 uppercase tracking-widest">
              Tout voir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={FADE_UP}
              >
                <Link
                  href={`/produits?category=${encodeURIComponent(cat.name)}` as any}
                  className={`flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl border ${cat.color} ${cat.hover} transition-all duration-200 group cursor-pointer`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                    <cat.icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. COMMENT ÇA MARCHE ────────────────────────────── */}
      <section className="py-16 bg-slate-50 dark:bg-white/[0.01]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-3">Simple & Rapide</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
              Achetez ou vendez en <span className="text-gradient-gold">3 étapes.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto text-sm">
              Pas de complication. Trouvez, contactez et concluez — tout depuis votre téléphone.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connecting line desktop */}
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px border-t-2 border-dashed border-slate-200 dark:border-white/10 z-0" />

            {steps.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={FADE_UP}
                className="relative z-10 flex flex-col items-center text-center p-8 bg-white dark:bg-white/[0.02] rounded-3xl border border-slate-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-2">Étape {s.step}</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRODUITS RÉCENTS ─────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/[0.05] pb-6 mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Fraîchement publiées</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                Dernières <span className="text-gradient-gold">Annonces.</span>
              </h2>
            </div>
            <Link
              href="/produits"
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={FADE_UP}
              >
                <HomeProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl"
            >
              <ShoppingBag className="w-4 h-4" />
              Voir toutes les annonces
            </Link>
          </div>
        </section>
      )}

      {/* ── 5. CONFIANCE ────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 dark:bg-white/[0.01] border-y border-slate-100 dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-3">Pourquoi nous choisir</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
              Une plateforme <span className="text-gradient-gold">de confiance.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPoints.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={FADE_UP}
                className="p-7 bg-white dark:bg-white/[0.02] rounded-3xl border border-slate-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${t.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <t.icon className={`w-6 h-6 ${t.color}`} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{t.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TÉMOIGNAGES ──────────────────────────────────── */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-3">Ils nous font confiance</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
            Ce que disent <span className="text-gradient-gold">nos membres.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={FADE_UP}
              className="p-7 bg-white dark:bg-white/[0.02] rounded-3xl border border-slate-100 dark:border-white/[0.06] shadow-sm flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. BANNER WHATSAPP ──────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-[#075E54] p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_60%)] pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Une question ? On répond sur WhatsApp.
            </h3>
            <p className="text-white/70 text-sm font-medium">
              Notre équipe est disponible 7j/7 pour vous aider à acheter, vendre ou créer votre boutique.
            </p>
          </div>
          <a
            href="https://wa.me/23560909092?text=Bonjour%2C%20j'ai%20une%20question%20sur%20Immersive%20Marketplace."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#075E54] font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl"
          >
            <MessageCircle className="w-4 h-4" />
            Nous contacter
          </a>
        </motion.div>
      </section>

      {/* ── 8. CTA VENDEUR ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-slate-950 dark:bg-black/60 border border-white/[0.06] p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.12),_transparent_60%)] pointer-events-none" />
          <div className="flex-1 space-y-5 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-black uppercase tracking-[0.3em]">
              <Zap className="w-3 h-3" /> Gratuit pour démarrer
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Publiez votre annonce<br />
              <span className="text-gradient-gold">gratuitement.</span>
            </h2>
            <p className="text-slate-400 text-base font-medium max-w-md">
              Rejoignez des milliers de vendeurs actifs au Tchad. Créez votre boutique en 2 minutes et commencez à vendre dès aujourd'hui.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-700 text-slate-950 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-2xl shadow-amber-500/10"
              >
                Créer ma boutique <Sparkles className="w-4 h-4" />
              </Link>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-bold text-[11px] transition-all"
              >
                Parcourir le catalogue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              alt="Dashboard vendeur Immersive"
              fill
              className="object-cover opacity-30 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 space-y-1">
              <p className="text-xl font-black text-white tracking-tight">Dashboard Vendeur Pro</p>
              <p className="text-xs text-amber-400 font-black uppercase tracking-widest">Inclus gratuitement</p>
            </div>
            {/* Fake stats overlay */}
            <div className="absolute top-6 right-6 space-y-2">
              {[
                { label: 'Ventes du mois', value: '340 000 F' },
                { label: 'Commandes', value: '28' },
              ].map((s, i) => (
                <div key={i} className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-right">
                  <p className="text-white font-black text-sm">{s.value}</p>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
