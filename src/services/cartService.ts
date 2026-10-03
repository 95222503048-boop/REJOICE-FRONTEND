/**
 * Cart Service
 * Manages user's shopping cart via backend API
 * Note: Backend is authoritative for all prices
 */

import { apiClient } from './api';

export interface BackendCartItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  basePrice: number; // in paise/cents
  available: boolean;
  active: boolean;
}

export interface Cart {
  items: BackendCartItem[];
  itemCount: number;
}

export interface GetCartResponse {
  cart: Cart;
}

export interface CartMutationResponse {
  cart: Cart;
  message: string;
}

/**
 * Get current user's cart
 */
export async function getCart(): Promise<GetCartResponse> {
  return apiClient.get<GetCartResponse>('/api/cart');
}

/**
 * Add product to cart
 */
export async function addToCart(productId: string, quantity: number): Promise<CartMutationResponse> {
  return apiClient.post<CartMutationResponse>('/api/cart/items', {
    productId,
    quantity,
  });
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<CartMutationResponse> {
  return apiClient.patch<CartMutationResponse>(`/api/cart/items/${productId}`, {
    quantity,
  });
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productId: string): Promise<CartMutationResponse> {
  return apiClient.delete<CartMutationResponse>(`/api/cart/items/${productId}`);
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>('/api/cart');
}
