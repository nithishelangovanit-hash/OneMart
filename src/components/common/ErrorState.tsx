import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error processing this request. Your saved basket and holds are intact.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#FDECEE] flex items-center justify-center text-[#C8102E] mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">{title}</h3>
      <p className="text-sm text-[#5C5C5C] mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-[#FAFAFA] hover:bg-[#F4F4F4] border border-[#E8E8E8] rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry safe request</span>
        </button>
      )}
    </div>
  );
};
