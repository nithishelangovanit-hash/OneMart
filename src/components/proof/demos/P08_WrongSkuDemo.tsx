import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../../../context/ToastContext.tsx';

export const P08_WrongSkuDemo: React.FC = () => {
  const { showToast } = useToast();
  const [typedSku, setTypedSku] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const expectedSku = 'OM-MOB-NOV3';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedSku.trim().toUpperCase() === expectedSku) {
      setIsVerified(true);
      setErrorMsg('');
      showToast({
        type: 'success',
        title: 'SKU Verified Successfully (P08)',
        message: 'Barcode match confirmed against order snapshot. Order authorized for Shipped dispatch.'
      });
    } else {
      setIsVerified(false);
      setShake(true);
      setErrorMsg(`SKU Mismatch! Expected "${expectedSku}", but warehouse entered "${typedSku.trim()}". Order dispatch blocked.`);
      setTimeout(() => setShake(false), 500);
      showToast({
        type: 'error',
        title: 'Dispatch Blocked',
        message: 'Warehouse picking error intercepted before dispatch.'
      });
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 bg-white border border-[#E8E8E8] rounded-xl space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#F0F0F0]">
          <div>
            <p className="font-semibold text-[#1A1A1A]">Fulfillment Packing Station Gate</p>
            <p className="text-[#5C5C5C] text-[11px]">
              Item on invoice: <strong>Nova 3 5G</strong> (Required SKU: <code className="bg-[#FAFAFA] px-1 py-0.5 border rounded font-mono text-[#C8102E]">{expectedSku}</code>)
            </p>
          </div>
          <span className="text-[10px] font-semibold text-[#1F7A4D] bg-[#EDF7F2] px-2 py-0.5 rounded">
            Pre-Dispatch Verification
          </span>
        </div>

        <motion.form
          onSubmit={handleVerify}
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div>
            <label className="block font-semibold text-[#1A1A1A] mb-1">
              Type or Scan physical box barcode SKU:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={typedSku}
                onChange={e => setTypedSku(e.target.value)}
                placeholder="Type OM-MOB-NOV3 (correct) or OM-MOB-NOV2 (wrong)..."
                className="flex-1 px-3 py-2 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C8102E]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-semibold rounded-lg cursor-pointer"
              >
                Verify & Dispatch
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#FDECEE] border border-[#C8102E]/30 rounded-lg text-xs text-[#C8102E] flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isVerified && (
            <div className="p-3 bg-[#EDF7F2] border border-[#1F7A4D]/30 rounded-lg text-xs text-[#1F7A4D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                <strong>Verification Passed:</strong> SKU matches immutable order snapshot. Recorded sku_verified_by and timestamped.
              </span>
            </div>
          )}
        </motion.form>

        <div className="flex gap-2 pt-1 text-[11px]">
          <button
            onClick={() => setTypedSku('OM-MOB-NOV2')}
            className="text-[#C8102E] hover:underline"
          >
            Fill Wrong SKU (OM-MOB-NOV2)
          </button>
          <span>·</span>
          <button
            onClick={() => setTypedSku('OM-MOB-NOV3')}
            className="text-[#1F7A4D] hover:underline"
          >
            Fill Correct SKU (OM-MOB-NOV3)
          </button>
        </div>
      </div>
    </div>
  );
};
