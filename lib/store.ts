import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  vendor: string;
  image: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((current) => current.id === item.id);
        set(({ items }) => ({
          items: existing
            ? items.map((current) =>
                current.id === item.id
                  ? { ...current, quantity: current.quantity + item.quantity }
                  : current
              )
            : [...items, item]
        }));
      },
      removeItem: (id) => set(({ items }) => ({ items: items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set(({ items }) => ({
          items: items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }),
    {
      name: 'marketplace-cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);
