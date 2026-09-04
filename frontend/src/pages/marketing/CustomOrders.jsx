import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Title from '../../components/Title'
import DesignPreviewModal from '../../components/DesignPreviewModal'
import { getMyOrders, updateOrderStatus } from '../../api/orders'
import { isCustomizedItem } from '../../utils/orderFlags'
import { isTerminalStatus } from '../../utils/orderStatus'
import { toast } from 'react-toastify'
import DeliveryMap from '../../components/DeliveryMap'

const formatStatus = (status) =>
  (status || '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatPayment = (method) => {
  if (method === 'COD') return 'Cash on Delivery'
  if (method === 'KHALTI') return 'Khalti'
  if (method === 'ESEWA') return 'eSewa'
  return method || '—'
}

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

const CustomOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    getMyOrders()
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

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return
    setCancellingId(orderId)
    try {
      const response = await updateOrderStatus(orderId, 'CANCELLED')
      setOrders((prev) => prev.map((order) => (
        order.id === orderId
          ? { ...response.data, items: (response.data.items || []).filter(isCustomizedItem) }
          : order
      )).filter((order) => order.items.length))
      toast.success('Order cancelled')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className='border-t pt-16'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='text-2xl'>
          <Title text1='MY' text2='CUSTOM ORDERS' />
        </div>
        <Link to="/orders" className='text-sm text-gray-600 underline'>Regular orders</Link>
      </div>

      {loading && <p className='mt-8 text-sm text-gray-500'>Loading custom orders...</p>}

      {!loading && !orders.length && (
        <div className='mt-10 text-sm text-gray-500'>
          <p>You have not placed any custom orders yet.</p>
          <Link to="/collections" className='mt-3 inline-block text-black underline'>Continue shopping</Link>
        </div>
      )}

      <div>
        {orders.map((order) => (
          <div key={order.id} className='py-6 border-b text-gray-700'>
            <div className='mb-4 flex flex-wrap items-center justify-between gap-2 text-sm'>
              <p className='font-medium text-black'>Order #{order.id}{order.shopName ? ` · ${order.shopName}` : ''}</p>
              <p className='text-gray-500'>{formatDate(order.createdAt)}</p>
            </div>

            {(order.items || []).map((item, index) => (
              <div key={`${order.id}-${index}`} className='py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
                <div className='flex items-center gap-6 text-sm'>
                  {item.previewFront || item.imageUrl ? (
                    <img src={item.previewFront || item.imageUrl} alt={item.productName} className='w-16 h-20 object-cover' />
                  ) : (
                    <div className='w-16 h-20 bg-gray-100' />
                  )}
                  <div>
                    <p className='sm:text-base font-medium'>{item.productName}</p>
                    <p className='mt-1 text-[10px] uppercase tracking-wide text-gray-400'>Customized</p>
                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                      <p className='text-lg'>Rs. {item.price}</p>
                      <p>Quantity : {item.quantity}</p>
                      <p>Size : {item.size}</p>
                    </div>
                    <p className='mt-2'>Payment: <span className='text-gray-400'>{formatPayment(order.paymentMethod)}</span></p>
                  </div>
                </div>

                <div className='flex items-center justify-between gap-4 md:w-1/2 md:justify-end'>
                  <div className='flex items-center gap-2'>
                    <p className={`min-w-2 h-2 rounded-full ${order.status === 'CANCELLED' ? 'bg-red-500' : order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-yellow-500'}`}></p>
                    <p className='text-sm md:text-base'>{formatStatus(order.status)}</p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setPreviewItem(item)}
                    className='border px-5 py-2 text-sm hover:bg-gray-50'
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            <p className='text-sm text-gray-500'>Deliver to: {[order.landmark, order.area || order.address, order.city, order.region || order.state].filter(Boolean).join(', ') || '—'}</p>
            <DeliveryMap
              className='mt-3 max-w-xl'
              city={order.city}
              latitude={order.latitude}
              longitude={order.longitude}
            />
            <p className='text-sm font-medium text-black'>Total: Rs. {order.total}</p>
            {!isTerminalStatus(order.status) && (
              <button
                type='button'
                disabled={cancellingId === order.id}
                onClick={() => handleCancel(order.id)}
                className='mt-3 border border-red-500 px-4 py-2 text-sm text-red-600 disabled:opacity-60'
              >
                {cancellingId === order.id ? 'Cancelling...' : 'Cancel order'}
              </button>
            )}
          </div>
        ))}
      </div>

      <DesignPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  )
}

export default CustomOrders
