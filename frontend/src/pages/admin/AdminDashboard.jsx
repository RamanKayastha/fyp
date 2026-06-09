import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../../assets/frontend_assets/assets'
import { AdminCard, PageHeader, StatusBadge } from '../../components/admin/AdminUI'

const AdminDashboard = () => {
    const latestProducts = products.slice(0, 4)
    const metrics = [
        { label: 'Revenue', value: 'Rs. 128,400', helper: '+12.4% this month' },
        { label: 'Orders', value: '248', helper: '36 pending' },
        { label: 'Products', value: products.length, helper: '8 drafts' },
        { label: 'Customers', value: '1,924', helper: '+84 new users' },
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
                            <div key={product._id} className="flex items-center gap-4 rounded-2xl border p-3">
                                <img src={product.image[0]} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-black">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.category} / {product.subCategory}</p>
                                </div>
                                <StatusBadge tone="success">Active</StatusBadge>
                            </div>
                        ))}
                    </div>
                </AdminCard>

                <AdminCard>
                    <h3 className="text-lg font-semibold text-black">Order Flow</h3>
                    <p className="mt-1 text-sm text-gray-500">Today&apos;s fulfillment status</p>
                    <div className="mt-6 space-y-4">
                        {['Pending', 'Packing', 'Ready to Ship', 'Out for Delivery', 'Delivered'].map((item, index) => (
                            <div key={item} className="flex items-center gap-3">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs text-white">{index + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{item}</span>
                                        <span className="text-gray-400">{18 - index * 3}</span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-gray-100">
                                        <div className="h-full rounded-full bg-black" style={{ width: `${90 - index * 12}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AdminCard>
            </div>
        </div>
    )
}

export default AdminDashboard
