import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, StatusBadge, inputClass } from '../../components/admin/AdminUI'
import { getVendorApplications, reviewVendorApplication } from '../../api/vendors'

const formatStatus = (status) =>
  (status || '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const AdminVendors = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState({})
  const [savingId, setSavingId] = useState(null)

  const load = () =>
    getVendorApplications()
      .then((response) => setApplications(response.data || []))
      .catch(() => toast.error('Failed to load vendor applications'))

  useEffect(() => {
    let cancelled = false
    load()
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const review = async (id, status) => {
    setSavingId(id)
    try {
      const response = await reviewVendorApplication(id, {
        status,
        adminNote: note[id] || '',
      })
      setApplications((prev) => prev.map((item) => (item.id === id ? response.data : item)))
      toast.success(status === 'APPROVED' ? 'Vendor approved' : 'Application rejected')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to review application')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Sellers"
        title="Vendor Applications"
        description="Review shop details and documents. Approved sellers can list products and fulfill their own orders."
      />

      {loading && <p className="text-sm text-gray-500">Loading applications...</p>}
      {!loading && !applications.length && (
        <p className="text-sm text-gray-500">No vendor applications yet.</p>
      )}

      <div className="space-y-4">
        {applications.map((item) => (
          <AdminCard key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-black">{item.shopName}</p>
                <p className="mt-1 text-sm text-gray-500">{item.username} · {item.email}</p>
              </div>
              <StatusBadge tone={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'warning'}>
                {formatStatus(item.status)}
              </StatusBadge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-gray-600">
              <p>Phone: {item.phone}</p>
              <p>Address: {item.address}</p>
              <p>ID / PAN: {item.idDocument}</p>
              <p>Payout: {item.payoutAccount}</p>
              {item.note && <p>Note: {item.note}</p>}
              {item.adminNote && <p>Admin note: {item.adminNote}</p>}
            </div>
            {item.status === 'PENDING' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <input
                  className={inputClass}
                  placeholder="Note to the applicant (optional)"
                  value={note[item.id] || ''}
                  onChange={(e) => setNote((prev) => ({ ...prev, [item.id]: e.target.value }))}
                />
                <button
                  type="button"
                  disabled={savingId === item.id}
                  onClick={() => review(item.id, 'REJECTED')}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={savingId === item.id}
                  onClick={() => review(item.id, 'APPROVED')}
                  className="rounded-md bg-black px-4 py-2 text-sm text-white"
                >
                  Approve
                </button>
              </div>
            )}
          </AdminCard>
        ))}
      </div>
    </div>
  )
}

export default AdminVendors
