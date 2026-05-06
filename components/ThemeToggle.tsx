'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initial synchronization
  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.dataset.theme as 'dark' | 'light' || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    
    // 1. Update state
    setTheme(nextTheme);
    
    // 2. Update DOM
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dataset.theme = nextTheme;
    
    // 3. Persist
    localStorage.setItem('theme', nextTheme);
  };

  // Prevent hydration mismatch (don't render until client-side)
  if (!mounted) {
    return (
      <div className="h-[38px] w-[38px] animate-pulse rounded-full border border-white/10 bg-slate-900/80" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 relative overflow-hidden"
      aria-label={`Passer au mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      <div className="relative h-5 w-5">
        <Sun className={`absolute inset-0 h-5 w-5 text-amber-500 dark:text-amber-300 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
        <Moon className={`absolute inset-0 h-5 w-5 text-cyan-600 dark:text-cyan-400 transition-all duration-500 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
      </div>
    </button>
  );
}
