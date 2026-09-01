import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, customizable, shopName }) => {
    const { currency } = useContext(ShopContext);
    const imageSrc = Array.isArray(image) ? image[0] : image;

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden bg-gray-100 aspect-[3/4]'>
                {imageSrc ? (
                    <img src={imageSrc} alt={name} className='h-full w-full object-cover hover:scale-110 transition ease-in-out' />
                ) : null}
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            {shopName && <p className='text-[10px] uppercase tracking-wide text-gray-400'>{shopName}</p>}
            <p className='font-medium text-xs'>{currency} {price}</p>
            {customizable && (
                <p className='mt-1 text-[10px] uppercase tracking-wide text-gray-400'>Customizable</p>
            )}
        </Link>
    )
}

export default ProductItem
