import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/productHelper';
import { OrderStatus } from '../../types';
import * as orderService from '../../services/orderService';
import { Order } from '../../types';

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await orderService.getOrders();
        setOrders(response.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderService.cancelOrder(orderId);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o)));
      setSelectedOrder(null);
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Failed to cancel order');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <CustomerLayout>
        <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
            My Orders
          </h1>
          <div className="text-center py-12">
            <p className="text-chocolate/60">Loading orders...</p>
          </div>
        </section>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
            My Orders
          </h1>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </section>
      </CustomerLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <CustomerLayout>
        <section data-reveal="up" className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">
            My Orders
          </h1>
          <div className="motion-card bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-5xl mb-4">📦</p>
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-3">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start ordering from our delicious menu!
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="inline-block bg-chocolate text-cream px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all"
            >
              Browse Menu
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
          My Orders
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                  selectedOrder?.id === order.id ? 'border-2 border-chocolate' : 'border-2 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {order.id.slice(-8)}</p>
                    <p className="font-semibold text-chocolate">{formatPrice(order.totalPaise)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      order.status === OrderStatus.REQUESTED
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === OrderStatus.BAKER_REVIEWING
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === OrderStatus.CONFIRMED
                        ? 'bg-blue-50 text-blue-600'
                        : order.status === OrderStatus.PREPARING
                        ? 'bg-orange-100 text-orange-700'
                        : order.status === OrderStatus.READY
                        ? 'bg-purple-100 text-purple-700'
                        : order.status === OrderStatus.OUT_FOR_DELIVERY
                        ? 'bg-indigo-100 text-indigo-700'
                        : order.status === OrderStatus.COMPLETED
                        ? 'bg-green-100 text-green-700'
                        : order.status === OrderStatus.CANCELLED
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="lg:col-span-1">
              <div className="motion-card bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">
                  Order Details
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gold/20">
                  <div>
                    <p className="text-xs text-gray-600">Order ID</p>
                    <p className="text-sm font-semibold text-chocolate break-all">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className="text-sm font-semibold text-chocolate">
                      {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Delivery Mode</p>
                    <p className="text-sm font-semibold text-chocolate capitalize">
                      {selectedOrder.deliveryMode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Delivery Date</p>
                    <p className="text-sm font-semibold text-chocolate">
                      {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gold/20">
                  <h3 className="font-semibold text-chocolate text-sm mb-2">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.subtotalPaise)}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2">
                    <span>Delivery:</span>
                    <span>{formatPrice(selectedOrder.deliveryFeePaise)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-gold/20">
                    <span>Total:</span>
                    <span className="text-chocolate">{formatPrice(selectedOrder.totalPaise)}</span>
                  </div>
                </div>

                {selectedOrder.status === OrderStatus.REQUESTED && (
                  <button
                    onClick={() => handleCancel(selectedOrder.id)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-all text-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </CustomerLayout>
  );
};
