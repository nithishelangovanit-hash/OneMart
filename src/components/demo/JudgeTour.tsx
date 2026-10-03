import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Award, Check } from 'lucide-react';
import { CLAIMS } from '../../shared/claims.ts';

interface JudgeTourProps {
  onSelectClaim: (claimId: string) => void;
}

export const JudgeTour: React.FC<JudgeTourProps> = ({ onSelectClaim }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentClaim = CLAIMS[currentIndex];

  const handleNext = () => {
    const next = (currentIndex + 1) % CLAIMS.length;
    setCurrentIndex(next);
    onSelectClaim(CLAIMS[next].id);
  };

  const handlePrev = () => {
    const prev = (currentIndex - 1 + CLAIMS.length) % CLAIMS.length;
    setCurrentIndex(prev);
    onSelectClaim(CLAIMS[prev].id);
  };

  return (
    <div className="bg-[#FFF7F8] border border-[#FDECEE] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-[#C8102E] text-white font-bold flex items-center justify-center font-display tabular-nums shrink-0">
          {currentIndex + 1}/12
        </span>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C8102E]">
            3-Minute Guided Judge Tour
          </span>
          <p className="font-bold text-[#1A1A1A] leading-snug">
            {currentClaim.title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 bg-white border border-[#E8E8E8] text-[#1A1A1A] hover:bg-[#FAFAFA] rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-1.5 bg-[#C8102E] hover:bg-[#A30D25] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>Next Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
