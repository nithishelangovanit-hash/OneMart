/**
 * Whole-rupee money utilities used across client and server.
 * Guarantees no floating-point rounding issues in e-commerce arithmetic.
 */

export function formatRupees(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rounded);
}

export function calculateOrderTotals(subtotal: number): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const cleanSubtotal = Math.max(0, Math.round(subtotal));
  const shipping = cleanSubtotal >= 999 || cleanSubtotal === 0 ? 0 : 49;
  // Tax is calculated on taxable goods (included/calculated transparently at 18%)
  const tax = Math.round(cleanSubtotal * 0.18);
  const total = cleanSubtotal + shipping;
  return {
    subtotal: cleanSubtotal,
    shipping,
    tax,
    total
  };
}
