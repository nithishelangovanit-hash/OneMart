import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../lib/api.ts';
import { formatRupees } from '../../shared/money.ts';

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  inStockOnly: boolean;
  onInStockToggle: () => void;
  sortBy: string;
  onSortChange: (val: any) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onMaxPriceChange,
  inStockOnly,
  onInStockToggle,
  sortBy,
  onSortChange,
  onReset
}) => {
  return (
    <aside className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-subtle space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
          <Filter className="w-3.5 h-3.5 text-[#C8102E]" />
          <span>Catalog Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#8E8E8E] hover:text-[#C8102E] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort Select */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
          Sort Order
        </label>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="w-full text-xs bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#C8102E] cursor-pointer"
        >
          <option value="newest">Newest Releases</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
              selectedCategory === ''
                ? 'bg-[#FDECEE] text-[#C8102E] font-semibold'
                : 'text-[#5C5C5C] hover:bg-[#FAFAFA]'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] opacity-75 tabular-nums">60</span>
          </button>
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#FDECEE] text-[#C8102E] font-semibold'
                  : 'text-[#5C5C5C] hover:bg-[#FAFAFA]'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className="text-[11px] opacity-75 tabular-nums">6</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Cap Slider */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-semibold text-[#1A1A1A]">Price Ceiling</span>
          <span className="font-bold text-[#C8102E] tabular-nums">
            {formatRupees(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="100000"
          step="1000"
          value={maxPrice}
          onChange={e => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-[#C8102E] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#8E8E8E] mt-1">
          <span>₹200</span>
          <span>₹50,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-2 border-t border-[#F0F0F0]">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#1A1A1A]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onInStockToggle}
            className="w-4 h-4 text-[#C8102E] rounded border-[#E8E8E8] accent-[#C8102E] cursor-pointer"
          />
          <span>In-stock items only</span>
        </label>
      </div>
    </aside>
  );
};
