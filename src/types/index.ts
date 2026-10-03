// User & Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

// Product image from Cloudinary
export interface ProductImage {
  id: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  position: number;
  createdAt: string;
}

// Products (from backend)
export interface Product {
  _id: string;
  id?: string; // alias for _id
  name: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number; // in paise
  tags?: string[];
  available: boolean;
  active: boolean;
  images?: ProductImage[]; // populated by backend
  createdAt: string;
  updatedAt: string;
}

// Cart (from backend)
export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  basePrice: number; // in paise
  available: boolean;
  active: boolean;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
}

// Orders (from backend)
export const OrderStatus = {
  REQUESTED: 'Requested',
  BAKER_REVIEWING: 'Baker Reviewing',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const DeliveryMode = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
} as const;

export type DeliveryMode = typeof DeliveryMode[keyof typeof DeliveryMode];

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  basePrice: number; // in paise
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
  status: OrderStatus;
  deliveryMode: DeliveryMode;
  deliveryDate: string; // ISO date
  deliveryAddress?: string;
  specialNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Reviews
export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  productId?: string;
  productName?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  bakerReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // e.g., {5: 25, 4: 10, 3: 5, 2: 2, 1: 1}
  };
}

// Gallery
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'cakes' | 'biscuits' | 'sweets' | 'special';
  tags: string[];
  width?: number;
  height?: number;
  createdAt: Date;
}

// Delivery
export interface DeliveryOptions {
  baseFee: number;
  feeByDistance: Array<{
    minDistance: number;
    maxDistance: number;
    fee: number;
  }>;
  minPrepDays: number;
  maxAdvanceDays: number;
}

// Business
export interface BusinessInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  fssai: string;
  instagram?: string;
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}
