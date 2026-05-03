'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions';
import { useCartStore } from '@/lib/store';
import { CreditCard, Truck, ShieldCheck, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShinyButton } from '@/components/ShinyButton';

type Step = 'info' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total >= 100 ? 0 : 6.99;
  const grandTotal = total + shipping;

  const [formData, setFormData] = useState({
    customerName: '', customerEmail: '', customerAddress: '', customerCity: '',
    cardNumber: '', cardExpiry: '', cardCvc: '', paymentMethod: 'card',
  });

  const updateField = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Votre panier est vide.'); return; }
    setLoading(true);
    try {
      const order = await createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        customerCity: formData.customerCity,
        paymentMethod: formData.paymentMethod,
        total: grandTotal,
        items: items.map((i) => ({ productId: i.id, title: i.title, quantity: i.quantity, price: i.price })),
      });
      setOrderId(order.id);
      clearCart();
      setStep('confirmation');
    } catch {
      toast.error('Erreur lors du paiement. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 lg:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/produits" className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <h1 className="text-2xl font-bold">Commande</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10">
          {(['info', 'payment', 'confirmation'] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold transition-colors ${step === s || (idx < ['info','payment','confirmation'].indexOf(step)) ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {idx + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {s === 'info' ? 'Livraison' : s === 'payment' ? 'Paiement' : 'Confirmation'}
              </span>
              {idx < 2 && <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Panel */}
          <AnimatePresence mode="wait">
            {step === 'info' && (
              <motion.form key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleInfoSubmit} className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8 space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><Truck className="h-5 w-5 text-cyan-500" /> Adresse de livraison</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Nom complet *</label>
                    <input required value={formData.customerName} onChange={(e) => updateField('customerName', e.target.value)} placeholder="Jean Dupont" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Email *</label>
                    <input required type="email" value={formData.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} placeholder="jean@email.com" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Adresse *</label>
                    <input required value={formData.customerAddress} onChange={(e) => updateField('customerAddress', e.target.value)} placeholder="Quartier Sabangali, Rue 1024" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ville *</label>
                    <input required value={formData.customerCity} onChange={(e) => updateField('customerCity', e.target.value)} placeholder="N'Djaména" className={inputClass} />
                  </div>
                </div>
                <ShinyButton
                  variant="primary"
                  className="w-full !py-4"
                >
                  Continuer vers le paiement →
                </ShinyButton>
              </motion.form>
            )}

            {step === 'payment' && (
              <motion.form key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handlePayment} className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8 space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard className="h-5 w-5 text-cyan-500" /> Paiement sécurisé</h2>
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" /> Paiement 100% sécurisé et chiffré — Démo uniquement
                </div>
                <div>
                  <label className={labelClass}>Numéro de carte *</label>
                  <input required value={formData.cardNumber} onChange={(e) => updateField('cardNumber', e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Expiration *</label>
                    <input required value={formData.cardExpiry} onChange={(e) => updateField('cardExpiry', e.target.value)} placeholder="MM / AA" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>CVC *</label>
                    <input required value={formData.cardCvc} onChange={(e) => updateField('cardCvc', e.target.value)} placeholder="123" maxLength={4} className={inputClass} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShinyButton
                    variant="secondary"
                    onClick={() => setStep('info')}
                    className="flex-1 !py-4"
                  >
                    ← Retour
                  </ShinyButton>
                  <ShinyButton
                    variant="primary"
                    disabled={loading}
                    className="flex-1 !py-4"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {loading ? 'Traitement...' : `Payer ${grandTotal.toLocaleString()} FCFA`}
                  </ShinyButton>
                </div>
              </motion.form>
            )}

            {step === 'confirmation' && (
              <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-10 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Commande confirmée !</h2>
                  <p className="text-slate-500 mt-2">Merci pour votre achat. Vous recevrez un email de confirmation.</p>
                </div>
                {orderId && <p className="text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">Référence : {orderId.slice(-12).toUpperCase()}</p>}
                <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity">
                  Continuer mes achats
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Summary */}
          {step !== 'confirmation' && (
            <div className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-6 space-y-4 h-fit">
              <h3 className="font-bold text-slate-900 dark:text-white">Récapitulatif</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="h-12 w-12 rounded-xl object-cover flex-shrink-0 ring-1 ring-black/5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-slate-500">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/5 dark:border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Sous-total</span><span>{total.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'Gratuite' : `${shipping.toLocaleString()} FCFA`}</span>
                </div>
                {shipping === 0 && <p className="text-xs text-emerald-600 dark:text-emerald-400">🎉 Livraison offerte dès 100 000 FCFA</p>}
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white border-t border-black/5 dark:border-white/10 pt-2">
                  <span>Total</span><span>{grandTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
