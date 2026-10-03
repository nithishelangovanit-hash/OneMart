import React, { useState } from 'react';
import { PiggyBank, Plus, TrendingDown, Check, Sparkles } from 'lucide-react';
import { formatRupees } from '../../../shared/money.ts';
import { useToast } from '../../../context/ToastContext.tsx';

export const P11_SavingsCalcDemo: React.FC = () => {
  const { showToast } = useToast();
  const [livePrice, setLivePrice] = useState(12000);
  const [savedSoFar, setSavedSoFar] = useState(4000);
  const [periodsLeft, setPeriodsLeft] = useState(4);
  const budgetCap = 12000;

  const remaining = Math.max(0, livePrice - savedSoFar);
  const suggestedMonthly = Math.ceil(remaining / Math.max(1, periodsLeft));
  const isPriceFit = livePrice <= budgetCap;

  const handleDeposit = (amount: number) => {
    const updated = savedSoFar + amount;
    setSavedSoFar(updated);
    showToast({
      type: 'success',
      title: 'Deposit Added (P11)',
      message: `Saved total is now ${formatRupees(updated)}. Monthly plan adjusted to ${formatRupees(
        Math.ceil(Math.max(0, livePrice - updated) / periodsLeft)
      )}.`
    });
  };

  const handlePriceDrop = (newPrice: number) => {
    setLivePrice(newPrice);
    if (newPrice <= budgetCap) {
      showToast({
        type: 'info',
        title: 'Price-Fit Alert Triggered!',
        message: `Live price dropped to ${formatRupees(newPrice)} (at or below budget cap ${formatRupees(budgetCap)}).`
      });
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {isPriceFit && (
        <div className="p-3 bg-[#EDF7F2] border border-[#1F7A4D]/30 rounded-xl text-[#1F7A4D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span>
              <strong>Price-Fit Alert Active:</strong> Live price ({formatRupees(livePrice)}) is below your ₹{budgetCap.toLocaleString('en-IN')} cap.
            </span>
          </div>
          <span className="font-semibold text-xs underline">Instant Buy Eligible</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Live Store Price</p>
          <p className="text-xl font-bold text-[#1A1A1A] tabular-nums mt-0.5">{formatRupees(livePrice)}</p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Saved So Far</p>
          <p className="text-xl font-bold text-[#1F7A4D] tabular-nums mt-0.5">{formatRupees(savedSoFar)}</p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Suggested / Month</p>
          <p className="text-xl font-bold text-[#C8102E] tabular-nums mt-0.5">{formatRupees(suggestedMonthly)}</p>
        </div>
      </div>

      <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl space-y-3">
        <p className="font-semibold text-[#1A1A1A]">Math Formulation Proof:</p>
        <p className="font-mono text-[11px] bg-white p-2 rounded border border-[#E8E8E8]">
          suggested = ceil(max({livePrice} - {savedSoFar}, 0) ÷ {periodsLeft}) = ₹{suggestedMonthly.toLocaleString('en-IN')}/month
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDeposit(1000)}
              className="px-3 py-1.5 bg-white border border-[#E8E8E8] hover:border-[#1F7A4D] rounded font-semibold text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-[#1F7A4D]" />
              <span>+₹1,000 Deposit</span>
            </button>
            <button
              onClick={() => handlePriceDrop(10500)}
              className="px-3 py-1.5 bg-white border border-[#E8E8E8] hover:border-[#C8102E] rounded font-semibold text-[#1A1A1A] cursor-pointer"
            >
              Simulate ₹10,500 Price Drop
            </button>
            <button
              onClick={() => handlePriceDrop(12000)}
              className="px-2.5 py-1.5 text-[#8E8E8E] hover:underline"
            >
              Reset Price (₹12,000)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
