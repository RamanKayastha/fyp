import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import RelatedProducts from '../../components/RelatedProducts';
import { getProductById } from '../../api/products';
import { isCustomizableProduct } from '../../utils/productFlags';

const mapProduct = (product) => {
  if (!product) return null
  const images = product.images?.length
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : product.image || [])
  return {
    ...product,
    _id: String(product.id ?? product._id),
    image: images,
    customizable: isCustomizableProduct(product),
  }
}

const Product = () => {
  const { productID } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, refreshProducts } = useContext(ShopContext);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState('');
  const [freshProduct, setFreshProduct] = useState(null);

  const listedProduct = products.find((item) => item._id === String(productID));
  const productData = freshProduct || listedProduct;
  const images = productData?.image || [];
  const displayImage = images[Math.min(imageIndex, Math.max(images.length - 1, 0))] || '';
  const canCustomize = isCustomizableProduct(productData);

  useEffect(() => {
    refreshProducts?.()
    let cancelled = false
    getProductById(productID)
      .then((response) => {
        if (!cancelled) setFreshProduct(mapProduct(response.data))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [productID, refreshProducts])

  if (!productData) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        {products.length ? 'Product not found.' : 'Loading product...'}
      </div>
    )
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row' >
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between  sm:justify-normal sm:w-[19%] w-full'>
            {images.map((item, index) => (
              <img onClick={() => setImageIndex(index)} src={item} alt={productData.name} key={index} className='w-[24%] sm:w-full sm:mb-3 flex shrink-0 cursor-pointer' />
            ))}
          </div>

          <div className='w-full sm:w-[80%]'>
            {displayImage ? (
              <img className='w-full h-auto' src={displayImage} alt={productData.name} />
            ) : (
              <div className='aspect-square bg-gray-100' />
            )}
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-sm text-gray-500 md:w-4/5'>{productData.description}</p>
          {canCustomize && (
            <p className='mt-3 inline-block border border-black px-3 py-1 text-xs uppercase tracking-wide'>Customizable</p>
          )}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {(productData.sizes || []).map((item, index) => (
                <button onClick={() => setSize(item)} className={`border border-gray-100 py-2 px-4 bg-gray-100 cursor-pointer ${item === size ? 'bg-gray-400 text-white ' : ''}`} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <button
              onClick={() => addToCart(productData._id, size)}
              disabled={(productData.stock ?? 0) <= 0}
              className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer disabled:opacity-50'
            >
              {(productData.stock ?? 0) <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            {canCustomize && (
              <button
                type='button'
                onClick={() => navigate(`/product/${productData._id}/customize${size ? `?size=${size}` : ''}`)}
                disabled={(productData.stock ?? 0) <= 0}
                className='border border-black px-8 py-3 text-sm cursor-pointer hover:bg-gray-50 disabled:opacity-50'>
                CUSTOMIZE
              </button>
            )}
          </div>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1 '>
            <p>100% Original Product</p>
            <p>Cash on Delivery Available</p>
            <p>7 Days Replacement Policy</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
        </div>
        <div className='flex flex-col gap-4 border border-t-0 px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
      </div>

      <RelatedProducts category={productData.category} productId={productData._id} />
    </div>
  )
}

export default Product
