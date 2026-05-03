'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShinyButton } from '@/components/ShinyButton';
import { registerVendor } from '@/lib/actions';
import { Building2, Mail, Lock, Sparkles, Rocket, Globe, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendrePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await registerVendor(formData);
      toast.success('Votre entreprise a été créée avec succès ! Connectez-vous pour commencer.');
      router.push('/admin/login');
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none text-slate-900 dark:text-white placeholder-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Info */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="h-4 w-4" /> Programme Partenaire
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]"
          >
            Propulsez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Entreprise.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg"
          >
            Rejoignez la plateforme immersive et commencez à vendre vos produits à une audience mondiale en quelques minutes.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-6 pt-8">
            {[
              { icon: Rocket, title: "Lancement Rapide", desc: "Créez votre boutique en 2 minutes chrono." },
              { icon: Globe, title: "Visibilité Globale", desc: "Touchez des milliers de clients potentiels." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 lg:p-12 shadow-2xl relative"
        >
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-cyan-500/20 blur-2xl rounded-full" />
          
          <h2 className="text-2xl font-bold mb-8">Créer ma boutique</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="name" required placeholder="Nom de l'entreprise" className={inputClass} />
            </div>

            <div className="relative group">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="tagline" required placeholder="Slogan ou accroche" className={inputClass} />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="email" type="email" required placeholder="Email professionnel" className={inputClass} />
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="phone" type="tel" required placeholder="Numéro WhatsApp (ex: +235...)" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input name="airtelMoney" placeholder="N° Airtel Money" className={inputClass + " pl-4"} />
              </div>
              <div className="relative group">
                <input name="moovMoney" placeholder="N° Moov Money" className={inputClass + " pl-4"} />
              </div>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="password" type="password" required placeholder="Mot de passe" className={inputClass} />
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Logo de l&apos;entreprise</label>
              <div className="relative group">
                <input 
                  name="logoFile" 
                  type="file" 
                  accept="image/*" 
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl py-4 px-4 text-center group-hover:border-cyan-500/50 transition-all bg-white/50 dark:bg-slate-900/50">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Cliquer pour choisir un logo</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center px-4">
              En créant votre boutique, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
            </p>

            <ShinyButton
              variant="primary"
              disabled={loading}
              className="w-full !py-5 text-base mt-4"
            >
              {loading ? "Création en cours..." : "Lancer mon entreprise"}
            </ShinyButton>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                Déjà partenaire ?{" "}
                <Link href="/admin/login" className="text-cyan-600 font-bold hover:underline">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
