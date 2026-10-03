import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  className = ''
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-[#B45309]">
        <Star className={`${iconSize} fill-[#B45309]`} />
      </div>
      <span className="text-xs font-semibold text-[#1A1A1A] tabular-nums">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-xs text-[#5C5C5C] tabular-nums">
          ({reviewCount.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};
