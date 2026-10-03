import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.ts';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSimulatedOffline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-[#FFF7F8] border-b border-[#FDECEE] text-[#1A1A1A] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
              <span>
                {isSimulatedOffline
                  ? 'Simulated Offline Mode active (Demo P12). All order drafts and holds are locked safely in local storage.'
                  : 'You are currently offline. Your cart and checkout drafts are securely preserved.'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#1F7A4D] font-medium shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Retry Queue Active</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
