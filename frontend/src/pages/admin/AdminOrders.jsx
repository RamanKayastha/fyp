import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'
import { getAllOrders, updateOrderStatus } from '../../api/orders'
import { isCustomizedItem } from '../../utils/orderFlags'
import { FULFILLMENT_STATUSES, isTerminalStatus, statusOptionsFor } from '../../utils/orderStatus'
import DeliveryMap from '../../components/DeliveryMap'

const formatStatus = (status) =>
  (status || '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatPayment = (method) => {
  if (method === 'COD') return 'COD'
  if (method === 'KHALTI') return 'Khalti'
  if (method === 'ESEWA') return 'eSewa'
  return method || '—'
}

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

const fullAddress = (order) =>
  [
    order.landmark,
    order.area || order.address,
    order.city,
    order.region || order.state,
    order.country || 'Nepal',
  ].filter(Boolean).join(', ')

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    let cancelled = false

    getAllOrders()
      .then((response) => {
        if (cancelled) return
        const nextOrders = (response.data || [])
          .map((order) => ({
            ...order,
            items: (order.items || []).filter((item) => !isCustomizedItem(item)),
          }))
          .filter((order) => order.items.length)
        setOrders(nextOrders)
        setSelectedOrder((current) => current || nextOrders[0] || null)
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const selected = useMemo(
    () => orders.find((order) => order.id === selectedOrder?.id) || selectedOrder,
    [orders, selectedOrder]
  )

  const handleStatusChange = async (orderId, status) => {
    if (status === 'CANCELLED' && !window.confirm('Cancel this order?')) return
    try {
      const response = await updateOrderStatus(orderId, status)
      const nextOrder = {
        ...response.data,
        items: (response.data.items || []).filter((item) => !isCustomizedItem(item)),
      }
      setOrders((prev) => prev.map((order) => (order.id === orderId ? nextOrder : order)))
      toast.success(status === 'CANCELLED' ? 'Order cancelled' : 'Order status updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Fulfillment"
        title="Orders Management"
        description="Track customer orders, update fulfillment status, and review detailed shipment information."
      />

      {!loading && !orders.length && (
        <p className="mb-6 text-sm text-gray-500">No orders have been placed yet.</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <div className="grid gap-4 xl:hidden">
            {orders.map((order) => {
              const firstItem = order.items?.[0]
              return (
                <AdminCard key={order.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-black">#{order.id}</p>
                      <p className="mt-1 text-sm text-gray-500">{order.shopName || 'Stitch & Story'}</p>
                      <p className="mt-1 text-sm text-gray-500">{order.customerName || order.email}</p>
                    </div>
                    <StatusBadge tone={order.paymentMethod === 'COD' ? 'warning' : 'success'}>
                      {formatPayment(order.paymentMethod)}
                    </StatusBadge>
                  </div>

                  <div className="mt-4 flex gap-3">
                    {firstItem?.imageUrl ? (
                      <img src={firstItem.imageUrl} alt={firstItem.productName} className="h-16 w-16 rounded-md object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-black">{firstItem?.productName || 'Order items'}</p>
                      <p className="mt-1 text-sm text-gray-500">Qty {order.itemCount} • Rs. {order.total}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <select
                      value={order.status}
                      disabled={isTerminalStatus(order.status)}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`${inputClass} py-2`}
                    >
                      {statusOptionsFor(order.status).map((status) => (
                        <option key={status} value={status}>{formatStatus(status)}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setSelectedOrder(order)} className="rounded-md border px-4 py-2 hover:bg-gray-100">
                      View
                    </button>
                  </div>
                </AdminCard>
              )
            })}
          </div>

          <div className={`${tableWrapperClass} hidden xl:block`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-4">Order ID</th>
                    <th className="px-4 py-4">Shop</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Product Details</th>
                    <th className="px-4 py-4">Qty</th>
                    <th className="px-4 py-4">Total</th>
                    <th className="px-4 py-4">Payment</th>
                    <th className="px-4 py-4">Order Status</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => {
                    const firstItem = order.items?.[0]
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium text-black">#{order.id}</td>
                        <td className="px-4 py-4">{order.shopName || 'Stitch & Story'}</td>
                        <td className="px-4 py-4">{order.customerName || order.email}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {firstItem?.imageUrl ? (
                              <img src={firstItem.imageUrl} alt={firstItem.productName} className="h-12 w-12 rounded-md object-cover" />
                            ) : (
                              <div className="h-12 w-12 rounded-md bg-gray-100" />
                            )}
                            <span className="max-w-44 truncate">{firstItem?.productName || `${order.itemCount} items`}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">{order.itemCount}</td>
                        <td className="px-4 py-4">Rs. {order.total}</td>
                        <td className="px-4 py-4">
                          <StatusBadge tone={order.paymentMethod === 'COD' ? 'warning' : 'success'}>
                            {formatPayment(order.paymentMethod)}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={order.status}
                            disabled={isTerminalStatus(order.status)}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`${inputClass} min-w-40 py-2`}
                          >
                            {statusOptionsFor(order.status).map((status) => (
                              <option key={status} value={status}>{formatStatus(status)}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end">
                            <button type="button" onClick={() => setSelectedOrder(order)} className="rounded-md border px-3 py-2 hover:bg-gray-100">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AdminCard className="xl:sticky xl:top-24 xl:self-start">
          <h3 className="text-xl font-semibold text-black">Order Detail</h3>
          {selected ? (
            <div className="mt-5 space-y-6">
              <div className="rounded-md bg-gray-50 p-4">
                <p className="font-medium text-black">{selected.fullName || selected.customerName || selected.email}</p>
                <p className="mt-1 text-sm text-gray-500">#{selected.id} · {selected.shopName || 'Stitch & Story'}</p>
                <p className="mt-3 text-sm text-gray-600">{fullAddress(selected)}</p>
                <p className="mt-2 text-sm text-gray-500">{selected.phone}</p>
                <DeliveryMap
                  className="mt-3"
                  city={selected.city}
                  latitude={selected.latitude}
                  longitude={selected.longitude}
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Items</p>
                <div className="space-y-3">
                  {(selected.items || []).map((item, index) => (
                    <div key={`${selected.id}-${index}`} className="flex gap-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-gray-100" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-black">{item.productName}</p>
                        <p className="text-xs text-gray-500">Size {item.size} • Qty {item.quantity}</p>
                        <p className="text-xs text-gray-500">Rs. {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 text-sm font-medium text-gray-700">Timeline</p>
                <div className="space-y-4">
                  {FULFILLMENT_STATUSES.map((status) => {
                    const active = FULFILLMENT_STATUSES.indexOf(status) <= FULFILLMENT_STATUSES.indexOf(selected.status) && selected.status !== 'CANCELLED'
                    return (
                      <div key={status} className="flex gap-3">
                        <span className={`mt-1 h-3 w-3 rounded-full ${active ? 'bg-black' : 'bg-gray-200'}`} />
                        <div>
                          <p className={`text-sm font-medium ${active ? 'text-black' : 'text-gray-400'}`}>{formatStatus(status)}</p>
                          <p className="text-xs text-gray-400">{active ? 'Updated' : 'Awaiting update'}</p>
                        </div>
                      </div>
                    )
                  })}
                  {selected.status === 'CANCELLED' && (
                    <p className="text-sm font-medium text-red-500">This order was cancelled.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-gray-500">Select an order to see details.</p>
          )}
        </AdminCard>
      </div>
    </div>
  )
}

export default AdminOrders
