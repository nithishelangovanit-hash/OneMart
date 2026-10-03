import React, { useState } from 'react';
import { Search, Truck, ShieldCheck, Sparkles, Package } from 'lucide-react';
import { fetchOrderTracking } from '../../lib/api.ts';
import { Order } from '../../shared/types.ts';
import { OrderTimeline } from '../../components/orders/OrderTimeline.tsx';
import { formatRupees } from '../../shared/money.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const TrackOrderPage: React.FC = () => {
  const [token, setToken] = useState('OM-TRK-7721');
  const [identifier, setIdentifier] = useState('nithishelangovan.it@gmail.com');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const found = await fetchOrderTracking(token, identifier);
    setLoading(false);
    setSearched(true);
    setOrder(found);

    if (found) {
      showToast({
        type: 'success',
        title: 'Order Located',
        message: `Found Order ${found.id} with ${found.events.length} immutable milestone records.`
      });
    } else {
      showToast({
        type: 'error',
        title: 'Order Not Found',
        message: 'No record matches this token + email/phone combination.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8102E]">
            <Truck className="w-3.5 h-3.5" />
            <span>Public Tracking Token Gate (P07)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] font-display">
            Track Package Without Login
          </h1>
          <p className="text-xs text-[#5C5C5C]">
            Uses an unguessable cryptographic tracking token + verified customer contact to safeguard order privacy without sequential ID enumeration leaks.
          </p>
        </div>

        {/* Tracking Search Form */}
        <form
          onSubmit={handleTrackSubmit}
          className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-8 shadow-card space-y-4 max-w-xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1A1A1A] mb-1">
                Tracking Token (e.g. OM-TRK-7721)
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="OM-TRK-XXXX"
                className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg font-mono font-bold text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1A1A1A] mb-1">
                Email or Last 4 Mobile Digits
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Email or phone..."
                className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Locating Ledger...' : 'Inspect Immutable Timeline'}</span>
          </button>
        </form>

        {/* Tracking Results */}
        {searched && order && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-subtle flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[#8E8E8E]">Recipient & Destination:</span>
                <p className="font-semibold text-sm text-[#1A1A1A]">
                  {order.address.fullName} · {order.address.city}, {order.address.state}
                </p>
              </div>

              <div>
                <span className="text-[#8E8E8E]">Current Fulfillment State:</span>
                <p className="font-bold text-sm text-[#1F7A4D]">{order.status}</p>
              </div>

              <div>
                <span className="text-[#8E8E8E]">Paid Amount:</span>
                <p className="font-bold text-sm text-[#1A1A1A] tabular-nums">
                  {formatRupees(order.total)}
                </p>
              </div>
            </div>

            <OrderTimeline currentStatus={order.status} events={order.events} />
          </div>
        )}

        {searched && !order && (
          <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-xl text-xs text-[#5C5C5C] space-y-2">
            <p className="font-bold text-[#1A1A1A]">No matching order found</p>
            <p>Please double-check the token and verified contact information.</p>
          </div>
        )}
      </div>
    </div>
  );
};
