'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-950/50 py-16 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Plateforme Immersive</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              L'avenir du e-commerce multi-sectoriel. Une expérience fluide entre marques, produits et consommateurs.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Navigation</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Accueil</Link></li>
              <li><Link href="/produits" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Produits</Link></li>
              <li><Link href="/categories" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Catégories</Link></li>
              <li><Link href="/marques" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Marques</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Support</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Centre d'aide</Link></li>
              <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Retours</Link></li>
              <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Livraison</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Newsletter</h3>
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">Recevez les dernières nouveautés de l'immersion.</p>
            <form className="mt-6 flex gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 rounded-full bg-black/5 dark:bg-white/5 px-4 py-2 text-sm text-slate-900 dark:text-white border border-black/5 dark:border-white/10 focus:outline-none focus:border-cyan-400"
              />
              <button className="rounded-full bg-cyan-400 px-6 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>
        <div className="mt-16 border-t border-black/5 dark:border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">© 2025 Marketplace Immersive. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
