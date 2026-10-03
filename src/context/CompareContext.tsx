import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../../shared/types.ts';
import { MAX_COMPARE_PRODUCTS } from '../../shared/constants.ts';
import { useToast } from './ToastContext.tsx';
import { db } from '../lib/api.ts';

interface CompareContextValue {
  selectedProducts: Product[];
  currentCategory: string | null;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isComparing: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-seed with Nova 3 & Orbi X2 so visitor can immediately test Compare Lens
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
    const p1 = db.products.find(p => p.id === 'prod_nova_3');
    const p2 = db.products.find(p => p.id === 'prod_orbi_x2');
    return p1 && p2 ? [p1, p2] : [];
  });

  const { showToast } = useToast();

  const currentCategory = selectedProducts.length > 0 ? selectedProducts[0].category : null;

  const isComparing = useCallback(
    (productId: string) => selectedProducts.some(p => p.id === productId),
    [selectedProducts]
  );

  const addToCompare = useCallback(
    (product: Product): boolean => {
      if (selectedProducts.some(p => p.id === product.id)) {
        return true;
      }

      if (selectedProducts.length >= MAX_COMPARE_PRODUCTS) {
        showToast({
          type: 'error',
          title: 'Comparison limit reached',
          message: `Compare Lens supports up to ${MAX_COMPARE_PRODUCTS} items for high-fidelity evaluation.`
        });
        return false;
      }

      if (selectedProducts.length > 0 && selectedProducts[0].category !== product.category) {
        showToast({
          type: 'error',
          title: 'Different category',
          message: `Compare Lens strictly validates products within the same category (${selectedProducts[0].category}). Clear current selection to compare ${product.category}.`
        });
        return false;
      }

      setSelectedProducts(prev => [...prev, product]);
      showToast({
        type: 'info',
        title: 'Added to Compare Lens',
        message: `${product.name} added. ${selectedProducts.length + 1} of ${MAX_COMPARE_PRODUCTS} slots filled.`
      });
      return true;
    },
    [selectedProducts, showToast]
  );

  const removeFromCompare = useCallback((productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        currentCategory,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
