import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProofCtaProps {
  onNavigate: (path: string) => void;
}

export const ProofCta: React.FC<ProofCtaProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-8 sm:p-12 shadow-card space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#FDECEE] text-[#C8102E] mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] font-display">
            Ready to test the proof-backed store?
          </h2>
          <p className="text-sm text-[#5C5C5C] max-w-xl mx-auto leading-relaxed">
            Take the 3-minute guided Judge Tour across all 12 test cards in the Proof Hub,
            or browse the catalog and experience atomic inventory holds firsthand.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/proof')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#C8102E] hover:bg-[#A30D25] rounded-xl transition-all cursor-pointer"
            >
              <span>Launch 12-Card Proof Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#1A1A1A] bg-[#FAFAFA] hover:bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl transition-all cursor-pointer"
            >
              <span>Explore Products</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
