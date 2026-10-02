/**
 * Helper utilities for products
 */

import { Product } from '../types';

/**
 * Get product ID - handles both _id and id fields from backend
 */
export function getProductId(product: Product): string {
  return product._id || product.id || '';
}

/**
 * Format price from paise to display currency
 * @param paise - Price in paise (1/100 of currency unit)
 * @param currency - Currency symbol (default ₹)
 */
export function formatPrice(paise: number, currency = '₹'): string {
  const rupees = paise / 100;
  return `${currency}${rupees.toFixed(2)}`;
}

/**
 * Convert paise to display number
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Get first image URL from product, fallback to emoji
 */
export function getProductImage(product: Product): string | null {
  if (product.images && product.images.length > 0) {
    return product.images[0].secureUrl;
  }
  return null;
}
