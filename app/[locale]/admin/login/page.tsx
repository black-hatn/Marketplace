'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, Link } from '@/i18n/routing';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShinyButton } from '@/components/ShinyButton';

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

    setLoading(false);

    if (res?.error) {
      toast.error('Identifiants incorrects');
    } else {
      toast.success('Connexion réussie');
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/[0.05] blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-slate-900 dark:bg-white p-4">
            <Lock className="h-8 w-8 text-white dark:text-slate-900" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
          Espace <span className="text-cyan-500">Partenaire</span>
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Connectez-vous à votre interface de gestion (Admin & Vendeur)
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass-card py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nom d'utilisateur
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <ShinyButton
                variant="primary"
                disabled={loading}
                className="w-full !py-4"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </ShinyButton>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
