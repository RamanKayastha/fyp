import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const latestProducts = [...products]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 10);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTION'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 '>
                    Explore our latest arrivals and discover the best of our products. Find the perfect outfit for any occasion.</p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map((item) => (
                    <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} customizable={item.customizable} shopName={item.shopName} />
                ))}
            </div>

            {!latestProducts.length && (
                <p className='text-center text-sm text-gray-500'>No products have been added yet.</p>
            )}
        </div>
    )
}

export default LatestCollection;
