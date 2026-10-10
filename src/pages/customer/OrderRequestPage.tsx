import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/productHelper';
import * as orderService from '../../services/orderService';
import { DeliveryMode } from '../../types';

export const OrderRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backend is authoritative for delivery fee calculation
  // Frontend should not calculate this
  const deliveryFeePaise = deliveryMode === 'delivery' ? 5000 : 0; // 50 rupees in paise
  const finalTotal = totalAmount + deliveryFeePaise;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!deliveryDate) {
        throw new Error('Delivery date is required');
      }

      if (deliveryMode === 'delivery' && !address) {
        throw new Error('Delivery address is required');
      }

      // Generate idempotency key to prevent duplicate orders
      const idempotencyKey = `order-${user.id}-${Date.now()}`;

      const response = await orderService.createOrder({
        deliveryMode,
        deliveryDate,
        deliveryAddress: deliveryMode === 'delivery' ? address : undefined,
        specialNotes: notes || undefined,
        idempotencyKey,
      });

      clearCart();
      navigate('/order-success', { state: { order: response.order } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
            Checkout
          </h1>
          <div className="motion-card bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-chocolate text-cream px-6 py-3 rounded font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </section>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Delivery Mode */}
              <div className="motion-card bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-chocolate mb-4">Delivery Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="delivery"
                      checked={deliveryMode === 'delivery'}
                      onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                      className="accent-chocolate"
                    />
                    <span>Home Delivery (+₹50)</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="pickup"
                      checked={deliveryMode === 'pickup'}
                      onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                      className="accent-chocolate"
                    />
                    <span>Pickup (Free)</span>
                  </label>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="motion-card bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-chocolate mb-4">Requested Delivery Date</h3>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gold/30 rounded px-4 py-3 focus:outline-none focus:border-chocolate"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Baker will confirm availability after you place the order
                </p>
              </div>

              {/* Address (if delivery) */}
              {deliveryMode === 'delivery' && (
                <div className="motion-card bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-chocolate mb-4">Delivery Address</h3>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    required={deliveryMode === 'delivery'}
                    className="w-full border border-gold/30 rounded px-4 py-3 focus:outline-none focus:border-chocolate"
                    rows={4}
                  />
                </div>
              )}

              {/* Special Notes */}
              <div className="motion-card bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-chocolate mb-4">Special Requests (Optional)</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or dietary restrictions?"
                  className="w-full border border-gold/30 rounded px-4 py-3 focus:outline-none focus:border-chocolate"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !deliveryDate || (deliveryMode === 'delivery' && !address)}
                className="w-full bg-chocolate text-cream px-6 py-4 rounded font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="motion-card bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4 pb-4 border-b border-gold/20">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.basePrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-gold/20">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery ({deliveryMode}):</span>
                  <span>{formatPrice(deliveryFeePaise)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-chocolate">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
