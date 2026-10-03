import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Scale, Check, PiggyBank, Eye } from 'lucide-react';
import { Product } from '../../shared/types.ts';
import { PriceTag } from '../common/PriceTag.tsx';
import { RatingStars } from '../common/RatingStars.tsx';
import { StockBadge } from '../common/StockBadge.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useCompare } from '../../context/CompareContext.tsx';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addItem } = useCart();
  const { addToCompare, removeFromCompare, isComparing } = useCompare();

  const comparing = isComparing(product.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-[#E8E8E8] hover:border-[#C8102E]/40 rounded-xl overflow-hidden shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between group"
    >
      {/* Product Image Lead (65%-75% of visual focus on neutral surface) */}
      <div
        onClick={() => onNavigate(`/product/${product.id}`)}
        className="relative bg-[#FAFAFA] aspect-[4/3] overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-[#F0F0F0]"
      >
        <img
          src={product.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 bg-white/95 text-[#1A1A1A] text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Specs</span>
          </span>
        </div>
      </div>

      {/* Product Metadata & Actions */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-1.5">
            <span className="font-medium tracking-wide">{product.brand}</span>
            <StockBadge stock={product.stock} />
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onNavigate(`/product/${product.id}`)}
            className="text-sm font-semibold text-[#1A1A1A] hover:text-[#C8102E] transition-colors line-clamp-2 mb-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>

        {/* Price & Primary Interactive Buttons */}
        <div className="pt-3 border-t border-[#F0F0F0] space-y-2.5">
          <div className="flex items-baseline justify-between">
            <PriceTag price={product.price} originalPrice={product.originalPrice} size="md" />
            <span className="text-[11px] text-[#8E8E8E] tabular-nums">Tax incl.</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => addItem(product, 1)}
              disabled={product.stock <= 0}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                product.stock > 0
                  ? 'bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm active:scale-[0.98]'
                  : 'bg-[#F0F0F0] text-[#8E8E8E] cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Sold Out'}</span>
            </button>

            <button
              onClick={() => {
                if (comparing) {
                  removeFromCompare(product.id);
                } else {
                  addToCompare(product);
                }
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                comparing
                  ? 'bg-[#FDECEE] border-[#C8102E] text-[#C8102E]'
                  : 'bg-[#FAFAFA] hover:bg-[#F4F4F4] border-[#E8E8E8] text-[#1A1A1A]'
              }`}
            >
              {comparing ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              <span>{comparing ? 'In Lens' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
