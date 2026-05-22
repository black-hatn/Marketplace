'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Erreur d&apos;administration</h2>
        <p className="text-white/60 max-w-sm">
          Une erreur inattendue s&apos;est produite dans le panneau d&apos;administration.
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
