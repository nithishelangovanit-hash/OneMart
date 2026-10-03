import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Check, Sparkles, Scale, Lock } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8102E]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shopping with Proof · 12 Verified Guarantees</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] font-display leading-[1.12]"
            >
              A store that{' '}
              <span className="relative inline-block text-[#C8102E]">
                shows its work
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                  className="absolute -bottom-1.5 left-0 w-full h-3 text-[#C8102E] overflow-visible"
                  viewBox="0 0 240 12"
                  fill="none"
                >
                  <motion.path
                    d="M 2 8 C 60 2, 180 2, 238 8"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              , not just its prices.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base sm:text-lg text-[#5C5C5C] max-w-xl leading-relaxed"
            >
              OneMart compares products without marketing bias, locks your stock for 10
              minutes at checkout, prevents double-debit payment limbo with strict state
              machines, and verifies every item before dispatch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={() => onNavigate('/proof')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#C8102E] hover:bg-[#A30D25] rounded-xl shadow-sm transition-all transform active:scale-[0.98] cursor-pointer"
              >
                <span>Try the 12 Live Demos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/shop')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#1A1A1A] bg-[#FAFAFA] hover:bg-[#F4F4F4] border border-[#E8E8E8] rounded-xl transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Start Shopping</span>
              </button>
            </motion.div>

            {/* Quick Proof Pillars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="pt-4 border-t border-[#E8E8E8] grid grid-cols-3 gap-3 text-xs text-[#5C5C5C]"
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0" />
                <span>10-Min Atomic Holds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0" />
                <span>Transparent Math</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Asset & Proof Badge */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden border border-[#E8E8E8] shadow-card bg-[#FAFAFA]"
            >
              <img
                src="/src/assets/images/hero_onemart_proof_1791067260349.jpg"
                alt="OneMart studio product composition with transparent verification tablet"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover"
              />

              {/* Contiguous Floating Verification Proof Card */}
              <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-[#E8E8E8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1A1A1A]">Fulfillment & Checkout Invariants</span>
                  <span className="text-[#1F7A4D] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Active & Enforced</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5C5C5C]">
                  <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                    <p className="text-[#8E8E8E]">Inventory Hold</p>
                    <p className="font-semibold text-[#1A1A1A] tabular-nums">10:00 Row Lock</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                    <p className="text-[#8E8E8E]">Payment Attempts</p>
                    <p className="font-semibold text-[#1A1A1A]">1 Active Attempt</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
