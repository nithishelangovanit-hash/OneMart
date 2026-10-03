import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy, ArrowRight, ShieldCheck, UserPlus, Package } from 'lucide-react';
import { db } from '../../lib/api.ts';
import { Order } from '../../shared/types.ts';
import { formatRupees } from '../../shared/money.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface ConfirmationPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { user, loginAsCustomer } = useAuth();
  const { showToast } = useToast();
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    const existing = db.orders.find(o => o.id === orderId) || db.orders[0];
    if (existing) {
      setOrder(existing);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-2 border-[#C8102E] border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingToken);
    showToast({
      type: 'info',
      title: 'Tracking Token Copied',
      message: `Token ${order.trackingToken} copied to clipboard.`
    });
  };

  const handleCreateAccount = () => {
    loginAsCustomer(order.address.email, order.address.fullName);
    setAccountCreated(true);
    showToast({
      type: 'success',
      title: 'Account Activated',
      message: 'Your guest order is now linked to your new customer profile.'
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Animated Checkmark Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-16 h-16 rounded-full bg-[#EDF7F2] text-[#1F7A4D] mx-auto flex items-center justify-center shadow-subtle"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display">
            Order Confirmed & Secured!
          </h1>
          <p className="text-xs text-[#5C5C5C] max-w-md mx-auto leading-relaxed">
            Payment verified. Your item hold has converted to a committed warehouse allocation.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          {/* Tracking Token Callout */}
          <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#8E8E8E]">Public Tracking Token:</span>
              <p className="text-base font-bold font-mono text-[#C8102E] tracking-wider mt-0.5">
                {order.trackingToken}
              </p>
            </div>
            <button
              onClick={handleCopyTracking}
              className="px-3 py-1.5 bg-white border border-[#E8E8E8] hover:border-[#1A1A1A] rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-[#1A1A1A]"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Token</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#5C5C5C] pt-2 border-t border-[#F0F0F0]">
            <div>
              <p className="text-[#8E8E8E]">Order Number</p>
              <p className="font-bold text-[#1A1A1A] tabular-nums">{order.id}</p>
            </div>
            <div>
              <p className="text-[#8E8E8E]">Payment Method</p>
              <p className="font-bold text-[#1A1A1A] uppercase">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[#8E8E8E]">Status</p>
              <p className="font-bold text-[#1F7A4D]">{order.status}</p>
            </div>
            <div>
              <p className="text-[#8E8E8E]">Total Paid</p>
              <p className="font-bold text-[#C8102E] tabular-nums">{formatRupees(order.total)}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3 pt-4 border-t border-[#F0F0F0]">
            <p className="text-xs font-semibold text-[#1A1A1A]">Purchased Items</p>
            {order.items.map(item => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-xs py-2 bg-[#FAFAFA] p-3 rounded-lg border border-[#E8E8E8]"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#8E8E8E]" />
                  <span className="font-medium text-[#1A1A1A]">{item.name}</span>
                </div>
                <span className="font-bold tabular-nums text-[#1A1A1A]">
                  {formatRupees(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Post-Order Optional Account Creation (P01) */}
          {!user && (
            <div className="p-4 bg-[#FFF7F8] border border-[#FDECEE] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>Optional Account Creation (P01 Guest Rule)</span>
                </span>
                <span className="text-[11px] text-[#C8102E] font-medium">Never Forced Before Purchase</span>
              </div>
              <p className="text-[#5C5C5C]">
                Save your delivery address ({order.address.email}) for 1-tap tracking across future visits.
              </p>
              {!accountCreated ? (
                <button
                  onClick={handleCreateAccount}
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg cursor-pointer"
                >
                  Create Account with 1-Tap
                </button>
              ) : (
                <p className="text-[#1F7A4D] font-bold">Account successfully activated!</p>
              )}
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate(`/account/orders/${order.id}`)}
              className="flex-1 py-3 px-4 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Order Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('/track')}
              className="flex-1 py-3 px-4 bg-[#FAFAFA] hover:bg-[#F4F4F4] border border-[#E8E8E8] text-[#1A1A1A] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Public Tracking Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
