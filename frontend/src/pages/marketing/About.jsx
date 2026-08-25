import React from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/frontend_assets/assets'
import NewsletterBox from '../../components/NewsletterBox'

const about = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1='ABOUT' text2='US' />
      </div>
      <div className='flex flex-col md:flex-row gap-8 md:gap-16 my-10 items-center md:items-start'>
        <img src={assets.about_img} alt="about_img" className='w-full max-h-72 md:max-h-[400px] md:w-[360px] object-cover shrink-0' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p> Stitch and Story was born out of a passion for fashion and a desire to create a
            unique shopping experience for our customers. Our journey began with a simple idea:
            to offer high-quality, stylish clothing that reflects the unique style of each customer.
            This is why we are committed to providing the best possible service to our customers
            and ensuring that each customer is satisfied with their purchase. We are a team of 
            passionate individuals who are dedicated to providing the best possible service to our customers. </p>
          <p> We are a team of passionate individuals who are dedicated to providing the best
            possible service to our customers. We are a team of passionate individuals
            who are dedicated to providing the best possible service to our customers.
            Since then, we have grown into a trusted destination for fashion-forward shoppers around the world. </p>
          <b className='text-gray-800 text-lg md:text-xl'> Our Mission </b>
          <p> Our mission is to provide the best possible service to our customers.
            We are a team of passionate individuals who are dedicated to providing the best possible service to our customers. </p>
        </div>
      </div>

      <div className='text-xl py-4 '>
        <Title text1='Why ' text2='Choose Us' />
        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className=' border px-6 sm:px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b className='text-lg md:text-xl'>Quality Assurance</b>
            <p> We are a team of passionate individuals who are dedicated to providing the best
              possible service to our customers. </p>
          </div>
          <div className=' border px-6 sm:px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b className='text-lg md:text-xl'>Convenience</b>
            <p>With our user-friendly website, you can shop from the comfort of your home at any time.</p>
          </div>
          <div className=' border px-6 sm:px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b className='text-lg md:text-xl'>Exceptional Customer Service</b>
            <p> Our dedicated support team is always here to help you with any questions or concerns.</p>
          </div>
        </div>
        <NewsletterBox />
      </div>
    </div>
  )
}

export default about