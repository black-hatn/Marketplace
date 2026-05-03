'use client';

import { useState, useTransition } from 'react';
import { Plus, X, Loader2, Pencil, Trash2, Package, ImageIcon, MapPin } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions';
import toast from 'react-hot-toast';
import { ShinyButton } from '@/components/ShinyButton';

type Brand = { id: string; name: string };
type Product = {
  id: string;
  nom: string;
  prix_ttc: number;
  images: string[];
  stock: number;
  brandId: string | null;
  description: string;
  categories: string[];
};

export function AdminProductModal({
  brands,
  product,
  editMode = false,
}: {
  brands: Brand[];
  product?: any;
  editMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    startTransition(async () => {
      try {
        if (editMode && product) {
          await updateProduct(product.id, data);
          toast.success('Produit mis à jour !');
        } else {
          await createProduct(data);
          toast.success('Produit créé avec succès !');
        }
        setOpen(false);
      } catch (err) {
        console.error(err);
        toast.error('Une erreur est survenue.');
      }
    });
  };

  const handleDelete = () => {
    if (!product) return;
    if (!confirm(`Supprimer "${product.nom || product.title}" ? Cette action est irréversible.`)) return;
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

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className={labelClass}>Nom du produit *</label>
                <input name="title" required defaultValue={product?.nom || product?.title} placeholder="ex: Casque Audio XR-900" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix HT (FCFA) *</label>
                  <input name="price" type="number" step="1" required defaultValue={product?.prix_ht || product?.price} placeholder="50000" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Package className="inline h-3 w-3 mr-1" /> Stock *</label>
                  <input name="stock" type="number" required defaultValue={product?.stock ?? 100} placeholder="100" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Catégorie</label>
                  <input name="category" required defaultValue={product?.categories?.[0] || product?.category} placeholder="ex: Audio, Mode" className={inputClass} />
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
              </div>

              <div>
                <label className={labelClass}><ImageIcon className="inline h-3 w-3 mr-1" /> URLs des Photos (Galerie)</label>
                <textarea 
                  name="images" 
                  required 
                  defaultValue={product?.images?.join(', ') || product?.image || ""} 
                  placeholder="https://image1.jpg, https://image2.jpg, ..." 
                  rows={3}
                  className={inputClass} 
                />
                <p className="text-[10px] text-slate-500 mt-1">Séparez les URLs par des virgules pour créer une galerie.</p>
              </div>

              <div>
                <label className={labelClass}>Description détaillée</label>
                <textarea 
                  name="description" 
                  rows={4} 
                  defaultValue={product?.description || ""} 
                  placeholder="Décrivez les caractéristiques..." 
                  className={inputClass} 
                />
              </div>
            </form>

            <div className="p-6 border-t border-black/5 dark:border-white/10 flex gap-3 flex-shrink-0">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold">
                Annuler
              </button>
              <button 
                type="submit" 
                onClick={(e: any) => {
                  const form = e.target.closest('div').previousElementSibling;
                  form.requestSubmit();
                }}
                disabled={isPending} 
                className="flex-1 py-3 rounded-xl bg-cyan-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (editMode ? 'Enregistrer' : 'Créer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
