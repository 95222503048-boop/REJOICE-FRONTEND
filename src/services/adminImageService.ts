/**
 * Admin Image Service
 * Manages product image uploads and reordering
 */

import { apiClient } from './api';

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

export interface UploadImagesResponse {
  images: ProductImage[];
  message: string;
}

export interface GetImagesResponse {
  images: ProductImage[];
  total: number;
}

export interface ReorderImagesRequest {
  images: Array<{
    imageId: string;
    position: number;
  }>;
}

export interface ReorderImagesResponse {
  images: ProductImage[];
  message: string;
}

/**
 * Upload images for a product
 * @param productId - Product ID
 * @param files - Image files (max 5)
 */
export async function uploadProductImages(
  productId: string,
  files: File[],
): Promise<UploadImagesResponse> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  // Use the apiClient's fetch method which handles CSRF
  return apiClient.post<UploadImagesResponse>(
    `/products/admin/${productId}/images`,
    formData,
  );
}

/**
 * Get all images for a product
 */
export async function getProductImages(productId: string): Promise<GetImagesResponse> {
  return apiClient.get<GetImagesResponse>(`/products/admin/${productId}/images`);
}

/**
 * Delete an image
 */
export async function deleteProductImage(productId: string, imageId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/products/admin/${productId}/images/${imageId}`);
}

/**
 * Reorder images for a product
 */
export async function reorderProductImages(
  productId: string,
  images: ReorderImagesRequest['images'],
): Promise<ReorderImagesResponse> {
  return apiClient.patch<ReorderImagesResponse>(`/products/admin/${productId}/images`, {
    images,
  });
}
