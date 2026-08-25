import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (e) => {
        e.preventDefault();
    }
    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe to our newsletter </p>
            <p className='text-gray-400 mt-3 text-sm md:text-base'>Get the latest news and updates from our store delivered right to your inbox</p>

            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-stretch gap-0 sm:gap-3 mx-auto my-6 border pl-3 pr-0'>
                <input type="email" placeholder='Enter your email' className='w-full min-w-0 flex-1 self-center outline-none py-3' />
                <button type='submit' className='inline-flex shrink-0 items-center justify-center bg-black text-white text-xs px-4 sm:px-10 m-0 cursor-pointer'>Subscribe</button>
            </form>
        </div>
    )
}

export default NewsletterBox