import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  vendor: string;
  rating: number;
  reviews: number;
  stock?: number;
}

interface CompareStore {
  items: CompareProduct[];
  add: (product: CompareProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const MAX = 4;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const { items } = get();
        if (items.length >= MAX || items.find((p) => p.id === product.id)) return;
        set({ items: [...items, product] });
      },
      remove: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((p) => p.id === id),
    }),
    { name: 'compare-store' }
  )
);
