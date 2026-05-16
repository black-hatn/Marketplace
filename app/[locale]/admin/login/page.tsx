'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, Link } from '@/i18n/routing';
import { Lock, User, Key, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      toast.error('Identifiants incorrects');
      setLoading(false);
    } else {
      toast.success('Connexion réussie');
      const { getSession } = await import('next-auth/react');
      const session = await getSession() as any;
      
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (session?.user?.role === 'VENDOR') {
        router.push('/vendeur/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    }
  };

  return (
    <PageTransition>
      <div className="relative w-full min-h-screen bg-background overflow-hidden selection:bg-white/20 selection:text-white flex items-center justify-center p-6">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Espace Partenaire</h1>
            <p className="text-muted-foreground font-light text-sm">
              Gérez votre boutique et vos commandes premium.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-8 sm:p-10 glass-card rounded-[2.5rem] border border-white/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Utilisateur</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="votre_pseudo"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl glass text-white placeholder-white/10 outline-none focus:border-white/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Mot de passe</label>
                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl glass text-white placeholder-white/10 outline-none focus:border-white/20 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-white text-black font-bold tracking-wide hover:bg-white/90 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accéder au Dashboard'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="pt-6 text-center border-t border-white/5">
                <p className="text-xs text-muted-foreground font-light">
                  Nouveau partenaire ?{' '}
                  <Link href="/register" className="text-white font-bold hover:underline">
                    Rejoindre l&apos;écosystème
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
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
              Retour à la boutique
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
