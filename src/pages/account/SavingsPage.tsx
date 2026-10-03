import React, { useState } from 'react';
import { PiggyBank, Plus, Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';
import { db } from '../../lib/api.ts';
import { SuperSaveGoal, Product } from '../../shared/types.ts';
import { GoalCard } from '../../components/supersave/GoalCard.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { formatRupees } from '../../shared/money.ts';

interface SavingsPageProps {
  onNavigate: (path: string) => void;
}

export const SavingsPage: React.FC<SavingsPageProps> = ({ onNavigate }) => {
  const [goals, setGoals] = useState<SuperSaveGoal[]>(db.savingsGoals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(db.products[0]?.id || '');
  const [targetMonths, setTargetMonths] = useState(6);
  const [budgetCap, setBudgetCap] = useState(25000);
  const { showToast } = useToast();

  const handleGoalUpdated = (updated: SuperSaveGoal) => {
    setGoals(prev => prev.map(g => (g.id === updated.id ? updated : g)));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const product = db.products.find(p => p.id === selectedProductId);
    if (!product) return;

    const newGoal: SuperSaveGoal = {
      id: 'goal_' + Math.random().toString(36).substring(2, 8),
      productId: product.id,
      product,
      budgetCap,
      targetMonths,
      frequency: 'monthly',
      status: 'active',
      savedSoFar: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + targetMonths * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      suggestedPerMonth: Math.ceil(product.price / targetMonths),
      priceFitAlertActive: product.price <= budgetCap,
      contributions: []
    };

    db.savingsGoals.unshift(newGoal);
    setGoals([...db.savingsGoals]);
    setShowCreateModal(false);

    showToast({
      type: 'success',
      title: 'SuperSave Goal Created (P11)',
      message: `Goal linked to ${product.name}. Suggested plan: ${formatRupees(newGoal.suggestedPerMonth)}/month.`
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display flex items-center gap-2">
              <PiggyBank className="w-7 h-7 text-[#C8102E]" />
              <span>SuperSave Goal Planner (P11)</span>
            </h1>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Plan big purchases disciplined and debt-free. Live mathematical plan recalculation on price changes.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Goal</span>
          </button>
        </div>

        {/* Regulatory Note */}
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl text-xs text-[#8E8E8E] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#B45309] shrink-0" />
          <span>
            Simulated tracker: No real money is held or debited. In production, real auto-debits require an authorized mandate and RBI PPI compliance.
          </span>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onGoalUpdated={handleGoalUpdated} />
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#E8E8E8] shadow-card space-y-5">
              <h3 className="text-base font-bold text-[#1A1A1A]">Create Product Savings Goal</h3>

              <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">Target Product</label>
                  <select
                    value={selectedProductId}
                    onChange={e => setSelectedProductId(e.target.value)}
                    className="w-full p-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs text-[#1A1A1A]"
                  >
                    {db.products.slice(0, 10).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatRupees(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">
                    Timeline (Months to Save): <strong className="text-[#C8102E]">{targetMonths} Months</strong>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={targetMonths}
                    onChange={e => setTargetMonths(Number(e.target.value))}
                    className="w-full accent-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">
                    Budget Cap Alert Ceiling (₹)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={budgetCap}
                    onChange={e => setBudgetCap(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-[#8E8E8E] mt-1">
                    Fires a price-fit notification if the live catalog price drops below this ceiling.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#F0F0F0]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3 py-2 border border-[#E8E8E8] text-[#5C5C5C] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg"
                  >
                    Activate Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
