'use client';

import { useTransition, useState } from 'react';
import { updateOrderStatus, deleteOrder } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Trash2, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = ['EN_ATTENTE', 'PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];
const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  PAYEE: 'Payée',
  VALIDEE: 'Validée',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

export function OrderStatusChanger({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleStatus = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success(`Statut mis à jour : ${STATUS_LABELS[newStatus]}`);
      } catch (err) {
        toast.error("Erreur de mise à jour");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteOrder(orderId);
        toast.success('Commande supprimée.');
      } catch (err) {
        toast.error("Erreur de suppression");
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2 relative">
      <AnimatePresence>
        {showConfirm ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-xl text-[10px] font-bold text-red-400 absolute right-0 z-30 backdrop-blur-md"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Sûr ?</span>
            <button 
              onClick={handleDelete}
              disabled={isPending}
              className="ml-1 px-2 py-0.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Oui
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Non
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={`flex items-center gap-2 transition-all duration-300 ${showConfirm ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100'}`}>
        <div className="relative flex items-center">
          <select
            value={currentStatus}
            onChange={(e) => handleStatus(e.target.value)}
            disabled={isPending}
            className="text-xs font-black rounded-xl border border-white/10 bg-black/40 text-white pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 disabled:opacity-50 cursor-pointer transition-all appearance-none uppercase tracking-wider min-w-[130px] hover:bg-white/5"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#0f0f0f] text-white py-2">
                {STATUS_LABELS[s].toUpperCase()}
              </option>
            ))}
          </select>
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin absolute right-3 pointer-events-none" />
          ) : (
            <span className="absolute right-3 pointer-events-none text-white/40 text-[10px]">▼</span>
          )}
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="p-2 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-all disabled:opacity-50"
          title="Supprimer la commande"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

