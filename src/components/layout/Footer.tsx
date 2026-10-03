import React from 'react';
import { ShieldCheck, Sparkles, RefreshCcw } from 'lucide-react';
import { useDemo } from '../../context/DemoContext.tsx';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { resetAllDemoState } = useDemo();

  return (
    <footer className="bg-[#FAFAFA] border-t border-[#E8E8E8] text-[#5C5C5C] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Honesty Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-1.5 text-base font-bold text-[#1A1A1A] font-display">
              <span>OneMart</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
            </div>
            <p className="max-w-md leading-relaxed text-[#5C5C5C]">
              Shopping with proof. An e-commerce engineering prototype built with whole-rupee
              transparency, atomic inventory reservations, compare-and-set idempotency,
              and verifiable delivery logs.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8E8E8E] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#1F7A4D] shrink-0" />
              <span>Simulated payment and courier environment — zero real financial debit.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">Platform</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/proof')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Proof Hub (12 Demos)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Shop Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/compare')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Compare Lens
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account/savings')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  SuperSave Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Demo Tools */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">Governance & Demo</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/track')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Public Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Admin Dispatch Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetAllDemoState();
                  }}
                  className="inline-flex items-center gap-1.5 text-[#C8102E] hover:underline cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Reset Demo State</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8E8E]">
          <p>© 2026 OneMart Architecture. Fictional brands & sample certifications for demonstration.</p>
          <div className="flex items-center gap-4">
            <span>Whole-Rupee Math</span>
            <span>·</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>·</span>
            <span>Zero Unverified Claims</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
