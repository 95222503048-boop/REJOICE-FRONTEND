/**
 * Admin Product Service
 * Manages product CRUD operations for admin users
 */

import { apiClient } from './api';
import { Product } from '../types';
import { Pagination } from './productService';

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number; // in paise
  tags?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  basePrice?: number;
  tags?: string[];
}

export interface AdminProductsResponse {
  products: Product[];
  pagination: Pagination;
}

/**
 * Get all products (admin view, includes inactive)
 */
export async function getAllProductsAdmin(page: number = 1, limit: number = 20): Promise<AdminProductsResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));

  return apiClient.get<AdminProductsResponse>(`/api/products/admin?${params.toString()}`);
}

/**
 * Get product by ID (admin view)
 */
export async function getProductByIdAdmin(id: string): Promise<{ product: Product }> {
  return apiClient.get<{ product: Product }>(`/api/products/admin/${id}`);
}

/**
 * Create new product
 */
export async function createProduct(data: CreateProductRequest): Promise<{ product: Product; message: string }> {
  return apiClient.post<{ product: Product; message: string }>('/api/products/admin', data);
}

/**
 * Update product
 */
export async function updateProduct(
  id: string,
  data: UpdateProductRequest,
): Promise<{ product: Product; message: string }> {
  return apiClient.patch<{ product: Product; message: string }>(`/api/products/admin/${id}`, data);
}

/**
 * Update product availability
 */
export async function updateProductAvailability(
  id: string,
  available: boolean,
): Promise<{ product: Product; message: string }> {
  return apiClient.patch<{ product: Product; message: string }>(`/api/products/admin/${id}/availability`, {
    available,
  });
}

/**
 * Deactivate product (soft delete)
 */
export async function deactivateProduct(id: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/api/products/admin/${id}`);
}
