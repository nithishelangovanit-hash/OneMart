import React from 'react';
import { Scale, ArrowLeft, Plus, Sparkles, RefreshCcw } from 'lucide-react';
import { CompareLens } from '../../components/compare/CompareLens.tsx';
import { useCompare } from '../../context/CompareContext.tsx';
import { db } from '../../lib/api.ts';

interface ComparePageProps {
  onNavigate: (path: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const { selectedProducts, addToCompare, clearCompare } = useCompare();

  const handleLoadNovaTrio = () => {
    clearCompare();
    const ids = ['prod_nova_3', 'prod_orbi_x2', 'prod_nova_2'];
    for (const id of ids) {
      const p = db.products.find(prod => prod.id === id);
      if (p) addToCompare(p);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] font-display flex items-center gap-2">
              <Scale className="w-7 h-7 text-[#C8102E]" />
              <span>Compare Lens (P09)</span>
            </h1>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Multi-dimensional evaluation across 4 lenses with customizable min-max mathematical weighting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadNovaTrio}
              className="px-3 py-1.5 bg-white border border-[#C8102E] text-[#C8102E] hover:bg-[#FFF7F8] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Fictional Nova Trio Demo</span>
            </button>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Catalog</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedProducts.length >= 2 ? (
          <CompareLens products={selectedProducts} onNavigate={onNavigate} />
        ) : (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-12 text-center max-w-lg mx-auto shadow-card space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FDECEE] text-[#C8102E] mx-auto flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1A1A] font-display">
              Add at Least 2 Products to Compare
            </h2>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Compare Lens requires 2 or 3 products from the same category to run normalized min-max score calculations.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleLoadNovaTrio}
                className="px-4 py-2 bg-[#C8102E] text-white font-semibold text-xs rounded-xl hover:bg-[#A30D25] cursor-pointer"
              >
                Load Nova Trio (Nova 3, Orbi X2, Nova 2)
              </button>
              <button
                onClick={() => onNavigate('/shop')}
                className="px-4 py-2 bg-[#FAFAFA] border border-[#E8E8E8] text-[#1A1A1A] font-semibold text-xs rounded-xl hover:bg-[#F4F4F4] cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
