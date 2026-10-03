import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is OneMart a real store with live payment processing?',
      a: 'No. OneMart is an architectural proof-of-concept for hackathon evaluation. All payment gateways (UPI, Cards, Net Banking) are fully simulated state machines without real monetary debits. No real cards or bank credentials are ever accepted or stored.'
    },
    {
      q: 'Are the product brands real commercial entities?',
      a: 'All brands (Aevum Tech, Kinetix, Vayu Dynamics, Dhanya Organics, Botanica Skin, Scribe Works, etc.) are strictly fictional. All certification records (BIS, FSSAI, GOTS) are labeled as prototype sample data to avoid misleading consumers.'
    },
    {
      q: 'How does OneMart prevent overselling during flash sale traffic?',
      a: 'When a shopper clicks "Proceed to checkout", an atomic database row lock verifies inventory (on_hand minus active holds) and writes a 10-minute hold. If another buyer competes for the last unit, they queue on the lock and receive an immediate out-of-stock notice instead of a ghost confirmation.'
    },
    {
      q: 'Why does Compare Lens enforce single-category comparisons?',
      a: 'Comparing specifications across different categories (e.g. comparing a smartphone against a cricket bat) is mathematically meaningless. Normalized min-max scoring works only across shared functional attributes within the same product vertical.'
    },
    {
      q: 'What is the "Chaos Demo" in the Proof Hub?',
      a: 'The Chaos Demo (P04) simulates 50 concurrent buyers firing simultaneous checkout requests for a single inventory unit. The real-time scoreboard proves that exactly 1 hold is granted, 49 are safely rejected, and zero negative stock is incurred.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C8102E] mb-2">Transparency & FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display">
            Frequently Asked Architecture Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#E8E8E8] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8E8E8E] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#C8102E]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#5C5C5C] leading-relaxed border-t border-[#F0F0F0] bg-[#FAFAFA]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
