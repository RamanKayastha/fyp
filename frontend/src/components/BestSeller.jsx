import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const bestSeller = [...products]
        .filter((item) => (item.stock ?? 0) > 0)
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 5);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 '>
                    Explore our best sellers and discover the best of our products. Find the perfect outfit for any occasion.</p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSeller.map((item) => (
                    <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} customizable={item.customizable} shopName={item.shopName} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller
