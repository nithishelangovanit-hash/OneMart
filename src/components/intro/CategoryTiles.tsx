import React from 'react';
import {
  Smartphone,
  Laptop,
  Shirt,
  Activity,
  Footprints,
  Wheat,
  Coffee,
  Sparkles,
  Droplets,
  PenTool,
  ArrowRight
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../lib/api.ts';

interface CategoryTilesProps {
  onNavigate: (path: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Smartphone,
  Laptop,
  Shirt,
  Activity,
  Footprints,
  Wheat,
  Coffee,
  Sparkles,
  Droplets,
  PenTool
};

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C8102E] mb-1">Catalog Structure</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display">
              10 Seeded Categories · 60 Fictional Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-semibold text-[#C8102E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INITIAL_CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.iconName] || Smartphone;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
                className="p-4 bg-white border border-[#E8E8E8] hover:border-[#C8102E] rounded-xl text-left transition-all hover:shadow-card-hover group cursor-pointer flex flex-col justify-between h-32"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] group-hover:bg-[#FDECEE] text-[#1A1A1A] group-hover:text-[#C8102E] flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#C8102E] transition-colors leading-tight mb-1">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-[#8E8E8E] line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
