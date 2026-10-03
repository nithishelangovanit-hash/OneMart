import React from 'react';
import { ShieldCheck, Lock, Award, Eye } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'Whole-Rupee Math',
      description: 'Zero hidden taxes or surprise shipping fees added in final payment.'
    },
    {
      icon: Lock,
      title: 'Atomic 10-Min Reservation',
      description: 'Strict database row lock prevents overselling during flash drop contention.'
    },
    {
      icon: ShieldCheck,
      title: 'Compare-and-Set Safety',
      description: 'Idempotency keys ensure double-clicking "Pay" creates only one order.'
    },
    {
      icon: Award,
      title: 'SKU Pack Verification',
      description: 'Warehouse staff must type matching item SKU before dispatching order.'
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FDECEE] text-[#C8102E] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A1A] mb-1">{item.title}</h4>
                  <p className="text-[11px] text-[#5C5C5C] leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
