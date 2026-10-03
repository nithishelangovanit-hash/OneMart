import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, ShieldCheck, XCircle } from 'lucide-react';
import { db, cancelOrder } from '../../lib/api.ts';
import { Order, ReturnCase } from '../../shared/types.ts';
import { formatRupees } from '../../shared/money.ts';
import { OrderTimeline } from '../../components/orders/OrderTimeline.tsx';
import { ReceivedCheck } from '../../components/orders/ReceivedCheck.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface OrderDetailPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId, onNavigate }) => {
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = db.orders.find(o => o.id === orderId) || db.orders[0];
    setOrder(existing ? JSON.parse(JSON.stringify(existing)) : null);
    setLoading(false);
  }, [orderId]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-2 border-[#C8102E] border-t-transparent animate-spin" />
      </div>
    );
  }

  const canCancel = order.status === 'Pending' || order.status === 'Confirmed' || order.status === 'Processing';

  const handleCancel = async () => {
    const res = await cancelOrder(order.id);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Order Cancelled',
        message: 'Order cancelled before shipment. Simulated refund processed and stock returned.'
      });
      const updated = db.orders.find(o => o.id === order.id);
      if (updated) setOrder(JSON.parse(JSON.stringify(updated)));
    } else {
      showToast({
        type: 'error',
        title: 'Cancellation Blocked',
        message: res.error || 'Cannot cancel this order.'
      });
    }
  };

  const handleCheckCompleted = (answer: 'correct' | 'wrong', returnCase?: ReturnCase) => {
    const updated = db.orders.find(o => o.id === order.id);
    if (updated) setOrder(JSON.parse(JSON.stringify(updated)));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
          <button
            onClick={() => onNavigate('/account/orders')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>

          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-white border border-[#C8102E] text-[#C8102E] hover:bg-[#FFF7F8] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel Order (P10)
              </button>
            )}
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0F0F0] text-xs">
            <div>
              <span className="text-[#8E8E8E]">Order Number:</span>
              <p className="font-bold text-base text-[#1A1A1A] font-mono">{order.id}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E]">Tracking Token:</span>
              <p className="font-bold text-sm text-[#C8102E] font-mono">{order.trackingToken}</p>
            </div>
            <div>
              <span className="text-[#8E8E8E]">Order Date:</span>
              <p className="font-semibold text-[#1A1A1A]">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-[#8E8E8E]">Total Paid:</span>
              <p className="font-bold text-base text-[#1A1A1A] tabular-nums">
                {formatRupees(order.total)}
              </p>
            </div>
          </div>

          {/* Delivery Address & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C5C5C]">
            <div>
              <p className="font-semibold text-[#1A1A1A] mb-1">Destination Address:</p>
              <p>{order.address.fullName}</p>
              <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.postalCode}</p>
              <p className="text-[#8E8E8E] mt-0.5">{order.address.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-[#1A1A1A] mb-1">Payment Verification:</p>
              <p>Method: <strong className="uppercase text-[#1A1A1A]">{order.paymentMethod}</strong></p>
              <p>Status: <strong className="text-[#1F7A4D]">{order.paymentStatus}</strong></p>
              <p className="text-[11px] text-[#8E8E8E] mt-0.5">Idempotency Key: {order.idempotencyKey}</p>
            </div>
          </div>
        </div>

        {/* Post-Delivery Verification Component (P08 / P10) */}
        {order.status === 'Delivered' && (
          <ReceivedCheck
            orderId={order.id}
            items={order.items}
            existingCheck={order.customerReceivedCheck}
            onCheckCompleted={handleCheckCompleted}
          />
        )}

        {/* Timeline */}
        <OrderTimeline currentStatus={order.status} events={order.events} />
      </div>
    </div>
  );
};
