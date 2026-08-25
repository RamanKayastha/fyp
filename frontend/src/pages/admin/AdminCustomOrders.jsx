import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, StatusBadge, inputClass } from '../../components/admin/AdminUI'
import DesignPreviewModal from '../../components/DesignPreviewModal'
import { getAllOrders, updateOrderStatus } from '../../api/orders'
import { isCustomizedItem } from '../../utils/orderFlags'

const orderStatuses = ['PENDING', 'PACKING', 'READY_TO_SHIP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState(null)

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
    try {
      const response = await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((order) => (
        order.id === orderId
          ? { ...response.data, items: (response.data.items || []).filter(isCustomizedItem) }
          : order
      )))
      toast.success('Order status updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
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
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge tone={order.status === 'CANCELLED' ? 'danger' : order.status === 'DELIVERED' ? 'success' : 'warning'}>
                  {formatStatus(order.status)}
                </StatusBadge>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`${inputClass} min-w-40 py-2`}
                >
                  {orderStatuses.map((status) => (
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
