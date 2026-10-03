import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sliders, Award, ArrowRight, Info, Check } from 'lucide-react';
import { calculateCompareScores } from '../../lib/scoring.ts';
import { db } from '../../lib/api.ts';
import { formatRupees } from '../../shared/money.ts';

interface FeaturedComparisonProps {
  onNavigate: (path: string) => void;
}

export const FeaturedComparison: React.FC<FeaturedComparisonProps> = ({ onNavigate }) => {
  const [weights, setWeights] = useState({
    price: 50,
    rating: 30,
    newest: 20
  });

  const [showMath, setShowMath] = useState(false);

  // Retrieve the Nova trio from db
  const trio = useMemo(() => {
    const ids = ['prod_nova_2', 'prod_nova_3', 'prod_orbi_x2'];
    return db.products.filter(p => ids.includes(p.id));
  }, []);

  const scoredTrio = useMemo(() => {
    return calculateCompareScores(trio, weights);
  }, [trio, weights]);

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C8102E] mb-2">
              Featured Compare Lens (P09)
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] font-display">
              Transparent, weighted product scoring
            </h2>
            <p className="text-sm text-[#5C5C5C] mt-2 max-w-xl">
              Adjust your personal priorities below. Scores recompute instantly via normalized min-max math across identical category products.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/compare')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#C8102E] hover:text-[#A30D25] hover:underline cursor-pointer"
          >
            <span>Open Full 4-Lens Comparison Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Priority Sliders Module */}
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 mb-8 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Priority Weight Sliders</span>
            </span>
            <button
              onClick={() => setShowMath(!showMath)}
              className="text-xs text-[#5C5C5C] hover:text-[#1A1A1A] underline cursor-pointer flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              <span>{showMath ? 'Hide Math Breakdown' : 'Show the Math'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[#1A1A1A]">Price Sensitivity (Cheaper = Better)</span>
                <span className="font-bold text-[#C8102E] tabular-nums">{weights.price}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.price}
                onChange={e => setWeights(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full accent-[#C8102E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[#1A1A1A]">User Satisfaction (Rating)</span>
                <span className="font-bold text-[#C8102E] tabular-nums">{weights.rating}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.rating}
                onChange={e => setWeights(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full accent-[#C8102E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[#1A1A1A]">Newest Hardware Generation</span>
                <span className="font-bold text-[#C8102E] tabular-nums">{weights.newest}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.newest}
                onChange={e => setWeights(prev => ({ ...prev, newest: Number(e.target.value) }))}
                className="w-full accent-[#C8102E] cursor-pointer"
              />
            </div>
          </div>

          {/* Math breakdown drawer */}
          {showMath && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-[#E8E8E8] text-xs text-[#5C5C5C] space-y-1"
            >
              <p className="font-semibold text-[#1A1A1A]">Min-Max Normalization Formula:</p>
              <p className="font-mono text-[11px] bg-[#FAFAFA] p-2 rounded border border-[#E8E8E8]">
                Score = (W_price × [MaxPrice - Price]/ΔPrice) + (W_rating × [Rating - MinRating]/ΔRating) + (W_year × [Year - MinYear]/ΔYear)
              </p>
              <p className="text-[11px] text-[#8E8E8E]">
                At 50/30/20 weights, Nova 2 scores 0.650, Nova 3 scores 0.500, and Orbi X2 scores 0.350. Small score spreads (&lt;0.03) trigger an automatic tie rule.
              </p>
            </motion.div>
          )}
        </div>

        {/* Live Ranked Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scoredTrio.map(item => {
            const isWinner = item.rank === 1;
            return (
              <motion.div
                key={item.product.id}
                layout
                className={`bg-white border rounded-xl overflow-hidden shadow-subtle p-5 flex flex-col justify-between transition-all ${
                  isWinner ? 'border-[#C8102E] ring-1 ring-[#C8102E]/20' : 'border-[#E8E8E8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#5C5C5C]">{item.product.brand}</span>
                    {isWinner && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] bg-[#FDECEE] px-2 py-0.5 rounded-full">
                        <Award className="w-3.5 h-3.5" />
                        <span>Rank #{item.rank} Choice</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
                    {item.product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-[#1A1A1A] tabular-nums">
                      {formatRupees(item.product.price)}
                    </span>
                    <span className="text-xs text-[#5C5C5C] tabular-nums">
                      · {item.product.rating}★ ({item.product.reviewCount} reviews) · {item.product.releaseYear}
                    </span>
                  </div>

                  {/* Animated Score Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#5C5C5C]">Weighted Lens Score</span>
                      <span className="font-bold text-[#1A1A1A] tabular-nums">
                        {(item.totalScore * 100).toFixed(1)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isWinner ? 'bg-[#C8102E]' : 'bg-[#1A1A1A]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.totalScore * 100}%` }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Plain English Reason */}
                  <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8] text-xs text-[#5C5C5C] space-y-1">
                    <p className="font-medium text-[#1A1A1A]">Reason for rank:</p>
                    {item.reasons.map((r, i) => (
                      <p key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                        <Check className="w-3 h-3 text-[#1F7A4D] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0F0F0] flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/product/${item.product.id}`)}
                    className="text-xs text-[#5C5C5C] hover:text-[#1A1A1A] font-medium"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => onNavigate('/compare')}
                    className="text-xs font-semibold text-[#C8102E] hover:underline"
                  >
                    Compare in Lens →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
