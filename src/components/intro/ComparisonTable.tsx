import React from 'react';
import { ArrowUpRight, Check, X, ShieldAlert } from 'lucide-react';
import { CLAIMS } from '../../shared/claims.ts';

interface ComparisonTableProps {
  onNavigate: (path: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C8102E] mb-2">12 Verified Fixes</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] font-display">
            Common retail frustrations vs OneMart solutions
          </h2>
          <p className="text-sm text-[#5C5C5C] mt-3">
            Every entry is substantiated by real industry survey data with explicit caveats, and backed by a live interactive demo.
          </p>
        </div>

        {/* 12-Row Table Container */}
        <div className="border border-[#E8E8E8] rounded-xl overflow-hidden shadow-subtle bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#1A1A1A]">
                  <th className="py-3.5 px-4 font-semibold w-16 text-center">#</th>
                  <th className="py-3.5 px-4 font-semibold w-64">Frustration</th>
                  <th className="py-3.5 px-4 font-semibold w-72">Many Standard Stores</th>
                  <th className="py-3.5 px-4 font-semibold w-80 text-[#C8102E]">OneMart Architectural Fix</th>
                  <th className="py-3.5 px-4 font-semibold w-36 text-right">Interactive Demo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                {CLAIMS.map(claim => (
                  <tr
                    key={claim.id}
                    className="hover:bg-[#FFF7F8]/40 transition-colors group"
                  >
                    <td className="py-4 px-4 text-center font-bold text-[#8E8E8E] tabular-nums">
                      P{claim.number.toString().padStart(2, '0')}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#1A1A1A]">
                      <p className="font-semibold text-sm text-[#1A1A1A] mb-1">{claim.title}</p>
                      <p className="text-[#5C5C5C] text-[11px] leading-relaxed">{claim.frustration}</p>
                    </td>
                    <td className="py-4 px-4 text-[#5C5C5C]">
                      <div className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-[#8E8E8E] mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{claim.industryPractice}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C8102E] mt-0.5 shrink-0" />
                        <span className="text-[#1A1A1A] font-medium leading-relaxed">
                          {claim.oneMartFix}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate(claim.demoRoute)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#C8102E] hover:text-[#A30D25] hover:bg-[#FDECEE] rounded-md transition-colors cursor-pointer"
                      >
                        <span>See Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence Caveat Note */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#8E8E8E]">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
            <span>All survey figures cite original sources (Baymard, DHL, New Relic, Descartes, RBI) and are labeled as sample signals.</span>
          </span>
          <button
            onClick={() => onNavigate('/proof')}
            className="text-[#C8102E] font-medium hover:underline cursor-pointer"
          >
            Open Proof Hub with all 12 live test benches →
          </button>
        </div>
      </div>
    </section>
  );
};
