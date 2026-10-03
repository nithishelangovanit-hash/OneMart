import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { formatRupees } from '../../shared/money.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useDemo } from '../../context/DemoContext.tsx';

interface CartSummaryProps {
  onProceed: () => void;
  proceedLabel?: string;
  isCheckout?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onProceed,
  proceedLabel = 'Proceed to Checkout',
  isCheckout = false
}) => {
  const { subtotal, shipping, tax, total, items } = useCart();
  const { isDemoMode } = useDemo();

  return (
    <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Order Summary</h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F7A4D] bg-[#EDF7F2] px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" />
          <span>Guaranteed Final Total</span>
        </span>
      </div>

      <div className="space-y-3 text-xs text-[#5C5C5C]">
        <div className="flex justify-between">
          <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} units)</span>
          <span className="font-semibold text-[#1A1A1A] tabular-nums">{formatRupees(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Standard Delivery</span>
          <span className="font-semibold text-[#1A1A1A] tabular-nums">
            {shipping === 0 ? (
              <span className="text-[#1F7A4D] font-bold">FREE (Above ₹999)</span>
            ) : (
              formatRupees(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Goods & Services Tax (18% GST Incl.)</span>
          <span className="text-[#8E8E8E] tabular-nums">{formatRupees(tax)}</span>
        </div>

        <div className="pt-3 border-t border-[#E8E8E8] flex justify-between items-baseline">
          <span className="text-sm font-bold text-[#1A1A1A]">Total Payable</span>
          <span className="text-xl font-bold text-[#C8102E] font-display tabular-nums">
            {formatRupees(total)}
          </span>
        </div>
      </div>

      <button
        onClick={onProceed}
        disabled={items.length === 0}
        className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
          items.length > 0
            ? 'bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm active:scale-[0.99]'
            : 'bg-[#E8E8E8] text-[#8E8E8E] cursor-not-allowed'
        }`}
      >
        <span>{proceedLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="pt-2 text-[11px] text-[#8E8E8E] space-y-1 text-center">
        <p className="flex items-center justify-center gap-1 text-[#1F7A4D] font-medium">
          <Sparkles className="w-3 h-3" />
          <span>No surprise checkout fees · Matches gateway to 1 rupee</span>
        </p>
        <p>Guest checkout supported without mandatory upfront account creation.</p>
      </div>
    </div>
  );
};
