import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/frontend_assets/assets';
import RelatedProducts from '../../components/RelatedProducts';


const Product = () => {


  const { productID } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = () => {
    products.map((item) => {
      if (item._id === productID) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productID, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* pd images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row' >
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between  sm:justify-normal sm:w-[19%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} alt={productData.name} key={index} className='w-[24%] sm:w-full sm:mb-3 flex shrink-0 cursor-pointer' />
              ))
            }

          </div>

          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* pd details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items center gap-1 mt-2'>
            <img src={assets.star_icon} className="w-4 h-4" />
            <img src={assets.star_icon} className="w-4 h-4" />
            <img src={assets.star_icon} className="w-4 h-4" />
            <img src={assets.star_icon} className="w-4 h-4" />
            <img src={assets.star_dull_icon} className="w-4 h-4" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-sm text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => {
                return <button onClick={() => setSize(item)} className={`border border-gray-100 py-2 px-4 bg-gray-100 cursor-pointer ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
              })}

            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1 '>
            <p>100% Original Product</p>
            <p>Cash on Delivery Available</p>
            <p>7 Days Replacement Policy</p>
          </div>
        </div>
      </div>

      {/* description */}

      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm text-gray-500'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border border-t-0 px-6 py-6 text-sm text-gray-500'>
          <p>An ecommerce website is an online platform that allows businesses to sell their products or services to customers over the internet. It typically includes a shopping cart, payment processing, and a user-friendly interface for browsing and purchasing products.
          </p>
          <p>Ecommerce websites are designed to be user-friendly and efficient, allowing customers to easily find and purchase products. They often include features such as product categorization, search functionality, and secure payment processing to ensure a smooth shopping experience.</p>
        </div>
      </div>


       {/* related products */}
       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className="opacity-0"></div>
}

export default Product