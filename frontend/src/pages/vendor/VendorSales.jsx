import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'
import { getSales } from '../../api/orders'
import { getUsers } from '../../api/users'

const periods = [
  { id: 'day', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
]

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`

const VendorSales = () => {
  const isAdmin = useLocation().pathname.startsWith('/admin')
  const [period, setPeriod] = useState('week')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [vendors, setVendors] = useState([])
  const [sales, setSales] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return undefined
    let cancelled = false
    getUsers()
      .then((response) => {
        if (!cancelled) {
          setVendors((response.data || []).filter((user) => user.role === 'VENDOR'))
        }
      })
      .catch(() => {
        if (!cancelled) setVendors([])
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = from && to ? { from, to } : { period }
    if (isAdmin && vendorId) params.vendorId = vendorId
    getSales(params)
      .then((response) => {
        if (!cancelled) setSales(response.data)
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load sales')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [period, from, to, vendorId, isAdmin])

  const clearCustom = () => {
    setFrom('')
    setTo('')
    setPeriod('week')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Revenue"
        title="Sales"
        description={
          isAdmin
            ? '10% of each vendor’s product sales is platform commission. Filter by vendor and date.'
            : 'Track what your shop sold today, this week, or this month. 10% of product sales goes to the platform.'
        }
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-2">
          {periods.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setFrom('')
                setTo('')
                setPeriod(item.id)
              }}
              className={`rounded-md px-4 py-2 text-sm ${
                !from && !to && period === item.id ? 'bg-black text-white' : 'border bg-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="text-sm text-gray-600">
          From
          <input
            type="date"
            className={`${inputClass} mt-1 min-w-40`}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="text-sm text-gray-600">
          To
          <input
            type="date"
            className={`${inputClass} mt-1 min-w-40`}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        {(from || to) && (
          <button type="button" onClick={clearCustom} className="rounded-md border px-4 py-2 text-sm">
            Clear dates
          </button>
        )}
        {isAdmin && (
          <label className="text-sm text-gray-600">
            Vendor
            <select
              className={`${inputClass} mt-1 min-w-48`}
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
            >
              <option value="">All vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.shopName || vendor.username || vendor.email}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loading && <p className="text-sm text-gray-500">Loading sales...</p>}

      {!loading && sales && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {sales.from} to {sales.to} · cancelled orders excluded · 10% commission on vendor product sales
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminCard>
              <p className="text-sm text-gray-500">{isAdmin ? 'Commission (10%)' : 'Platform commission (10%)'}</p>
              <p className="mt-3 text-3xl font-semibold text-black">{money(sales.commission)}</p>
              <p className="mt-2 text-xs text-gray-400">From vendor sales {money(sales.vendorRevenue)}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-sm text-gray-500">{isAdmin ? 'Vendor payout' : 'Your payout'}</p>
              <p className="mt-3 text-3xl font-semibold text-black">{money(sales.vendorPayout)}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-sm text-gray-500">Product sales</p>
              <p className="mt-3 text-3xl font-semibold text-black">{money(sales.revenue)}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="mt-3 text-3xl font-semibold text-black">{sales.orderCount}</p>
            </AdminCard>
          </div>

          {isAdmin && (
            <div className={`${tableWrapperClass} mt-6`}>
              <div className="border-b px-5 py-4">
                <h3 className="font-semibold text-black">Commission by vendor</h3>
                <p className="mt-1 text-sm text-gray-500">10% of each vendor’s product sales in this range</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Vendor</th>
                      <th className="px-5 py-3 font-medium">Orders</th>
                      <th className="px-5 py-3 font-medium">Sales</th>
                      <th className="px-5 py-3 font-medium">Commission</th>
                      <th className="px-5 py-3 font-medium">Vendor payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sales.vendorCommissions || []).map((row) => (
                      <tr key={row.vendorId} className="border-t">
                        <td className="px-5 py-3 text-black">{row.shopName}</td>
                        <td className="px-5 py-3">{row.orderCount}</td>
                        <td className="px-5 py-3">{money(row.revenue)}</td>
                        <td className="px-5 py-3 font-medium text-black">{money(row.commission)}</td>
                        <td className="px-5 py-3">{money(row.vendorPayout)}</td>
                      </tr>
                    ))}
                    {!(sales.vendorCommissions || []).length && (
                      <tr>
                        <td className="px-5 py-6 text-gray-500" colSpan={5}>No vendor sales in this range.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className={tableWrapperClass}>
              <div className="border-b px-5 py-4">
                <h3 className="font-semibold text-black">Sales by day</h3>
                <p className="mt-1 text-sm text-gray-500">Every day in the selected range</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Orders</th>
                      <th className="px-5 py-3 font-medium">Units</th>
                      <th className="px-5 py-3 font-medium">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sales.dailySales || []).map((row) => (
                      <tr key={row.date} className="border-t">
                        <td className="px-5 py-3 text-black">{row.label || row.date}</td>
                        <td className="px-5 py-3">{row.orderCount}</td>
                        <td className="px-5 py-3">{row.unitsSold}</td>
                        <td className="px-5 py-3 font-medium text-black">{money(row.revenue)}</td>
                      </tr>
                    ))}
                    {!(sales.dailySales || []).length && (
                      <tr>
                        <td className="px-5 py-6 text-gray-500" colSpan={4}>No sales in this range.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={tableWrapperClass}>
              <div className="border-b px-5 py-4">
                <h3 className="font-semibold text-black">Product sales</h3>
                <p className="mt-1 text-sm text-gray-500">Units and revenue per product</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 font-medium">Orders</th>
                      <th className="px-5 py-3 font-medium">Units</th>
                      <th className="px-5 py-3 font-medium">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sales.productSales || []).map((row) => (
                      <tr key={`${row.productId}-${row.productName}`} className="border-t">
                        <td className="px-5 py-3 text-black">{row.productName}</td>
                        <td className="px-5 py-3">{row.orderCount}</td>
                        <td className="px-5 py-3">{row.unitsSold}</td>
                        <td className="px-5 py-3 font-medium text-black">{money(row.revenue)}</td>
                      </tr>
                    ))}
                    {!(sales.productSales || []).length && (
                      <tr>
                        <td className="px-5 py-6 text-gray-500" colSpan={4}>No product sales in this range.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VendorSales
