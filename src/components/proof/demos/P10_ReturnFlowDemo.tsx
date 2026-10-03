import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, CheckCircle2, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { ReturnCaseStatus } from '../../../shared/types.ts';
import { useToast } from '../../../context/ToastContext.tsx';

export const P10_ReturnFlowDemo: React.FC = () => {
  const { showToast } = useToast();
  const [caseStatus, setCaseStatus] = useState<ReturnCaseStatus>('Reported');

  const statuses: ReturnCaseStatus[] = ['Reported', 'Under review', 'Refund'];

  const advanceCase = () => {
    if (caseStatus === 'Reported') {
      setCaseStatus('Under review');
      showToast({
        type: 'info',
        title: 'Return Case Advanced (P10)',
        message: 'Status moved to Under Review. Operations inspecting packing verification logs.'
      });
    } else if (caseStatus === 'Under review') {
      setCaseStatus('Refund');
      showToast({
        type: 'success',
        title: 'Refund Approved (Simulated)',
        message: 'Simulated whole-rupee refund credited to original payment instrument.'
      });
    } else {
      setCaseStatus('Reported');
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#F0F0F0]">
          <div>
            <p className="font-semibold text-[#1A1A1A]">Return Case Lifecycle Stepper</p>
            <p className="text-[11px] text-[#5C5C5C]">Case ID: ret_demo_9841 · Item: Nova 3 5G</p>
          </div>
          <span className="text-[11px] font-semibold text-[#C8102E] bg-[#FDECEE] px-2 py-0.5 rounded-full">
            Active Case
          </span>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between max-w-md mx-auto py-2">
          {statuses.map((s, idx) => {
            const isPassed = statuses.indexOf(caseStatus) >= idx;
            const isCurrent = caseStatus === s;

            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-[#C8102E] text-white ring-4 ring-[#C8102E]/20'
                        : isPassed
                        ? 'bg-[#1F7A4D] text-white'
                        : 'bg-[#FAFAFA] border border-[#E8E8E8] text-[#8E8E8E]'
                    }`}
                  >
                    {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] ${isCurrent ? 'font-bold text-[#C8102E]' : 'text-[#5C5C5C]'}`}>
                    {s}
                  </span>
                </div>
                {idx < statuses.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      statuses.indexOf(caseStatus) > idx ? 'bg-[#1F7A4D]' : 'bg-[#E8E8E8]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs space-y-1">
          <p className="font-semibold text-[#1A1A1A]">Audit Trail Entry:</p>
          <p className="text-[#5C5C5C] text-[11px]">
            {caseStatus === 'Reported' && 'Discrepancy logged by shopper. Awaiting warehouse pack verification audit.'}
            {caseStatus === 'Under review' && 'Fulfillment supervisor cross-referencing scanned packing station timestamps.'}
            {caseStatus === 'Refund' && 'Simulated refund of ₹26,999 authorized and credited. Zero cancellation dispute friction.'}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={advanceCase}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <span>{caseStatus === 'Refund' ? 'Restart Case Lifecycle' : 'Advance Case Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
