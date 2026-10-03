import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SampleDataBadgeProps {
  label?: string;
  className?: string;
}

export const SampleDataBadge: React.FC<SampleDataBadgeProps> = ({
  label = 'Sample data',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-[#5C5C5C] font-normal tracking-wide ${className}`}
      title="This metric or certification is seeded sample data for prototype demonstration"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
