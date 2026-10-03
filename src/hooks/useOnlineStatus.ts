import { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext.tsx';

export function useOnlineStatus() {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const { simulateNetworkOff } = useDemo();

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If demo toggle is simulated offline, treat as offline
  const isOnline = isBrowserOnline && !simulateNetworkOff;

  return {
    isOnline,
    isSimulatedOffline: simulateNetworkOff
  };
}
