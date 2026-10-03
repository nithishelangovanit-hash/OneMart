import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { PaymentStatus, PaymentMethod } from '../../shared/types.ts';
import { useDemo } from '../../context/DemoContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface PaymentStatusPanelProps {
  status: PaymentStatus;
  method: PaymentMethod;
  onPayClick: (forcedOutcome?: 'Success' | 'Failed' | 'Pending') => void;
  onSwitchMethod: () => void;
  isProcessing: boolean;
  message?: string;
}

export const PaymentStatusPanel: React.FC<PaymentStatusPanelProps> = ({
  status,
  method,
  onPayClick,
  onSwitchMethod,
  isProcessing,
  message
}) => {
  const { isDemoMode, forcedOutcome, setForcedOutcome } = useDemo();
  const { showToast } = useToast();
  const [illegalMoveAttempted, setIllegalMoveAttempted] = useState(false);

  const states: PaymentStatus[] = ['Ready', 'Checking', 'Success'];

  const handleIllegalMove = () => {
    setIllegalMoveAttempted(true);
    showToast({
      type: 'error',
      title: 'State Transition Blocked (P03 Invariant)',
      message: 'Server rejected illegal jump directly from Ready → Success without passing through Checking lock.'
    });
    setTimeout(() => setIllegalMoveAttempted(false), 3000);
  };

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A1A]">Payment State Machine (P03)</h3>
          <p className="text-xs text-[#5C5C5C] mt-0.5">
            Strict compare-and-set database transactions prevent duplicate debits.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#1F7A4D] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Idempotent Execution</span>
        </span>
      </div>

      {/* Visual State Diagram */}
      <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl">
        <p className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider mb-3">
          State Machine Flow: Ready → Checking → Success / Failed / Pending
        </p>

        <div className="flex items-center justify-between max-w-md mx-auto">
          {['Ready', 'Checking', status === 'Failed' ? 'Failed' : status === 'Pending' ? 'Pending' : 'Success'].map((s, idx) => {
            const isCurrent = status === s;
            const isPast =
              (status === 'Checking' && s === 'Ready') ||
              (status === 'Success' && (s === 'Ready' || s === 'Checking'));

            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? s === 'Failed'
                          ? 'bg-[#FDECEE] text-[#C8102E] border-2 border-[#C8102E] shadow-sm'
                          : s === 'Pending'
                          ? 'bg-[#FEF7EE] text-[#B45309] border-2 border-[#B45309]'
                          : 'bg-[#C8102E] text-white shadow-sm ring-4 ring-[#C8102E]/20'
                        : isPast
                        ? 'bg-[#EDF7F2] text-[#1F7A4D] border border-[#1F7A4D]/40'
                        : 'bg-white text-[#8E8E8E] border border-[#E8E8E8]'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s[0]}
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent ? 'text-[#1A1A1A] font-bold' : 'text-[#8E8E8E]'
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      isPast ? 'bg-[#1F7A4D]' : 'bg-[#E8E8E8]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* State Specific Feedback Messaging */}
      {status === 'Checking' && (
        <div className="p-4 rounded-xl bg-[#FEF7EE] border border-[#B45309]/30 text-xs text-[#B45309] space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="w-4 h-4 animate-spin shrink-0" />
            <span>Waiting for gateway authorization. Please do not submit again yet.</span>
          </div>
          <p className="text-[#5C5C5C] leading-relaxed">
            A compare-and-set row lock is in place. If network drops occur, status automatically transitions to Pending after 15 seconds.
          </p>
        </div>
      )}

      {status === 'Failed' && (
        <div className="p-4 rounded-xl bg-[#FDECEE] border border-[#C8102E]/30 text-xs text-[#C8102E] space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Payment attempt was not approved (Simulated).</span>
          </div>
          <p className="text-[#5C5C5C]">
            Your order snapshot and 10-minute hold remain preserved. You can retry immediately or switch to another method.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onPayClick('Success')}
              className="px-3 py-1.5 bg-[#C8102E] text-white font-semibold rounded-lg hover:bg-[#A30D25] cursor-pointer"
            >
              Retry Payment
            </button>
            <button
              onClick={onSwitchMethod}
              className="px-3 py-1.5 bg-white border border-[#E8E8E8] text-[#1A1A1A] font-semibold rounded-lg hover:bg-[#FAFAFA] cursor-pointer"
            >
              Try Another Method (P02)
            </button>
          </div>
        </div>
      )}

      {status === 'Pending' && (
        <div className="p-4 rounded-xl bg-[#FEF7EE] border border-[#B45309]/30 text-xs text-[#B45309] space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Authorization in Pending Limbo (15s Timeout Rule).</span>
          </div>
          <p className="text-[#5C5C5C]">
            We haven't received confirmation from the bank yet. Please check your UPI or banking app transaction history before paying again.
            Your item reservation is retained for up to 30 minutes.
          </p>
          <button
            onClick={() => onPayClick('Success')}
            className="px-3 py-1.5 bg-[#B45309] text-white font-semibold rounded-lg hover:bg-[#92400E] cursor-pointer"
          >
            Simulate Bank Approval Arrived
          </button>
        </div>
      )}

      {/* Main Execution Controls */}
      {status === 'Ready' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onPayClick()}
              disabled={isProcessing}
              className={`flex-1 py-3 px-6 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-[#E8E8E8] text-[#8E8E8E] cursor-not-allowed'
                  : 'bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm active:scale-[0.98]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing Idempotent Request...'
                  : `Authorize Simulated Payment (${method.toUpperCase()})`}
              </span>
            </button>

            <button
              onClick={onSwitchMethod}
              disabled={isProcessing}
              className="px-4 py-3 bg-[#FAFAFA] hover:bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl text-xs font-semibold text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Switch Method (P02)
            </button>
          </div>

          <p className="text-[11px] text-center text-[#8E8E8E]">
            Double-click protected: 2 fast clicks trigger 1 active attempt with 1 unique idempotency key.
          </p>
        </div>
      )}

      {/* Demo Outcome Simulator Panel (Visible in Demo Mode) */}
      {isDemoMode && (
        <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Demo State Machine Test Controls</span>
            </span>
            <button
              onClick={handleIllegalMove}
              className="text-[11px] text-[#C8102E] hover:underline cursor-pointer"
            >
              Try Illegal Move (Ready → Success)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#5C5C5C]">Force Outcome:</span>
            <button
              onClick={() => onPayClick('Success')}
              className="px-2.5 py-1 bg-white hover:bg-[#EDF7F2] border border-[#1F7A4D]/30 text-[#1F7A4D] rounded font-semibold text-[11px] cursor-pointer"
            >
              Force Success
            </button>
            <button
              onClick={() => onPayClick('Failed')}
              className="px-2.5 py-1 bg-white hover:bg-[#FDECEE] border border-[#C8102E]/30 text-[#C8102E] rounded font-semibold text-[11px] cursor-pointer"
            >
              Force Failure (Test Retry)
            </button>
            <button
              onClick={() => onPayClick('Pending')}
              className="px-2.5 py-1 bg-white hover:bg-[#FEF7EE] border border-[#B45309]/30 text-[#B45309] rounded font-semibold text-[11px] cursor-pointer"
            >
              Force Timeout Pending
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
