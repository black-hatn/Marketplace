'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useRecentlyViewed } from '@/components/RecentlyViewed';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { ShinyButton } from '@/components/ShinyButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AddToCartButton({ product, disabled }: { product: any; disabled?: boolean }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { addProduct } = useRecentlyViewed();

  const handleAdd = () => {
    addItem({ ...product, quantity: 1 });
    addProduct({ id: product.id, title: product.title, price: product.price, image: product.image, href: `/produit/${product.id}` });
    setAdded(true);
    toast.success(`${product.title} ajouté au panier !`, { icon: '🛍️' });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="flex-1"
    >
      <ShinyButton
        variant={added ? 'glass' : 'primary'}
        onClick={handleAdd}
        disabled={disabled}
        className={`w-full !py-4 transition-all duration-500 ${added ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : ''}`}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span 
              key="added"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              ✓ Ajouté au panier !
            </motion.span>
          ) : (
            <motion.span 
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" /> Ajouter au panier
            </motion.span>
          )}
        </AnimatePresence>
      </ShinyButton>
    </motion.div>
  );
}
