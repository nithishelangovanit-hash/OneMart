/**
 * System-wide constants, statuses, hold duration, and business invariants
 */

export const RESERVATION_HOLD_MINUTES = 10;
export const STALE_PENDING_MINUTES = 30;
export const CHECKING_TIMEOUT_SECONDS = 15;
export const MAX_COMPARE_PRODUCTS = 3;
export const TAX_RATE_PERCENT = 18;
export const FLAT_SHIPPING_FEE = 49;
export const FREE_SHIPPING_THRESHOLD = 999;

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Ready' | 'Checking' | 'Success' | 'Failed' | 'Pending';
export type PaymentMethod = 'upi' | 'card' | 'netbanking';
export type ReturnCaseStatus = 'Reported' | 'Under review' | 'Replacement' | 'Refund' | 'Rejected';
export type SavingsGoalStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type CertificationStatus = 'Verified' | 'Unverified' | 'Sample' | 'Not applicable';

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered'
];

export const PAYMENT_METHODS = [
  {
    id: 'upi' as PaymentMethod,
    name: 'UPI (Instant)',
    tagline: 'Google Pay, PhonePe, Paytm, BHIM',
    expectedTime: '~10 seconds',
    guide: [
      'Enter your virtual payment address or tap Open App',
      'Review the exact whole-rupee amount in your UPI client',
      'Approve the simulated request — no real money is deducted'
    ]
  },
  {
    id: 'card' as PaymentMethod,
    name: 'Credit / Debit Card (Simulated)',
    tagline: 'Visa, Mastercard, RuPay',
    expectedTime: '~20 seconds',
    guide: [
      'Use the prefilled test card number (never enter real card data)',
      'Review transaction snapshot and fraud hold timer',
      'Submit approval without SMS OTP or real bank debit'
    ]
  },
  {
    id: 'netbanking' as PaymentMethod,
    name: 'Net Banking (Simulated)',
    tagline: 'HDFC, SBI, ICICI, Axis',
    expectedTime: '~30 seconds',
    guide: [
      'Select any sample bank portal',
      'Inspect simulated bank authorization gateway',
      'Confirm authorization — order confirms instantaneously upon success'
    ]
  }
];
