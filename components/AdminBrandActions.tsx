'use client';

import { useState } from 'react';
import { MoreHorizontal, ShieldCheck, ShieldOff, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { toggleBrandVerification, deleteBrand } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminBrandActions({ brandId, isVerified }: { brandId: string, isVerified: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleBrandVerification(brandId, isVerified);
      toast.success(isVerified ? "Vendeur révoqué" : "Vendeur certifié");
      setIsOpen(false);
    } catch (e) {
      toast.error("Erreur de mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBrand(brandId);
      toast.success("Vendeur supprimé");
      setIsOpen(false);
      setShowConfirm(false);
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <MoreHorizontal className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setShowConfirm(false); }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-1.5 space-y-1">
                {showConfirm ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 text-center space-y-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <AlertTriangle className="w-4 h-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Confirmer ?</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed font-bold">
                      Toutes ses annonces seront supprimées.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleDelete}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        Supprimer
                      </button>
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        Annuler
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <button 
                      onClick={handleToggle}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all"
                    >
                      {isVerified ? (
                        <><ShieldOff className="w-3.5 h-3.5 text-amber-400" /> Révoquer</>
                      ) : (
                        <><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Certifier</>
                      )}
                    </button>
                    <div className="h-px bg-white/5 mx-2 my-1" />
                    <button 
                      onClick={() => setShowConfirm(true)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

