import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../lib/api.ts';

interface DemoContextValue {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  simulateNetworkOff: boolean;
  setSimulateNetworkOff: (val: boolean) => void;
  forcedOutcome: 'Success' | 'Failed' | 'Pending' | null;
  setForcedOutcome: (val: 'Success' | 'Failed' | 'Pending' | null) => void;
  completedDemos: string[];
  markDemoCompleted: (demoId: string) => void;
  resetAllDemoState: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [simulateNetworkOff, setSimulateNetworkOff] = useState<boolean>(false);
  const [forcedOutcome, setForcedOutcome] = useState<'Success' | 'Failed' | 'Pending' | null>(null);
  const [completedDemos, setCompletedDemos] = useState<string[]>(['p01', 'p03', 'p04', 'p06', 'p09']);

  useEffect(() => {
    db.demoOutcomeOverride = forcedOutcome;
  }, [forcedOutcome]);

  const markDemoCompleted = useCallback((demoId: string) => {
    setCompletedDemos(prev => (prev.includes(demoId) ? prev : [...prev, demoId]));
  }, []);

  const resetAllDemoState = useCallback(() => {
    db.reset();
    setSimulateNetworkOff(false);
    setForcedOutcome(null);
    setCompletedDemos(['p01', 'p03', 'p04', 'p06', 'p09']);
  }, []);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        simulateNetworkOff,
        setSimulateNetworkOff,
        forcedOutcome,
        setForcedOutcome,
        completedDemos,
        markDemoCompleted,
        resetAllDemoState
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
