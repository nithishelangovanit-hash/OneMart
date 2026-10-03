import React, { useState } from 'react';
import { Smartphone, CreditCard, Landmark, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { PaymentMethod } from '../../../shared/types.ts';
import { useToast } from '../../../context/ToastContext.tsx';

export const P02_SwitchMethodDemo: React.FC = () => {
  const { showToast } = useToast();
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>('upi');
  const [switchesCount, setSwitchesCount] = useState(0);

  const handleSwitch = (newMethod: PaymentMethod) => {
    setCurrentMethod(newMethod);
    setSwitchesCount(prev => prev + 1);
    showToast({
      type: 'info',
      title: 'Payment Method Switched (P02)',
      message: `Active attempt reset to ${newMethod.toUpperCase()}. Order items, address draft, and 10:00 hold preserved.`
    });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['upi', 'card', 'netbanking'] as PaymentMethod[]).map(method => {
          const isSelected = currentMethod === method;
          const Icon = method === 'upi' ? Smartphone : method === 'card' ? CreditCard : Landmark;
          const name = method === 'upi' ? 'UPI Instant' : method === 'card' ? 'Test Card' : 'Net Banking';

          return (
            <button
              key={method}
              onClick={() => handleSwitch(method)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                isSelected
                  ? 'border-[#C8102E] bg-[#FFF7F8] ring-1 ring-[#C8102E]/25'
                  : 'border-[#E8E8E8] bg-white hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="flex justify-between items-center">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C8102E]' : 'text-[#5C5C5C]'}`} />
                {isSelected && <span className="text-[10px] text-[#C8102E] font-bold">Active</span>}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A]">{name}</p>
                <p className="text-[10px] text-[#8E8E8E]">1 Active Attempt Rule</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-between text-xs">
        <div className="space-y-1">
          <p className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1F7A4D]" />
            <span>Preserved State Verification (Switches: {switchesCount})</span>
          </p>
          <p className="text-[#5C5C5C]">
            Basket Items: 1 unit Nova 3 · Reservation Hold: res_active_hold (10:00) · Cart: Intact
          </p>
        </div>
        <span className="text-xs font-semibold text-[#1F7A4D] bg-[#EDF7F2] px-2.5 py-1 rounded-md">
          Zero Lost Drafts
        </span>
      </div>
    </div>
  );
};
