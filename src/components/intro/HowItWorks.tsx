import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calculator, Lock, ShieldCheck, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Browse & Compare Honestly',
      icon: Search,
      description: 'Filter certified products with zero sponsored placement bias. Run the 4-Lens comparison before adding to bag.'
    },
    {
      number: '02',
      title: 'Guaranteed Full Total Upfront',
      icon: Calculator,
      description: 'Subtotal, shipping, and tax computed early in whole rupees. The cart total matches the payment gateway to the exact rupee.'
    },
    {
      number: '03',
      title: 'Atomic 10-Minute Held Stock',
      icon: Lock,
      description: 'Proceeding to checkout triggers a database row lock. Your unit is guaranteed held for 10 minutes while you enter your address.'
    },
    {
      number: '04',
      title: 'Clear Payment State Machine',
      icon: ShieldCheck,
      description: 'Compare-and-set transitions (Ready → Checking → Success) guarantee you never get double-debited during retries.'
    },
    {
      number: '05',
      title: 'Track & Verify Received Item',
      icon: Truck,
      description: 'Immutable append-only events show real progress. At delivery, verify the photo against what arrived or trigger instant return.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C8102E] mb-2">The Architecture</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] font-display">
            How OneMart protects your shopping journey
          </h2>
          <p className="text-sm text-[#5C5C5C] mt-3">
            Five strict architectural checkpoints eliminate hidden fees, overselling races, and payment limbo.
          </p>
        </div>

        {/* Step Cards with Connected Progress Line */}
        <div className="relative">
          {/* Subtle line behind desktop steps */}
          <div className="hidden lg:block absolute top-10 left-12 right-12 h-0.5 bg-[#E8E8E8] -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <motion.div
                  key={step.number}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveStep(idx)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#C8102E] shadow-card ring-1 ring-[#C8102E]/20'
                      : 'border-[#E8E8E8] hover:border-[#8E8E8E]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#C8102E] text-white' : 'bg-[#FAFAFA] text-[#1A1A1A] border border-[#E8E8E8]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#8E8E8E] font-display tabular-nums">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0F0F0] text-[11px] text-[#8E8E8E] flex items-center justify-between">
                    <span>Stage {idx + 1} of 5</span>
                    <span className={isSelected ? 'text-[#C8102E] font-semibold' : ''}>
                      {isSelected ? 'Active' : 'Inspect'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
