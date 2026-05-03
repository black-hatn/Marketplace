'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShinyButton } from '@/components/ShinyButton';
import { registerUser } from '@/lib/actions';
import { User, Mail, Lock, Sparkles, ArrowRight, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none text-slate-900 dark:text-white placeholder-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="h-4 w-4" /> Rejoignez l'aventure
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic">
            Créer un <span className="text-cyan-500">Compte</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Profitez d'une expérience d'achat personnalisée et suivez vos commandes en temps réel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 lg:p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="name" required placeholder="Nom complet" className={inputClass} />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="email" type="email" required placeholder="Email" className={inputClass} />
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="phone" type="tel" placeholder="Téléphone (Optionnel)" className={inputClass} />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input name="password" type="password" required placeholder="Mot de passe" className={inputClass} />
            </div>

            <ShinyButton
              variant="primary"
              disabled={loading}
              className="w-full !py-5 text-base mt-4"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </ShinyButton>

            <div className="text-center pt-6 border-t border-black/5 dark:border-white/5">
              <p className="text-sm text-slate-500">
                Déjà un compte ?{" "}
                <Link href="/admin/login" className="text-cyan-600 font-bold hover:underline">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400 font-medium">
                Vous voulez vendre sur Immersive ?{" "}
                <Link href="/vendre" className="text-slate-900 dark:text-white font-bold hover:underline">
                  Devenir Partenaire
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
