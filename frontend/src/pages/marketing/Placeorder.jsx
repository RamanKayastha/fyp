import React from 'react'
import Title from '../../components/Title'
import CartTotal from '../../components/CartTotal'
import { assets } from '../../assets/frontend_assets/assets'
import { useState } from 'react'

const Placeorder = () => {

  const [method, setMethod] = useState('cod');

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:w-120'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex  gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='First Name' />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Last Name' />
        </div>

        <input
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='email'
          placeholder='Email' />
        <input
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='text'
          placeholder='Address' />
        <div className='flex  gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='City' />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='State' />
        </div>
        <div className='flex  gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='ZIP Code' />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Country' />
        </div>
        <input
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='text'
          placeholder='Phone Number' />
      </div>

      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* payment method  */}
          <div onClick={() => setMethod('khalti')} className='flex gap-3 flex-col lg:flex-row'>
            <div className='flex items-center gap-3  p-2 px-3 cursor-pointer '>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'khalti' ? 'bg-black' : ''}`}></p>
              <img className='h-7 mx-4' src={assets.khalti_logo} alt="" />
            </div>
            <div onClick={() => setMethod('esewa')} className='flex items-center gap-3  p-2 px-3 cursor-pointer '>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'esewa' ? 'bg-black' : ''}`}></p>
              <img className='h-7 mx-4' src={assets.esewa_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3  p-2 px-3 cursor-pointer '>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-black' : ''}`}></p>
              <p className = 'text-gray-500 text-sm font-medium mx-4' >CASH ON DELIVERY</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Placeorder