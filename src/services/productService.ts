/**
 * Product Service
 * Fetches real product data from backend instead of mock data
 */

import { apiClient } from './api';
import { Product } from '../types';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetProductsResponse {
  products: Product[];
  pagination: Pagination;
}

/**
 * Get all products with pagination (no category filter)
 */
export async function getProducts(page: number = 1, limit: number = 20): Promise<GetProductsResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));

  const endpoint = `/api/products?${params.toString()}`;
  return apiClient.get<GetProductsResponse>(endpoint);
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<{ product: Product }> {
  return apiClient.get<{ product: Product }>(`/api/products/${id}`);
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<{ product: Product }> {
  return apiClient.get<{ product: Product }>(`/api/products/slug/${slug}`);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  category: string,
  page: number = 1,
  limit: number = 20,
): Promise<GetProductsResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));

  const endpoint = `/api/products/category/${encodeURIComponent(category)}?${params.toString()}`;
  return apiClient.get<GetProductsResponse>(endpoint);
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<{ categories: string[] }> {
  return apiClient.get<{ categories: string[] }>('/api/products/categories');
}
