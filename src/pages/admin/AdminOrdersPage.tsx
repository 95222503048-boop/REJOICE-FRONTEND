import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import * as adminOrderService from '../../services/adminOrderService';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/productHelper';

export const AdminOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminOrderService.getAllOrdersAdmin();
        setOrders(response.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.role]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await adminOrderService.updateOrderStatus(selectedOrder.id, newStatus as OrderStatus);
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus as OrderStatus } : o)));
      setSelectedOrder({ ...selectedOrder, status: newStatus as OrderStatus });
      setNewStatus('');
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <CustomerLayout>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <p className="text-red-600">Admin access required</p>
        </section>
      </CustomerLayout>
    );
  }

  if (isLoading) {
    return (
      <CustomerLayout>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">Orders</h1>
          <p className="text-chocolate/60">Loading...</p>
        </section>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-chocolate mb-8">Order Management</h1>

        {error && <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => { setSelectedOrder(order); setNewStatus(''); }}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 ${
                  selectedOrder?.id === order.id ? 'border-chocolate' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {order.id.slice(-8)}</p>
                    <p className="font-semibold text-chocolate">{formatPrice(order.totalPaise)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{order.items.length} items</p>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-playfair text-xl font-bold text-chocolate mb-4">Order Details</h2>

                <div className="space-y-2 mb-4 pb-4 border-b border-gold/20">
                  <p className="text-sm"><span className="font-semibold">ID:</span> {selectedOrder.id}</p>
                  <p className="text-sm"><span className="font-semibold">Total:</span> {formatPrice(selectedOrder.totalPaise)}</p>
                  <p className="text-sm"><span className="font-semibold">Mode:</span> {selectedOrder.deliveryMode}</p>
                  <p className="text-sm"><span className="font-semibold">Date:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-chocolate mb-2">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full border border-gold/30 rounded px-3 py-2"
                  >
                    <option value="">Select status...</option>
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                  className="w-full bg-chocolate text-cream px-4 py-2 rounded font-semibold disabled:opacity-50"
                >
                  Update Status
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </CustomerLayout>
  );
};
