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
      className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 relative group"
      title="Changer de langue"
    >
      <Languages className="h-5 w-5 group-hover:text-cyan-500 transition-colors" />
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
        {locale}
      </span>
    </button>
  );
}
