'use client';

import { useState, useEffect } from 'react';
import { Bell, ShoppingBag, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { getNotifications, markAsRead } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell({ brandId }: { brandId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getNotifications(brandId);
      setNotifications(data);
    }
    load();
    // In a real app, we would poll or use WebSockets here
    const interval = setInterval(load, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [brandId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'ORDER': return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
      case 'STOCK': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'REVIEW': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle2 className="h-4 w-4 text-cyan-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-110 active:scale-95"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-5 border-b border-black/5 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Centre d'Alertes</h3>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <Bell className="h-10 w-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-black/5 dark:divide-white/5">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-cyan-500/5' : ''}`}
                        onClick={() => handleRead(n.id)}
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'}`}>
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{n.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-black/5 dark:border-white/10 text-center">
                <button className="text-[10px] font-black text-cyan-600 uppercase tracking-widest hover:underline">Voir tout l'historique</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
