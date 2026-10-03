import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard.tsx';
import { FilterSidebar } from '../../components/product/FilterSidebar.tsx';
import { CompareTray } from '../../components/compare/CompareTray.tsx';
import { EmptyState } from '../../components/common/EmptyState.tsx';
import { fetchProducts } from '../../lib/api.ts';
import { Product } from '../../shared/types.ts';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onNavigate,
  initialCategory = '',
  initialSearch = ''
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: selectedCategory || undefined,
      search: search || undefined,
      maxPrice,
      inStockOnly,
      sortBy
    }).then(res => {
      setProducts(res);
      setLoading(false);
    });
  }, [selectedCategory, search, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearch('');
    setMaxPrice(100000);
    setInStockOnly(false);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display">
              Catalog & Verification Inventory
            </h1>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Showing <strong className="text-[#1A1A1A] tabular-nums">{products.length}</strong> items across 10 categories. All products support Compare Lens and SuperSave.
            </p>
          </div>

          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search catalog by name, spec, or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E8E8E8] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#C8102E] shadow-subtle"
            />
            <Search className="w-4 h-4 text-[#8E8E8E] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 2-Column Grid (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              search={search}
              onSearchChange={setSearch}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              inStockOnly={inStockOnly}
              onInStockToggle={() => setInStockOnly(!inStockOnly)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-white border border-[#E8E8E8] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Products Match Filters"
                description="Try loosening your price cap or clearing specific category restrictions to see the full 60-item catalog."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Tray */}
      <CompareTray onNavigate={onNavigate} />
    </div>
  );
};
