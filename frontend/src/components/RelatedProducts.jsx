import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Title from './Title';

const RelatedProducts = ({ category, productId }) => {
    const { products } = useContext(ShopContext);
    const related = products
        .filter((item) => item.category === category && item._id !== String(productId))
        .slice(0, 5);

    if (!related.length) return null;

    return (
        <div className='my-24'>
            <div className='text-center py-2 text-3xl'>
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item) => (
                    <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} customizable={item.customizable} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
