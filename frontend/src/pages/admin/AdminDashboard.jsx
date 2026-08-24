import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, StatusBadge } from '../../components/admin/AdminUI'
import { getProducts } from '../../api/products'
import { getUsers } from '../../api/users'
import { getAllOrders } from '../../api/orders'

const formatCategory = (category) => {
    if (category === 'MEN') return 'Men'
    if (category === 'WOMEN') return 'Women'
    return category || '—'
}

const AdminDashboard = () => {
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])

    useEffect(() => {
        let cancelled = false

        Promise.all([getProducts(), getUsers(), getAllOrders()])
            .then(([productResponse, userResponse, orderResponse]) => {
                if (cancelled) return
                setProducts(productResponse.data || [])
                setUsers(userResponse.data || [])
                setOrders(orderResponse.data || [])
            })
            .catch(() => {
                if (!cancelled) toast.error('Failed to load dashboard data')
            })

        return () => {
            cancelled = true
        }
    }, [])

    const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4)
    const pendingOrders = orders.filter((order) => order.status === 'PENDING').length
    const revenue = orders
        .filter((order) => order.status !== 'CANCELLED')
        .reduce((sum, order) => sum + Number(order.total || 0), 0)
    const fulfillmentSteps = [
        { label: 'Pending', status: 'PENDING' },
        { label: 'Packing', status: 'PACKING' },
        { label: 'Ready to Ship', status: 'READY_TO_SHIP' },
        { label: 'Out for Delivery', status: 'OUT_FOR_DELIVERY' },
        { label: 'Delivered', status: 'DELIVERED' },
    ]
    const metrics = [
        { label: 'Revenue', value: `Rs. ${revenue}`, helper: 'From placed orders' },
        { label: 'Orders', value: orders.length, helper: `${pendingOrders} pending` },
        { label: 'Products', value: products.length, helper: 'Live catalog items' },
        { label: 'Customers', value: users.length, helper: `${users.filter((user) => user.role === 'ADMIN').length} admins` },
    ]

    return (
        <div>
            <PageHeader
                eyebrow="Overview"
                title="Dashboard"
                description="A calm, focused overview of store performance, recent products, and operational status."
                action={<Link to="/admin/add-items" className=" bg-black px-5 py-3 text-sm text-white">Add Product</Link>}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <AdminCard key={metric.label}>
                        <p className="text-sm text-gray-500">{metric.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-black">{metric.value}</p>
                        <p className="mt-2 text-xs text-gray-400">{metric.helper}</p>
                    </AdminCard>
                ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <AdminCard>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-black">Recent Products</h3>
                            <p className="text-sm text-gray-500">Latest catalog additions</p>
                        </div>
                        <Link to="/admin/items" className="text-sm font-medium text-black underline">View all</Link>
                    </div>

                    <div className="space-y-4">
                        {latestProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-4 rounded-2xl border p-3">
                                <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-2xl object-cover bg-gray-100" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-black">{product.name}</p>
                                    <p className="text-sm text-gray-500">{formatCategory(product.category)} · Stock {product.stock ?? 0}</p>
                                </div>
                                <StatusBadge tone={(product.stock ?? 0) > 0 ? 'success' : 'danger'}>
                                    {(product.stock ?? 0) > 0 ? 'Active' : 'Out of Stock'}
                                </StatusBadge>
                            </div>
                        ))}

                        {!latestProducts.length && (
                            <p className="py-6 text-center text-sm text-gray-500">No products yet. Add your first item to the catalog.</p>
                        )}
                    </div>
                </AdminCard>

                <AdminCard>
                    <div className="mb-1 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-black">Order Flow</h3>
                            <p className="mt-1 text-sm text-gray-500">Current fulfillment status</p>
                        </div>
                        <Link to="/admin/orders" className="text-sm font-medium text-black underline">View all</Link>
                    </div>
                    <div className="mt-6 space-y-4">
                        {fulfillmentSteps.map((item, index) => {
                            const count = orders.filter((order) => order.status === item.status).length
                            const width = orders.length ? Math.max(8, Math.round((count / orders.length) * 100)) : 0
                            return (
                                <div key={item.status} className="flex items-center gap-3">
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs text-white">{index + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm">
                                            <span>{item.label}</span>
                                            <span className="text-gray-400">{count}</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-gray-100">
                                            <div className="h-full rounded-full bg-black" style={{ width: `${width}%` }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </AdminCard>
            </div>
        </div>
    )
}

export default AdminDashboard
