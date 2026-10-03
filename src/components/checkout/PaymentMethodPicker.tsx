import React from 'react';
import { Smartphone, CreditCard, Landmark, ShieldCheck, Check } from 'lucide-react';
import { PaymentMethod } from '../../shared/types.ts';
import { PAYMENT_METHODS } from '../../shared/constants.ts';

interface PaymentMethodPickerProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = ({
  selectedMethod,
  onSelectMethod
}) => {
  const currentConfig = PAYMENT_METHODS.find(m => m.id === selectedMethod)!;

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A1A]">Select Simulated Payment Method (P02)</h3>
          <p className="text-xs text-[#5C5C5C] mt-0.5">Switch methods safely anytime — your order draft and reservation stay intact.</p>
        </div>
        <span className="text-[11px] font-semibold text-[#1F7A4D] bg-[#EDF7F2] px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Zero Real Financial Debit</span>
        </span>
      </div>

      {/* Method Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PAYMENT_METHODS.map(method => {
          const isSelected = selectedMethod === method.id;
          const Icon =
            method.id === 'upi' ? Smartphone : method.id === 'card' ? CreditCard : Landmark;

          return (
            <button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                isSelected
                  ? 'border-[#C8102E] bg-[#FFF7F8] ring-1 ring-[#C8102E]/25'
                  : 'border-[#E8E8E8] bg-[#FAFAFA] hover:bg-[#F4F4F4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-[#C8102E] text-white' : 'bg-white text-[#1A1A1A] border border-[#E8E8E8]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#C8102E]" />}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#1A1A1A] leading-tight">{method.name}</p>
                <p className="text-[10px] text-[#8E8E8E] mt-0.5">{method.expectedTime}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Method 3-Step Guide */}
      <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1A1A1A]">{currentConfig.name} Protocol</span>
          <span className="text-[#8E8E8E]">Expected latency: {currentConfig.expectedTime}</span>
        </div>

        <ol className="space-y-1.5 text-xs text-[#5C5C5C]">
          {currentConfig.guide.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#E8E8E8] text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {selectedMethod === 'card' && (
          <div className="p-3 bg-white border border-[#E8E8E8] rounded-lg text-xs space-y-1">
            <p className="font-semibold text-[#1A1A1A]">Prefilled Prototype Test Card:</p>
            <p className="font-mono text-[#5C5C5C] text-[11px]">
              4000 0012 3456 7890 · Exp 12/28 · CVV 123
            </p>
            <p className="text-[10px] text-[#8E8E8E]">Never input real financial credentials on test platforms.</p>
          </div>
        )}
      </div>
    </div>
  );
};
