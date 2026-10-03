import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ReturnCaseStatus,
  SavingsGoalStatus,
  CertificationStatus
} from './constants.ts';

export type {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ReturnCaseStatus,
  SavingsGoalStatus,
  CertificationStatus
};

export type CategorySlug =
  | 'mobiles'
  | 'laptops'
  | 'shirts'
  | 'cricket-bats'
  | 'shoes'
  | 'urad-dal'
  | 'soft-drinks'
  | 'facial-creams'
  | 'bathing-soaps'
  | 'pens';

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  iconName: string;
}

export interface ProductSpec {
  name: string;
  value: string;
  highlight?: boolean;
}

export interface BrandYearlyStat {
  year: number;
  averageRating: number;
  reviewCount: number;
}

export interface ProductCertification {
  name: string;
  authority: string;
  status: CertificationStatus;
  licenseNumber?: string;
  lastCheckedDate: string;
  sourceUrl?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number; // whole rupees
  originalPrice?: number;
  rating: number; // e.g. 4.4
  reviewCount: number;
  stock: number; // on_hand
  images: string[];
  description: string;
  specs: Record<string, string>;
  releaseYear: number;
  familyId?: string; // For old vs new comparison (e.g. 'nova-series')
  replacedById?: string;
  replacesId?: string;
  specsGained?: string[];
  specsLost?: string[];
  supportEndDate?: string;
  certifications: ProductCertification[];
  yearlyStats?: BrandYearlyStat[];
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  priceWhenAdded: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  hasPriceChange: boolean;
  priceChanges: {
    productId: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
  }[];
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  skuVerifiedAt?: string;
  skuVerifiedBy?: string;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string;
  actor: 'system' | 'admin' | 'customer' | 'courier';
  timestamp: string;
}

export interface Order {
  id: string;
  trackingToken: string;
  idempotencyKey: string;
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  address: CustomerAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  events: OrderEvent[];
  reservationId?: string;
  deliveredAt?: string;
  customerReceivedCheck?: 'correct' | 'wrong';
  returnCaseId?: string;
}

export interface Reservation {
  id: string;
  productId: string;
  quantity: number;
  expiresAt: string;
  status: 'active' | 'converted' | 'expired' | 'released';
  orderId?: string;
}

export interface SuperSaveGoal {
  id: string;
  productId: string;
  product: Product;
  budgetCap: number;
  targetMonths: number;
  frequency: 'weekly' | 'monthly';
  status: SavingsGoalStatus;
  savedSoFar: number;
  startDate: string;
  targetDate: string;
  suggestedPerMonth: number;
  priceFitAlertActive: boolean;
  contributions: SuperSaveContribution[];
}

export interface SuperSaveContribution {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export interface ReturnCase {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  reason: string;
  status: ReturnCaseStatus;
  createdAt: string;
  updatedAt: string;
  photoUrl?: string;
  adminDecisionNotes?: string;
}

export interface CompareWeights {
  price: number; // 0..100
  rating: number; // 0..100
  newest: number; // 0..100
  standards?: number; // 0..100 (disabled if all data sample)
}

export interface CompareProductScore {
  product: Product;
  scaledPrice: number;
  scaledRating: number;
  scaledYear: number;
  totalScore: number;
  rank: number;
  isTie: boolean;
  reasons: string[];
}
