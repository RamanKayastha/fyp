import { Link } from 'react-router-dom'
import Title from '../../components/Title'

const PaymentFailure = () => {
  return (
    <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4 gap-4'>
      <Title text1={'PAYMENT'} text2={'FAILED'} />
      <p className='text-gray-600 max-w-md'>
        The eSewa payment was cancelled or could not be confirmed. Your cart is still saved, so you can try again.
      </p>
      <div className='flex flex-col sm:flex-row gap-3'>
        <Link to='/place-order' className='bg-black text-white px-8 py-3'>
          Try again
        </Link>
        <Link to='/cart' className='border border-gray-300 px-8 py-3'>
          Back to cart
        </Link>
      </div>
    </div>
  )
}

export default PaymentFailure
