'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ShinyButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'glass';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function ShinyButton({ 
  children, 
  icon: Icon, 
  variant = 'primary', 
  onClick, 
  className = '',
  disabled = false,
  type = 'button'
}: ShinyButtonProps) {
  
  const variants = {
    primary: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border-cyan-400/20",
    secondary: "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-xl shadow-black/5 hover:border-cyan-500/30",
    glass: "bg-white/10 dark:bg-black/10 backdrop-blur-md text-slate-900 dark:text-white border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
        relative overflow-hidden px-6 py-3 rounded-2xl font-bold text-sm
        flex items-center justify-center gap-2 transition-all duration-300
        border group ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}
      `}
    >
      {/* Glossy Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Shine Animation */}
      <motion.div 
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-20deg] pointer-events-none"
      />

      {Icon && <Icon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
