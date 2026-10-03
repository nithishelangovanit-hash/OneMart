import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AddressForm } from '../../components/checkout/AddressForm.tsx';
import { ReservationTimer } from '../../components/checkout/ReservationTimer.tsx';
import { CartSummary } from '../../components/cart/CartSummary.tsx';
import { CustomerAddress } from '../../shared/types.ts';
import { saveAddressDraft } from '../../lib/draftStorage.ts';

interface AddressPageProps {
  onNavigate: (path: string) => void;
}

export const AddressPage: React.FC<AddressPageProps> = ({ onNavigate }) => {
  const handleAddressSubmit = (address: CustomerAddress) => {
    saveAddressDraft(address);
    onNavigate('/checkout/review');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <button
          onClick={() => onNavigate('/cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        {/* 10-Minute Hold Countdown */}
        <ReservationTimer onExpire={() => onNavigate('/cart')} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <AddressForm onSubmit={handleAddressSubmit} />
          </div>

          <div className="lg:col-span-4 sticky top-24">
            <CartSummary
              onProceed={() => {}}
              proceedLabel="Save Address Above to Continue"
              isCheckout
            />
          </div>
        </div>
      </div>
    </div>
  );
};
