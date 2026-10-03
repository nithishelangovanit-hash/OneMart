import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Award,
  Check,
  X,
  TrendingUp,
  ShieldCheck,
  History,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Info
} from 'lucide-react';
import { Product } from '../../shared/types.ts';
import { calculateCompareScores } from '../../lib/scoring.ts';
import { formatRupees } from '../../shared/money.ts';
import { PriceTag } from '../common/PriceTag.tsx';
import { RatingStars } from '../common/RatingStars.tsx';
import { useCart } from '../../context/CartContext.tsx';

interface CompareLensProps {
  products: Product[];
  onNavigate: (path: string) => void;
}

export const CompareLens: React.FC<CompareLensProps> = ({ products, onNavigate }) => {
  const { addItem } = useCart();
  const [activeLens, setActiveLens] = useState<'specs' | 'trust' | 'standards' | 'old_vs_new'>('specs');
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [weights, setWeights] = useState({
    price: 50,
    rating: 30,
    newest: 20
  });
  const [showMath, setShowMath] = useState(false);

  // Compute live scores and ranking
  const scoredProducts = useMemo(() => {
    return calculateCompareScores(products, weights);
  }, [products, weights]);

  // Aggregate all unique specification keys
  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const p of products) {
      Object.keys(p.specs).forEach(k => keys.add(k));
    }
    return Array.from(keys);
  }, [products]);

  // Filter specs by "differences only" if toggled
  const visibleSpecKeys = useMemo(() => {
    if (!differencesOnly) return allSpecKeys;
    return allSpecKeys.filter(k => {
      const values = products.map(p => p.specs[k] || '—');
      return new Set(values).size > 1;
    });
  }, [allSpecKeys, differencesOnly, products]);

  // Detect if any products share a familyId for Lens 4 (Old vs New)
  const familyProducts = useMemo(() => {
    return products.filter(p => p.familyId);
  }, [products]);

  return (
    <div className="space-y-8">
      {/* Top Priority Picker & Weighted Scoring Header */}
      <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F0F0]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Priority Weighting Engine</span>
            </span>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Fine-tune the relative importance of price, customer satisfaction, and release age.
            </p>
          </div>
          <button
            onClick={() => setShowMath(!showMath)}
            className="text-xs text-[#5C5C5C] hover:text-[#1A1A1A] underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
          >
            <Info className="w-3 h-3" />
            <span>{showMath ? 'Hide Math Formulation' : 'Show the Math'}</span>
          </button>
        </div>

        {/* 3 Interactive Sliders */}
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
              <span className="font-medium text-[#1A1A1A]">User Rating & Reviews</span>
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
              <span className="font-medium text-[#1A1A1A]">Newest Generation Hardware</span>
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

        {showMath && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs text-[#5C5C5C] space-y-1.5"
          >
            <p className="font-semibold text-[#1A1A1A]">Formula Proof & Normalization Invariant:</p>
            <p className="font-mono text-[11px] bg-white p-2 rounded border border-[#E8E8E8]">
              Score = (w_p × [MaxPrice - Price] ÷ ΔPrice) + (w_r × [Rating - MinRating] ÷ ΔRating) + (w_y × [Year - MinYear] ÷ ΔYear)
            </p>
            <p className="text-[11px] text-[#8E8E8E]">
              Only products belonging to the same vertical are scored. A spread &lt;0.03 automatically triggers the tie rule.
            </p>
          </motion.div>
        )}
      </div>

      {/* Top Product Cards Matrix with Rank Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoredProducts.map(scored => {
          const isWinner = scored.rank === 1;
          const p = scored.product;
          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-5 shadow-subtle flex flex-col justify-between transition-all ${
                isWinner ? 'border-[#C8102E] ring-1 ring-[#C8102E]/25 shadow-card' : 'border-[#E8E8E8]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#8E8E8E]">{p.brand}</span>
                  {isWinner ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-xs text-[#C8102E] bg-[#FDECEE] px-2 py-0.5 rounded-full">
                      <Award className="w-3.5 h-3.5" />
                      <span>Rank #{scored.rank} Overall</span>
                    </span>
                  ) : (
                    <span className="text-xs text-[#8E8E8E] font-medium tabular-nums">
                      Rank #{scored.rank}
                    </span>
                  )}
                </div>

                <div className="aspect-[4/3] bg-[#FAFAFA] rounded-lg p-3 flex items-center justify-center mb-3 border border-[#F0F0F0]">
                  <img
                    src={p.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
                    alt={p.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1 leading-snug">
                  {p.name}
                </h3>

                <div className="flex items-baseline justify-between mb-3">
                  <PriceTag price={p.price} originalPrice={p.originalPrice} size="md" />
                  <RatingStars rating={p.rating} reviewCount={p.reviewCount} />
                </div>

                {/* Score Progress */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#5C5C5C]">Score</span>
                    <span className="font-bold text-[#1A1A1A] tabular-nums">
                      {(scored.totalScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isWinner ? 'bg-[#C8102E]' : 'bg-[#1A1A1A]'
                      }`}
                      style={{ width: `${scored.totalScore * 100}%` }}
                    />
                  </div>
                </div>

                {/* Plain-English Reasons */}
                <div className="p-2.5 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8] text-xs text-[#5C5C5C] space-y-1">
                  {scored.reasons.map((r, i) => (
                    <p key={i} className="flex items-start gap-1 text-[11px] leading-relaxed">
                      <Check className="w-3 h-3 text-[#1F7A4D] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center gap-2">
                <button
                  onClick={() => addItem(p, 1)}
                  className="w-full py-2 px-3 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lens Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E8E8E8]">
        <div className="flex items-center gap-1 p-1 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveLens('specs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeLens === 'specs'
                ? 'bg-white text-[#C8102E] font-semibold shadow-subtle'
                : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
            }`}
          >
            Lens 1: Specs & Price
          </button>
          <button
            onClick={() => setActiveLens('trust')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeLens === 'trust'
                ? 'bg-white text-[#C8102E] font-semibold shadow-subtle'
                : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
            }`}
          >
            Lens 2: 5-Year Brand Trust
          </button>
          <button
            onClick={() => setActiveLens('standards')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeLens === 'standards'
                ? 'bg-white text-[#C8102E] font-semibold shadow-subtle'
                : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
            }`}
          >
            Lens 3: Standards Matrix
          </button>
          <button
            onClick={() => setActiveLens('old_vs_new')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeLens === 'old_vs_new'
                ? 'bg-white text-[#C8102E] font-semibold shadow-subtle'
                : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
            }`}
          >
            Lens 4: Old vs New Generation
          </button>
        </div>

        {activeLens === 'specs' && (
          <label className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] cursor-pointer">
            <input
              type="checkbox"
              checked={differencesOnly}
              onChange={() => setDifferencesOnly(!differencesOnly)}
              className="w-4 h-4 text-[#C8102E] rounded border-[#E8E8E8] accent-[#C8102E] cursor-pointer"
            />
            <span>Show differences only</span>
          </label>
        )}
      </div>

      {/* Lens 1: Specs and Price Table */}
      {activeLens === 'specs' && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#1A1A1A]">
                  <th className="py-3 px-4 font-semibold w-1/4">Specification Attribute</th>
                  {products.map(p => (
                    <th key={p.id} className="py-3 px-4 font-semibold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                <tr className="hover:bg-[#FAFAFA]">
                  <td className="py-3 px-4 font-medium text-[#5C5C5C]">Official Price</td>
                  {products.map(p => (
                    <td key={p.id} className="py-3 px-4 font-bold text-[#1A1A1A] tabular-nums">
                      {formatRupees(p.price)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#FAFAFA]">
                  <td className="py-3 px-4 font-medium text-[#5C5C5C]">Hardware Release Year</td>
                  {products.map(p => (
                    <td key={p.id} className="py-3 px-4 text-[#1A1A1A] tabular-nums">
                      {p.releaseYear}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#FAFAFA]">
                  <td className="py-3 px-4 font-medium text-[#5C5C5C]">Verified User Rating</td>
                  {products.map(p => (
                    <td key={p.id} className="py-3 px-4 text-[#1A1A1A] tabular-nums">
                      {p.rating}★ ({p.reviewCount} reviews)
                    </td>
                  ))}
                </tr>
                {visibleSpecKeys.map(key => (
                  <tr key={key} className="hover:bg-[#FAFAFA]">
                    <td className="py-3 px-4 font-medium text-[#5C5C5C]">{key}</td>
                    {products.map(p => {
                      const val = p.specs[key] || '—';
                      return (
                        <td key={p.id} className="py-3 px-4 text-[#1A1A1A]">
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lens 2: 5-Year Brand Trust Trend */}
      {activeLens === 'trust' && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C8102E]" />
              <span>Multi-Year Customer Trust Index (2022 – 2026)</span>
            </h3>
            <p className="text-xs text-[#5C5C5C]">
              Tracks brand-level average ratings and aggregate review volumes over a 5-year longitudinal history.
              Always displays review counts; labeled "Limited history" if insufficient data points exist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => {
              const stats = p.yearlyStats;
              const hasHistory = stats && stats.length >= 3;

              return (
                <div key={p.id} className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#1A1A1A]">{p.brand}</span>
                    <span className="text-[#8E8E8E]">{p.name}</span>
                  </div>

                  {hasHistory ? (
                    <div className="space-y-2">
                      <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
                        {stats.map(s => {
                          const heightPct = ((s.averageRating - 3.5) / 1.5) * 100;
                          return (
                            <div key={s.year} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[10px] text-[#5C5C5C] font-semibold tabular-nums">
                                {s.averageRating.toFixed(1)}
                              </span>
                              <div
                                className="w-full bg-[#C8102E]/80 hover:bg-[#C8102E] rounded-t transition-all"
                                style={{ height: `${Math.max(15, heightPct)}%` }}
                              />
                              <span className="text-[10px] text-[#8E8E8E] tabular-nums">{s.year}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2 border-t border-[#E8E8E8] text-[11px] text-[#5C5C5C] flex justify-between">
                        <span>Total Brand Reviews:</span>
                        <span className="font-bold tabular-nums">
                          {stats.reduce((acc, s) => acc + s.reviewCount, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[#8E8E8E] border border-dashed border-[#E8E8E8] rounded-lg">
                      <History className="w-5 h-5 mx-auto mb-1 text-[#8E8E8E]" />
                      <p className="font-semibold text-[#1A1A1A]">Limited History Available</p>
                      <p className="text-[11px] text-[#5C5C5C] mt-0.5">
                        Brand established recently. Current sample size: {p.reviewCount} reviews.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lens 3: Standards & Certifications Matrix */}
      {activeLens === 'standards' && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F7A4D]" />
              <span>Independent Standards & Regulatory Matrix</span>
            </h3>
            <p className="text-xs text-[#5C5C5C]">
              Safety, health, and environmental marks with regulatory authority, status, and last audit date.
              All items in prototype are marked with "Sample" or "Verified" badges with zero fabricated claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-3">
                <p className="font-semibold text-xs text-[#1A1A1A]">{p.name}</p>
                <div className="space-y-2">
                  {p.certifications.length > 0 ? (
                    p.certifications.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white border border-[#E8E8E8] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1A1A1A]">{c.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF7EE] text-[#B45309] font-medium border border-[#B45309]/20">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C5C5C]">Authority: {c.authority}</p>
                        <p className="text-[10px] text-[#8E8E8E]">Last Verified: {c.lastCheckedDate}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[#8E8E8E]">
                      No third-party certifications filed for this item category.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lens 4: Old vs New Generation */}
      {activeLens === 'old_vs_new' && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#C8102E]" />
              <span>Generational Upgrade Delta (Old vs New)</span>
            </h3>
            <p className="text-xs text-[#5C5C5C]">
              Hardware comparison for products within the same product family (e.g. Nova 2 vs Nova 3).
              Explicitly breaks down price differential, hardware gained, features dropped, and official software support horizons.
            </p>
          </div>

          {familyProducts.length >= 2 ? (
            <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#E8E8E8]">
                <span className="font-bold text-[#1A1A1A]">Family: {familyProducts[0].familyId?.toUpperCase()}</span>
                <span className="text-[#C8102E] font-medium">Upgrade Analysis Verified</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {familyProducts.map(p => (
                  <div key={p.id} className="space-y-3 bg-white p-4 rounded-lg border border-[#E8E8E8]">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-[#1A1A1A]">{p.name} ({p.releaseYear})</span>
                      <span className="text-xs font-bold text-[#1A1A1A] tabular-nums">{formatRupees(p.price)}</span>
                    </div>

                    {p.specsGained && p.specsGained.length > 0 && (
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-[#1F7A4D] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Hardware Gained:</span>
                        </span>
                        <ul className="list-disc list-inside text-[#5C5C5C] text-[11px] pl-1 space-y-0.5">
                          {p.specsGained.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {p.specsLost && p.specsLost.length > 0 && (
                      <div className="space-y-1 text-xs pt-1">
                        <span className="font-semibold text-[#C8102E] flex items-center gap-1">
                          <X className="w-3.5 h-3.5" />
                          <span>Features Dropped:</span>
                        </span>
                        <ul className="list-disc list-inside text-[#5C5C5C] text-[11px] pl-1 space-y-0.5">
                          {p.specsLost.map((l, i) => (
                            <li key={i}>{l}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {p.supportEndDate && (
                      <div className="pt-2 border-t border-[#F0F0F0] text-[11px] text-[#8E8E8E]">
                        <span>Security & OS Support Horizon: </span>
                        <span className="font-medium text-[#1A1A1A]">{p.supportEndDate}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#8E8E8E] border border-dashed border-[#E8E8E8] rounded-xl">
              <p className="font-semibold text-[#1A1A1A]">No Direct Predecessor/Successor Pair Selected</p>
              <p className="text-[11px] text-[#5C5C5C] mt-1">
                To inspect generational upgrade deltas, add both Nova 2 and Nova 3 from the smartphone category to the Compare Lens.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
