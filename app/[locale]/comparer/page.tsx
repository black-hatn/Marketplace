'use client';

import { useCompareStore } from '@/lib/compareStore';
import { Star, ShoppingCart, Trash2, Scale, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function ComparerPage() {
  const { items, remove, clear } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
          <Scale className="w-10 h-10 text-white/20" />
        </div>
        <h1 className="text-3xl font-bold text-white">Aucun produit à comparer</h1>
        <p className="text-white/60 max-w-sm">Ajoutez jusqu'à 4 produits depuis le catalogue pour les comparer côte à côte.</p>
        <Link href="/produits" className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Parcourir le catalogue
        </Link>
      </div>
    );
  }

  const rows: { label: string; key: keyof typeof items[0] | 'actions' }[] = [
    { label: 'Image', key: 'image' },
    { label: 'Produit', key: 'title' },
    { label: 'Marque', key: 'vendor' },
    { label: 'Catégorie', key: 'category' },
    { label: 'Prix', key: 'price' },
    { label: 'Note', key: 'rating' },
    { label: 'Avis', key: 'reviews' },
    { label: 'Stock', key: 'stock' },
    { label: 'Actions', key: 'actions' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] pb-24">
      <div className="h-28" />
      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/produits" className="text-xs text-white/40 hover:text-white flex items-center gap-1 mb-2 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Catalogue
            </Link>
            <h1 className="text-3xl font-bold text-white">Comparateur</h1>
            <p className="text-white/50 text-sm mt-1">{items.length} produit{items.length > 1 ? 's' : ''} sélectionné{items.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clear}
            aria-label="Vider le comparateur"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all text-sm font-bold"
          >
            <Trash2 className="w-4 h-4" /> Tout effacer
          </button>
        </div>

        {/* Table de comparaison */}
        <div className="overflow-x-auto rounded-3xl border border-white/5">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-white/30 w-32">Critère</th>
                {items.map((p) => (
                  <th key={p.id} className="px-6 py-4 text-center">
                    <button
                      onClick={() => remove(p.id)}
                      aria-label={`Retirer ${p.title}`}
                      className="text-white/20 hover:text-red-400 transition-colors float-right"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, key }) => (
                <tr key={key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">{label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="px-6 py-5 text-center">
                      {key === 'image' && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border border-white/10">
                          <Image src={p.image} alt={p.title} width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                      )}
                      {key === 'title' && (
                        <Link href={`/produit/${p.id}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                          {p.title}
                        </Link>
                      )}
                      {key === 'vendor' && <span className="text-sm text-white/70">{p.vendor}</span>}
                      {key === 'category' && (
                        <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold">{p.category}</span>
                      )}
                      {key === 'price' && (
                        <span className="text-lg font-black text-white">{p.price.toLocaleString('fr-FR')} <span className="text-xs text-white/50">FCFA</span></span>
                      )}
                      {key === 'rating' && (
                        <span className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                          <Star className="w-4 h-4 fill-amber-400" />{p.rating.toFixed(1)}
                        </span>
                      )}
                      {key === 'reviews' && <span className="text-sm text-white/60">{p.reviews} avis</span>}
                      {key === 'stock' && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${(p.stock ?? 1) > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {(p.stock ?? 1) > 0 ? `${p.stock ?? '✓'} en stock` : 'Épuisé'}
                        </span>
                      )}
                      {key === 'actions' && (
                        <button
                          onClick={() => {
                            addItem({ id: p.id, title: p.title, price: p.price, image: p.image, quantity: 1, category: p.category, vendor: p.vendor });
                            toast.success(`${p.title} ajouté !`);
                          }}
                          aria-label={`Ajouter ${p.title} au panier`}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-all mx-auto"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Ajouter
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
