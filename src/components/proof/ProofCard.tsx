import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { ClaimItem } from '../../shared/claims.ts';
import { useDemo } from '../../context/DemoContext.tsx';
import { P01_TotalsMatchDemo } from './demos/P01_TotalsMatchDemo.tsx';
import { P02_SwitchMethodDemo } from './demos/P02_SwitchMethodDemo.tsx';
import { P03_DoubleClickDemo } from './demos/P03_DoubleClickDemo.tsx';
import { P04_ChaosScoreboard } from './demos/P04_ChaosScoreboard.tsx';
import { P05_LoadResultsPanel } from './demos/P05_LoadResultsPanel.tsx';
import { P06_SecurityRunner } from './demos/P06_SecurityRunner.tsx';
import { P07_TrackingDemo } from './demos/P07_TrackingDemo.tsx';
import { P08_WrongSkuDemo } from './demos/P08_WrongSkuDemo.tsx';
import { P09_CompareMathDemo } from './demos/P09_CompareMathDemo.tsx';
import { P10_ReturnFlowDemo } from './demos/P10_ReturnFlowDemo.tsx';
import { P11_SavingsCalcDemo } from './demos/P11_SavingsCalcDemo.tsx';
import { P12_BadNetworkDemo } from './demos/P12_BadNetworkDemo.tsx';

interface ProofCardProps {
  claim: ClaimItem;
}

const DEMO_COMPONENTS: Record<string, React.FC> = {
  p01: P01_TotalsMatchDemo,
  p02: P02_SwitchMethodDemo,
  p03: P03_DoubleClickDemo,
  p04: P04_ChaosScoreboard,
  p05: P05_LoadResultsPanel,
  p06: P06_SecurityRunner,
  p07: P07_TrackingDemo,
  p08: P08_WrongSkuDemo,
  p09: P09_CompareMathDemo,
  p10: P10_ReturnFlowDemo,
  p11: P11_SavingsCalcDemo,
  p12: P12_BadNetworkDemo
};

export const ProofCard: React.FC<ProofCardProps> = ({ claim }) => {
  const { completedDemos, markDemoCompleted } = useDemo();
  const isCompleted = completedDemos.includes(claim.id);
  const DemoComponent = DEMO_COMPONENTS[claim.id] || P01_TotalsMatchDemo;

  return (
    <div
      id={claim.id}
      className={`bg-white border rounded-2xl p-6 sm:p-8 shadow-card transition-all ${
        isCompleted ? 'border-[#E8E8E8]' : 'border-[#C8102E]/30 ring-1 ring-[#C8102E]/10'
      }`}
    >
      {/* Header with Problem Index & Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#C8102E] text-white font-bold text-xs flex items-center justify-center font-display tabular-nums">
            P{claim.number.toString().padStart(2, '0')}
          </span>
          <div>
            <span className="text-[11px] text-[#8E8E8E] uppercase tracking-wider font-semibold">
              {claim.rubricCategory}
            </span>
            <h3 className="text-lg font-bold text-[#1A1A1A] font-display leading-snug">
              {claim.title}
            </h3>
          </div>
        </div>

        <button
          onClick={() => markDemoCompleted(claim.id)}
          className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-[#EDF7F2] text-[#1F7A4D] border border-[#1F7A4D]/30'
              : 'bg-[#FAFAFA] border border-[#E8E8E8] text-[#5C5C5C] hover:text-[#1A1A1A]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Verified in Demo' : 'Mark as Tested'}</span>
        </button>
      </div>

      {/* Problem, Industry Dilemma, and Solution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 text-xs">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Customer Frustration:</p>
            <p className="text-[#5C5C5C] leading-relaxed bg-[#FAFAFA] p-3 rounded-lg border border-[#E8E8E8]">
              "{claim.frustration}"
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#8E8E8E] mb-1">Standard Industry Practice:</p>
            <p className="text-[#5C5C5C] leading-relaxed">{claim.industryPractice}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="font-semibold text-[#C8102E] mb-1">OneMart Architectural Guarantee:</p>
            <p className="text-[#1A1A1A] font-medium leading-relaxed bg-[#FFF7F8] p-3 rounded-lg border border-[#FDECEE]">
              {claim.oneMartFix}
            </p>
          </div>

          {/* Evidence Strip with Explicit Source, Year, Metric & Caveat */}
          <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#1A1A1A]">{claim.evidence.source} ({claim.evidence.year})</span>
              <span className="text-[#C8102E] font-semibold tabular-nums">{claim.evidence.metric}</span>
            </div>
            <p className="text-[10px] text-[#8E8E8E] flex items-start gap-1 pt-0.5">
              <ShieldAlert className="w-3 h-3 text-[#B45309] shrink-0 mt-0.5" />
              <span><strong>Caveat:</strong> {claim.evidence.caveat}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Live Demo Workspace */}
      <div className="pt-4 border-t border-[#F0F0F0]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Interactive Demo: {claim.demoTitle}</span>
          </span>
          <span className="text-[11px] text-[#8E8E8E]">Self-contained client state machine</span>
        </div>

        <DemoComponent />
      </div>
    </div>
  );
};
