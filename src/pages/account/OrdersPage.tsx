import React from 'react';
import { Package, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { db } from '../../lib/api.ts';
import { formatRupees } from '../../shared/money.ts';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const orders = db.orders;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display flex items-center gap-2">
            <Package className="w-6 h-6 text-[#C8102E]" />
            <span>Customer Orders & Deliveries</span>
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Every order is logged in an append-only event ledger. Inspect live timestamps and packing SKU verification.
          </p>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              onClick={() => onNavigate(`/account/orders/${order.id}`)}
              className="bg-white border border-[#E8E8E8] hover:border-[#C8102E]/40 rounded-xl p-5 shadow-subtle hover:shadow-card transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A1A1A] font-mono">{order.id}</span>
                  <span className="text-[#8E8E8E]">· Token: {order.trackingToken}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      order.status === 'Delivered'
                        ? 'bg-[#EDF7F2] text-[#1F7A4D]'
                        : order.status === 'Cancelled'
                        ? 'bg-[#FDECEE] text-[#C8102E]'
                        : 'bg-[#FEF7EE] text-[#B45309]'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold text-sm text-[#1A1A1A] tabular-nums">
                    {formatRupees(order.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#1A1A1A] line-clamp-1">
                    {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-[11px] text-[#8E8E8E]">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[#C8102E] font-semibold">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
