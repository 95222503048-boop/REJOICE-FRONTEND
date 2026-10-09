import React, { useEffect, useMemo, useState } from 'react';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import * as adminOrderService from '../../services/adminOrderService';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/productHelper';

type StatusChartItem = {
  value: OrderStatus;
  label: string;
  color: string;
};

const ACTIVE_STATUSES: StatusChartItem[] = [
  { value: OrderStatus.REQUESTED, label: 'Received', color: '#D4AF37' },
  { value: OrderStatus.BAKER_REVIEWING, label: 'Under review', color: '#9A7430' },
  { value: OrderStatus.CONFIRMED, label: 'Confirmed', color: '#6096E8' },
  { value: OrderStatus.PREPARING, label: 'Preparing', color: '#E7A34D' },
  { value: OrderStatus.READY, label: 'Prepared / ready', color: '#45A885' },
  { value: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for delivery', color: '#9A84D9' },
];

const CHART_PAGE_SIZE = 50;
const VISIBLE_ORDER_COUNT = 20;
const TREND_DAYS = 14;

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const statusPillClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.REQUESTED:
      return 'bg-amber-100 text-amber-800';
    case OrderStatus.BAKER_REVIEWING:
      return 'bg-orange-100 text-orange-800';
    case OrderStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.PREPARING:
      return 'bg-violet-100 text-violet-800';
    case OrderStatus.READY:
      return 'bg-emerald-100 text-emerald-800';
    case OrderStatus.OUT_FOR_DELIVERY:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

interface DonutChartProps {
  items: Array<StatusChartItem & { count: number }>;
  total: number;
}

const OrderStatusDonut: React.FC<DonutChartProps> = ({ items, total }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-6">
      <div className="mx-auto relative h-44 w-44">
        <svg viewBox="0 0 140 140" className="h-full w-full" role="img" aria-label={`Active order status chart. ${total} active orders.`}>
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#F2EADB" strokeWidth="18" />
          {total > 0 && items.map((item) => {
            const segmentLength = (item.count / total) * circumference;
            const segmentOffset = offset;
            offset += segmentLength;

            return (
              <circle
                key={item.value}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-segmentOffset}
                transform="rotate(-90 70 70)"
                className="transition-all duration-500"
              />
            );
          })}
          <text x="70" y="65" textAnchor="middle" className="fill-chocolate" fontSize="23" fontWeight="700">
            {total}
          </text>
          <text x="70" y="83" textAnchor="middle" className="fill-gray-500" fontSize="9">
            ACTIVE ORDERS
          </text>
        </svg>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.value} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate text-gray-600">{item.label}</span>
            </div>
            <span className="font-bold tabular-nums text-chocolate">{item.count}</span>
          </div>
        ))}
        {total === 0 && (
          <p className="text-xs leading-5 text-gray-500">Active-stage orders will appear here as new orders arrive.</p>
        )}
      </div>
    </div>
  );
};

interface TrendPoint {
  date: Date;
  key: string;
  count: number;
}

