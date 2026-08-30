import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyPayment } from '../../api/payments'
import { ShopContext } from '../../context/ShopContext'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useContext(ShopContext)
  const [message, setMessage] = useState('Confirming your eSewa payment...')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const data = searchParams.get('data')
    if (!data) {
      toast.error('Missing eSewa payment details')
      navigate('/payment/failure', { replace: true })
      return
    }

    verifyPayment({ data })
      .then((response) => {
        clearCart()
        toast.success('Payment confirmed')
        navigate(response.data?.customized ? '/custom-orders' : '/orders', { replace: true })
      })
      .catch((error) => {
        setMessage('Payment could not be confirmed')
        toast.error(error.response?.data?.message || 'Payment could not be confirmed')
        navigate('/payment/failure', { replace: true })
      })
  }, [searchParams, navigate, clearCart])

  return (
    <div className='min-h-[50vh] flex items-center justify-center text-center px-4'>
      <p className='text-gray-600'>{message}</p>
    </div>
  )
}

export default PaymentSuccess
