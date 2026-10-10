import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/productHelper';
import { DeliveryMode } from '../../types';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');

  // Backend handles delivery fee calculation
  // Frontend should not override this
  const deliveryFeePaise = deliveryMode === 'delivery' ? 5000 : 0; // 50 rupees in paise
  const finalTotal = totalAmount + deliveryFeePaise;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/sign-in', { state: { from: '/cart' } });
      return;
    }
    navigate('/order-request', { state: { deliveryMode } });
  };

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
            Shopping Cart
          </h1>

          <div className="motion-card bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding delicious creations from our menu!
            </p>
            <Link
              to="/menu"
              className="inline-block bg-chocolate text-cream px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="motion-card bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                <div className="bg-gradient-to-br from-gold/20 to-chocolate/20 w-20 h-20 rounded flex items-center justify-center flex-shrink-0">
                  <div className="text-3xl">🍰</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-chocolate">{item.name}</h3>
                  <p className="text-sm text-gray-600">{formatPrice(item.basePrice)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gold/30 rounded">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-cream"
                    >
                      −
                    </button>
                    <span className="px-3 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-cream"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="motion-card bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">
                Order Summary
              </h2>

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

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span className="text-chocolate">{formatPrice(finalTotal)}</span>
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="delivery"
                    checked={deliveryMode === 'delivery'}
                    onChange={(e) => setDeliveryMode(e.target.value as 'delivery' | 'pickup')}
                    className="accent-chocolate"
                  />
                  <span className="text-sm">Delivery (+₹50)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryMode === 'pickup'}
                    onChange={(e) => setDeliveryMode(e.target.value as 'delivery' | 'pickup')}
                    className="accent-chocolate"
                  />
                  <span className="text-sm">Pickup (Free)</span>
                </label>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-chocolate text-cream px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/menu"
                className="block text-center text-chocolate text-sm font-semibold mt-4 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
