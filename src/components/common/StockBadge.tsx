import React from 'react';
import { Check, AlertTriangle, XCircle } from 'lucide-react';

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock, className = '' }) => {
  if (stock <= 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#C8102E] ${className}`}>
        <XCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Out of stock</span>
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#B45309] ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span className="tabular-nums">Only {stock} remaining</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#1F7A4D] ${className}`}>
      <Check className="w-3.5 h-3.5 shrink-0" />
      <span>In stock</span>
    </span>
  );
};
