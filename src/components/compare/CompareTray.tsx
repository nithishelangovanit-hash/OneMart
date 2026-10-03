import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext.tsx';
import { MAX_COMPARE_PRODUCTS } from '../../shared/constants.ts';

interface CompareTrayProps {
  onNavigate: (path: string) => void;
}

export const CompareTray: React.FC<CompareTrayProps> = ({ onNavigate }) => {
  const { selectedProducts, removeFromCompare, clearCompare } = useCompare();

  if (selectedProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-40 bg-white/95 backdrop-blur-md border border-[#E8E8E8] shadow-card rounded-2xl p-3.5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FDECEE] text-[#C8102E] flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selectedProducts.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-2 py-1 text-xs text-[#1A1A1A] shrink-0"
              >
                <img
                  src={p.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
                  alt={p.name}
                  className="w-5 h-5 object-contain"
                />
                <span className="font-medium truncate max-w-[100px]">{p.name}</span>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  aria-label={`Remove ${p.name} from comparison`}
                  className="text-[#8E8E8E] hover:text-[#C8102E] transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {Array.from({ length: MAX_COMPARE_PRODUCTS - selectedProducts.length }).map((_, i) => (
              <div
                key={i}
                className="border border-dashed border-[#E8E8E8] rounded-lg px-3 py-1.5 text-[11px] text-[#8E8E8E] shrink-0"
              >
                + Empty Slot
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-[#8E8E8E] hover:text-[#1A1A1A] px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => onNavigate('/compare')}
            className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <span>Compare ({selectedProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
