import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PiggyBank, Plus, Bell, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';
import { SuperSaveGoal } from '../../shared/types.ts';
import { formatRupees } from '../../shared/money.ts';
import { addSavingsContribution } from '../../lib/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

interface GoalCardProps {
  goal: SuperSaveGoal;
  onGoalUpdated: (updated: SuperSaveGoal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onGoalUpdated }) => {
  const { showToast } = useToast();
  const [depositAmount, setDepositAmount] = useState<number>(goal.suggestedPerMonth || 1000);
  const [isDepositing, setIsDepositing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const progressPercent = Math.min(100, Math.round((goal.savedSoFar / goal.product.price) * 100));
  const remaining = Math.max(0, goal.product.price - goal.savedSoFar);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDepositing(true);
    const updated = await addSavingsContribution(goal.id, depositAmount);
    setIsDepositing(false);

    if (updated) {
      showToast({
        type: 'success',
        title: 'Simulated Deposit Added',
        message: `Added ${formatRupees(depositAmount)}. Total saved: ${formatRupees(updated.savedSoFar)}.`
      });
      onGoalUpdated(updated);
      setShowDepositModal(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-5">
      {/* Price Fit Alert Banner (P11) */}
      {goal.priceFitAlertActive && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-[#EDF7F2] border border-[#1F7A4D]/30 rounded-lg text-xs text-[#1F7A4D] flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span>
              <strong>Price-Fit Alert Triggered:</strong> Live price ({formatRupees(goal.product.price)}) is
              at or below your target budget cap ({formatRupees(goal.budgetCap)})!
            </span>
          </div>
          <span className="font-semibold underline cursor-pointer shrink-0">Buy Now</span>
        </motion.div>
      )}

      {/* Goal Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={goal.product.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
            alt={goal.product.name}
            className="w-14 h-14 object-contain bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg p-1.5"
          />
          <div>
            <span className="text-[11px] text-[#8E8E8E] uppercase tracking-wider font-semibold">
              SuperSave Target Goal
            </span>
            <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug">{goal.product.name}</h3>
            <p className="text-xs text-[#5C5C5C] tabular-nums mt-0.5">
              Live Store Price: <strong className="text-[#1A1A1A]">{formatRupees(goal.product.price)}</strong>
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
            goal.status === 'completed'
              ? 'bg-[#EDF7F2] text-[#1F7A4D] border-[#1F7A4D]/30'
              : 'bg-[#FAFAFA] text-[#5C5C5C] border-[#E8E8E8]'
          }`}
        >
          {goal.status === 'completed' ? 'Goal Reached!' : `${progressPercent}% Saved`}
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#5C5C5C]">
          <span>Saved so far: <strong className="text-[#1A1A1A] tabular-nums">{formatRupees(goal.savedSoFar)}</strong></span>
          <span>Remaining: <strong className="text-[#C8102E] tabular-nums">{formatRupees(remaining)}</strong></span>
        </div>

        <div className="w-full h-3 bg-[#F0F0F0] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              goal.status === 'completed' ? 'bg-[#1F7A4D]' : 'bg-[#C8102E]'
            }`}
          />
        </div>
      </div>

      {/* Plan Math Calculation Breakdown */}
      <div className="p-3.5 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1A1A1A]">Suggested Monthly Contribution:</span>
          <span className="text-base font-bold text-[#C8102E] tabular-nums">
            {formatRupees(goal.suggestedPerMonth)} / mo
          </span>
        </div>
        <p className="text-[11px] text-[#5C5C5C] leading-relaxed">
          Formula: ceil(max(live price ₹{goal.product.price.toLocaleString('en-IN')} − saved ₹{goal.savedSoFar.toLocaleString('en-IN')}, 0) ÷ {goal.targetMonths} months remaining) = ₹{goal.suggestedPerMonth.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[#8E8E8E] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#C8102E]" />
          <span>Simulated tracker · No real funds deducted</span>
        </span>

        <button
          onClick={() => setShowDepositModal(true)}
          disabled={goal.status === 'completed'}
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Deposit (P11)</span>
        </button>
      </div>

      {/* Simulated Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-[#E8E8E8] shadow-card space-y-4">
            <h4 className="text-sm font-bold text-[#1A1A1A]">Record Simulated Savings Deposit</h4>
            <p className="text-xs text-[#5C5C5C]">
              Add a mock deposit to your tracking plan. The monthly suggested plan will automatically rebalance.
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1A1A] mb-1">Deposit Amount (₹)</label>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  step="100"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-sm font-bold tabular-nums"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-3 py-2 border border-[#E8E8E8] text-[#5C5C5C] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDepositing}
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg"
                >
                  {isDepositing ? 'Recording...' : 'Record Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
