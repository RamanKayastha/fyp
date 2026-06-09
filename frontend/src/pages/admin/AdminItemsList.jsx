import React, { useMemo, useState } from 'react'
import { products } from '../../assets/frontend_assets/assets'
import { AdminCard, ConfirmModal, PageHeader, Pagination, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'

const AdminItemsList = () => {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [sort, setSort] = useState('date-desc')
    const [page, setPage] = useState(1)
    const [itemToRemove, setItemToRemove] = useState(null)

    const filteredProducts = useMemo(() => {
        const list = products
            .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
            .filter((product) => category === 'All' || product.category === category)

        return [...list].sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price
            if (sort === 'price-desc') return b.price - a.price
            if (sort === 'date-asc') return a.date - b.date
            return b.date - a.date
        })
    }, [category, search, sort])

    const pageSize = 6
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
    const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

    return (
        <div>
            <PageHeader
                eyebrow="Catalog"
                title="Items List"
                description="Review, filter, sort, edit, or remove products from a clean admin table."
            />

            <AdminCard className="mb-5">
                <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
                    <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className={inputClass} placeholder="Search products" />
                    <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} className={inputClass}>
                        {['All', 'Men', 'Women', 'Kids'].map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
                        <option value="date-desc">Newest first</option>
                        <option value="date-asc">Oldest first</option>
                        <option value="price-asc">Price low to high</option>
                        <option value="price-desc">Price high to low</option>
                    </select>
                </div>
            </AdminCard>

            <div className={tableWrapperClass}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-5 py-4">Product</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Stock Status</th>
                                <th className="px-5 py-4">Created Date</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedProducts.map((product, index) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image[0]} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                                            <div>
                                                <p className="font-medium text-black">{product.name}</p>
                                                <p className="text-xs text-gray-400">SKU {product._id.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">{product.category}</td>
                                    <td className="px-5 py-4">Rs. {product.price}</td>
                                    <td className="px-5 py-4">
                                        <StatusBadge tone={index % 5 === 0 ? 'warning' : 'success'}>{index % 5 === 0 ? 'Low Stock' : 'In Stock'}</StatusBadge>
                                    </td>
                                    <td className="px-5 py-4">{new Date(product.date).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button type="button" className="rounded-full border px-4 py-2 hover:bg-gray-100">Edit</button>
                                            <button type="button" onClick={() => setItemToRemove(product)} className="rounded-full border px-4 py-2 text-red-500 hover:bg-red-50">Remove</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!paginatedProducts.length && (
                    <div className="px-5 py-16 text-center">
                        <p className="text-lg font-medium text-black">No products found</p>
                        <p className="mt-2 text-sm text-gray-500">Try changing your search or filter.</p>
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
                    onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                />
            </div>

            {itemToRemove && (
                <ConfirmModal
                    title="Remove product?"
                    message={`This will remove "${itemToRemove.name}" from the catalog preview.`}
                    confirmLabel="Remove"
                    onCancel={() => setItemToRemove(null)}
                    onConfirm={() => setItemToRemove(null)}
                />
            )}
        </div>
    )
}

export default AdminItemsList
