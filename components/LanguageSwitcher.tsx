'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'fr' ? 'en' : locale === 'en' ? 'ar' : 'fr';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-black/5 dark:border-white/10 hover:border-cyan-500/30 transition-all group"
      title="Changer de langue"
    >
      <Languages className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-cyan-500 transition-colors" />
      <span className="hidden sm:block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
        {locale}
      </span>
    </button>
  );
}
