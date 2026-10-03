import React, { useEffect } from 'react';
import { CLAIMS } from '../../shared/claims.ts';
import { ProofCard } from '../../components/proof/ProofCard.tsx';
import { ProofProgress } from '../../components/proof/ProofProgress.tsx';
import { JudgeTour } from '../../components/demo/JudgeTour.tsx';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const ProofHubPage: React.FC = () => {
  const scrollToCard = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => scrollToCard(hash), 200);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8102E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verifiable Architecture Benchmark</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A] font-display">
            The OneMart Proof Hub
          </h1>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            12 interactive test benches demonstrating how our frontend and transactional
            engine eliminate common e-commerce failures. Every card links problem, verified evidence,
            and live client execution.
          </p>
        </div>

        {/* Judge Tour & Progress */}
        <div className="space-y-4">
          <JudgeTour onSelectClaim={scrollToCard} />
          <ProofProgress />
        </div>

        {/* 12 Proof Cards Stream */}
        <div className="space-y-8 pt-4">
          {CLAIMS.map(claim => (
            <ProofCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>
    </div>
  );
};
