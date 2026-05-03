'use client';

import { useState, useTransition } from 'react';
import { Plus, X, Loader2, Pencil, Trash2, Package, ImageIcon, MapPin } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions';
import toast from 'react-hot-toast';
import { ShinyButton } from '@/components/ShinyButton';

type Brand = { id: string; name: string };
type Product = {
  id: string;
  title: string;
  price: number;
  badge: string | null;
  tagline: string | null;
  image: string;
  images: string; // JSON string
  stock: number;
  brandId: string;
  location?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  shippingViaAgency?: boolean | null;
  description?: string | null;
};

export function AdminProductModal({
  brands,
  product,
  editMode = false,
}: {
  brands: Brand[];
  product?: Product;
  editMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (editMode && product) {
          await updateProduct(product.id, formData);
          toast.success('Produit mis à jour !');
        } else {
          await createProduct(formData);
          toast.success('Produit créé avec succès !');
        }
        setOpen(false);
      } catch {
        toast.error('Une erreur est survenue.');
      }
    });
  };

  const handleDelete = () => {
    if (!product) return;
    if (!confirm(`Supprimer "${product.title}" ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      try {
        await deleteProduct(product.id);
        toast.success('Produit supprimé.');
      } catch {
        toast.error('Erreur lors de la suppression.');
      }
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <>
      {editMode ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(true)}
            className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
          >
            <Pencil className="h-3 w-3" /> Éditer
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" /> Suppr.
          </button>
        </div>
      ) : (
        <ShinyButton
          onClick={() => setOpen(true)}
          icon={Plus}
          className="!py-2.5"
        >
          Ajouter un produit
        </ShinyButton>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl border border-black/5 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editMode ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Gérez votre catalogue avec précision</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className={labelClass}>Nom du produit *</label>
                <input name="title" required defaultValue={product?.title} placeholder="ex: Casque Audio XR-900" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix (FCFA) *</label>
                  <input name="price" type="number" step="0.01" required defaultValue={product?.price} placeholder="299.99" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Package className="inline h-3 w-3 mr-1" /> Stock *</label>
                  <input name="stock" type="number" required defaultValue={product?.stock ?? 100} placeholder="100" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}><MapPin className="inline h-3 w-3 mr-1" /> Ville *</label>
                  <select name="city" required defaultValue={product?.city || "N'Djaména"} className={inputClass}>
                    <option value="N'Djaména">N&apos;Djaména</option>
                    <option value="Moundou">Moundou</option>
                    <option value="Abéché">Abéché</option>
                    <option value="Sarh">Sarh</option>
                    <option value="Koumra">Koumra</option>
                    <option value="Pala">Pala</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Quartier</label>
                  <input name="neighborhood" defaultValue={product?.neighborhood || ""} placeholder="ex: Moursal, Diguel" className={inputClass} />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <input 
                  type="checkbox" 
                  name="shippingViaAgency" 
                  defaultChecked={product?.shippingViaAgency ?? false}
                  id="shippingViaAgency"
                  className="h-5 w-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="shippingViaAgency" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Expédition possible en province via agence (Abou Hamama, etc.)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Badge</label>
                  <input name="badge" defaultValue={product?.badge || ''} placeholder="ex: Promo, Urgent" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Catégorie</label>
                  {editMode ? (
                    <input disabled value="Catégorie figée" className={inputClass + " opacity-50"} />
                  ) : (
                    <input name="category" required placeholder="ex: Audio, Mode" className={inputClass} />
                  )}
                </div>
              </div>

              {!editMode && (
                <div>
                  <label className={labelClass}>Marque *</label>
                  <select name="brandId" required className={inputClass}>
                    <option value="">Sélectionnez une marque</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-black/5 dark:border-white/5">
                <label className={labelClass}><ImageIcon className="inline h-3 w-3 mr-1" /> Photo du Produit *</label>
                
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <input 
                      name="imageFile" 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl py-8 px-4 text-center group-hover:border-cyan-500/50 transition-all">
                      <ImageIcon className="h-8 w-8 text-slate-400 mx-auto mb-2 group-hover:text-cyan-500 transition-colors" />
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Cliquer pour télécharger</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">PNG, JPG jusqu&apos;à 5Mo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OU</span>
                    <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                  </div>

                  <div>
                    <label className={labelClass}>URL de l&apos;image (Alternative)</label>
                    <input name="image" type="url" defaultValue={product?.image} placeholder="https://..." className={inputClass} />
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                  <label className={labelClass}>Galerie (JSON Array d&apos;URLs)</label>
                  <textarea name="images" rows={2} defaultValue={product?.images || '[]'} placeholder='["https://img1.jpg"]' className={inputClass + " font-mono text-xs"} />
                  <p className="text-[10px] text-slate-400 mt-1 italic">Laissez [] si pas de galerie.</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description détaillée du produit</label>
                <textarea 
                  name="description" 
                  rows={4} 
                  defaultValue={product?.description || ""} 
                  placeholder="Décrivez les caractéristiques, l'état et les points forts du produit..." 
                  className={inputClass} 
                />
              </div>

              <div>
                <label className={labelClass}>Tagline (Accroche)</label>
                <input name="tagline" defaultValue={product?.tagline || ''} placeholder="Une courte phrase d'accroche" className={inputClass} />
              </div>
            </form>

            <div className="p-6 border-t border-black/5 dark:border-white/10 flex gap-3 flex-shrink-0">
              <ShinyButton variant="secondary" onClick={() => setOpen(false)} className="flex-1 !py-3">
                Annuler
              </ShinyButton>
              <ShinyButton variant="primary" disabled={isPending} className="flex-1 !py-3">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editMode ? 'Enregistrer les modifications' : 'Créer le produit'}
              </ShinyButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
