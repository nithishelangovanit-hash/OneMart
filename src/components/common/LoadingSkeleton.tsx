import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`bg-[#F0F0F0] animate-pulse rounded-md ${className}`}
      aria-hidden="true"
    />
  );
};
