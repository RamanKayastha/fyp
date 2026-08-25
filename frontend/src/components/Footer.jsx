import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-8 sm:gap-14 my-10 mt-16 sm:mt-40 text-sm'>
                <div>
                    <img src={assets.logo} alt="logo" className='w-32 mb-5' />
                    <p className='w-full md:w-2/3 text-gray-500'>We are a team of passionate individuals who are dedicated to providing the best possible service to our customers. We are a team of passionate individuals who are dedicated to providing the best possible service to our customers.</p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>Collections</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Quick Links</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>info@example.com</li>
                        <li>987654321</li>
                        <li>Madhyapur Thimi, Bhaktapur, Nepal</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-center text-gray-500 mt-5'>Copyright © 2026 Stitch & Story. All rights reserved.</p>
            </div>

        </div>
    )
}

export default Footer