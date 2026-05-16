'use client';

import { useState } from 'react';
import { MessageSquare, Phone, Mail, X, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    { 
      icon: MessageCircle, 
      label: 'WhatsApp', 
      href: 'https://wa.me/23500000000', // Remplacer par le numéro réel
      color: 'bg-emerald-500',
      delay: 0.1
    },
    { 
      icon: Phone, 
      label: 'Appeler', 
      href: 'tel:+23500000000', 
      color: 'bg-blue-500',
      delay: 0.2
    },
    { 
      icon: Mail, 
      label: 'Email', 
      href: 'mailto:support@immersive-market.com', 
      color: 'bg-purple-500',
      delay: 0.3
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-20 right-0 flex flex-col items-end gap-4">
            {contactOptions.map((option, i) => (
              <motion.a
                key={i}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ delay: option.delay, type: 'spring', damping: 15 }}
                className="group flex items-center gap-4"
              >
                <div className="glass px-4 py-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                  <span className="text-xs font-black text-white uppercase tracking-widest">{option.label}</span>
                </div>
                <div className={`${option.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                  <option.icon className="w-6 h-6" />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isOpen ? 'bg-white text-black rotate-90 scale-90' : 'bg-blue-600 text-white hover:scale-105 hover:bg-blue-500'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Tooltip for the main button */}
      {!isOpen && (
        <div className="absolute top-1/2 -left-32 -translate-y-1/2 hidden md:block">
          <div className="glass px-4 py-2 rounded-xl border border-white/10 shadow-2xl animate-bounce-x">
             <p className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Besoin d&apos;aide ?</p>
          </div>
        </div>
      )}
    </div>
  );
}
