import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RotateCcw,
  ArrowRight,
  Activity,
  FileText
} from 'lucide-react';
import { db, advanceOrderStatus } from '../../lib/api.ts';
import { formatRupees } from '../../shared/money.ts';
import { Order, OrderStatus } from '../../shared/types.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { P04_ChaosScoreboard } from '../../components/proof/demos/P04_ChaosScoreboard.tsx';

export const AdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(db.orders);
  const [activeTab, setActiveTab] = useState<'orders' | 'returns' | 'health' | 'chaos'>('orders');
  const [skuModalOrder, setSkuModalOrder] = useState<Order | null>(null);
  const [typedSku, setTypedSku] = useState('');
  const [skuError, setSkuError] = useState('');

  // Paid-only revenue (Never count pending or failed orders)
  const paidRevenue = orders
    .filter(o => o.paymentStatus === 'Success')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockProducts = db.products.filter(p => p.stock <= 5);

  const handleAdvanceStep = async (order: Order) => {
    let nextStatus: OrderStatus = 'Processing';
    if (order.status === 'Confirmed') nextStatus = 'Processing';
    else if (order.status === 'Processing') {
      // Must verify SKU to move to Shipped
      setSkuModalOrder(order);
      setTypedSku('');
      setSkuError('');
      return;
    } else if (order.status === 'Shipped') nextStatus = 'Delivered';
    else return;

    const res = await advanceOrderStatus({
      orderId: order.id,
      nextStatus,
      adminName: 'Admin Warehouse Supervisor'
    });

    if (res.success && res.order) {
      setOrders([...db.orders]);
      showToast({
        type: 'success',
        title: `Order Updated to ${nextStatus}`,
        message: 'Immutable event appended with admin identity signature.'
      });
    }
  };

  const handleSkuVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuModalOrder) return;

    const firstItem = skuModalOrder.items[0];
    const res = await advanceOrderStatus({
      orderId: skuModalOrder.id,
      nextStatus: 'Shipped',
      skuInputs: { [firstItem.productId]: typedSku },
      adminName: 'Operations Dispatcher #4'
    });

    if (res.success) {
      setOrders([...db.orders]);
      setSkuModalOrder(null);
      showToast({
        type: 'success',
        title: 'SKU Verified (P08 Enforced)',
        message: `Order ${skuModalOrder.id} dispatched successfully with verified item match.`
      });
    } else {
      setSkuError(res.error || 'SKU verification failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8102E] mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Operations & Fulfillment Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] font-display">
              Warehouse Dispatch & Audit Control
            </h1>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E8E8] rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#C8102E] text-white' : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'returns' ? 'bg-[#C8102E] text-white' : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
              }`}
            >
              Returns ({db.returnCases.length})
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'health' ? 'bg-[#C8102E] text-white' : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
              }`}
            >
              Health & Invariants
            </button>
            <button
              onClick={() => setActiveTab('chaos')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'chaos' ? 'bg-[#C8102E] text-white' : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
              }`}
            >
              Chaos Lab
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#E8E8E8] rounded-xl shadow-subtle space-y-1">
            <p className="text-xs text-[#8E8E8E]">Paid-Only Revenue</p>
            <p className="text-2xl font-bold text-[#1A1A1A] font-display tabular-nums">
              {formatRupees(paidRevenue)}
            </p>
            <p className="text-[11px] text-[#1F7A4D] font-medium">Excludes pending holds</p>
          </div>

          <div className="p-5 bg-white border border-[#E8E8E8] rounded-xl shadow-subtle space-y-1">
            <p className="text-xs text-[#8E8E8E]">Total Orders</p>
            <p className="text-2xl font-bold text-[#1A1A1A] font-display tabular-nums">
              {orders.length}
            </p>
            <p className="text-[11px] text-[#5C5C5C]">Append-only audit enabled</p>
          </div>

          <div className="p-5 bg-white border border-[#E8E8E8] rounded-xl shadow-subtle space-y-1">
            <p className="text-xs text-[#8E8E8E]">Low Stock Warnings</p>
            <p className="text-2xl font-bold text-[#B45309] font-display tabular-nums">
              {lowStockProducts.length}
            </p>
            <p className="text-[11px] text-[#8E8E8E]">Units with ≤ 5 remaining</p>
          </div>

          <div className="p-5 bg-white border border-[#E8E8E8] rounded-xl shadow-subtle space-y-1">
            <p className="text-xs text-[#8E8E8E]">Avg API Response</p>
            <p className="text-2xl font-bold text-[#1F7A4D] font-display tabular-nums">
              {db.metrics.avgResponseMs}ms
            </p>
            <p className="text-[11px] text-[#5C5C5C]">k6 verified latency</p>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0F0F0]">
              <h3 className="text-sm font-bold text-[#1A1A1A]">Fulfillment Pipeline & Step Stepper</h3>
              <span className="text-xs text-[#8E8E8E]">To advance to Shipped, SKU verification is mandatory.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#1A1A1A]">
                    <th className="py-3 px-3 font-semibold">Order ID</th>
                    <th className="py-3 px-3 font-semibold">Items</th>
                    <th className="py-3 px-3 font-semibold">Amount</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                    <th className="py-3 px-3 font-semibold text-right">Step Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-[#FAFAFA]">
                      <td className="py-3 px-3 font-mono font-bold text-[#1A1A1A]">{o.id}</td>
                      <td className="py-3 px-3 text-[#5C5C5C]">
                        {o.items.map(i => `${i.name} (SKU: ${i.sku})`).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#1A1A1A] tabular-nums">
                        {formatRupees(o.total)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                            o.status === 'Delivered'
                              ? 'bg-[#EDF7F2] text-[#1F7A4D]'
                              : o.status === 'Cancelled'
                              ? 'bg-[#FDECEE] text-[#C8102E]'
                              : 'bg-[#FEF7EE] text-[#B45309]'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {o.status !== 'Delivered' && o.status !== 'Cancelled' ? (
                          <button
                            onClick={() => handleAdvanceStep(o)}
                            className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Advance: {o.status === 'Confirmed' ? 'Processing' : o.status === 'Processing' ? 'Verify SKU & Ship' : 'Delivered'}
                          </button>
                        ) : (
                          <span className="text-[#8E8E8E] text-[11px]">Final State</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Returns Management */}
        {activeTab === 'returns' && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#1A1A1A]">Customer Return Cases</h3>
            {db.returnCases.length > 0 ? (
              <div className="space-y-3">
                {db.returnCases.map(c => (
                  <div key={c.id} className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A]">Case: {c.id} (Order: {c.orderId})</span>
                      <span className="px-2 py-0.5 bg-[#FFF7F8] text-[#C8102E] font-bold rounded">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[#5C5C5C]">Reported Reason: {c.reason}</p>
                    <p className="text-[11px] text-[#8E8E8E]">Created: {new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8E8E8E] py-8 text-center">
                Zero active return cases reported.
              </p>
            )}
          </div>
        )}

        {/* Tab 3: Health & Invariants */}
        {activeTab === 'health' && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-card space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#1A1A1A]">Transactional Invariant Health Telemetry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl">
                <p className="text-[#8E8E8E]">Expired Reservations Released</p>
                <p className="text-xl font-bold text-[#1A1A1A] tabular-nums mt-1">{db.metrics.expiredReservations}</p>
              </div>
              <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl">
                <p className="text-[#8E8E8E]">Blocked Duplicate Submissions</p>
                <p className="text-xl font-bold text-[#1F7A4D] tabular-nums mt-1">{db.metrics.blockedDuplicates}</p>
              </div>
              <div className="p-4 bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl">
                <p className="text-[#8E8E8E]">Failed Payment Retries</p>
                <p className="text-xl font-bold text-[#C8102E] tabular-nums mt-1">{db.metrics.failedPayments}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Chaos Lab */}
        {activeTab === 'chaos' && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#1A1A1A]">50-Buyer Concurrency Stress Test</h3>
            <P04_ChaosScoreboard />
          </div>
        )}

        {/* SKU Verification Dialog Modal (P08) */}
        {skuModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#E8E8E8] shadow-card space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#F0F0F0]">
                <h4 className="text-sm font-bold text-[#1A1A1A]">SKU Pack Verification Required</h4>
                <span className="text-[10px] text-[#C8102E] font-semibold">P08 Packing Gate</span>
              </div>

              <p className="text-[#5C5C5C] leading-relaxed">
                Before marking Order <strong>{skuModalOrder.id}</strong> as Shipped, you must physically inspect the carton and type the matching SKU for:
              </p>

              <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg">
                <p className="font-semibold text-[#1A1A1A]">{skuModalOrder.items[0]?.name}</p>
                <p className="text-[11px] text-[#8E8E8E]">
                  Required Invoice SKU: <code className="font-mono text-[#C8102E] font-bold">{skuModalOrder.items[0]?.sku}</code>
                </p>
              </div>

              <form onSubmit={handleSkuVerifySubmit} className="space-y-3">
                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">
                    Scan or Type Carton SKU:
                  </label>
                  <input
                    type="text"
                    required
                    value={typedSku}
                    onChange={e => setTypedSku(e.target.value)}
                    placeholder={`Type ${skuModalOrder.items[0]?.sku}...`}
                    className="w-full p-2.5 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg font-mono text-xs focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                {skuError && (
                  <p className="text-[#C8102E] font-semibold text-[11px]">{skuError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#F0F0F0]">
                  <button
                    type="button"
                    onClick={() => setSkuModalOrder(null)}
                    className="px-3 py-2 border border-[#E8E8E8] text-[#5C5C5C] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C8102E] hover:bg-[#A30D25] text-white font-semibold rounded-lg"
                  >
                    Verify & Mark Shipped
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
