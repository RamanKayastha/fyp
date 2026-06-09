import React, { useState } from 'react'
import { products } from '../../assets/frontend_assets/assets'
import { AdminCard, PageHeader, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'

const orderStatuses = ['Pending', 'Packing', 'Ready to Ship', 'Out for Delivery', 'Delivered', 'Cancelled']

const orders = [
    { id: '#ORD-1028', customer: 'Aayush Sharma', productIndex: 0, quantity: 2, payment: 'Paid', status: 'Pending', date: '2026-06-09', address: 'Boudha, Kathmandu, Nepal' },
    { id: '#ORD-1027', customer: 'Nisha Rai', productIndex: 1, quantity: 1, payment: 'COD', status: 'Packing', date: '2026-06-08', address: 'Lakeside, Pokhara, Nepal' },
    { id: '#ORD-1026', customer: 'Suman Thapa', productIndex: 2, quantity: 3, payment: 'Paid', status: 'Ready to Ship', date: '2026-06-07', address: 'Itahari, Sunsari, Nepal' },
    { id: '#ORD-1025', customer: 'Pratik Adhikari', productIndex: 3, quantity: 1, payment: 'Paid', status: 'Delivered', date: '2026-06-06', address: 'Pulchowk, Lalitpur, Nepal' },
]

const AdminOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(orders[0])
    const [statusMap, setStatusMap] = useState({})

    const getStatus = (order) => statusMap[order.id] || order.status

    return (
        <div>
            <PageHeader
                eyebrow="Fulfillment"
                title="Orders Management"
                description="Track customer orders, update fulfillment status, and review detailed shipment information."
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="min-w-0">
                    <div className="grid gap-4 xl:hidden">
                        {orders.map((order) => {
                            const product = products[order.productIndex]
                            return (
                                <AdminCard key={order.id}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-black">{order.id}</p>
                                            <p className="mt-1 text-sm text-gray-500">{order.customer}</p>
                                        </div>
                                        <StatusBadge tone={order.payment === 'Paid' ? 'success' : 'warning'}>{order.payment}</StatusBadge>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <img src={product.image[0]} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-black">{product.name}</p>
                                            <p className="mt-1 text-sm text-gray-500">Qty {order.quantity} • Rs. {product.price * order.quantity}</p>
                                            <p className="mt-1 text-xs text-gray-400">{order.date}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <select
                                            value={getStatus(order)}
                                            onChange={(e) => setStatusMap((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                            className={`${inputClass} py-2`}
                                        >
                                            {orderStatuses.map((status) => <option key={status}>{status}</option>)}
                                        </select>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => setSelectedOrder(order)} className="flex-1 rounded-md border px-4 py-2 hover:bg-gray-100 sm:flex-none">View</button>
                                            <button type="button" className="flex-1 rounded-md border px-4 py-2 hover:bg-gray-100 sm:flex-none">Print</button>
                                        </div>
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
                                    const product = products[order.productIndex]
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 font-medium text-black">{order.id}</td>
                                            <td className="px-4 py-4">{order.customer}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image[0]} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                                                    <span className="max-w-44 truncate">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">{order.quantity}</td>
                                            <td className="px-4 py-4">Rs. {product.price * order.quantity}</td>
                                            <td className="px-4 py-4">
                                                <StatusBadge tone={order.payment === 'Paid' ? 'success' : 'warning'}>{order.payment}</StatusBadge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={getStatus(order)}
                                                    onChange={(e) => setStatusMap((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                                    className={`${inputClass} min-w-40 py-2`}
                                                >
                                                    {orderStatuses.map((status) => <option key={status}>{status}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">{order.date}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setSelectedOrder(order)} className="rounded-md border px-3 py-2 hover:bg-gray-100">View</button>
                                                    <button type="button" className="rounded-md border px-3 py-2 hover:bg-gray-100">Print</button>
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
                    {selectedOrder && (
                        <div className="mt-5 space-y-6">
                            <div className="rounded-md bg-gray-50 p-4">
                                <p className="font-medium text-black">{selectedOrder.customer}</p>
                                <p className="mt-1 text-sm text-gray-500">{selectedOrder.id}</p>
                                <p className="mt-3 text-sm text-gray-600">{selectedOrder.address}</p>
                            </div>

                            <div>
                                <p className="mb-3 text-sm font-medium text-gray-700">Product thumbnails</p>
                                <div className="flex gap-3">
                                    {products[selectedOrder.productIndex].image.slice(0, 3).map((image, index) => (
                                        <img key={index} src={image} alt="" className="h-16 w-16 rounded-md object-cover" />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-4 text-sm font-medium text-gray-700">Timeline</p>
                                <div className="space-y-4">
                                    {orderStatuses.slice(0, 5).map((status) => {
                                        const active = orderStatuses.indexOf(status) <= orderStatuses.indexOf(getStatus(selectedOrder))
                                        return (
                                            <div key={status} className="flex gap-3">
                                                <span className={`mt-1 h-3 w-3 rounded-full ${active ? 'bg-black' : 'bg-gray-200'}`} />
                                                <div>
                                                    <p className={`text-sm font-medium ${active ? 'text-black' : 'text-gray-400'}`}>{status}</p>
                                                    <p className="text-xs text-gray-400">{active ? 'Updated by admin team' : 'Awaiting update'}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </AdminCard>
            </div>
        </div>
    )
}

export default AdminOrders
