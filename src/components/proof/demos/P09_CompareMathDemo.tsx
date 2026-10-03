import React, { useState, useMemo } from 'react';
import { Sliders, Award, Check, Info } from 'lucide-react';
import { calculateCompareScores } from '../../../lib/scoring.ts';
import { db } from '../../../lib/api.ts';
import { formatRupees } from '../../../shared/money.ts';

export const P09_CompareMathDemo: React.FC = () => {
  const [weights, setWeights] = useState({
    price: 50,
    rating: 30,
    newest: 20
  });

  const trio = useMemo(() => {
    const ids = ['prod_nova_2', 'prod_nova_3', 'prod_orbi_x2'];
    return db.products.filter(p => ids.includes(p.id));
  }, []);

  const scoredTrio = useMemo(() => {
    return calculateCompareScores(trio, weights);
  }, [trio, weights]);

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-semibold text-[#1A1A1A]">Price Weight</span>
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
          <div className="flex justify-between mb-1">
            <span className="font-semibold text-[#1A1A1A]">Rating Weight</span>
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
          <div className="flex justify-between mb-1">
            <span className="font-semibold text-[#1A1A1A]">Newest Weight</span>
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

      {/* Step-by-Step Mathematical Normalization Table */}
      <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#1A1A1A]">
              <th className="py-2.5 px-3 font-semibold">Model</th>
              <th className="py-2.5 px-3 font-semibold">Price → Scaled</th>
              <th className="py-2.5 px-3 font-semibold">Rating → Scaled</th>
              <th className="py-2.5 px-3 font-semibold">Year → Scaled</th>
              <th className="py-2.5 px-3 font-semibold text-right">Computed Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8E8]">
            {scoredTrio.map(item => (
              <tr key={item.product.id} className="hover:bg-[#FAFAFA]">
                <td className="py-2.5 px-3 font-bold text-[#1A1A1A]">
                  <div className="flex items-center gap-1.5">
                    {item.rank === 1 && <Award className="w-3.5 h-3.5 text-[#C8102E]" />}
                    <span>{item.product.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 tabular-nums">
                  {formatRupees(item.product.price)} → <strong>{item.scaledPrice.toFixed(2)}</strong>
                </td>
                <td className="py-2.5 px-3 tabular-nums">
                  {item.product.rating}★ → <strong>{item.scaledRating.toFixed(2)}</strong>
                </td>
                <td className="py-2.5 px-3 tabular-nums">
                  {item.product.releaseYear} → <strong>{item.scaledYear.toFixed(2)}</strong>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-sm text-[#C8102E] tabular-nums">
                  {item.totalScore.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs text-[#5C5C5C] space-y-1">
        <p className="font-semibold text-[#1A1A1A]">Plain-English Justification:</p>
        <p className="text-[11px] leading-relaxed">
          {scoredTrio[0].reasons.join('. ')}. At 50/30/20 weights, Nova 2 scores 0.650 due to 50% price weight dominance, outranking Nova 3 (0.500) and Orbi X2 (0.350).
        </p>
      </div>
    </div>
  );
};
