import React from 'react';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/productHelper';

interface OrderCardProps {
  order: Order;
}

const ORDER_STEPS = [
  'Requested',
  'Baker Reviewing',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Completed',
];

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.REQUESTED:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.BAKER_REVIEWING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.CONFIRMED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.PREPARING:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.COMPLETED:
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-chocolate text-cream p-4 flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</h3>
          <p className="text-sm text-cream/80">
            {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Order Items */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-chocolate">
                {formatPrice(item.basePrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <span className="font-semibold">Total Amount:</span>
          <span className="font-bold text-lg text-chocolate">{formatPrice(order.totalPaise)}</span>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">Order Status</p>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            getStatusColor(order.status)
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="p-4 bg-cream/30">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-xs text-gray-600 font-semibold">Delivery Date</p>
            <p className="text-chocolate font-semibold">
              {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString('en-IN')
                : 'TBD'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Mode</p>
            <p className="text-chocolate font-semibold capitalize">{order.deliveryMode}</p>
          </div>
        </div>

        {order.deliveryMode === 'delivery' && order.deliveryAddress && (
          <div className="text-sm">
            <p className="text-xs text-gray-600 font-semibold mb-1">Delivery Address</p>
            <p className="text-chocolate">{order.deliveryAddress}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-2">
        <button className="flex-1 bg-chocolate text-cream py-2 rounded text-sm font-semibold hover:bg-opacity-90 transition-all">
          View Details
        </button>
        {order.status === OrderStatus.COMPLETED && (
          <button className="flex-1 bg-gold text-chocolate py-2 rounded text-sm font-semibold hover:bg-opacity-90 transition-all">
            Write Review
          </button>
        )}
      </div>
    </div>
  );
};
