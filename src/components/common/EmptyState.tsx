import React from 'react';
import { PackageOpen, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] flex items-center justify-center text-[#5C5C5C] mb-4">
        <PackageOpen className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">{title}</h3>
      <p className="text-sm text-[#5C5C5C] mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C8102E] hover:bg-[#A30D25] rounded-lg transition-colors cursor-pointer"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
