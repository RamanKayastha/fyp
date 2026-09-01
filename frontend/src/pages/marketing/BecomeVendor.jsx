import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Title from '../../components/Title'
import { useAuth } from '../../context/AuthContext'
import { applyAsVendor, getMyVendorApplication } from '../../api/vendors'
import { homePathForRole } from '../../utils/roles'

const emptyForm = {
  shopName: '',
  phone: '',
  address: '',
  idDocument: '',
  payoutAccount: '',
  note: '',
}

const BecomeVendor = () => {
  const { userDTO, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [application, setApplication] = useState(undefined)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (userDTO?.role === 'VENDOR' || userDTO?.role === 'ADMIN') {
      navigate(homePathForRole(userDTO.role), { replace: true })
    }
  }, [isAuthenticated, userDTO, navigate])

  useEffect(() => {
    if (!isAuthenticated) return undefined
    let cancelled = false
    getMyVendorApplication()
      .then((response) => {
        if (!cancelled) setApplication(response.data || null)
      })
      .catch(() => {
        if (!cancelled) setApplication(null)
      })
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await applyAsVendor(form)
      setApplication(response.data)
      toast.success('Application submitted. We will review it shortly.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setSaving(false)
    }
  }

  const pending = application?.status === 'PENDING'
  const rejected = application?.status === 'REJECTED'

  return (
    <div className='border-t pt-14 min-h-[60vh]'>
      <div className='text-2xl mb-8 text-center'>
        <Title text1='BECOME A' text2='VENDOR' />
      </div>

      <div className='w-full sm:max-w-2xl m-auto text-sm text-gray-600'>
        <p className='mb-6'>
          Apply to sell on Stitch & Story. An admin reviews your shop details and documents before you can list products.
        </p>

        {application?.status === 'APPROVED' && userDTO?.role !== 'VENDOR' && (
          <div className='mb-6 border border-gray-200 bg-slate-50 p-4'>
            <p className='font-medium text-black'>You're approved</p>
            <p className='mt-2'>Log out and sign in again to open your vendor dashboard.</p>
          </div>
        )}

        {pending && (
          <div className='mb-6 border border-gray-200 bg-slate-50 p-4'>
            <p className='font-medium text-black'>Application pending</p>
            <p className='mt-2'>Shop: {application.shopName}</p>
            <p className='mt-1 text-gray-500'>You'll be able to list products after an admin approves this application.</p>
          </div>
        )}

        {rejected && (
          <div className='mb-6 border border-red-200 bg-red-50 p-4'>
            <p className='font-medium text-red-700'>Application rejected</p>
            {application.adminNote && <p className='mt-2'>{application.adminNote}</p>}
            <p className='mt-2'>You can submit a new application below.</p>
          </div>
        )}

        {!pending && application?.status !== 'APPROVED' && (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input className='border px-3 py-2' placeholder='Shop name' value={form.shopName} onChange={(e) => updateForm('shopName', e.target.value)} required />
            <input className='border px-3 py-2' placeholder='Phone' value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} required />
            <textarea className='border px-3 py-2' rows={3} placeholder='Workshop / pickup address' value={form.address} onChange={(e) => updateForm('address', e.target.value)} required />
            <input className='border px-3 py-2' placeholder='Citizenship / PAN number' value={form.idDocument} onChange={(e) => updateForm('idDocument', e.target.value)} required />
            <input className='border px-3 py-2' placeholder='eSewa or bank payout account' value={form.payoutAccount} onChange={(e) => updateForm('payoutAccount', e.target.value)} required />
            <textarea className='border px-3 py-2' rows={3} placeholder='Anything else we should know (optional)' value={form.note} onChange={(e) => updateForm('note', e.target.value)} />
            <button type='submit' disabled={saving} className='bg-black text-white py-3 disabled:opacity-60'>
              {saving ? 'Submitting...' : 'Submit application'}
            </button>
          </form>
        )}

        <Link to='/profile' className='mt-6 inline-block underline text-black'>Back to profile</Link>
      </div>
    </div>
  )
}

export default BecomeVendor
