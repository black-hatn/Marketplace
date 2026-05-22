'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Page Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Une erreur s&apos;est produite</h1>
          <p className="text-white/60 font-light">
            Quelque chose s&apos;est mal passé. Notre équipe a été notifiée.
          </p>
          {error.digest && (
            <p className="text-xs text-white/30 font-mono">Code : {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
