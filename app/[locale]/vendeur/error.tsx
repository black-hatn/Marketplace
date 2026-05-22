'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function VendeurError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Vendeur Error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Erreur espace vendeur</h2>
        <p className="text-white/60 max-w-sm">
          Une erreur s&apos;est produite dans votre tableau de bord. Vos données sont en sécurité.
        </p>
        {error.digest && (
          <p className="text-xs text-white/30 font-mono mt-2">Référence : {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Relancer
      </button>
    </div>
  );
}
