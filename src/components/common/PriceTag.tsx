import React from 'react';
import { formatRupees } from '../../shared/money.ts';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold'
  };

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className={`inline-flex items-baseline gap-2 tabular-nums ${className}`}>
      <span className={`text-[#1A1A1A] ${sizeClasses[size]}`}>
        {formatRupees(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs text-[#8E8E8E] line-through">
          {formatRupees(originalPrice)}
        </span>
      )}
      {discount && (
        <span className="text-xs font-medium text-[#C8102E]">
          Save {discount}%
        </span>
      )}
    </div>
  );
};
