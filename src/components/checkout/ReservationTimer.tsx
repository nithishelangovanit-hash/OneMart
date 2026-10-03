import React from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown.ts';

interface ReservationTimerProps {
  onExpire?: () => void;
}

export const ReservationTimer: React.FC<ReservationTimerProps> = ({ onExpire }) => {
  const { formatted, isExpiringSoon, isExpired, percentage } = useCountdown(600, onExpire);

  if (isExpired) {
    return (
      <div className="p-3 bg-[#FEF7EE] border border-[#B45309]/30 rounded-xl text-xs text-[#B45309] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Your 10-minute inventory reservation has expired. Please re-check item availability.</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-2.5 py-1 bg-[#B45309] text-white rounded text-[11px] font-semibold hover:bg-[#92400E] shrink-0"
        >
          Re-Check Stock
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-colors ${
        isExpiringSoon
          ? 'bg-[#FEF7EE] border-[#B45309]/40 text-[#B45309]'
          : 'bg-[#EDF7F2] border-[#1F7A4D]/30 text-[#1F7A4D]'
      }`}
    >
      <div className="flex items-center gap-2">
        {isExpiringSoon ? (
          <Clock className="w-4 h-4 animate-pulse shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 shrink-0" />
        )}
        <span>
          <strong className="font-semibold">Inventory Hold Locked (P04):</strong> Stock is reserved
          exclusively for your checkout.
        </span>
      </div>

      <div className="flex items-center gap-2 font-mono font-bold text-sm tabular-nums shrink-0">
        <span>{formatted}</span>
      </div>
    </div>
  );
};
