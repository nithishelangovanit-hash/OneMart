import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PiggyBank, ArrowRight, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { formatRupees } from '../../shared/money.ts';

interface SuperSaveTeaserProps {
  onNavigate: (path: string) => void;
}

export const SuperSaveTeaser: React.FC<SuperSaveTeaserProps> = ({ onNavigate }) => {
  const [productPrice, setProductPrice] = useState<number>(12000);
  const [months, setMonths] = useState<number>(6);

  const monthlySuggested = Math.ceil(productPrice / months);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-2xl p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Context */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8102E]">
                <PiggyBank className="w-3.5 h-3.5" />
                <span>SuperSave Scheme (P11)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display">
                Plan big-ticket purchases without predatory credit lines
              </h2>

              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Link any active store product to an automated personal savings goal.
                Track deposits, receive live price-fit alerts when discounts occur, and buy debt-free.
              </p>

              <div className="space-y-2 text-xs text-[#5C5C5C] pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1F7A4D] shrink-0" />
                  <span>Real-time plan recalculation if the store price changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1F7A4D] shrink-0" />
                  <span>Price-fit notification when live price drops below your target budget cap</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#8E8E8E]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>Simulated tracker: No real money is held or debited. Prototype demonstration only.</span>
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Mini Calculator */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Interactive Goal Calculator
                  </span>
                  <span className="text-xs font-medium text-[#C8102E] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Whole-Rupee Math</span>
                  </span>
                </div>

                {/* Price Input */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#1A1A1A]">Product Target Value</span>
                    <span className="font-bold text-[#1A1A1A] tabular-nums">
                      {formatRupees(productPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="60000"
                    step="1000"
                    value={productPrice}
                    onChange={e => setProductPrice(Number(e.target.value))}
                    className="w-full accent-[#C8102E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#8E8E8E] mt-1">
                    <span>₹3,000</span>
                    <span>₹30,000</span>
                    <span>₹60,000</span>
                  </div>
                </div>

                {/* Target Months Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#1A1A1A]">Saving Timeline</span>
                    <span className="font-bold text-[#C8102E] tabular-nums">
                      {months} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={months}
                    onChange={e => setMonths(Number(e.target.value))}
                    className="w-full accent-[#C8102E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#8E8E8E] mt-1">
                    <span>2 Mo</span>
                    <span>6 Mo</span>
                    <span>12 Mo</span>
                  </div>
                </div>

                {/* Result Callout */}
                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#5C5C5C]">Suggested Monthly Deposit</p>
                    <p className="text-2xl font-bold text-[#C8102E] font-display tabular-nums mt-0.5">
                      {formatRupees(monthlySuggested)}{' '}
                      <span className="text-xs font-normal text-[#5C5C5C]">/ month</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-[#8E8E8E]">
                    <p>ceil({formatRupees(productPrice)} ÷ {months})</p>
                    <p className="text-[#1F7A4D] font-medium mt-0.5">Zero Interest Charges</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/account/savings')}
                  className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Full SuperSave Goal Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
