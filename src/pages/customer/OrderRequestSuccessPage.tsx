import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { Order } from '../../types';
import { formatPrice } from '../../utils/productHelper';

export const OrderRequestSuccessPage: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return (
      <CustomerLayout>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Order data not found</p>
            <Link to="/menu" className="text-chocolate font-semibold hover:underline">
              Return to Menu
            </Link>
          </div>
        </section>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="font-playfair text-3xl font-bold text-chocolate mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your order. Your delicious treats will be prepared with care.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-6">
              Order Details
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gold/20">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-chocolate text-sm break-all">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-chocolate">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Mode</p>
                <p className="font-semibold text-chocolate capitalize">{order.deliveryMode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery Date</p>
                <p className="font-semibold text-chocolate">{new Date(order.deliveryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-chocolate">{formatPrice(order.totalPaise)}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-chocolate mb-3">Items Ordered</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.basePrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gold/10 rounded-lg p-8 mb-8">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ We've received your order</li>
              <li>✓ Our team is preparing your items</li>
              <li>✓ You'll receive a confirmation via email</li>
              {order.deliveryMode === 'delivery' && (
                <li>✓ Your order will be delivered to the provided address</li>
              )}
              {order.deliveryMode === 'pickup' && (
                <li>✓ Your order will be ready for pickup</li>
              )}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              to="/my-orders"
              className="bg-chocolate text-cream px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
            >
              View My Orders
            </Link>
            <Link
              to="/menu"
              className="bg-white text-chocolate border-2 border-chocolate px-8 py-3 rounded font-semibold hover:bg-cream transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};
