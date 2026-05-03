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
      <div className="h-[46px] w-[100px] animate-pulse rounded-full border border-white/10 bg-slate-900/80" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative inline-flex items-center gap-3 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm font-bold text-slate-900 dark:text-white shadow-lg dark:shadow-glow transition-all hover:bg-slate-100 dark:hover:bg-slate-800/90 active:scale-95"
      aria-label={`Passer au mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      <div className="relative h-4 w-4">
        <Sun className={`absolute inset-0 h-4 w-4 text-amber-500 dark:text-amber-300 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
        <Moon className={`absolute inset-0 h-4 w-4 text-cyan-600 dark:text-cyan-400 transition-all duration-500 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
      </div>
      <span className="min-w-[45px] text-left transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
        {theme === 'dark' ? 'Clair' : 'Sombre'}
      </span>
    </button>
  );
}
