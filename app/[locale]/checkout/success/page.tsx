'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const cancelled = searchParams.get('cancelled');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<{
    customerEmail?: string;
    customerName?: string;
    total?: number;
  }>({});

  useEffect(() => {
    if (cancelled) {
      setStatus('error');
      return;
    }

    if (!sessionId) {
      setStatus('error');
      return;
    }

    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'paid') {
          setOrderData({
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            total: data.total,
          });
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [sessionId, cancelled]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] border border-black/5 dark:border-white/10 p-10 max-w-md w-full text-center space-y-6 shadow-2xl"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-cyan-500 mx-auto" />
            <p className="text-slate-600 dark:text-slate-400">Confirmation du paiement…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
              className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto"
            >
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Merci {orderData.customerName?.split(' ')[0] || ''} ! 🎉
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Votre commande a été confirmée et payée avec succès.
              </p>
            </div>

            {orderData.customerEmail && (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                Un reçu a été envoyé à{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {orderData.customerEmail}
                </span>
              </div>
            )}

            {orderData.total && (
              <p className="text-sm text-slate-500">
                Montant débité :{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {orderData.total.toLocaleString()} XAF
                </span>
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/mes-commandes"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Mes commandes
              </Link>
              <Link
                href="/produits"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Continuer
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="h-24 w-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {cancelled ? 'Paiement annulé' : 'Paiement échoué'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {cancelled
                  ? 'Vous avez annulé la commande. Votre panier est intact.'
                  : 'Une erreur est survenue. Aucun montant n\'a été débité.'}
              </p>
            </div>
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Réessayer
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
