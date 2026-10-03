import { useMemo } from 'react';

export function useSavingsPlan(livePrice: number, savedSoFar: number, targetMonths: number) {
  return useMemo(() => {
    const cleanPrice = Math.max(0, Math.round(livePrice));
    const cleanSaved = Math.max(0, Math.round(savedSoFar));
    const months = Math.max(1, Math.round(targetMonths));

    const remaining = Math.max(0, cleanPrice - cleanSaved);
    const suggestedMonthly = Math.ceil(remaining / months);
    const progressPercent = cleanPrice > 0 ? Math.min(100, Math.round((cleanSaved / cleanPrice) * 100)) : 0;
    const isCompleted = cleanSaved >= cleanPrice;

    return {
      livePrice: cleanPrice,
      savedSoFar: cleanSaved,
      remaining,
      targetMonths: months,
      suggestedMonthly,
      progressPercent,
      isCompleted
    };
  }, [livePrice, savedSoFar, targetMonths]);
}
