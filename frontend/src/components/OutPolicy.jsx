import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OutPolicy = () => {
  return (
    <div>
        <div className='flex flex-col sm:flex-row justify-around gap-8 sm:gap-2 text-center py-10 sm:py-20 text-xs sm:text-sm md:text-base text-gray-600 '>
            <div>
                <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="out_policy" />
                <p className='font-semibold'> EASY RETURN POLICY</p>
                <p className='text-gray-500'>Return within 30 days for a full refund</p>
            </div>
            <div>
                <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="out_policy" />
                <p className='font-semibold'> QUALITY GUARANTEED</p>
                <p className='text-gray-500'>We ensure the best quality of the products</p>
            </div>
            <div>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt="out_policy" />
                <p className='font-semibold'> 24/7 CUSTOMER SUPPORT</p>
                <p className='text-gray-500'>We are here to help you 24/7</p>
            </div>
        </div>
    </div>
  )
}

export default OutPolicy