const OrdersTrendChart: React.FC<{ data: TrendPoint[] }> = ({ data }) => {
  const width = 720;
  const height = 280;
  const margin = { top: 20, right: 20, bottom: 42, left: 38 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const highestCount = Math.max(0, ...data.map((item) => item.count));
  const yMax = Math.max(3, Math.ceil(highestCount / 3) * 3);
  const points = data.map((item, index) => ({
    ...item,
    x: margin.left + (index / Math.max(data.length - 1, 1)) * plotWidth,
    y: margin.top + plotHeight - (item.count / yMax) * plotHeight,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = firstPoint && lastPoint
    ? `${linePath} L ${lastPoint.x} ${margin.top + plotHeight} L ${firstPoint.x} ${margin.top + plotHeight} Z`
    : '';
  const yTicks = [0, 1, 2, 3].map((step) => ({
    value: Math.round((yMax * step) / 3),
    y: margin.top + plotHeight - (step / 3) * plotHeight,
  }));
  const totalInPeriod = data.reduce((sum, point) => sum + point.count, 0);
  const peak = data.reduce<TrendPoint | null>((best, point) => !best || point.count > best.count ? point : best, null);
  const labelPoints = points.filter((_, index) => index % 2 === 0 || index === points.length - 1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Daily order requests</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-chocolate">{totalInPeriod}</p>
          <p className="mt-1 text-xs text-gray-500">orders placed in the last 14 days</p>
        </div>
        <div className="rounded-xl bg-cream px-4 py-3">
          <p className="text-xs text-gray-500">Busiest day</p>
          <p className="mt-1 text-sm font-bold text-chocolate">
            {peak && peak.count > 0 ? `${formatDateLabel(peak.date)} · ${peak.count} ${peak.count === 1 ? 'order' : 'orders'}` : 'No orders yet'}
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Line chart of orders placed each day over the last 14 days">
          <defs>
            <linearGradient id="ordersTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.015" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, index) => (
            <g key={`${tick.value}-${index}`}>
              <line x1={margin.left} y1={tick.y} x2={width - margin.right} y2={tick.y} stroke="#EAE2D2" strokeDasharray="4 5" />
              <text x={margin.left - 10} y={tick.y + 4} textAnchor="end" fontSize="11" fill="#8A8174">{tick.value}</text>
            </g>
          ))}

          {areaPath && <path d={areaPath} fill="url(#ordersTrendFill)" />}
          {linePath && <path d={linePath} fill="none" stroke="#B88B20" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}

          {points.map((point) => (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r="7" fill="#D4AF37" opacity="0.16" />
              <circle cx={point.x} cy={point.y} r="3.5" fill="#FFFDF8" stroke="#B88B20" strokeWidth="2.5">
                <title>{`${formatDateLabel(point.date)}: ${point.count} ${point.count === 1 ? 'order' : 'orders'}`}</title>
              </circle>
            </g>
          ))}

          {labelPoints.map((point) => (
            <text key={point.key} x={point.x} y={height - 14} textAnchor="middle" fontSize="10" fill="#8A8174">
              {formatDateLabel(point.date)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const AdminOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartOrders, setChartOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    let cancelled = false;
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Keep the table at its existing 20-order view, but load all pages for accurate analytics.
        const firstPage = await adminOrderService.getAllOrdersAdmin(1, CHART_PAGE_SIZE);
        const allOrders = [...firstPage.orders];

        for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
          const nextPage = await adminOrderService.getAllOrdersAdmin(page, CHART_PAGE_SIZE);
          allOrders.push(...nextPage.orders);
        }

        if (cancelled) return;
        setChartOrders(allOrders);
        setOrders(allOrders.slice(0, VISIBLE_ORDER_COUNT));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        if (!cancelled) setError('Failed to load orders and analytics. Please refresh and try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => { cancelled = true; };
  }, [user?.role]);

  const statusCounts = useMemo(() => ACTIVE_STATUSES.map((item) => ({
    ...item,
    count: chartOrders.filter((order) => order.status === item.value).length,
  })), [chartOrders]);

  const activeOrderCount = statusCounts.reduce((sum, item) => sum + item.count, 0);
  const completedCount = chartOrders.filter((order) => order.status === OrderStatus.COMPLETED).length;
  const cancelledCount = chartOrders.filter((order) => order.status === OrderStatus.CANCELLED).length;

  const trendData = useMemo(() => {
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dates = Array.from({ length: TREND_DAYS }, (_, index) => {
      const date = new Date(todayLocal);
      date.setDate(todayLocal.getDate() - (TREND_DAYS - 1 - index));
      return { date, key: getDateKey(date), count: 0 };
    });
    const counts = new Map(dates.map((item) => [item.key, 0]));

    chartOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      if (Number.isNaN(createdAt.getTime())) return;
      const key = getDateKey(createdAt);
      if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return dates.map((item) => ({ ...item, count: counts.get(item.key) ?? 0 }));
  }, [chartOrders]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await adminOrderService.updateOrderStatus(selectedOrder.id, newStatus);
      setOrders((current) => current.map((order) => order.id === selectedOrder.id ? { ...order, status: newStatus } : order));
      setChartOrders((current) => current.map((order) => order.id === selectedOrder.id ? { ...order, status: newStatus } : order));
      setSelectedOrder((current) => current ? { ...current, status: newStatus } : current);
      setStatusMessage('Order status updated successfully. Your dashboard is refreshed.');
      setNewStatus('');
    } catch (err) {
      console.error('Failed to update order status:', err);
      setStatusMessage(null);
      alert('Failed to update order. Please try again.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <CustomerLayout>
        <section className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-red-600">Admin access required</p>
        </section>
      </CustomerLayout>
    );
  }

  if (isLoading) {
    return (
      <CustomerLayout>
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="mb-8 font-playfair text-3xl font-bold text-chocolate">Order Management</h1>
          <p className="text-chocolate/60">Loading orders and analytics...</p>
        </section>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">Rejoice bakery dashboard</p>
            <h1 className="font-playfair text-3xl font-bold text-chocolate sm:text-4xl">Order Management</h1>
            <p className="mt-2 text-sm text-gray-500">Track each order from arrival to delivery.</p>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-500">All-time orders</p>
            <p className="text-2xl font-bold text-chocolate">{chartOrders.length}</p>
          </div>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {statusMessage && (
          <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {statusMessage}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-chocolate/5 bg-white p-5 shadow-sm shadow-chocolate/5">
            <p className="text-sm text-gray-500">Total orders</p>
            <p className="mt-2 text-3xl font-bold text-chocolate">{chartOrders.length}</p>
            <p className="mt-2 text-xs text-gray-400">Across all order statuses</p>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active pipeline</p>
            <p className="mt-2 text-3xl font-bold text-chocolate">{activeOrderCount}</p>
            <p className="mt-2 text-xs text-gray-400">Received through out for delivery</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm shadow-chocolate/5">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{completedCount}</p>
            <p className="mt-2 text-xs text-gray-400">Successfully finished</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm shadow-chocolate/5">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{cancelledCount}</p>
            <p className="mt-2 text-xs text-gray-400">Cancelled orders</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <article className="rounded-3xl border border-chocolate/5 bg-white p-5 shadow-lg shadow-chocolate/5 sm:p-7 xl:col-span-5">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Live snapshot</p>
              <h2 className="mt-2 font-playfair text-2xl font-bold text-chocolate">Order status mix</h2>
              <p className="mt-1 text-sm text-gray-500">See how active orders are moving through the bakery.</p>
            </div>
            <OrderStatusDonut items={statusCounts} total={activeOrderCount} />
            <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5 text-xs text-gray-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5">Completed: {completedCount}</span>
              <span className="rounded-full bg-red-50 px-3 py-1.5">Cancelled: {cancelledCount}</span>
            </div>
          </article>

          <article className="rounded-3xl border border-chocolate/5 bg-white p-5 shadow-lg shadow-chocolate/5 sm:p-7 xl:col-span-7">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Order momentum</p>
                <h2 className="mt-2 font-playfair text-2xl font-bold text-chocolate">Orders placed over time</h2>
                <p className="mt-1 text-sm text-gray-500">Daily volume and peaks over the last 14 days.</p>
              </div>
              <span className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-chocolate">14-day trend</span>
            </div>
            <OrdersTrendChart data={trendData} />
          </article>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-chocolate">Recent orders</h2>
                <p className="mt-1 text-sm text-gray-500">Showing the latest {orders.length} orders.</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gold/40 bg-white p-10 text-center">
                <p className="text-lg font-semibold text-chocolate">No orders yet</p>
                <p className="mt-2 text-sm text-gray-500">New orders will appear here when customers place them.</p>
              </div>
            ) : orders.map((order) => (
              <button
                type="button"
                key={order.id}
                onClick={() => { setSelectedOrder(order); setNewStatus(''); setStatusMessage(null); }}
                className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedOrder?.id === order.id ? 'border-gold ring-2 ring-gold/20' : 'border-chocolate/5'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Order #{order.id.slice(-8)}</p>
                    <p className="mt-1 text-lg font-bold text-chocolate">{formatPrice(order.totalPaise)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusPillClass(order.status)}`}>{order.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                  <div>
                    <p className="font-semibold text-chocolate">{order.customer?.name || 'Unknown customer'}</p>
                    <p className="text-sm text-gray-500">{order.customer?.phone || 'Phone not provided'}</p>
                  </div>
                  <p className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>

          <aside className="lg:col-span-1">
            {selectedOrder ? (
              <div className="sticky top-6 rounded-2xl border border-chocolate/5 bg-white p-6 shadow-lg shadow-chocolate/5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Selected order</p>
                    <h2 className="mt-2 font-playfair text-xl font-bold text-chocolate">Order Details</h2>
                  </div>
                  <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-full px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-chocolate" aria-label="Close order details">✕</button>
                </div>

                <div className="mb-5 space-y-3 border-b border-gray-100 pb-5 text-sm">
                  <div><p className="text-gray-500">Customer</p><p className="font-semibold text-chocolate">{selectedOrder.customer?.name || 'Unknown customer'}</p></div>
                  <div><p className="text-gray-500">Mobile</p><p className="font-semibold text-chocolate">{selectedOrder.customer?.phone || 'Phone not provided'}</p></div>
                  <div><p className="text-gray-500">Order ID</p><p className="break-all font-medium text-chocolate">{selectedOrder.id}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-gray-500">Total</p><p className="font-semibold text-chocolate">{formatPrice(selectedOrder.totalPaise)}</p></div>
                    <div><p className="text-gray-500">Mode</p><p className="font-semibold capitalize text-chocolate">{selectedOrder.deliveryMode}</p></div>
                  </div>
                  <div><p className="text-gray-500">Delivery date</p><p className="font-semibold text-chocolate">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p></div>
                  <div><p className="text-gray-500">Placed on</p><p className="font-semibold text-chocolate">{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                </div>

                <div className="mb-4">
                  <label htmlFor="order-status" className="mb-2 block text-sm font-semibold text-chocolate">Update status</label>
                  <select id="order-status" value={newStatus} onChange={(event) => setNewStatus(event.target.value as OrderStatus | '')} className="w-full rounded-xl border border-gold/30 bg-white px-3 py-3 text-sm text-chocolate outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                    <option value="">Select status...</option>
                    {Object.values(OrderStatus).map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <button type="button" onClick={handleStatusUpdate} disabled={!newStatus || newStatus === selectedOrder.status} className="w-full rounded-xl bg-chocolate px-4 py-3 font-semibold text-cream shadow-sm transition hover:bg-chocolate/90 disabled:cursor-not-allowed disabled:opacity-40">
                  Update Status
                </button>
              </div>
            ) : (
              <div className="sticky top-6 rounded-2xl border border-dashed border-gold/40 bg-white/70 p-8 text-center">
                <div className="text-3xl" aria-hidden="true">📦</div>
                <p className="mt-3 font-semibold text-chocolate">Choose an order</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">Select a recent order to review the details and update its status.</p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </CustomerLayout>
  );
};
