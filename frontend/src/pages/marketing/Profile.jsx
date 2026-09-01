import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import Title from '../../components/Title'

const Profile = () => {
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
    if (!userDTO) {
      navigate('/login')
      return
    }

    setForm({
      username: userDTO.username || '',
      contact: userDTO.contact || '',
      address: userDTO.address || '',
    })
  }, [userDTO, navigate])

  if (!userDTO) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
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

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put(`/api/users/${userDTO.id}`, {
        username: form.username,
        contact: form.contact,
        address: form.address,
      })

      login(token, response.data)
      toast.success('Profile updated')
      setIsEditing(false)
    } catch (error) {
      console.log(error)
      toast.error('Failed to update profile')
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
    <div className='border-t pt-14 min-h-[60vh]'>
      <div className='text-2xl mb-8 text-center'>
        <Title text1='MY' text2='PROFILE' />
      </div>

      <div className='flex flex-col gap-8 w-full sm:max-w-2xl m-auto'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center w-16 h-16 rounded-full bg-black text-white text-2xl font-semibold'>
            {initials}
          </div>
          <div>
            <p className='text-lg font-medium text-gray-800'>{userDTO.username}</p>
            <p className='text-sm text-gray-500'>{userDTO.email}</p>
            <div className='flex items-center gap-2 mt-1'>
              {userDTO.role && (
                <span className='text-[10px] uppercase tracking-wide bg-slate-100 text-gray-600 px-2 py-0.5 rounded'>
                  {userDTO.role}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Username</label>
            <input
              type='text'
              name='username'
              value={form.username}
              onChange={handleChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border border-gray-300 rounded outline-none disabled:bg-slate-50 disabled:text-gray-500'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              value={userDTO.email || ''}
              disabled
              className='w-full px-3 py-2 border border-gray-300 rounded outline-none bg-slate-50 text-gray-500'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Contact</label>
            <input
              type='text'
              name='contact'
              value={form.contact}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder='Add a contact number'
              className='w-full px-3 py-2 border border-gray-300 rounded outline-none disabled:bg-slate-50 disabled:text-gray-500'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Address</label>
            <textarea
              name='address'
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              placeholder='Add a delivery address'
              className='w-full px-3 py-2 border border-gray-300 rounded outline-none resize-none disabled:bg-slate-50 disabled:text-gray-500'
            />
          </div>

          <div className='mt-2 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center'>
            {isEditing ? (
              <>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full sm:w-auto bg-black text-white py-2.5 px-6 transition cursor-pointer active:bg-gray-700 disabled:opacity-60'
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={loading}
                  className='w-full sm:w-auto border border-gray-400 text-gray-700 py-2.5 px-6 transition cursor-pointer hover:bg-slate-50'
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className='w-full sm:w-auto bg-black text-white py-2.5 px-6 transition cursor-pointer active:bg-gray-700'
              >
                Edit Profile
              </button>
            )}

            <button
                type='button'
                onClick={() => navigate('/orders')}
                className='w-full sm:w-auto border border-gray-400 text-gray-700 py-2.5 px-6 transition cursor-pointer hover:bg-slate-50'
              >
                My Orders
              </button>
            <button
                type='button'
                onClick={() => navigate('/custom-orders')}
                className='w-full sm:w-auto border border-gray-400 text-gray-700 py-2.5 px-6 transition cursor-pointer hover:bg-slate-50'
              >
                Custom Orders
              </button>
            {userDTO.role === 'VENDOR' && (
              <button
                type='button'
                onClick={() => navigate('/vendor')}
                className='w-full sm:w-auto border border-gray-400 text-gray-700 py-2.5 px-6 transition cursor-pointer hover:bg-slate-50'
              >
                Vendor dashboard
              </button>
            )}
            {userDTO.role === 'USER' && (
              <button
                type='button'
                onClick={() => navigate('/become-vendor')}
                className='w-full sm:w-auto border border-gray-400 text-gray-700 py-2.5 px-6 transition cursor-pointer hover:bg-slate-50'
              >
                Become a vendor
              </button>
            )}
            <button
              type='button'
              onClick={handleLogout}
              className='w-full sm:w-auto sm:ml-auto border border-gray-400 text-gray-700 py-2.5 px-6 transition cursor-pointer hover:bg-slate-50'
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
