'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/components/RecentlyViewed';

export function RecentlyViewedTrigger({ product }: { product: any }) {
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    addProduct(product);
  }, [product, addProduct]);

  return null;
}
