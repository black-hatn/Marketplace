'use client';

import { useState } from 'react';
import { User, Mail, Phone, Camera, Loader2, Save } from 'lucide-react';
import { updateProfile } from '@/lib/actions';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProfileFormProps {
  user: any;
  role: string;
}

export function ProfileForm({ user, role }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('existingImage', user.image || '');

    try {
      await updateProfile(user.id, role, formData);
      toast.success('Profil mis à jour avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none text-slate-900 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center sm:flex-row gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl shadow-black/5">
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-xl">
            {preview ? (
              <Image src={preview} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-300">
                <User className="h-16 w-16" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 h-10 w-10 bg-cyan-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg border-4 border-white dark:border-slate-900">
            <Camera className="h-5 w-5" />
            <input type="file" name="imageFile" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Photo de profil</h3>
          <p className="text-sm text-slate-500 mt-1">Cliquez sur l'icône de caméra pour mettre à jour votre photo.</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600 mt-2">Format: JPG, PNG • Max: 5MB</p>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                name="name" 
                defaultValue={user.name || user.nom} 
                required 
                className={inputClass} 
              />
            </div>
          </div>
          
          {role !== 'VENDOR' && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Prénom</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  name="prenom" 
                  defaultValue={user.prenom} 
                  className={inputClass} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input 
              name="email" 
              type="email" 
              defaultValue={user.email} 
              required 
              className={inputClass} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Numéro de Téléphone</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input 
              name="phone" 
              type="tel" 
              defaultValue={user.phone || user.telephone} 
              className={inputClass} 
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-black/10 dark:shadow-white/5"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </form>
  );
}
