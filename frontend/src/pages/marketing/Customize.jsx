import { useContext, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import ProductCustomizer from '../../customizer/ProductCustomizer'
import { getProductById } from '../../api/products'
import { isCustomizableProduct } from '../../utils/productFlags'

const Customize = () => {
  const { productID } = useParams()
  const [searchParams] = useSearchParams()
  const { products, refreshProducts } = useContext(ShopContext)
  const [size, setSize] = useState(searchParams.get('size') || '')
  const [freshProduct, setFreshProduct] = useState(null)

  const listedProduct = products.find((item) => item._id === String(productID))
  const product = freshProduct || listedProduct

  useEffect(() => {
    refreshProducts?.()
    let cancelled = false
    getProductById(productID)
      .then((response) => {
        if (cancelled || !response.data) return
        const data = response.data
        setFreshProduct({
          ...data,
          _id: String(data.id ?? data._id),
          image: data.images?.length ? data.images : (data.imageUrl ? [data.imageUrl] : data.image || []),
          customizable: isCustomizableProduct(data),
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [productID, refreshProducts])

  if (!products.length && !product) {
    return <div className="py-20 text-center text-sm text-gray-500">Loading product...</div>
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        Product not found. <Link to="/collections" className="underline text-black">Browse products</Link>
      </div>
    )
  }

  if (!isCustomizableProduct(product)) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        This product is not customizable.{' '}
        <Link to={`/product/${product._id}`} className="underline text-black">Back to product</Link>
      </div>
    )
  }

  return <ProductCustomizer key={product._id} product={product} size={size} onSizeChange={setSize} />
}

export default Customize
