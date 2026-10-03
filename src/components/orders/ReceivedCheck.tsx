import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { OrderItemSnapshot, ReturnCase } from '../../shared/types.ts';
import { submitDeliveredCheck } from '../../lib/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { formatRupees } from '../../shared/money.ts';

interface ReceivedCheckProps {
  orderId: string;
  items: OrderItemSnapshot[];
  existingCheck?: 'correct' | 'wrong';
  onCheckCompleted: (answer: 'correct' | 'wrong', returnCase?: ReturnCase) => void;
}

export const ReceivedCheck: React.FC<ReceivedCheckProps> = ({
  orderId,
  items,
  existingCheck,
  onCheckCompleted
}) => {
  const { showToast } = useToast();
  const [showWrongItemForm, setShowWrongItemForm] = useState(false);
  const [wrongReason, setWrongReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCorrect = async () => {
    setSubmitting(true);
    const res = await submitDeliveredCheck(orderId, 'correct');
    setSubmitting(false);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Delivery Confirmation Recorded',
        message: 'Thank you for confirming receipt of the correct item.'
      });
      onCheckCompleted('correct');
    }
  };

  const handleWrongItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wrongReason.trim()) return;

    setSubmitting(true);
    const res = await submitDeliveredCheck(orderId, 'wrong', wrongReason);
    setSubmitting(false);

    if (res.success && res.returnCase) {
      showToast({
        type: 'info',
        title: 'Return Case Opened (P10)',
        message: `Case ${res.returnCase.id} registered in Reported state. Warehouse review pending.`
      });
      onCheckCompleted('wrong', res.returnCase);
      setShowWrongItemForm(false);
    }
  };

  if (existingCheck === 'correct') {
    return (
      <div className="p-4 rounded-xl bg-[#EDF7F2] border border-[#1F7A4D]/30 text-xs text-[#1F7A4D] flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="font-semibold">
          Customer verified item match upon delivery. Order fulfillment completed.
        </span>
      </div>
    );
  }

  if (existingCheck === 'wrong') {
    return (
      <div className="p-4 rounded-xl bg-[#FFF7F8] border border-[#C8102E]/30 text-xs text-[#C8102E] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Return Case active: Wrong item reported. Under administrative review.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A1A]">Package Receipt Verification (P08)</h3>
          <p className="text-xs text-[#5C5C5C] mt-0.5">
            Compare the delivered physical item against your original order snapshot below:
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#C8102E] bg-[#FDECEE] px-2 py-0.5 rounded-full">
          Immediate Redress Gate
        </span>
      </div>

      {/* Snapshot of items */}
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8] text-xs"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.imageUrl || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
                alt={item.name}
                className="w-12 h-12 object-contain bg-white rounded border border-[#E8E8E8] p-1"
              />
              <div>
                <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                <p className="text-[11px] text-[#8E8E8E]">SKU: {item.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold tabular-nums text-[#1A1A1A]">{formatRupees(item.unitPrice)}</p>
              <p className="text-[11px] text-[#5C5C5C]">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {!showWrongItemForm ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleCorrect}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1F7A4D] hover:bg-[#18633e] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Correct Item Delivered</span>
          </button>

          <button
            onClick={() => setShowWrongItemForm(true)}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#C8102E] text-[#C8102E] hover:bg-[#FFF7F8] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Wrong Item / Model Received</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleWrongItemSubmit} className="pt-3 border-t border-[#F0F0F0] space-y-3">
          <div className="text-xs">
            <label className="block font-semibold text-[#1A1A1A] mb-1">
              Describe the discrepancy (e.g. Received Nova 2 instead of Nova 3, wrong color/capacity):
            </label>
            <textarea
              required
              rows={3}
              value={wrongReason}
              onChange={e => setWrongReason(e.target.value)}
              placeholder="e.g. Package arrived with model SKU OM-MOB-NOV2 instead of ordered OM-MOB-NOV3."
              className="w-full p-2.5 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowWrongItemForm(false)}
              className="px-4 py-2 border border-[#E8E8E8] text-[#5C5C5C] hover:text-[#1A1A1A] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <span>Submit Return Case (P10)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
