import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    const imageSrc = Array.isArray(image) ? image[0] : image;

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                {imageSrc ? (
                    <img src={imageSrc} alt={name} className='hover:scale-110 transition ease-in-out ' />
                ) : (
                    <div className='aspect-square bg-gray-100' />
                )}
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='font-medium text-xs'>{currency} {price}</p>
        </Link>
    )
}

export default ProductItem
