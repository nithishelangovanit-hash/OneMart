import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  ShieldCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { OrderEvent, OrderStatus } from '../../shared/types.ts';
import { ORDER_STATUS_FLOW } from '../../shared/constants.ts';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  events: OrderEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, events }) => {
  const getActorBadge = (actor: OrderEvent['actor']) => {
    switch (actor) {
      case 'system':
        return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/20';
      case 'admin':
        return 'bg-[#FFF7F8] text-[#C8102E] border-[#C8102E]/20';
      case 'courier':
        return 'bg-[#EDF7F2] text-[#1F7A4D] border-[#1F7A4D]/20';
      default:
        return 'bg-[#FAFAFA] text-[#5C5C5C] border-[#E8E8E8]';
    }
  };

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0F0F0]">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A1A]">Immutable Delivery Ledger (P07)</h3>
          <p className="text-xs text-[#5C5C5C] mt-0.5">
            Append-only order event records. Past statuses are cryptographically verified and immutable.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#5C5C5C]">
          <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
          <span>Simulated courier data</span>
        </span>
      </div>

      {/* High-Level Status Milestones */}
      <div className="flex items-center justify-between max-w-2xl mx-auto py-2">
        {ORDER_STATUS_FLOW.map((statusName, idx) => {
          const isPassed =
            ORDER_STATUS_FLOW.indexOf(currentStatus) >= idx && currentStatus !== 'Cancelled';
          const isCurrent = currentStatus === statusName;

          return (
            <React.Fragment key={statusName}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#C8102E] text-white shadow-sm ring-4 ring-[#C8102E]/20'
                      : isPassed
                      ? 'bg-[#1F7A4D] text-white'
                      : 'bg-[#FAFAFA] text-[#8E8E8E] border border-[#E8E8E8]'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:inline ${
                    isCurrent ? 'text-[#C8102E] font-bold' : isPassed ? 'text-[#1A1A1A]' : 'text-[#8E8E8E]'
                  }`}
                >
                  {statusName}
                </span>
              </div>
              {idx < ORDER_STATUS_FLOW.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors ${
                    ORDER_STATUS_FLOW.indexOf(currentStatus) > idx ? 'bg-[#1F7A4D]' : 'bg-[#E8E8E8]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Append-Only Event Stream */}
      <div className="pt-4 border-t border-[#F0F0F0]">
        <h4 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">
          Detailed Milestone Audit Stream
        </h4>

        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E8E8]">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="relative flex items-start gap-4 pl-8 text-xs"
            >
              <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#C8102E] shrink-0" />

              <div className="flex-1 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl p-3.5 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#1A1A1A]">
                    Status: {evt.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getActorBadge(
                        evt.actor
                      )}`}
                    >
                      Actor: {evt.actor.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-[#8E8E8E] tabular-nums">
                      {new Date(evt.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-[#5C5C5C] leading-relaxed">{evt.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
