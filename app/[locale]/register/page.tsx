'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from '@/lib/actions';
import { User, Mail, Lock, Sparkles, ArrowRight, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter, Link } from '@/i18n/routing';
import PageTransition from '@/components/PageTransition';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await registerUser(formData);
      toast.success('Compte créé avec succès ! Connectez-vous.');
      router.push('/admin/login');
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] overflow-hidden selection:bg-cyan-500/30 selection:text-white flex items-center justify-center p-6">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-6 shadow-sm">
              <Sparkles className="h-4 w-4" /> Rejoignez l'élite
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-3">
              Créer un <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Compte</span>
            </h1>
            <p className="text-white/40 text-sm font-medium">
              Rejoignez notre plateforme premium et profitez d'une expérience d'achat inégalée.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-8 sm:p-10 glass-card bg-white/[0.02] rounded-[2.5rem] border border-white/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Nom complet</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Jean-Luc Maloum"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 text-white placeholder-white/20 border border-white/5 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 text-white placeholder-white/20 border border-white/5 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Téléphone</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Ex: 60 00 00 00"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 text-white placeholder-white/20 border border-white/5 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 text-white placeholder-white/20 border border-white/5 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 mt-4 rounded-2xl bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-white/90 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer mon compte'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="pt-6 text-center border-t border-white/5">
                <p className="text-xs text-white/40 font-medium">
                  Déjà membre ?{' '}
                  <Link href="/admin/login" className="text-white font-bold hover:text-cyan-400 transition-colors">
                    Connectez-vous ici
                  </Link>
                </p>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                  Vous êtes un professionnel ?{' '}
                  <Link href="/vendre" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Devenir Partenaire
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" /> Retour à la boutique
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
