'use client';

import { useTransition } from 'react';
import { updateOrderStatus, deleteOrder } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

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

  const handleStatus = (newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Statut mis à jour : ${STATUS_LABELS[newStatus]}`);
    });
  };

  const handleDelete = () => {
    if (!confirm('Supprimer cette commande ? Cette action est irréversible.')) return;
    startTransition(async () => {
      await deleteOrder(orderId);
      toast.success('Commande supprimée.');
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={currentStatus}
        onChange={(e) => handleStatus(e.target.value)}
        disabled={isPending}
        className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1.5 focus:outline-none focus:border-cyan-500 disabled:opacity-50 cursor-pointer transition-all"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
        title="Supprimer la commande"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
