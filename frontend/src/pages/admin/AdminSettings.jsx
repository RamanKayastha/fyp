import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { updateUser } from '../../api/users'
import { AdminCard, Field, PageHeader, StatusBadge, inputClass } from '../../components/admin/AdminUI'

const AdminSettings = () => {
  const { userDTO, token, login, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '',
    contact: '',
    address: '',
  })

  useEffect(() => {
    if (!userDTO) return
    setForm({
      username: userDTO.username || '',
      contact: userDTO.contact || '',
      address: userDTO.address || '',
    })
  }, [userDTO])

  if (!userDTO) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setForm({
      username: userDTO.username || '',
      contact: userDTO.contact || '',
      address: userDTO.address || '',
    })
    setIsEditing(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.username.trim()) {
      toast.error('Username is required')
      return
    }

    setLoading(true)
    try {
      const response = await updateUser(userDTO.id, {
        username: form.username.trim(),
        contact: form.contact.trim() || null,
        address: form.address.trim() || null,
      })
      login(token, response.data)
      toast.success('Profile updated')
      setIsEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (userDTO.username || userDTO.email || '?')
    .trim()
    .charAt(0)
    .toUpperCase()

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Admin Profile"
        description="This is your user account. Update the same profile details customers use in the store."
      />

      <AdminCard className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-black text-2xl font-semibold text-white">
            {initials}
          </span>
          <div>
            <p className="text-lg font-semibold text-black">{userDTO.username}</p>
            <p className="text-sm text-gray-500">{userDTO.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge tone="dark">{userDTO.role || 'ADMIN'}</StatusBadge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 grid gap-4">
          <Field label="Username">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={userDTO.email || ''}
              disabled
              className={`${inputClass} bg-slate-50 text-gray-500`}
            />
          </Field>

          <Field label="Contact">
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              disabled={!isEditing}
              maxLength={10}
              placeholder="Add a contact number"
              className={inputClass}
            />
          </Field>

          <Field label="Address">
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              placeholder="Add an address"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-black px-6 py-3 text-sm text-white disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-full border px-6 py-3 text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-black px-6 py-3 text-sm text-white"
              >
                Edit Profile
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="ml-auto rounded-full border px-6 py-3 text-sm text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  )
}

export default AdminSettings
