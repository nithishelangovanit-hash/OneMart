import { useState, useEffect, useRef } from 'react';

export function useCountdown(initialSeconds: number = 600, onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpireRef.current) onExpireRef.current();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpireRef.current) onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isExpiringSoon = secondsLeft > 0 && secondsLeft <= 120; // Under 2 minutes -> turns amber
  const isExpired = secondsLeft === 0;
  const percentage = (secondsLeft / initialSeconds) * 100;

  const reset = (newSeconds = initialSeconds) => {
    setSecondsLeft(newSeconds);
  };

  return {
    secondsLeft,
    formatted,
    isExpiringSoon,
    isExpired,
    percentage,
    reset
  };
}
