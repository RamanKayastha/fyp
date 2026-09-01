import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { homePathForRole } from '../../utils/roles'

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const email = location.state?.email
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true })
    }
  }, [email, navigate])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code sent to your email')
      return
    }

    setVerifying(true)
    try {
      const response = await api.post('/auth/verify', { email, otp })
      const userData = response.data.userDTO
      login(response.data.token, userData)
      navigate(homePathForRole(userData?.role))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email || resending) return

    setResending(true)
    try {
      const response = await api.post('/auth/resend-otp', { email })
      toast.success(typeof response.data === 'string' ? response.data : 'A new code was sent')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not resend the code')
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <form
      onSubmit={handleVerify}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex gap-2 items-center mb-2 mt-10'>
        <p className='prata-regular text-2xl'>Verify OTP</p>
        <hr className='w-8 h-[2px] border-none bg-gray-700' />
      </div>

      <p className='w-full text-center text-sm text-gray-500'>
        Enter the 6-digit code sent to
        <span className='block mt-1 font-medium text-gray-800 break-all'>{email}</span>
      </p>

      <TextField
        fullWidth
        label='Verification code'
        name='otp'
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputProps={{
          maxLength: 6,
          inputMode: 'numeric',
          autoComplete: 'one-time-code',
          style: {
            letterSpacing: '0.35em',
            textAlign: 'center',
            fontWeight: 600,
          },
        }}
      />

      <button
        type='submit'
        disabled={verifying}
        className='w-full bg-black text-white p-2 disabled:opacity-60'
      >
        {verifying ? 'Verifying...' : 'Verify account'}
      </button>

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <button
          type='button'
          onClick={handleResend}
          disabled={resending}
          className='text-gray-500 hover:text-gray-700 disabled:opacity-60'
        >
          {resending ? 'Sending...' : 'Resend code'}
        </button>
        <NavLink to='/register'>
          <p className='cursor-pointer hover:text-gray-700'>Back to register</p>
        </NavLink>
      </div>
    </form>
  )
}

export default VerifyOtp
