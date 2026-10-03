import React, { useState, useEffect } from 'react';
import { MapPin, Check, Save } from 'lucide-react';
import { CustomerAddress } from '../../shared/types.ts';
import { saveAddressDraft, loadAddressDraft } from '../../lib/draftStorage.ts';

interface AddressFormProps {
  onSubmit: (address: CustomerAddress) => void;
  defaultAddress?: CustomerAddress;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, defaultAddress }) => {
  const [address, setAddress] = useState<CustomerAddress>(() => {
    if (defaultAddress) return defaultAddress;
    const draft = loadAddressDraft();
    if (draft) return draft;
    return {
      fullName: 'Nithish Elangovan',
      phone: '+91 98765 43210',
      email: 'nithishelangovan.it@gmail.com',
      street: '42 Cyber Concorde Way, Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100'
    };
  });

  const [savedLocally, setSavedLocally] = useState(false);

  useEffect(() => {
    saveAddressDraft(address);
    setSavedLocally(true);
    const t = setTimeout(() => setSavedLocally(false), 2000);
    return () => clearTimeout(t);
  }, [address]);

  const handleChange = (field: keyof CustomerAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddressDraft(address);
    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-subtle space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C8102E]" />
          <h3 className="text-sm font-bold text-[#1A1A1A]">Delivery Address & Contact</h3>
        </div>
        <span className="text-[11px] text-[#5C5C5C] flex items-center gap-1">
          <Save className="w-3 h-3 text-[#1F7A4D]" />
          <span>{savedLocally ? 'Draft saved locally (P12)' : 'Auto-saving draft'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-[#1A1A1A] mb-1">Full Name</label>
          <input
            type="text"
            required
            value={address.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#1A1A1A] mb-1">Mobile Number (For Courier OTP)</label>
          <input
            type="tel"
            required
            value={address.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-[#1A1A1A] mb-1">Email Address (For Order Tracking Token)</label>
          <input
            type="email"
            required
            value={address.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-[#1A1A1A] mb-1">Street Address, Flat / Building</label>
          <input
            type="text"
            required
            value={address.street}
            onChange={e => handleChange('street', e.target.value)}
            className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#1A1A1A] mb-1">City</label>
          <input
            type="text"
            required
            value={address.city}
            onChange={e => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-[#1A1A1A] mb-1">State</label>
            <input
              type="text"
              required
              value={address.state}
              onChange={e => handleChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1A1A1A] mb-1">Postal Code</label>
            <input
              type="text"
              required
              value={address.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#F0F0F0] flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#C8102E] hover:bg-[#A30D25] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Confirm Address & Review Order
        </button>
      </div>
    </form>
  );
};
