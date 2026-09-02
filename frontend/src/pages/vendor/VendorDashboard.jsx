import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader } from '../../components/admin/AdminUI'
import { getMyProducts } from '../../api/products'
import { getAllOrders, getSales } from '../../api/orders'

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`

const VendorDashboard = () => {
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [todaySales, setTodaySales] = useState(null)

    useEffect(() => {
        let cancelled = false
        Promise.all([getMyProducts(), getAllOrders(), getSales({ period: 'day' })])
            .then(([productResponse, orderResponse, salesResponse]) => {
                if (cancelled) return
                setProducts(productResponse.data || [])
                setOrders(orderResponse.data || [])
                setTodaySales(salesResponse.data)
            })
            .catch(() => {
                if (!cancelled) toast.error('Failed to load dashboard data')
            })
        return () => {
            cancelled = true
        }
    }, [])

    const pendingOrders = orders.filter((order) => order.status === 'PENDING').length

    return (
        <div>
            <PageHeader
                eyebrow="Your shop"
                title="Vendor Dashboard"
                description="Manage your products and fulfill orders placed for your items."
                action={
                    <div className="flex gap-2">
                        <Link to="/vendor/sales" className="border px-5 py-3 text-sm">View sales</Link>
                        <Link to="/vendor/add-items" className=" bg-black px-5 py-3 text-sm text-white">Add Product</Link>
                    </div>
                }
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminCard>
                    <p className="text-sm text-gray-500">Today's sales</p>
                    <p className="mt-3 text-3xl font-semibold text-black">{money(todaySales?.revenue)}</p>
                    <p className="mt-2 text-xs text-gray-400">{todaySales?.unitsSold || 0} units</p>
                </AdminCard>
                <AdminCard>
                    <p className="text-sm text-gray-500">Products</p>
                    <p className="mt-3 text-3xl font-semibold text-black">{products.length}</p>
                </AdminCard>
                <AdminCard>
                    <p className="text-sm text-gray-500">Orders</p>
                    <p className="mt-3 text-3xl font-semibold text-black">{orders.length}</p>
                    <p className="mt-2 text-xs text-gray-400">{pendingOrders} pending</p>
                </AdminCard>
                <AdminCard>
                    <p className="text-sm text-gray-500">Custom jobs</p>
                    <p className="mt-3 text-3xl font-semibold text-black">
                        {orders.filter((order) => (order.items || []).some((item) => item.customized)).length}
                    </p>
                </AdminCard>
            </div>
        </div>
    )
}

export default VendorDashboard
