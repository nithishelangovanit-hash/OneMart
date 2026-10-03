import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, ShieldCheck, AlertCircle, Award } from 'lucide-react';
import { runChaosRace, ChaosRacerResult } from '../../../lib/api.ts';

export const P04_ChaosScoreboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    holdsGranted: number;
    rejections: number;
    negativeStockCount: number;
    winner?: ChaosRacerResult;
    racers: ChaosRacerResult[];
  } | null>(null);

  const startChaosRace = async () => {
    setIsRunning(true);
    setResults(null);

    // Simulate animated concurrency burst
    setTimeout(async () => {
      const data = await runChaosRace();
      setResults(data);
      setIsRunning(false);
    }, 700);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Scoreboard Metrics */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Concurrent Buyers</p>
          <p className="text-xl font-bold text-[#1A1A1A] tabular-nums mt-0.5">50</p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Holds Granted</p>
          <p className="text-xl font-bold text-[#1F7A4D] tabular-nums mt-0.5">
            {results ? results.holdsGranted : '—'}
          </p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Safe Rejections</p>
          <p className="text-xl font-bold text-[#C8102E] tabular-nums mt-0.5">
            {results ? results.rejections : '—'}
          </p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Negative Stock</p>
          <p className="text-xl font-bold text-[#1F7A4D] tabular-nums mt-0.5">
            {results ? results.negativeStockCount : '0'}
          </p>
        </div>
      </div>

      {/* 50-Dot Visualization Grid */}
      <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl space-y-3">
        <div className="flex items-center justify-between text-[11px] text-[#5C5C5C]">
          <span>Race Arena: 50 Threads Contending for 1 Inventory Row</span>
          {results?.winner && (
            <span className="font-semibold text-[#1F7A4D] flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Acquired by {results.winner.name} ({results.winner.latencyMs}ms)</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 50 }).map((_, idx) => {
            const racer = results?.racers[idx];
            const isWinner = racer?.outcome === 'hold_acquired';
            const isLoser = racer?.outcome === 'rejected_out_of_stock';

            return (
              <motion.div
                key={idx}
                animate={
                  isRunning
                    ? { scale: [1, 1.25, 1], opacity: [0.4, 1, 0.4] }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.3, repeat: isRunning ? Infinity : 0 }}
                className={`h-7 rounded-lg flex items-center justify-center font-bold text-[10px] tabular-nums transition-colors ${
                  isWinner
                    ? 'bg-[#1F7A4D] text-white shadow-sm ring-2 ring-[#1F7A4D]/40'
                    : isLoser
                    ? 'bg-[#FDECEE] text-[#C8102E] border border-[#C8102E]/20'
                    : 'bg-white border border-[#E8E8E8] text-[#8E8E8E]'
                }`}
                title={`Shopper #${idx + 1}`}
              >
                {idx + 1}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trigger & Invariant Verification */}
      <div className="flex items-center justify-between">
        <button
          onClick={startChaosRace}
          disabled={isRunning}
          className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isRunning ? 'Simulating 50-Buyer Spike...' : 'Fire 50-Buyer Chaos Race'}</span>
        </button>

        <span className="text-[11px] text-[#5C5C5C] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A4D]" />
          <span>CHECK on_hand &gt;= 0 strictly enforced at Postgres level.</span>
        </span>
      </div>
    </div>
  );
};
