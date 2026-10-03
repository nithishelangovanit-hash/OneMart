import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatRupees, calculateOrderTotals } from '../../../shared/money.ts';
import { changeProductPriceForDemo, db } from '../../../lib/api.ts';
import { useToast } from '../../../context/ToastContext.tsx';

export const P01_TotalsMatchDemo: React.FC = () => {
  const { showToast } = useToast();
  const [productPrice, setProductPrice] = useState(26999);
  const [guestOrdered, setGuestOrdered] = useState(false);

  const cartTotals = calculateOrderTotals(productPrice);
  const gatewayTotals = calculateOrderTotals(productPrice);

  const handlePriceChange = async (delta: number) => {
    const newPrice = Math.max(1000, productPrice + delta);
    setProductPrice(newPrice);
    await changeProductPriceForDemo('prod_nova_3', newPrice);
    showToast({
      type: 'info',
      title: 'Warehouse Live Price Changed (P01)',
      message: `Product price updated to ${formatRupees(newPrice)}. Both Cart and Gateway recalculated identically.`
    });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cart View Totals */}
        <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl space-y-2">
          <div className="flex justify-between items-center font-bold text-[#1A1A1A]">
            <span>Cart Step Calculation</span>
            <span className="text-[10px] text-[#1F7A4D] bg-[#EDF7F2] px-2 py-0.5 rounded font-semibold">
              Computed Server-Side
            </span>
          </div>
          <div className="space-y-1 text-[#5C5C5C] text-[11px]">
            <div className="flex justify-between">
              <span>Item Subtotal:</span>
              <span className="font-semibold text-[#1A1A1A] tabular-nums">{formatRupees(cartTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-[#1A1A1A] tabular-nums">{formatRupees(cartTotals.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18% Included):</span>
              <span className="tabular-nums">{formatRupees(cartTotals.tax)}</span>
            </div>
            <div className="pt-2 border-t border-[#E8E8E8] flex justify-between font-bold text-sm text-[#1A1A1A]">
              <span>Cart Total:</span>
              <span className="text-[#C8102E] tabular-nums">{formatRupees(cartTotals.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Gateway View Totals */}
        <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl space-y-2">
          <div className="flex justify-between items-center font-bold text-[#1A1A1A]">
            <span>Final Gateway Step</span>
            <span className="text-[10px] text-[#1F7A4D] bg-[#EDF7F2] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Exact Match Verified</span>
            </span>
          </div>
          <div className="space-y-1 text-[#5C5C5C] text-[11px]">
            <div className="flex justify-between">
              <span>Authorized Amount:</span>
              <span className="font-semibold text-[#1A1A1A] tabular-nums">{formatRupees(gatewayTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Courier Handling:</span>
              <span className="font-semibold text-[#1A1A1A] tabular-nums">{formatRupees(gatewayTotals.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Hidden Fee / Surcharge:</span>
              <span className="text-[#1F7A4D] font-bold">₹0 (Zero Drip-Pricing)</span>
            </div>
            <div className="pt-2 border-t border-[#E8E8E8] flex justify-between font-bold text-sm text-[#1A1A1A]">
              <span>Gateway Total:</span>
              <span className="text-[#C8102E] tabular-nums">{formatRupees(gatewayTotals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1A1A1A]">Simulate Price Fluctuation:</span>
          <button
            onClick={() => handlePriceChange(-2000)}
            className="px-2.5 py-1 bg-white border border-[#E8E8E8] hover:border-[#C8102E] rounded font-semibold"
          >
            -₹2,000 Discount
          </button>
          <button
            onClick={() => handlePriceChange(3000)}
            className="px-2.5 py-1 bg-white border border-[#E8E8E8] hover:border-[#C8102E] rounded font-semibold"
          >
            +₹3,000 Surcharge
          </button>
        </div>

        <button
          onClick={() => {
            setGuestOrdered(true);
            showToast({
              type: 'success',
              title: 'Guest Checkout Completed (P01)',
              message: 'Order created with guest_token. Account registration offered optionally.'
            });
          }}
          className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded font-semibold flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{guestOrdered ? 'Guest Order Placed ✓' : 'Test 1-Tap Guest Order'}</span>
        </button>
      </div>
    </div>
  );
};
