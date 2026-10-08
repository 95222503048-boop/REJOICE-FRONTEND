/**
 * Order Service
 * Manages customer orders via backend API
 * Note: All prices from backend are in paise (1/100th of currency unit)
 */

import { apiClient } from './api';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  basePrice: number; // in paise
  // lineTotal is calculated by frontend: quantity * basePrice
}

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

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const DeliveryMode = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
} as const;

export type DeliveryMode = (typeof DeliveryMode)[keyof typeof DeliveryMode];

export interface Order {
  id: string;
  customer?: {
    name: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
  status: OrderStatus;
  deliveryMode: DeliveryMode;
  deliveryDate: string; // ISO date string
  deliveryAddress?: string;
  specialNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  deliveryMode: DeliveryMode;
  deliveryDate: string;
  deliveryAddress?: string;
  specialNotes?: string;
  idempotencyKey: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface CreateOrderResponse {
  order: Order;
  message: string;
}

export interface CancelOrderResponse {
  order: {
    id: string;
    status: OrderStatus;
    message: string;
  };
}

/**
 * Create a new order from cart
 * Backend is authoritative for all prices and calculations
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  return apiClient.post<CreateOrderResponse>('/orders', orderData);
}

/**
 * Get user's orders with pagination
 */
export async function getOrders(page: number = 1, limit: number = 10): Promise<GetOrdersResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  return apiClient.get<GetOrdersResponse>(`/orders?${params.toString()}`);
}

/**
 * Get specific order details
 * Backend enforces ownership (customer can only see their own orders)
 */
export async function getOrderById(orderId: string): Promise<{ order: Order }> {
  return apiClient.get<{ order: Order }>(`/orders/${orderId}`);
}

/**
 * Cancel an order (must be in REQUESTED status)
 */
export async function cancelOrder(orderId: string): Promise<CancelOrderResponse> {
  return apiClient.patch<CancelOrderResponse>(`/orders/${orderId}/cancel`);
}
