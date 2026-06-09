import React, { useMemo, useState } from 'react'
import { ConfirmModal, PageHeader, Pagination, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'

const users = [
    { name: 'Aayush Sharma', email: 'aayush@example.com', role: 'Admin', status: 'Active', registered: '2026-02-18', lastLogin: 'Today' },
    { name: 'Nisha Rai', email: 'nisha@example.com', role: 'Manager', status: 'Active', registered: '2026-03-12', lastLogin: 'Yesterday' },
    { name: 'Suman Thapa', email: 'suman@example.com', role: 'Customer', status: 'Active', registered: '2026-04-02', lastLogin: 'Jun 8, 2026' },
    { name: 'Pratik Adhikari', email: 'pratik@example.com', role: 'Customer', status: 'Disabled', registered: '2026-04-20', lastLogin: 'May 30, 2026' },
    { name: 'Maya Gurung', email: 'maya@example.com', role: 'Customer', status: 'Active', registered: '2026-05-11', lastLogin: 'Jun 7, 2026' },
    { name: 'Rohit Karki', email: 'rohit@example.com', role: 'Manager', status: 'Active', registered: '2026-05-21', lastLogin: 'Jun 5, 2026' },
]

const AdminUsers = () => {
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('All')
    const [page, setPage] = useState(1)
    const [confirmUser, setConfirmUser] = useState(null)

    const filteredUsers = useMemo(() => users
        .filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()))
        .filter((user) => role === 'All' || user.role === role), [role, search])

    const pageSize = 5
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
    const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

    return (
        <div>
            <PageHeader
                eyebrow="Customers"
                title="Users Management"
                description="Manage admin, manager, and customer accounts with careful controls for status and access."
            />

            <div className="mb-5 grid gap-3 rounded-3xl border bg-white p-5 shadow-sm md:grid-cols-[1fr_180px]">
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className={inputClass} placeholder="Search users" />
                <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }} className={inputClass}>
                    {['All', 'Admin', 'Manager', 'Customer'].map((item) => <option key={item}>{item}</option>)}
                </select>
            </div>

            <div className={tableWrapperClass}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-5 py-4">Profile</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Role</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Registration Date</th>
                                <th className="px-5 py-4">Last Login</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedUsers.map((user) => (
                                <tr key={user.email} className="hover:bg-gray-50">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-11 w-11 place-items-center rounded-full bg-black text-sm font-medium text-white">{user.name.charAt(0)}</span>
                                            <span className="font-medium text-black">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">{user.email}</td>
                                    <td className="px-5 py-4">
                                        <StatusBadge tone={user.role === 'Admin' ? 'dark' : user.role === 'Manager' ? 'info' : 'neutral'}>{user.role}</StatusBadge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge tone={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</StatusBadge>
                                    </td>
                                    <td className="px-5 py-4">{user.registered}</td>
                                    <td className="px-5 py-4">{user.lastLogin}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button type="button" className="rounded-full border px-4 py-2 hover:bg-gray-100">View</button>
                                            <button type="button" className="rounded-full border px-4 py-2 hover:bg-gray-100">Edit</button>
                                            <button type="button" onClick={() => setConfirmUser({ user, action: 'disable' })} className="rounded-full border px-4 py-2 hover:bg-gray-100">Disable</button>
                                            <button type="button" onClick={() => setConfirmUser({ user, action: 'delete' })} className="rounded-full border px-4 py-2 text-red-500 hover:bg-red-50">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!paginatedUsers.length && (
                    <div className="px-5 py-16 text-center">
                        <p className="text-lg font-medium text-black">No users found</p>
                        <p className="mt-2 text-sm text-gray-500">Try adjusting the search or role filter.</p>
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
                    onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                />
            </div>

            {confirmUser && (
                <ConfirmModal
                    title={`${confirmUser.action === 'delete' ? 'Delete' : 'Disable'} user?`}
                    message={`Please confirm you want to ${confirmUser.action} ${confirmUser.user.name}.`}
                    confirmLabel={confirmUser.action === 'delete' ? 'Delete' : 'Disable'}
                    onCancel={() => setConfirmUser(null)}
                    onConfirm={() => setConfirmUser(null)}
                />
            )}
        </div>
    )
}

export default AdminUsers
