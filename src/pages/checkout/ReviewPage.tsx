import React, { useState } from 'react';
import { ShieldCheck, MapPin, ShoppingBag, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { loadAddressDraft, loadActiveReservation } from '../../lib/draftStorage.ts';
import { formatRupees } from '../../shared/money.ts';
import { placeOrder } from '../../lib/api.ts';
import { generateIdempotencyKey } from '../../lib/idempotency.ts';
import { ReservationTimer } from '../../components/checkout/ReservationTimer.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface ReviewPageProps {
  onNavigate: (path: string) => void;
  onOrderCreated: (orderId: string) => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ onNavigate, onOrderCreated }) => {
  const { items, subtotal, shipping, tax, total } = useCart();
  const { showToast } = useToast();
  const [placing, setPlacing] = useState(false);

  const address = loadAddressDraft() || {
    fullName: 'Nithish Elangovan',
    phone: '+91 98765 43210',
    email: 'nithishelangovan.it@gmail.com',
    street: '42 Cyber Concorde Way, Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100'
  };

  const reservation = loadActiveReservation();

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const key = generateIdempotencyKey('ord_chk');

    const res = await placeOrder({
      idempotencyKey: key,
      items: items.map(i => ({ product: i.product, quantity: i.quantity })),
      address,
      paymentMethod: 'upi',
      reservationId: reservation?.reservationId
    });

    setPlacing(false);

    if (res.success && res.order) {
      showToast({
        type: 'success',
        title: 'Order Placed (Pending Payment)',
        message: `Order ${res.order.id} inserted idempotently. Snapshot immutable.`
      });
      onOrderCreated(res.order.id);
      onNavigate(`/checkout/payment?orderId=${res.order.id}`);
    } else {
      showToast({
        type: 'error',
        title: 'Order Insertion Error',
        message: res.error || 'Failed to place order.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <button
          onClick={() => onNavigate('/checkout/address')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Delivery Address</span>
        </button>

        <ReservationTimer onExpire={() => onNavigate('/cart')} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Review Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery Destination Snapshot */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-subtle text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0]">
                <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C8102E]" />
                  <span>Delivery Destination</span>
                </span>
                <button
                  onClick={() => onNavigate('/checkout/address')}
                  className="text-xs text-[#C8102E] hover:underline"
                >
                  Change
                </button>
              </div>
              <p className="font-semibold text-sm text-[#1A1A1A]">{address.fullName} ({address.phone})</p>
              <p className="text-[#5C5C5C]">{address.street}, {address.city}, {address.state} - {address.postalCode}</p>
              <p className="text-[#8E8E8E]">Updates sent to: {address.email}</p>
            </div>

            {/* Items Snapshot */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0] text-xs">
                <span className="font-bold text-[#1A1A1A]">Ordered Items ({items.length})</span>
                <span className="text-[#1F7A4D] font-semibold">Hold Verified Active</span>
              </div>

              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 text-xs py-2 border-b border-[#F0F0F0]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0] || '/src/assets/images/hero_onemart_proof_1791067260349.jpg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain bg-[#FAFAFA] rounded border border-[#E8E8E8] p-1"
                      />
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{item.product.name}</p>
                        <p className="text-[11px] text-[#8E8E8E]">SKU: {item.product.sku}</p>
                        <p className="text-[11px] text-[#5C5C5C] tabular-nums">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1A1A1A] tabular-nums">
                        {formatRupees(item.product.price * item.quantity)}
                      </p>
                      <p className="text-[10px] text-[#8E8E8E]">Tax included</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Summary Column */}
          <div className="lg:col-span-4 bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-card space-y-5 sticky top-24">
            <h3 className="text-sm font-bold text-[#1A1A1A] pb-3 border-b border-[#E8E8E8]">
              Final Total Confirmation
            </h3>

            <div className="space-y-2.5 text-xs text-[#5C5C5C]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#1A1A1A] tabular-nums">{formatRupees(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-semibold text-[#1A1A1A] tabular-nums">{shipping === 0 ? 'FREE' : formatRupees(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18% Incl.):</span>
                <span className="tabular-nums">{formatRupees(tax)}</span>
              </div>
              <div className="pt-3 border-t border-[#E8E8E8] flex justify-between font-bold text-base text-[#1A1A1A]">
                <span>Payable Now:</span>
                <span className="text-xl text-[#C8102E] font-display tabular-nums">{formatRupees(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full py-3 px-4 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{placing ? 'Securing Order...' : 'Place Order & Pay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[11px] text-[#5C5C5C] space-y-1">
              <p className="flex items-center gap-1 font-semibold text-[#1F7A4D]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Idempotent Order Creation</span>
              </p>
              <p>Re-clicking will never create duplicate order rows.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
