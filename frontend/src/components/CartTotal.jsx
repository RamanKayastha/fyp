import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { isCodMethod } from '../utils/pricing';

const CartTotal = ({ paymentMethod }) => {
    const { currency, delivery_fee, cod_fee, getCartAmount, getCartCount } = useContext(ShopContext);

    if (getCartCount() === 0) {
        return null;
    }

    const subtotal = getCartAmount()
    const cashOnDeliveryFee = isCodMethod(paymentMethod) ? (cod_fee || 0) : 0
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee + cashOnDeliveryFee

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'Cart'} text2={'Total'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex items-center justify-between'>
                    <p>Subtotal</p>
                    <p>{currency}{subtotal}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p>Delivery Fee</p>
                    <p>{currency}{delivery_fee}</p>
                </div>
                {cashOnDeliveryFee > 0 && (
                    <div className='flex items-center justify-between'>
                        <p>Cash on Delivery</p>
                        <p>{currency}{cashOnDeliveryFee}</p>
                    </div>
                )}
                <div className='flex items-center justify-between font-bold'>
                    <p>Total</p>
                    <p>{currency}{total}</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal;
