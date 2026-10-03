import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Scale,
  PiggyBank,
  Check,
  ShieldCheck,
  Star,
  ArrowLeft,
  Award,
  Truck,
  RotateCcw
} from 'lucide-react';
import { fetchProductById } from '../../lib/api.ts';
import { Product } from '../../shared/types.ts';
import { formatRupees } from '../../shared/money.ts';
import { PriceTag } from '../../components/common/PriceTag.tsx';
import { RatingStars } from '../../components/common/RatingStars.tsx';
import { StockBadge } from '../../components/common/StockBadge.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useCompare } from '../../context/CompareContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addToCompare, removeFromCompare, isComparing } = useCompare();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchProductById(productId).then(p => {
      setProduct(p);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-2 border-[#C8102E] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] py-16 text-center text-xs">
        <p className="text-base font-bold text-[#1A1A1A]">Product Not Found</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-4 px-4 py-2 bg-[#C8102E] text-white rounded-lg"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const comparing = isComparing(product.id);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('/shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* 2-Column Split: Gallery Left & Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery Left */}
          <div className="lg:col-span-7 bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-10 shadow-card flex items-center justify-center">
            <div className="max-w-md w-full aspect-[4/3] flex items-center justify-center">
              <img
                src={product.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Purchase Module Right */}
          <div className="lg:col-span-5 bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-8 shadow-card space-y-5 sticky top-24">
            <div>
              <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-1.5">
                <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
                <StockBadge stock={product.stock} />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-display leading-tight mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-xs text-[#8E8E8E]">· SKU: {product.sku}</span>
              </div>

              <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl flex items-baseline justify-between mb-4">
                <PriceTag price={product.price} originalPrice={product.originalPrice} size="xl" />
                <span className="text-xs text-[#1F7A4D] font-semibold">18% GST Included</span>
              </div>

              <p className="text-xs text-[#5C5C5C] leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 border-t border-[#F0F0F0]">
              <button
                onClick={() => {
                  addItem(product, 1);
                  showToast({
                    type: 'success',
                    title: 'Added to Cart',
                    message: `${product.name} added. Upfront whole-rupee total recalculated.`
                  });
                }}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-4 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock > 0 ? 'Add to Cart (Full Total Early)' : 'Out of Stock'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (comparing) {
                      removeFromCompare(product.id);
                    } else {
                      addToCompare(product);
                    }
                  }}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    comparing
                      ? 'bg-[#FDECEE] border-[#C8102E] text-[#C8102E]'
                      : 'bg-[#FAFAFA] hover:bg-[#F4F4F4] border-[#E8E8E8] text-[#1A1A1A]'
                  }`}
                >
                  {comparing ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                  <span>{comparing ? 'In Compare Lens' : 'Compare in Lens'}</span>
                </button>

                <button
                  onClick={() => onNavigate('/account/savings')}
                  className="py-2.5 px-3 bg-[#FAFAFA] hover:bg-[#F4F4F4] border border-[#E8E8E8] text-[#1A1A1A] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PiggyBank className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>Save for this (SuperSave)</span>
                </button>
              </div>
            </div>

            {/* Invariant Guarantees */}
            <div className="pt-4 border-t border-[#F0F0F0] space-y-2 text-[11px] text-[#5C5C5C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0" />
                <span>10-Minute atomic reservation lock at checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0" />
                <span>SKU verified in warehouse before Shipped status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="text-base font-bold text-[#1A1A1A] font-display">
            Full Technical Specifications
          </h2>
          <div className="border border-[#E8E8E8] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <tbody className="divide-y divide-[#E8E8E8]">
                {Object.entries(product.specs).map(([specKey, specVal]) => (
                  <tr key={specKey} className="hover:bg-[#FAFAFA]">
                    <td className="py-3 px-4 font-semibold text-[#5C5C5C] w-1/3 bg-[#FAFAFA]/50">
                      {specKey}
                    </td>
                    <td className="py-3 px-4 text-[#1A1A1A] font-medium">{specVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Reviews (Rendered as escaped plain text per P06 XSS rules) */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
            <div>
              <h2 className="text-base font-bold text-[#1A1A1A] font-display">
                Verified Customer Reviews
              </h2>
              <p className="text-xs text-[#8E8E8E]">All text is sanitized and rendered as literal plain text.</p>
            </div>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
          </div>

          <div className="space-y-3">
            {product.reviews.length > 0 ? (
              product.reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1A1A1A]">{rev.author}</span>
                    <span className="text-[11px] text-[#8E8E8E]">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-[#B45309] text-[11px]">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    {rev.verifiedBuyer && (
                      <span className="ml-2 text-[10px] text-[#1F7A4D] font-semibold">Verified Buyer</span>
                    )}
                  </div>
                  {/* Strict plain text rendering preventing XSS */}
                  <p className="text-[#5C5C5C] leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8E8E8E] py-4 text-center">
                Be the first verified buyer to review this item upon delivery.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
