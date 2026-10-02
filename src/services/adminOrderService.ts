/**
 * Admin Order Service
 * Manages order viewing and status updates for admin users
 */

import { apiClient } from './api';
import { Order, OrderStatus } from '../types';
import { Pagination } from './orderService';

export interface AdminOrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  order: {
    id: string;
    status: OrderStatus;
  };
  message: string;
}

/**
 * Get all orders (admin view, with pagination)
 */
export async function getAllOrdersAdmin(page: number = 1, limit: number = 20): Promise<AdminOrdersResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));

  return apiClient.get<AdminOrdersResponse>(`/orders/admin?${params.toString()}`);
}

/**
 * Get specific order (admin can see all)
 */
export async function getOrderAdmin(orderId: string): Promise<{ order: Order }> {
  return apiClient.get<{ order: Order }>(`/orders/admin/${orderId}`);
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<UpdateOrderStatusResponse> {
  return apiClient.patch<UpdateOrderStatusResponse>(`/orders/admin/${orderId}/status`, {
    status,
  });
}
