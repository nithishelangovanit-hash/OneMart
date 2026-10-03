import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../../shared/types.ts';
import { calculateOrderTotals } from '../../shared/money.ts';
import { db } from '../lib/api.ts';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  hasPriceChange: boolean;
  priceChanges: {
    productId: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
  }[];
  cartBounced: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  acknowledgePriceChanges: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'onemart_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse saved cart', e);
    }
    // Default seed cart item so visitor immediately sees the cart workflow
    const defaultProd = db.products.find(p => p.id === 'prod_nova_3') || db.products[0];
    return [
      {
        productId: defaultProd.id,
        product: defaultProd,
        quantity: 1,
        priceWhenAdded: defaultProd.price
      }
    ];
  });

  const [cartBounced, setCartBounced] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart items', e);
    }
  }, [items]);

  // Check for live price discrepancies between live product price and priceWhenAdded
  const priceChanges = useMemo(() => {
    const list: {
      productId: string;
      productName: string;
      oldPrice: number;
      newPrice: number;
    }[] = [];

    for (const item of items) {
      const live = db.products.find(p => p.id === item.productId);
      if (live && live.price !== item.priceWhenAdded) {
        list.push({
          productId: item.productId,
          productName: item.product.name,
          oldPrice: item.priceWhenAdded,
          newPrice: live.price
        });
      }
    }
    return list;
  }, [items]);

  const hasPriceChange = priceChanges.length > 0;

  const acknowledgePriceChanges = useCallback(() => {
    setItems(prev =>
      prev.map(item => {
        const live = db.products.find(p => p.id === item.productId);
        if (live) {
          return {
            ...item,
            product: live,
            priceWhenAdded: live.price
          };
        }
        return item;
      })
    );
  }, []);

  const triggerBounce = () => {
    setCartBounced(true);
    setTimeout(() => setCartBounced(false), 600);
  };

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          priceWhenAdded: product.price
        }
      ];
    });
    triggerBounce();
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const { shipping, tax, total } = useMemo(() => {
    return calculateOrderTotals(subtotal);
  }, [subtotal]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        hasPriceChange,
        priceChanges,
        cartBounced,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        acknowledgePriceChanges
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
