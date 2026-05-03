'use client';

import { useEffect, useState } from 'react';
import { getOrdersByEmail } from '@/lib/actions';
import { Package, Search, Calendar, CreditCard, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
      fetchOrders(session.user.email);
    }
  }, [session]);

  const fetchOrders = async (targetEmail: string) => {
    setLoading(true);
    try {
      const data = await getOrdersByEmail(targetEmail);
      setOrders(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    fetchOrders(email);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 lg:py-20">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Mes Commandes</h1>
        </div>

        {!searched ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl border border-black/5 dark:border-white/10 p-8 lg:p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-cyan-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Suivre vos achats</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Entrez l'adresse email utilisée lors de vos commandes pour retrouver votre historique complet.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                required 
                placeholder="votre@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Rechercher'}
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Commandes pour <span className="font-semibold text-slate-900 dark:text-white">{email}</span></p>
              <button onClick={() => setSearched(false)} className="text-sm text-cyan-600 font-medium hover:underline">Changer d'email</button>
            </div>

            <AnimatePresence>
              {orders && orders.length > 0 ? (
                orders.map((order, idx) => (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-wider">#{order.numero_commande || order.id.slice(-8)}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${order.statut === 'PAYEE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {order.statut}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total</p>
                          <p className="text-xl font-bold text-cyan-600">{Number(order.montant_total).toLocaleString()} FCFA</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-white/[0.02] border-t border-black/5 dark:border-white/10 p-6">
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.lignes_commande.map((item: any) => (
                          <div key={item.id} className="flex-shrink-0 group">
                            <div className="h-14 w-14 rounded-xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-cyan-500/30 transition-all">
                              <Package className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="text-[10px] text-center mt-1 text-slate-500">×{item.quantite}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Aucune commande trouvée pour cette adresse email.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
