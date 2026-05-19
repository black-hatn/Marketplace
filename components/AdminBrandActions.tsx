'use client';

import { useState } from 'react';
import { MoreHorizontal, ShieldCheck, ShieldOff, Trash2, ExternalLink } from 'lucide-react';
import { toggleBrandVerification, deleteBrand } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminBrandActions({ brandId, isVerified }: { brandId: string, isVerified: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!confirm("Voulez-vous vraiment supprimer ce vendeur et toutes ses annonces ? Cette action est irréversible.")) return;
    
    setIsLoading(true);
    try {
      await deleteBrand(brandId);
      toast.success("Vendeur supprimé");
      setIsOpen(false);
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
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-1.5 space-y-1">
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
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
