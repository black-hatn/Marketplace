'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { CreditCard, Truck, ShieldCheck, Loader2, ArrowLeft, Lock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, Link } from '@/i18n/routing';

type Step = 'info' | 'payment';

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const { items, clearCart } = useCartStore();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total >= 100000 ? 0 : 2500;
  const grandTotal = total + shipping;

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerCity: '',
  });

  const updateField = (field: string, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleMobileMoneyOrder = async () => {
    setLoading(true);
    try {
      const { createOrder } = await import('@/lib/actions');
      await createOrder({
        ...formData,
        paymentMethod: 'Mobile Money',
        total: grandTotal,
        items: items.map(i => ({
          productId: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity
        }))
      });

      // Format WhatsApp message
      const whatsappMessage = `Bonjour Nouradine,\nJe viens de valider une commande sur Plateforme Immersive.\n\n` +
        `📝 *Détails:*\n` +
        items.map(i => `- ${i.quantity}x ${i.title}`).join('\n') +
        `\n\n💰 *Total TTC:* ${grandTotal.toLocaleString()} XAF\n` +
        `🚚 *Adresse:* ${formData.customerAddress}, ${formData.customerCity}\n\n` +
        `Comment puis-je procéder au paiement Mobile Money ?`;

      const whatsappUrl = `https://wa.me/23560909092?text=${encodeURIComponent(whatsappMessage)}`;
      
      toast.success('Commande enregistrée ! Redirection vers WhatsApp...');
      clearCart();
      
      // Redirect to WhatsApp in a new tab, then go to orders page
      window.open(whatsappUrl, '_blank');
      router.push('/mes-commandes');
      
    } catch (err: any) {
      toast.error('Erreur lors de la commande.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect to Stripe Checkout hosted page
  const handleStripeCheckout = async () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            title: i.title,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          customerAddress: formData.customerAddress,
          customerCity: formData.customerCity,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Erreur Stripe');
      }

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du paiement.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all';
  const labelClass =
    'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">Votre panier est vide</p>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors"
          >
            Découvrir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[40%] w-[40%] rounded-full bg-blue-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 lg:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/produits"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux produits
          </Link>
          <h1 className="text-2xl font-black">Finaliser ma commande</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-10">
          {(['info', 'payment'] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-full text-sm font-black transition-all ${
                  step === s
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : idx < ['info', 'payment'].indexOf(step)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-sm font-semibold hidden sm:block ${
                  step === s ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}
              >
                {s === 'info' ? '📦 Livraison' : '💳 Paiement'}
              </span>
              {idx < 1 && <div className="h-px w-10 bg-slate-200 dark:bg-slate-700" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Panel */}
          <AnimatePresence mode="wait">
            {/* STEP 1 : Delivery info */}
            {step === 'info' && (
              <motion.form
                key="info"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                onSubmit={handleInfoSubmit}
                className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8 space-y-6 shadow-xl"
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cyan-500" />
                  Adresse de livraison
                </h2>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className={labelClass}>Nom complet *</label>
                    <input
                      required
                      value={formData.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      placeholder="Jean Dupont"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      placeholder="jean@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Adresse *</label>
                    <input
                      required
                      value={formData.customerAddress}
                      onChange={(e) => updateField('customerAddress', e.target.value)}
                      placeholder="Quartier Sabangali, Rue 1024"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Ville *</label>
                    <input
                      required
                      value={formData.customerCity}
                      onChange={(e) => updateField('customerCity', e.target.value)}
                      placeholder="N'Djaména"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Continuer vers le paiement →
                </button>
              </motion.form>
            )}

            {/* STEP 2 : Payment via Stripe */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8 space-y-6 shadow-xl"
              >
                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      paymentMethod === 'card'
                        ? 'border-cyan-500 bg-cyan-500/5'
                        : 'border-black/5 dark:border-white/10 hover:border-black/10'
                    }`}
                  >
                    <CreditCard className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-cyan-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-black uppercase tracking-widest">Carte / Google Pay</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      paymentMethod === 'mobile'
                        ? 'border-cyan-500 bg-cyan-500/5'
                        : 'border-black/5 dark:border-white/10 hover:border-black/10'
                    }`}
                  >
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Mobile Money</span>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <>
                    {/* Security badge */}
                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl px-5 py-4 border border-emerald-200/50 dark:border-emerald-500/20">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                          Paiement 100% sécurisé via Stripe
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          Données chiffrées TLS — Certifié PCI DSS Level 1
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        onClick={handleStripeCheckout}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                        {loading ? 'Redirection Stripe…' : `Payer par Carte →`}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 space-y-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Comment payer par Mobile Money ?</p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold shrink-0 mt-0.5">1</span>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Envoyez le montant total au numéro suivant :</p>
                        </div>
                        <div className="ml-8 p-3 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-cyan-500/30 text-center">
                          <p className="text-lg font-black text-cyan-600">+235 60 90 90 92</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nouradine Z. (Manager)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold shrink-0 mt-0.5">2</span>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Indiquez votre nom en motif de transfert.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold shrink-0 mt-0.5">3</span>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Cliquez sur "Confirmer" ci-dessous.</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleMobileMoneyOrder}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm transition-all shadow-xl"
                    >
                      {loading ? 'Traitement...' : 'Confirmer le transfert Mobile Money'}
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setStep('info')}
                    disabled={loading}
                    className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    ← Modifier la livraison
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400">
                  En cliquant, vous serez redirigé vers la page sécurisée Stripe.{' '}
                  <Link href="/legal/cgv" className="underline hover:text-slate-600">CGV applicables.</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Summary */}
          <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-6 space-y-5 h-fit shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-white">
              Récapitulatif ({items.length} article{items.length > 1 ? 's' : ''})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-14 w-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-black/5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">× {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString()} XAF
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 dark:border-white/10 pt-5 space-y-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Sous-total</span>
                <span>{total.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Livraison</span>
                <span
                  className={shipping === 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}
                >
                  {shipping === 0 ? '🎁 Gratuite' : `${shipping.toLocaleString()} XAF`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-slate-400">
                  Livraison gratuite dès 100 000 XAF d'achat
                </p>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-black/5 dark:border-white/10 pt-3">
                <span>Total TTC</span>
                <span>{grandTotal.toLocaleString()} XAF</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-white/10">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Lock className="h-3 w-3" /> SSL chiffré
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• PCI DSS</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• RGPD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
