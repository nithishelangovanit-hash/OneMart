import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { formatRupees } from '../../shared/money.ts';

export const PriceChangeBanner: React.FC = () => {
  const { hasPriceChange, priceChanges, acknowledgePriceChanges } = useCart();

  if (!hasPriceChange) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#FEF7EE] border border-[#B45309]/30 rounded-xl p-4 mb-6 text-xs text-[#1A1A1A]"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-[#B45309]">
              Inventory Price Update Detected (P01 Protection)
            </p>
            <p className="text-[#5C5C5C] leading-relaxed">
              One or more items in your cart had a live price change in the warehouse catalog.
              We never silently alter your checkout total:
            </p>
            <div className="space-y-1 pt-1">
              {priceChanges.map(change => (
                <div key={change.productId} className="flex items-center gap-2 tabular-nums">
                  <span className="font-medium">{change.productName}:</span>
                  <span className="line-through text-[#8E8E8E]">{formatRupees(change.oldPrice)}</span>
                  <span>→</span>
                  <span className="font-bold text-[#C8102E]">{formatRupees(change.newPrice)}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={acknowledgePriceChanges}
            className="px-3 py-1.5 bg-[#B45309] hover:bg-[#92400E] text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Acknowledge New Price</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
