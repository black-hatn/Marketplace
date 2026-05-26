'use client';

import { useTransition } from 'react';
import { toggleBrandVerification } from '@/lib/actions';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function VerifyButton({ brandId, isVerified }: { brandId: string, isVerified: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleBrandVerification(brandId, isVerified);
        toast.success(isVerified ? "Vendeur retiré de la liste certifiée" : "Vendeur certifié avec succès !");
      } catch (e) {
        toast.error("Une erreur est survenue");
      }
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.90 }}
      onClick={handleToggle}
      disabled={isPending}
      className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${
        isVerified 
          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/10' 
          : 'bg-white/5 border border-white/5 text-slate-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isVerified ? "Retirer la certification" : "Certifier ce vendeur"}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.span 
            key="loading" 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          </motion.span>
        ) : (
          <motion.span
            key={isVerified ? 'verified' : 'unverified'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {isVerified ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

