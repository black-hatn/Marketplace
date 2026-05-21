'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { CreditCard, Truck, ShieldCheck, Loader2, ArrowLeft, Lock, Zap, MapPin, Smartphone, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, Link } from '@/i18n/routing';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';

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
    customerCity: "N'Djaména",
    customerPhone: '',
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

      const whatsappMessage = `Bonjour,\nJe viens de valider une commande premium.\n\n` +
        `📦 *Articles:*\n` +
        items.map(i => `- ${i.quantity}x ${i.title}`).join('\n') +
        `\n\n💰 *Total:* ${grandTotal.toLocaleString()} FCFA\n` +
        `🚚 *Lieu:* ${formData.customerAddress}, ${formData.customerCity}\n\n` +
        `Je souhaite procéder au paiement Mobile Money.`;

      const whatsappUrl = `https://wa.me/23560909092?text=${encodeURIComponent(whatsappMessage)}`;
      
      toast.success('Commande validée ! Ouverture de WhatsApp...');
      clearCart();
      window.open(whatsappUrl, '_blank');
      router.push('/mes-commandes');
      
    } catch (err: any) {
      toast.error('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
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
      if (!res.ok || !data.url) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: any) {
      toast.error('Erreur lors de la redirection Stripe.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
          <ShoppingBagIcon className="w-10 h-10 text-white/20" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8 max-w-sm font-light">
          Découvrez nos collections exclusives et commencez votre expérience shopping premium.
        </p>
        <Link href="/produits" className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all">
          Découvrir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-background overflow-hidden selection:bg-white/20 selection:text-white pb-24">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <Link href="/produits" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour aux achats
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Finaliser la commande</h1>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === 'info' ? 'bg-white text-black' : 'bg-white/10 text-white/40'
                }`}>
                  1
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step === 'info' ? 'text-white' : 'text-white/20'}`}>Livraison</span>
              </div>
              <div className="w-12 h-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === 'payment' ? 'bg-white text-black' : 'bg-white/10 text-white/40'
                }`}>
                  2
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step === 'payment' ? 'text-white' : 'text-white/20'}`}>Paiement</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_450px] gap-16 items-start">
            {/* Form Side */}
            <AnimatePresence mode="wait">
              {step === 'info' ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <section className="p-10 glass-card rounded-[2.5rem] space-y-10">
                    <div className="flex items-center gap-3 text-blue-400">
                      <Truck className="w-6 h-6" />
                      <h2 className="text-xl font-bold text-white">Détails d&apos;expédition</h2>
                    </div>

                    <form onSubmit={handleInfoSubmit} className="grid sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Nom Complet</label>
                        <input
                          required
                          value={formData.customerName}
                          onChange={(e) => updateField('customerName', e.target.value)}
                          placeholder="Ex: Jean-Luc Maloum"
                          className="w-full px-6 py-4 rounded-2xl glass text-white placeholder-white/10 outline-none focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Adresse Email</label>
                        <input
                          required
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => updateField('customerEmail', e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full px-6 py-4 rounded-2xl glass text-white placeholder-white/10 outline-none focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Adresse de livraison</label>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input
                            required
                            value={formData.customerAddress}
                            onChange={(e) => updateField('customerAddress', e.target.value)}
                            placeholder="Ex: Quartier Sabangali, Rue 1024"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl glass text-white placeholder-white/10 outline-none focus:border-white/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Téléphone</label>
                        <input
                          required
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => updateField('customerPhone', e.target.value)}
                          placeholder="+235 60 XX XX XX"
                          className="w-full px-6 py-4 rounded-2xl glass text-white placeholder-white/10 outline-none focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Ville</label>
                        <select
                          value={formData.customerCity}
                          onChange={(e) => updateField('customerCity', e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl glass text-white outline-none focus:border-white/20 transition-all bg-transparent"
                        >
                          {["N'Djaména","Moundou","Abéché","Sarh","Koumra","Pala","Bongor","Am Timan","Mongo","Doba"].map(v => (
                            <option key={v} value={v} className="bg-slate-900 text-white">{v}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-4 rounded-2xl bg-white text-black font-bold tracking-wide hover:bg-white/90 transition-all shadow-xl"
                        >
                          Continuer vers le paiement
                        </button>
                      </div>
                    </form>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <section className="p-10 glass-card rounded-[2.5rem] space-y-10">
                    <div className="flex items-center gap-3 text-purple-400">
                      <CreditCard className="w-6 h-6" />
                      <h2 className="text-xl font-bold text-white">Méthode de règlement</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all group ${
                          paymentMethod === 'card' ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {paymentMethod === 'card' && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-white" />}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                          paymentMethod === 'card' ? 'bg-white text-black' : 'bg-white/5 text-white/20'
                        }`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-white">Carte Bancaire</span>
                        <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Stripe Secure</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('mobile')}
                        className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all group ${
                          paymentMethod === 'mobile' ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {paymentMethod === 'mobile' && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-white" />}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                          paymentMethod === 'mobile' ? 'bg-white text-black' : 'bg-white/5 text-white/20'
                        }`}>
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-white">Mobile Money</span>
                        <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Airtel / Moov</span>
                      </button>
                    </div>

                    <div className="pt-6">
                      {paymentMethod === 'card' ? (
                        <div className="space-y-8">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-white">Transaction sécurisée</p>
                              <p className="text-xs text-muted-foreground font-light mt-1">Vos données bancaires sont chiffrées par Stripe. Nous ne stockons aucune information sensible.</p>
                            </div>
                          </div>
                          <button
                            onClick={handleStripeCheckout}
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-3"
                          >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                            {loading ? 'Redirection en cours...' : 'Procéder au paiement Stripe'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="p-8 rounded-[2rem] bg-white/5 border border-dashed border-white/20 space-y-6">
                            <p className="text-sm text-center text-muted-foreground font-light">
                              Effectuez le transfert au numéro suivant puis cliquez sur confirmer pour notifier notre équipe commerciale via WhatsApp.
                            </p>
                            <div className="text-center">
                              <p className="text-3xl font-black text-white tracking-tighter">+235 60 90 90 92</p>
                              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2">Nouradine Z. • Responsable Boutique</p>
                            </div>
                          </div>
                          <button
                            onClick={handleMobileMoneyOrder}
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-3"
                          >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                            Confirmer & Envoyer sur WhatsApp
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setStep('info')}
                      className="w-full text-center text-xs font-bold text-white/30 hover:text-white transition-colors"
                    >
                      ← Revenir aux informations de livraison
                    </button>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sidebar Summary */}
            <div className="space-y-8 sticky top-32">
              <section className="glass-card rounded-[2.5rem] p-8 space-y-8">
                <h3 className="text-xl font-bold text-white">Résumé</h3>
                
                <div className="space-y-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill unoptimized={true} className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{item.quantity} x {item.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center text-sm font-black text-white">
                        {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Sous-total</span>
                    <span className="text-white font-bold">{total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Expédition</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-emerald-400' : 'text-white'}`}>
                      {shipping === 0 ? 'Gratuite' : `${shipping.toLocaleString()} FCFA`}
                    </span>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/20 mb-1">Total TTC</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{grandTotal.toLocaleString()} <span className="text-sm font-medium text-white/40">FCFA</span></span>
                  </div>
                </div>
              </section>

              <div className="p-8 glass-card rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Protection de l&apos;acheteur
                </div>
                <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
                  Bénéficiez de notre garantie de satisfaction. Tous vos achats sont protégés et assurés par notre service client basé à N&apos;Djaména.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

function ShoppingBagIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
