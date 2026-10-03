import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../../shared/types.ts';
import { formatRupees } from '../../shared/money.ts';
import { useCart } from '../../context/CartContext.tsx';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="py-4 flex items-center justify-between gap-4 border-b border-[#F0F0F0] text-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-16 h-16 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg p-2 flex items-center justify-center shrink-0">
          <img
            src={item.product.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
            alt={item.product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-[#8E8E8E]">{item.product.brand}</p>
          <h4 className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[240px] sm:max-w-xs">
            {item.product.name}
          </h4>
          <p className="text-[#5C5C5C] tabular-nums mt-0.5">
            {formatRupees(item.product.price)} each
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-[#E8E8E8] rounded-lg bg-[#FAFAFA] overflow-hidden">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="p-1.5 hover:bg-[#E8E8E8] text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-semibold text-[#1A1A1A] tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            aria-label="Increase quantity"
            className="p-1.5 hover:bg-[#E8E8E8] text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[80px]">
          <p className="text-sm font-bold text-[#1A1A1A] tabular-nums">
            {formatRupees(item.product.price * item.quantity)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(item.productId)}
          aria-label="Remove item from cart"
          className="text-[#8E8E8E] hover:text-[#C8102E] p-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
