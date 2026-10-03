import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Award, RotateCcw } from 'lucide-react';
import { useDemo } from '../../context/DemoContext.tsx';
import { CLAIMS } from '../../shared/claims.ts';

export const ProofProgress: React.FC = () => {
  const { completedDemos, resetAllDemoState } = useDemo();
  const count = completedDemos.length;
  const total = CLAIMS.length;
  const pct = Math.round((count / total) * 100);

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-[#FDECEE] text-[#C8102E] flex items-center justify-center font-bold font-display text-sm shrink-0">
          {pct}%
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Judge Verification Progress</span>
          </h4>
          <p className="text-xs text-[#5C5C5C] mt-0.5">
            <strong className="text-[#C8102E] tabular-nums">{count} of {total}</strong> architectural demos tested and verified.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-64 space-y-1">
        <div className="w-full h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-[#C8102E] rounded-full"
          />
        </div>
      </div>

      <button
        onClick={resetAllDemoState}
        className="text-xs text-[#8E8E8E] hover:text-[#C8102E] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset All Demos</span>
      </button>
    </div>
  );
};
