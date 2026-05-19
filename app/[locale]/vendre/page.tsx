'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { registerVendor } from '@/lib/actions';
import { Building2, Mail, Lock, Sparkles, Rocket, Globe, Phone, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import PageTransition from '@/components/PageTransition';

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

  const inputClass = "w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/20 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm";

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30 selection:text-white flex items-center justify-center p-6 sm:p-12">
        {/* Background Decor */}
        <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 py-12">
          {/* Left Side: Info */}
          <div className="space-y-10">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour au site
            </Link>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-sm"
              >
                <Sparkles className="h-4 w-4" /> Programme Partenaire Exclusif
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[1.1]"
              >
                Propulsez votre <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Entreprise.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/50 font-medium leading-relaxed max-w-lg"
              >
                Rejoignez l'élite des vendeurs du Tchad. Créez votre boutique premium et touchez une audience qualifiée en quelques minutes.
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {[
                { icon: Rocket, title: "Lancement Rapide", desc: "Votre e-boutique prête à vendre en 2 minutes chrono." },
                { icon: Globe, title: "Visibilité Premium", desc: "Vos produits mis en valeur sur un design de classe mondiale." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="p-6 rounded-[2rem] glass-card border border-white/5 bg-white/[0.02]"
                >
                  <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-[3rem] border border-white/5 p-8 sm:p-12 shadow-2xl relative bg-white/[0.01]"
          >
            <div className="absolute -top-6 -right-6 h-32 w-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <h2 className="text-2xl font-black text-white tracking-tight mb-8">Ouvrir votre boutique</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input name="name" required placeholder="Nom de la boutique" className={inputClass} />
              </div>

              <div className="relative group">
                <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input name="tagline" required placeholder="Slogan ou domaine d'expertise" className={inputClass} />
              </div>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input name="email" type="email" required placeholder="Email professionnel" className={inputClass} />
              </div>

              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input name="phone" type="tel" required placeholder="Numéro de contact (ex: 60 00 00 00)" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input name="airtelMoney" placeholder="N° Airtel Money" className={`${inputClass} pl-6`} />
                </div>
                <div className="relative group">
                  <input name="moovMoney" placeholder="N° Moov Money" className={`${inputClass} pl-6`} />
                </div>
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input name="password" type="password" required placeholder="Mot de passe d'accès" className={inputClass} />
              </div>

              <div className="pt-2">
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Logo de l'entreprise</label>
                <div className="relative group">
                  <input 
                    name="logoFile" 
                    type="file" 
                    accept="image/*" 
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border border-dashed border-white/20 rounded-2xl py-6 px-4 text-center group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5 transition-all bg-white/5 flex flex-col items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-white/30 group-hover:text-cyan-400 transition-colors" />
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Cliquer pour uploader</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black tracking-widest uppercase text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer l'entreprise"}
                </button>
              </div>

              <div className="text-center pt-6 border-t border-white/5 mt-6">
                <p className="text-[11px] text-white/40 font-medium">
                  Déjà membre partenaire ?{" "}
                  <Link href="/admin/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                    Espace Connexion
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
