import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, StatusBadge, inputClass } from '../../components/admin/AdminUI'
import DesignPreviewModal from '../../components/DesignPreviewModal'
import { getAllOrders, updateOrderStatus, markOrderRefunded } from '../../api/orders'
import { isCustomizedItem } from '../../utils/orderFlags'
import { isTerminalStatus, statusOptionsFor, esewaRefundPercentFor } from '../../utils/orderStatus'
import DeliveryMap from '../../components/DeliveryMap'
import { useAuth } from '../../context/AuthContext'

const formatStatus = (status) =>
  (status || '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

const AdminCustomOrders = () => {
  const { isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState(null)
  const [refundingId, setRefundingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    getAllOrders()
      .then((response) => {
        if (cancelled) return
        const customOrders = (response.data || [])
          .map((order) => ({
            ...order,
            items: (order.items || []).filter(isCustomizedItem),
          }))
          .filter((order) => order.items.length)
        setOrders(customOrders)
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load custom orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleStatusChange = async (orderId, status) => {
    if (status === 'CANCELLED') {
      const order = orders.find((item) => item.id === orderId)
      const percent = order?.paymentMethod === 'ESEWA' ? esewaRefundPercentFor(order.status) : null
      const message = percent
        ? `Cancel this eSewa order? Refund due: ${percent}% (Rs. ${((Number(order.total) * percent) / 100).toFixed(2)}).`
        : 'Cancel this order?'
      if (!window.confirm(message)) return
    }
    try {
      const response = await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((order) => (
        order.id === orderId
          ? { ...response.data, items: (response.data.items || []).filter(isCustomizedItem) }
          : order
      )))
      toast.success(status === 'CANCELLED' ? 'Order cancelled' : 'Order status updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleMarkRefunded = async (orderId) => {
    if (!window.confirm('Mark this eSewa refund as completed?')) return
    setRefundingId(orderId)
    try {
      const response = await markOrderRefunded(orderId)
      setOrders((prev) => prev.map((order) => (
        order.id === orderId
          ? { ...response.data, items: (response.data.items || []).filter(isCustomizedItem) }
          : order
      )))
      toast.success('Refund marked as completed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark refund')
    } finally {
      setRefundingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Fulfillment"
        title="Custom Orders"
        description="Review customized designs and update fulfillment status."
      />

      {loading && <p className="mb-6 text-sm text-gray-500">Loading custom orders...</p>}

      {!loading && !orders.length && (
        <p className="mb-6 text-sm text-gray-500">No custom orders have been placed yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <AdminCard key={order.id}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-black">#{order.id} · {order.customerName || order.email}</p>
                <p className="mt-1 text-sm text-gray-500">{formatDate(order.createdAt)} · Rs. {order.total}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {[order.landmark, order.area || order.address, order.city, order.region || order.state].filter(Boolean).join(', ') || '—'}
                </p>
                <DeliveryMap
                  className="mt-3 max-w-xl"
                  city={order.city}
                  latitude={order.latitude}
                  longitude={order.longitude}
                />
                {order.status === 'CANCELLED' && order.paymentMethod === 'ESEWA' && order.refundAmount != null && (
                  <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
                    <p className="font-medium text-black">
                      eSewa refund: Rs. {order.refundAmount} ({order.refundPercent}%)
                    </p>
                    <p className="mt-1 text-gray-600">
                      Status: {order.refundStatus === 'COMPLETED' ? 'Refunded' : 'Pending admin refund'}
                    </p>
                    {isAdmin && order.refundStatus === 'PENDING' && (
                      <button
                        type="button"
                        disabled={refundingId === order.id}
                        onClick={() => handleMarkRefunded(order.id)}
                        className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
                      >
                        {refundingId === order.id ? 'Saving...' : 'Mark refund completed'}
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge tone={order.status === 'CANCELLED' ? 'danger' : order.status === 'DELIVERED' ? 'success' : 'warning'}>
                  {formatStatus(order.status)}
                </StatusBadge>
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
              </div>
            </div>

            <div className="space-y-3">
              {(order.items || []).map((item, index) => (
                <div key={`${order.id}-${index}`} className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                  <div className="flex items-center gap-3">
                    {item.previewFront || item.imageUrl ? (
                      <img src={item.previewFront || item.imageUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-100" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-black">{item.productName}</p>
                      <p className="text-xs text-gray-500">Size {item.size} · Qty {item.quantity}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>

      <DesignPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  )
}

export default AdminCustomOrders
