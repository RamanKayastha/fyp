import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';


const CartTotal = () => {


    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'Cart'} text2={'Total'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex items-center justify-between'>
                    <p>Subtotal</p>
                    <p>{currency}{getCartAmount()}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p>Delivery Fee</p>
                    <p>{currency}{delivery_fee}</p>
                </div>
                <div className='flex items-center justify-between font-bold'>
                    <p>Total</p>
                    <p>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal;