import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminCard, PageHeader, Pagination, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'
import { getActivityLogs } from '../../api/activityLogs'

const formatAction = (action) =>
  (action || '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatDateTime = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

const actionTone = (action) => {
  if (action === 'CREATE') return 'success'
  if (action === 'DELETE') return 'danger'
  if (action === 'STATUS_CHANGE') return 'warning'
  return 'info'
}

const AdminActivityLog = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [entityType, setEntityType] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    getActivityLogs()
      .then((response) => {
        if (!cancelled) setLogs(response.data || [])
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load activity log')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => entityType === 'All' || log.entityType === entityType)
      .filter((log) => {
        const haystack = `${log.actorName || ''} ${log.actorEmail || ''} ${log.description || ''}`.toLowerCase()
        return haystack.includes(search.toLowerCase())
      })
  }, [entityType, logs, search])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div>
      <PageHeader
        eyebrow="Audit"
        title="Activity Log"
        description="A record of admin actions on products, users, orders, and profile updates."
      />

      <AdminCard className="mb-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={inputClass}
            placeholder="Search actor or activity"
          />
          <select
            value={entityType}
            onChange={(e) => { setEntityType(e.target.value); setPage(1) }}
            className={inputClass}
          >
            <option value="All">All</option>
            <option value="PRODUCT">Products</option>
            <option value="USER">Users</option>
            <option value="ORDER">Orders</option>
            <option value="PROFILE">Profile</option>
          </select>
        </div>
      </AdminCard>

      <div className={tableWrapperClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Admin</th>
                <th className="px-5 py-4">Action</th>
                <th className="px-5 py-4">Target</th>
                <th className="px-5 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500">{formatDateTime(log.createdAt)}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-black">{log.actorName || 'Admin'}</p>
                    <p className="text-xs text-gray-400">{log.actorEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={actionTone(log.action)}>{formatAction(log.action)}</StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge tone="neutral">{formatAction(log.entityType)}</StatusBadge>
                    {log.entityId != null && (
                      <span className="ml-2 text-xs text-gray-400">#{log.entityId}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-700">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !paginatedLogs.length && (
          <div className="px-5 py-16 text-center">
            <p className="text-lg font-medium text-black">No activity yet</p>
            <p className="mt-2 text-sm text-gray-500">Admin product, user, order, and profile changes will appear here.</p>
          </div>
        )}

        {loading && (
          <div className="px-5 py-16 text-center text-sm text-gray-500">Loading activity...</div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        />
      </div>
    </div>
  )
}

export default AdminActivityLog
