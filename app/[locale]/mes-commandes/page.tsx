'use client';

import { useEffect, useState } from 'react';
import { getOrdersByEmail } from '@/lib/actions';
import { Package, Search, Calendar, CreditCard, ChevronRight, Loader2, ArrowLeft, History, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import PageTransition from '@/components/PageTransition';

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
    <PageTransition>
      <div className="relative w-full min-h-screen bg-[#030303] overflow-hidden selection:bg-white/20 selection:text-white pb-24">
        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="h-24 sm:h-32"></div>

        <main className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <Link href="/" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour à l&apos;accueil
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Historique d&apos;Achats</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-blue-400">
              <History className="w-6 h-6" />
            </div>
          </div>

          {!searched ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-12 glass-card rounded-[3rem] text-center max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-white/20" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Retrouvez vos commandes</h2>
              <p className="text-muted-foreground font-light mb-10">
                Saisissez l&apos;adresse email utilisée lors de vos achats pour accéder à votre historique complet et au suivi de vos colis.
              </p>
              
              <form onSubmit={handleSearch} className="relative group">
                <input 
                  type="email" 
                  required 
                  placeholder="votre@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-8 py-5 rounded-3xl glass text-white placeholder-white/20 outline-none focus:border-white/20 transition-all text-center"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="mt-6 w-full py-5 rounded-3xl bg-white text-black font-bold tracking-wide hover:bg-white/90 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-4 h-4" />}
                  Explorer l&apos;historique
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass p-6 rounded-3xl border-white/5">
                <p className="text-sm font-light text-muted-foreground">
                  Affichage des résultats pour <span className="text-white font-bold">{email}</span>
                </p>
                <button 
                  onClick={() => setSearched(false)} 
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all uppercase tracking-widest"
                >
                  Changer d&apos;email
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {orders && orders.length > 0 ? (
                  <div className="grid gap-6">
                    {orders.map((order, idx) => (
                      <motion.div 
                        key={order.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group glass-card rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden"
                      >
                        <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="px-3 py-1 rounded-full glass text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                #{order.numero_commande || order.id.slice(-8)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                order.statut === 'PAYEE' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {order.statut}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-muted-foreground text-sm font-light">
                                <Calendar className="w-4 h-4 text-white/20" />
                                {new Date(order.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm font-light">
                                <MapPin className="w-4 h-4 text-white/20" />
                                N&apos;Djaména
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Montant Total</p>
                              <p className="text-3xl font-black text-white tracking-tighter">
                                {Number(order.montant_total).toLocaleString()} <span className="text-sm font-medium text-white/40">FCFA</span>
                              </p>
                            </div>
                            <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all">
                              <ChevronRight className="w-6 h-6" />
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="bg-white/[0.02] border-t border-white/5 p-8 flex gap-4 overflow-x-auto custom-scrollbar">
                          {order.lignes_commande.map((item: any) => (
                            <div key={item.id} className="flex-shrink-0 relative group/item">
                              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center overflow-hidden border border-white/5 transition-transform group-hover/item:scale-105">
                                <Package className="w-8 h-8 text-white/10" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-lg">
                                {item.quantite}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 glass-card rounded-[3rem] border-dashed border-white/10">
                    <Package className="w-16 h-16 text-white/5 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground font-light">Nous n&apos;avons trouvé aucun historique pour cette adresse.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
