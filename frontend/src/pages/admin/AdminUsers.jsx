import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { AdminCard, ConfirmModal, Field, PageHeader, Pagination, StatusBadge, inputClass, tableWrapperClass } from '../../components/admin/AdminUI'
import { createUser, deleteUser, getUsers, updateUser } from '../../api/users'

const emptyForm = {
  username: '',
  email: '',
  password: '',
  contact: '',
  address: '',
  role: 'USER',
}

const formatRole = (role) => {
  if (role === 'ADMIN') return 'Admin'
  if (role === 'VENDOR') return 'Vendor'
  return 'User'
}
const formatProvider = (provider) => (provider === 'GOOGLE' ? 'Google' : 'Local')

const AdminUsers = () => {
  const { userDTO } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    let cancelled = false

    getUsers()
      .then((response) => {
        if (!cancelled) setUsers(response.data || [])
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load users')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const reloadUsers = async () => {
    const response = await getUsers()
    setUsers(response.data || [])
  }

  const filteredUsers = useMemo(() => {
    const list = users
      .filter((user) => `${user.username || ''} ${user.email || ''}`.toLowerCase().includes(search.toLowerCase()))
      .filter((user) => role === 'All' || user.role === role)

    return [...list].sort((a, b) => b.id - a.id)
  }, [role, search, users])

  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openCreate = () => {
    setForm(emptyForm)
    setErrors({})
    setModal('create')
  }

  const openView = (user) => {
    setForm({
      username: user.username || '',
      email: user.email || '',
      password: '',
      contact: user.contact || '',
      address: user.address || '',
      role: user.role || 'USER',
      authProvider: user.authProvider,
      id: user.id,
    })
    setErrors({})
    setModal('view')
  }

  const openEdit = (user) => {
    setForm({
      username: user.username || '',
      email: user.email || '',
      password: '',
      contact: user.contact || '',
      address: user.address || '',
      role: user.role || 'USER',
      id: user.id,
    })
    setErrors({})
    setModal('edit')
  }

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.username.trim()) nextErrors.username = 'Username is required'
    if (modal === 'create' && !form.email.trim()) nextErrors.email = 'Email is required'
    if (modal === 'create' && !form.password.trim()) nextErrors.password = 'Password is required'
    if (form.contact && form.contact.length > 10) nextErrors.contact = 'Contact can be at most 10 characters'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (modal === 'view') return
    if (!validate()) return

    setSaving(true)
    try {
      if (modal === 'create') {
        await createUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          contact: form.contact.trim() || null,
          address: form.address.trim() || null,
          role: form.role,
        })
        toast.success('User created')
      } else {
        await updateUser(form.id, {
          username: form.username.trim(),
          contact: form.contact.trim() || null,
          address: form.address.trim() || null,
          role: form.role,
        })
        toast.success('User updated')
      }

      setModal(null)
      await reloadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    setRemoving(true)
    try {
      await deleteUser(userToDelete.id)
      toast.success('User deleted')
      setUserToDelete(null)
      await reloadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    } finally {
      setRemoving(false)
    }
  }

  const isView = modal === 'view'
  const isCreate = modal === 'create'

  return (
    <div>
      <PageHeader
        eyebrow="Customers"
        title="Users Management"
        description="View, create, update, and remove customer and admin accounts."
        action={
          <button type="button" onClick={openCreate} className=" bg-black px-5 py-3 text-sm text-white">
            Add User
          </button>
        }
      />

      <AdminCard className="mb-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={inputClass}
            placeholder="Search users"
          />
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1) }}
            className={inputClass}
          >
            <option value="All">All</option>
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </AdminCard>

      <div className={tableWrapperClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4">Profile</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-black text-sm font-medium text-white">
                        {(user.username || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-black">{user.username || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={user.role === 'ADMIN' ? 'dark' : 'neutral'}>{formatRole(user.role)}</StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={user.authProvider === 'GOOGLE' ? 'info' : 'neutral'}>
                      {formatProvider(user.authProvider)}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">{user.contact || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openView(user)} className="rounded-full border px-4 py-2 hover:bg-gray-100">View</button>
                      <button type="button" onClick={() => openEdit(user)} className="rounded-full border px-4 py-2 hover:bg-gray-100">Edit</button>
                      <button
                        type="button"
                        disabled={user.id === userDTO?.id}
                        onClick={() => setUserToDelete(user)}
                        className="rounded-full border px-4 py-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !paginatedUsers.length && (
          <div className="px-5 py-16 text-center">
            <p className="text-lg font-medium text-black">No users found</p>
            <p className="mt-2 text-sm text-gray-500">Try adjusting the search or role filter.</p>
          </div>
        )}

        {loading && (
          <div className="px-5 py-16 text-center text-sm text-gray-500">Loading users...</div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-black">
              {isCreate ? 'Add User' : isView ? 'User Details' : 'Edit User'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {isCreate ? 'Create a local account with a role.' : isView ? 'Account details from the database.' : 'Update profile details and role.'}
            </p>

            <div className="mt-5 grid gap-4">
              <Field label="Username" error={errors.username}>
                <input
                  value={form.username}
                  onChange={(e) => updateForm('username', e.target.value)}
                  disabled={isView}
                  className={inputClass}
                  placeholder="Username"
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  disabled={!isCreate}
                  type="email"
                  className={inputClass}
                  placeholder="email@example.com"
                />
              </Field>

              {isCreate && (
                <Field label="Password" error={errors.password}>
                  <input
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    type="password"
                    className={inputClass}
                    placeholder="Temporary password"
                  />
                </Field>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact" error={errors.contact}>
                  <input
                    value={form.contact}
                    onChange={(e) => updateForm('contact', e.target.value)}
                    disabled={isView}
                    className={inputClass}
                    placeholder="98xxxxxxxx"
                    maxLength={10}
                  />
                </Field>
                <Field label="Role">
                  <select
                    value={form.role}
                    onChange={(e) => updateForm('role', e.target.value)}
                    disabled={isView || form.id === userDTO?.id}
                    className={inputClass}
                  >
                    <option value="USER">User</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </Field>
              </div>

              <Field label="Address">
                <textarea
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  disabled={isView}
                  className={`${inputClass} min-h-24 resize-none`}
                  placeholder="Delivery address"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)} className="rounded-full border px-5 py-2 text-sm">
                {isView ? 'Close' : 'Cancel'}
              </button>
              {!isView && (
                <button type="submit" disabled={saving} className="rounded-full bg-black px-5 py-2 text-sm text-white disabled:opacity-60">
                  {saving ? 'Saving...' : isCreate ? 'Create User' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {userToDelete && (
        <ConfirmModal
          title="Delete user?"
          message={`This will permanently remove "${userToDelete.username || userToDelete.email}" from the store.`}
          confirmLabel={removing ? 'Deleting...' : 'Delete'}
          onCancel={() => !removing && setUserToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export default AdminUsers
