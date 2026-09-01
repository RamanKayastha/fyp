import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../../context/ShopContext';
import Title from '../../components/Title';
import { assets } from '../../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';
import CartTotal from '../../components/CartTotal';
import { ConfirmModal } from '../../components/admin/AdminUI';
import { lineUnitPrice } from '../../utils/pricing';

const Cart = () => {

  const { products, currency, cartItems, customLines, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const askRemove = (itemId, size, name, lineId = null) => {
    setItemToRemove({ itemId, size, name, lineId });
  };

  const confirmRemove = () => {
    if (!itemToRemove) return;
    updateQuantity(itemToRemove.itemId, itemToRemove.size, 0, itemToRemove.lineId);
    setItemToRemove(null);
  };

  const handleQuantityChange = (itemId, size, rawValue, name, lineId = null) => {
    const nextQuantity = parseInt(rawValue, 10);
    if (Number.isNaN(nextQuantity) || nextQuantity < 1) {
      askRemove(itemId, size, name, lineId);
      return;
    }
    updateQuantity(itemId, size, nextQuantity, lineId);
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1="YOUR" text2="CART" />
      </div>

      {!cartData.length && !(customLines || []).length && (
        <p className='text-sm text-gray-500'>
          Your cart is empty. <Link to="/collections" className='underline text-black'>Browse products</Link>
        </p>
      )}

      <div className='flex flex-col gap-5'>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null;
            return (
              <div key={index} className='py-4  border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-center gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image?.[0]} alt={productData.name} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium' >{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1   bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input className='max-w-10 sm:max-w-15 px-1 sm:px-2 py-1 bg-slate-50' type="number" min="1" value={item.quantity} onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value, productData.name)} />
                <img onClick={() => askRemove(item._id, item.size, productData.name)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt='Remove from cart' />
              </div>
            )
          })
        }
        {(customLines || []).map((line) => {
          const productData = products.find((product) => product._id === String(line.productId));
          if (!productData) return null;
          return (
            <div key={line.lineId} className='py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-center gap-6'>
                <img
                  className='w-16 sm:w-20'
                  src={line.customization?.previewFront || productData.image?.[0]}
                  alt={productData.name}
                />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <p className='mt-1 text-[10px] uppercase tracking-wide text-gray-500'>Customized</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{lineUnitPrice(productData, line.customization)}</p>
                    <p className='px-2 sm:px-3 sm:py-1 bg-slate-50'>{line.size}</p>
                  </div>
                </div>
              </div>
              <input
                className='max-w-10 sm:max-w-15 px-1 sm:px-2 py-1 bg-slate-50'
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => handleQuantityChange(line.productId, line.size, e.target.value, productData.name, line.lineId)}
              />
              <img
                onClick={() => askRemove(line.productId, line.size, productData.name, line.lineId)}
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                src={assets.bin_icon}
                alt='Remove from cart'
              />
            </div>
          )
        })}
      </div>
      
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-112.5'>
          <CartTotal />
          {(cartData.length > 0 || (customLines || []).length > 0) && (
            <div className='w-full text-end'>
              <button onClick={() => navigate('/place-order')} className ='bg-black text-white py-2 px-6 transition cursor-pointer active:bg-gray-700'>PROCEED TO CHECKOUT</button>
            </div>
          )}
        </div>
      </div>

      {itemToRemove && (
        <ConfirmModal
          title="Remove from cart?"
          message={`Remove "${itemToRemove.name}" from your cart?`}
          confirmLabel="Remove"
          onCancel={() => setItemToRemove(null)}
          onConfirm={confirmRemove}
        />
      )}

    </div>
  )
}

export default Cart