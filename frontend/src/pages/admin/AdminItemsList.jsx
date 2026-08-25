import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminCard, ConfirmModal, PageHeader, Pagination, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'
import { deleteProduct, getProducts } from '../../api/products'
import { isCustomizableProduct } from '../../utils/productFlags'

const formatCategory = (category) => {
  if (category === 'MEN') return 'Men'
  if (category === 'WOMEN') return 'Women'
  return category || '—'
}

const stockStatus = (stock) => {
  const quantity = Number(stock) || 0
  if (quantity <= 0) return { tone: 'danger', label: 'Out of Stock' }
  if (quantity <= 5) return { tone: 'warning', label: 'Low Stock' }
  return { tone: 'success', label: 'In Stock' }
}

const AdminItemsList = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('id-desc')
  const [page, setPage] = useState(1)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [removing, setRemoving] = useState(false)

  const loadProducts = async ({ showLoader = false } = {}) => {
    if (showLoader) setLoading(true)
    try {
      const response = await getProducts()
      setProducts(response.data || [])
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    getProducts()
      .then((response) => {
        if (cancelled) return
        setProducts(response.data || [])
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const list = products
      .filter((product) => product.name?.toLowerCase().includes(search.toLowerCase()))
      .filter((product) => category === 'All' || product.category === category)

    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'id-asc') return a.id - b.id
      return b.id - a.id
    })
  }, [category, products, search, sort])

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleRemove = async () => {
    if (!itemToRemove) return
    setRemoving(true)
    try {
      await deleteProduct(itemToRemove.id)
      toast.success('Product removed')
      setItemToRemove(null)
      await loadProducts({ showLoader: true })
    } catch {
      toast.error('Failed to remove product')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Items List"
        description="Review, filter, sort, edit, or remove products from a clean admin table."
        action={<Link to="/admin/add-items" className=" bg-black px-5 py-3 text-sm text-white">Add Product</Link>}
      />

      <AdminCard className="mb-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={inputClass}
            placeholder="Search products"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className={inputClass}
          >
            <option value="All">All</option>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
            <option value="id-desc">Newest first</option>
            <option value="id-asc">Oldest first</option>
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
                <th className="px-5 py-4">Sizes</th>
                <th className="px-5 py-4">Customizable</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedProducts.map((product) => {
                const status = stockStatus(product.stock)
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-black">{product.name}</p>
                          <p className="text-xs text-gray-400">SKU {product.id} · Stock {product.stock ?? 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{formatCategory(product.category)}</td>
                    <td className="px-5 py-4">Rs. {product.price}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-4">{(product.sizes || []).join(', ') || '—'}</td>
                    <td className="px-5 py-4">{isCustomizableProduct(product) ? 'Yes' : 'No'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/items/${product.id}/edit`)}
                          className="rounded-full border px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToRemove(product)}
                          className="rounded-full border px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!loading && !paginatedProducts.length && (
          <div className="px-5 py-16 text-center">
            <p className="text-lg font-medium text-black">No products found</p>
            <p className="mt-2 text-sm text-gray-500">Try changing your search or filter, or add a new product.</p>
          </div>
        )}

        {loading && (
          <div className="px-5 py-16 text-center text-sm text-gray-500">Loading products...</div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        />
      </div>

      {itemToRemove && (
        <ConfirmModal
          title="Remove product?"
          message={`This will permanently remove "${itemToRemove.name}" from the catalog.`}
          confirmLabel={removing ? 'Removing...' : 'Remove'}
          onCancel={() => !removing && setItemToRemove(null)}
          onConfirm={handleRemove}
        />
      )}
    </div>
  )
}

export default AdminItemsList
