import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { PaymentMethodPicker } from '../../components/checkout/PaymentMethodPicker.tsx';
import { PaymentStatusPanel } from '../../components/checkout/PaymentStatusPanel.tsx';
import { ReservationTimer } from '../../components/checkout/ReservationTimer.tsx';
import { PaymentMethod, PaymentStatus, Order } from '../../shared/types.ts';
import { executePaymentAttempt, switchPaymentMethod, db } from '../../lib/api.ts';
import { generateIdempotencyKey } from '../../lib/idempotency.ts';
import { formatRupees } from '../../shared/money.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface PaymentPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ orderId, onNavigate }) => {
  const { clearCart } = useCart();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Ready');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    const existing = db.orders.find(o => o.id === orderId) || db.orders[0];
    if (existing) {
      setOrder(existing);
      setSelectedMethod(existing.paymentMethod);
      setPaymentStatus(existing.paymentStatus);
    }
  }, [orderId]);

  const handlePayClick = async (forcedOutcome?: 'Success' | 'Failed' | 'Pending') => {
    if (!order) return;
    setIsProcessing(true);
    setPaymentStatus('Checking');

    const paymentKey = generateIdempotencyKey('pay_key');

    // Simulate standard 1.2s gateway roundtrip
    setTimeout(async () => {
      const res = await executePaymentAttempt({
        orderId: order.id,
        paymentMethod: selectedMethod,
        idempotencyKey: paymentKey,
        forcedOutcome
      });

      setIsProcessing(false);
      setPaymentStatus(res.paymentStatus);
      setStatusMessage(res.message);

      if (res.success && res.paymentStatus === 'Success') {
        clearCart();
        showToast({
          type: 'success',
          title: 'Payment Confirmed',
          message: 'Order Confirmed in single transactional commit. Redirecting to receipt...'
        });
        setTimeout(() => {
          onNavigate(`/checkout/confirmation?orderId=${order.id}`);
        }, 800);
      } else if (res.paymentStatus === 'Failed') {
        showToast({
          type: 'error',
          title: 'Payment Not Approved (Simulated)',
          message: 'No funds debited. Safe retry available.'
        });
      } else if (res.paymentStatus === 'Pending') {
        showToast({
          type: 'info',
          title: 'Status Pending (>15s rule)',
          message: 'Item hold retained for 30 minutes. Check your payment app history.'
        });
      }
    }, 1100);
  };

  const handleSwitchMethod = async () => {
    if (!order) return;
    const nextMethod: PaymentMethod =
      selectedMethod === 'upi' ? 'card' : selectedMethod === 'card' ? 'netbanking' : 'upi';
    setSelectedMethod(nextMethod);
    const updated = await switchPaymentMethod(order.id, nextMethod);
    if (updated) {
      setOrder(updated);
      setPaymentStatus('Ready');
      showToast({
        type: 'info',
        title: 'Switched Payment Method (P02)',
        message: `Active attempt reset to ${nextMethod.toUpperCase()}. Order items and hold stay 100% intact.`
      });
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-2 border-[#C8102E] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
          <button
            onClick={() => onNavigate('/checkout/review')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Review</span>
          </button>

          <span className="text-xs font-bold text-[#1A1A1A]">
            Order ID: <code className="font-mono text-[#C8102E]">{order.id}</code>
          </span>
        </div>

        <ReservationTimer onExpire={() => onNavigate('/cart')} />

        {/* Amount Confirmation Banner */}
        <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-between shadow-subtle">
          <div>
            <p className="text-xs text-[#5C5C5C]">Authorized Whole-Rupee Amount</p>
            <p className="text-2xl font-bold text-[#C8102E] font-display tabular-nums">
              {formatRupees(order.total)}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1F7A4D] bg-[#EDF7F2] px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Matches Cart Total Exactly (P01)</span>
          </span>
        </div>

        {/* Method Picker */}
        <PaymentMethodPicker
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
        />

        {/* State Machine Status & Execution */}
        <PaymentStatusPanel
          status={paymentStatus}
          method={selectedMethod}
          onPayClick={handlePayClick}
          onSwitchMethod={handleSwitchMethod}
          isProcessing={isProcessing}
          message={statusMessage}
        />
      </div>
    </div>
  );
};
