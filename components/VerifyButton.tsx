'use client';

import { useTransition } from 'react';
import { toggleBrandVerification } from '@/lib/actions';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export function VerifyButton({ brandId, isVerified }: { brandId: string, isVerified: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleBrandVerification(brandId);
        toast.success(isVerified ? "Vendeur retiré de la liste certifiée" : "Vendeur certifié avec succès !");
      } catch (e) {
        toast.error("Une erreur est survenue");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-xl transition-all active:scale-95 ${
        isVerified 
          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
          : 'bg-slate-100 text-slate-400 hover:bg-cyan-500 hover:text-white'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isVerified ? "Retirer la certification" : "Certifier ce vendeur"}
    >
      {isVerified ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
    </button>
  );
}
