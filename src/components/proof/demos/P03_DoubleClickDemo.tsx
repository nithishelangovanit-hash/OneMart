import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, AlertOctagon, RotateCcw, Lock } from 'lucide-react';
import { useToast } from '../../../context/ToastContext.tsx';

export const P03_DoubleClickDemo: React.FC = () => {
  const { showToast } = useToast();
  const [clickCount, setClickCount] = useState(0);
  const [attemptsCreated, setAttemptsCreated] = useState(0);
  const [ordersCreated, setOrdersCreated] = useState(0);
  const [currentState, setCurrentState] = useState<'Ready' | 'Checking' | 'Success'>('Ready');
  const [isLocked, setIsLocked] = useState(false);

  const handlePayClick = () => {
    setClickCount(prev => prev + 1);

    if (isLocked) {
      showToast({
        type: 'info',
        title: 'Concurrent Click Intercepted (P03)',
        message: 'Second click blocked by compare-and-set row lock. No duplicate charge.'
      });
      return;
    }

    setIsLocked(true);
    setAttemptsCreated(1);
    setOrdersCreated(1);
    setCurrentState('Checking');

    setTimeout(() => {
      setCurrentState('Success');
      setIsLocked(false);
      showToast({
        type: 'success',
        title: 'Payment Successful',
        message: 'Order Confirmed in single ACID database transaction.'
      });
    }, 1200);
  };

  const handleIllegalMove = () => {
    showToast({
      type: 'error',
      title: 'Illegal Transition Blocked (HTTP 409 Conflict)',
      message: 'Client attempted direct jump to Success without passing through gateway Checking state.'
    });
  };

  const handleReset = () => {
    setClickCount(0);
    setAttemptsCreated(0);
    setOrdersCreated(0);
    setCurrentState('Ready');
    setIsLocked(false);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Button Clicks</p>
          <p className="text-xl font-bold text-[#1A1A1A] tabular-nums mt-0.5">{clickCount}</p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Payment Attempts</p>
          <p className="text-xl font-bold text-[#C8102E] tabular-nums mt-0.5">{attemptsCreated}</p>
        </div>
        <div className="p-3 bg-white border border-[#E8E8E8] rounded-xl">
          <p className="text-[#8E8E8E]">Orders Inserted</p>
          <p className="text-xl font-bold text-[#1F7A4D] tabular-nums mt-0.5">{ordersCreated}</p>
        </div>
      </div>

      {/* State Machine Status */}
      <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#5C5C5C]">Current State:</span>
          <span className="font-bold text-[#C8102E] px-2 py-0.5 bg-[#FDECEE] rounded">
            {currentState}
          </span>
        </div>
        <span className="text-[11px] text-[#1F7A4D] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Compare-and-Set Lock</span>
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePayClick}
          className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Double-Click Pay Rapidly</span>
        </button>

        <button
          onClick={handleIllegalMove}
          className="px-3 py-2 bg-white border border-[#C8102E] text-[#C8102E] hover:bg-[#FFF7F8] font-semibold rounded-lg cursor-pointer"
        >
          Try Illegal Move (Jump to Success)
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] text-[#5C5C5C] hover:text-[#1A1A1A] rounded-lg flex items-center gap-1 ml-auto cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
