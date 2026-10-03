import React from 'react';
import { Sparkles } from 'lucide-react';

interface SimulatedBadgeProps {
  label?: string;
  className?: string;
}

export const SimulatedBadge: React.FC<SimulatedBadgeProps> = ({
  label = 'Simulated demo data',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-[#5C5C5C] font-normal ${className}`}
      title="Non-production simulated environment. No real funds debited or real couriers dispatched."
    >
      <Sparkles className="w-3.5 h-3.5 text-[#C8102E] shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
