import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { OrderTimeline } from '../../orders/OrderTimeline.tsx';
import { OrderStatus, OrderEvent } from '../../../shared/types.ts';
import { ORDER_STATUS_FLOW } from '../../../shared/constants.ts';
import { useToast } from '../../../context/ToastContext.tsx';

export const P07_TrackingDemo: React.FC = () => {
  const { showToast } = useToast();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Processing');
  const [events, setEvents] = useState<OrderEvent[]>([
    { id: '1', orderId: 'ord_demo_77', status: 'Pending', note: 'Order placed by customer via guest checkout. Inventory hold locked.', actor: 'customer', timestamp: '2026-10-03T10:00:00.000Z' },
    { id: '2', orderId: 'ord_demo_77', status: 'Confirmed', note: 'Payment verified. Inventory transitioned to fulfillment.', actor: 'system', timestamp: '2026-10-03T10:00:15.000Z' },
    { id: '3', orderId: 'ord_demo_77', status: 'Processing', note: 'Item in Bengaluru Central packing queue.', actor: 'admin', timestamp: '2026-10-03T11:30:00.000Z' }
  ]);

  const advanceOneStep = () => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex >= ORDER_STATUS_FLOW.length - 1) {
      showToast({
        type: 'info',
        title: 'Already Delivered',
        message: 'Order has already achieved final Delivered milestone.'
      });
      return;
    }

    const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1];
    setCurrentStatus(nextStatus);

    const note =
      nextStatus === 'Shipped'
        ? 'All SKUs scanned and verified. Dispatched via Express Courier.'
        : nextStatus === 'Delivered'
        ? 'Package delivered to recipient with contactless verification (Simulated courier data).'
        : `Order updated to ${nextStatus}.`;

    const actor = nextStatus === 'Delivered' ? 'courier' : 'admin';

    const newEvt: OrderEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 8),
      orderId: 'ord_demo_77',
      status: nextStatus,
      note,
      actor,
      timestamp: new Date().toISOString()
    };

    setEvents(prev => [...prev, newEvt]);

    showToast({
      type: 'success',
      title: `Order Advanced to ${nextStatus} (P07)`,
      message: 'New immutable record appended to order event ledger.'
    });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="p-3.5 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl flex items-center justify-between">
        <div>
          <span className="font-semibold text-[#1A1A1A]">Admin Dispatch Simulator</span>
          <p className="text-[11px] text-[#5C5C5C]">
            Click "Advance One Step" to append a verified event to the live customer timeline below.
          </p>
        </div>
        <button
          onClick={advanceOneStep}
          disabled={currentStatus === 'Delivered'}
          className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>Advance One Step</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <OrderTimeline currentStatus={currentStatus} events={events} />
    </div>
  );
};
