import React, { useState } from 'react';
import { Wifi, WifiOff, ShieldCheck, RefreshCw, Save } from 'lucide-react';
import { useDemo } from '../../../context/DemoContext.tsx';
import { loadAddressDraft } from '../../../lib/draftStorage.ts';
import { useToast } from '../../../context/ToastContext.tsx';

export const P12_BadNetworkDemo: React.FC = () => {
  const { simulateNetworkOff, setSimulateNetworkOff } = useDemo();
  const { showToast } = useToast();
  const [retryAttempted, setRetryAttempted] = useState(false);

  const address = loadAddressDraft();

  const handleToggle = () => {
    const nextState = !simulateNetworkOff;
    setSimulateNetworkOff(nextState);
    showToast({
      type: nextState ? 'error' : 'success',
      title: nextState ? 'Simulated Offline Mode Active (P12)' : 'Connection Restored',
      message: nextState
        ? 'Network requests suspended. Client draft storage locked in local cache.'
        : 'Store reachable. Safe retry queue synchronized with 0 duplicate orders.'
    });
  };

  const handleSimulatedRetry = () => {
    setRetryAttempted(true);
    showToast({
      type: 'success',
      title: 'Safe Idempotent Retry',
      message: 'Client retried with original idempotency key req_offline_retry. Server returned identical single order.'
    });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[#1A1A1A]">Network Simulation Controller</p>
          <p className="text-[11px] text-[#5C5C5C]">
            Test client draft recovery and safe idempotent retry under degraded connectivity.
          </p>
        </div>

        <button
          onClick={handleToggle}
          className={`px-4 py-2 font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
            simulateNetworkOff
              ? 'bg-[#C8102E] text-white'
              : 'bg-[#FAFAFA] border border-[#E8E8E8] text-[#1A1A1A] hover:bg-[#F4F4F4]'
          }`}
        >
          {simulateNetworkOff ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          <span>{simulateNetworkOff ? 'Simulated Offline: ACTIVE' : 'Simulate Bad Network'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl space-y-1">
          <p className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 text-[#1F7A4D]" />
            <span>Persistent Draft Storage State</span>
          </p>
          <p className="text-[11px] text-[#5C5C5C]">
            Address in local memory: {address?.fullName || 'Nithish Elangovan'} ({address?.city || 'Bengaluru'})
          </p>
          <p className="text-[10px] text-[#8E8E8E]">Progress automatically preserved across network dropouts.</p>
        </div>

        <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl space-y-1">
          <p className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A4D]" />
            <span>Idempotent Retry Invariant</span>
          </p>
          <p className="text-[11px] text-[#5C5C5C]">
            Unique Idempotency Key: <code className="font-mono text-[#C8102E]">idemp_offline_retry</code>
          </p>
          <button
            onClick={handleSimulatedRetry}
            className="text-[11px] font-semibold text-[#C8102E] hover:underline cursor-pointer"
          >
            {retryAttempted ? 'Retry Processed: 1 Order Exactly ✓' : 'Execute Safe Retry Submission →'}
          </button>
        </div>
      </div>
    </div>
  );
};
