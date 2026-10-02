import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch cart from backend when user logs in or app loads
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Clear cart if user logs out
      setItems([]);
      setError(null);
    }
  }, [user?.id]);

  const fetchCart = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      setItems(response.cart.items);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      setError('Please log in to add items to cart');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.addToCart(productId, quantity);
      setItems(response.cart.items);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.removeFromCart(productId);
      setItems(response.cart.items);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      setItems(response.cart.items);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await cartService.clearCart();
      setItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals from backend data (prices in paise)
  // Note: Frontend should NOT calculate prices, but can compute UI totals
  const totalAmount = items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    totalAmount,
    totalItems,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
