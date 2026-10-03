import React from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { CartItemRow } from '../../components/cart/CartItemRow.tsx';
import { CartSummary } from '../../components/cart/CartSummary.tsx';
import { PriceChangeBanner } from '../../components/cart/PriceChangeBanner.tsx';
import { EmptyState } from '../../components/common/EmptyState.tsx';
import { createReservation } from '../../lib/api.ts';
import { saveActiveReservation } from '../../lib/draftStorage.ts';
import { useToast } from '../../context/ToastContext.tsx';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, clearCart } = useCart();
  const { showToast } = useToast();

  const handleProceedToAddress = async () => {
    if (items.length === 0) return;

    // Lock atomic 10-minute hold for first item
    const firstItem = items[0];
    const res = await createReservation(firstItem.productId, firstItem.quantity);

    if (res.success && res.reservationId && res.expiresAt) {
      saveActiveReservation({ reservationId: res.reservationId, expiresAt: res.expiresAt });
      showToast({
        type: 'success',
        title: '10-Minute Hold Locked (P04)',
        message: 'Your inventory reservation is secured while you complete your delivery address.'
      });
      onNavigate('/checkout/address');
    } else {
      showToast({
        type: 'error',
        title: 'Hold Allocation Blocked',
        message: res.error || 'Inventory temporarily unavailable.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#C8102E]" />
              <span>Shopping Cart</span>
            </h1>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Full total shown upfront in whole rupees. No surprise courier handling surcharges added later.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-[#8E8E8E] hover:text-[#C8102E] transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Live Price Change Alert */}
        <PriceChangeBanner />

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-card space-y-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">
                <span>Product Item</span>
                <span>Quantity & Subtotal</span>
              </div>

              {items.map(item => (
                <CartItemRow key={item.productId} item={item} />
              ))}

              <div className="pt-4 flex justify-between items-center text-xs text-[#5C5C5C]">
                <button
                  onClick={() => onNavigate('/shop')}
                  className="inline-flex items-center gap-1.5 text-[#C8102E] hover:underline font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </button>
                <span>Whole-rupee billing · Standard GST inclusive</span>
              </div>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 sticky top-24">
              <CartSummary
                onProceed={handleProceedToAddress}
                proceedLabel="Proceed to Address & Hold Stock"
              />
            </div>
          </div>
        ) : (
          <EmptyState
            title="Your Cart is Empty"
            description="Explore our curated catalog of smartphones, laptops, apparel, and verified goods."
            actionText="Browse Catalog"
            onAction={() => onNavigate('/shop')}
          />
        )}
      </div>
    </div>
  );
};
