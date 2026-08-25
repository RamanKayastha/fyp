import React from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/frontend_assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1='CONTACT' text2='US' />
      </div>
      <div className='flex flex-col md:flex-row gap-10 my-10 mb-28 justify-center items-center md:items-start'>
        <img src={assets.contact_img} alt="contact_img" className='w-full max-h-72 md:max-h-[400px] md:w-[360px] object-cover shrink-0' />
        <div className='flex flex-col gap-6 justify-center items-start'>
          <p className='text-xl font-bold text-gray-600'>Our Store</p>
          <p className='text-gray-500'>Madhyapur Thimi,<br /> Bhaktapur, Nepal</p>
          <p className='text-gray-500'> Phone: 987654321<br /> Email: info@example.com</p>

          <p className='font-semibold text-xl text-gray-600'>Careers at Stitch and Story</p>
          <p className='text-gray-500'>Learn more about our culture and the opportunities we have to offer.</p>
          <button className='border border-black text-sm md:text-base cursor-pointer hover:bg-black hover:text-white transition-all duration-500 px-6 py-2'>Explore Jobs</button>
          </div>
      </div>
    </div>
  )
}

export default Contact