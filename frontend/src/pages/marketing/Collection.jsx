import { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/frontend_assets/assets';
import Title from '../../components/Title';
import ProductItem from '../../components/ProductItem';

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  }

  const filterProducts = useMemo(() => {
    let list = products.slice();

    if (search.trim()) {
      list = list.filter(item => item.name?.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      list = list.filter(item => category.includes(item.category));
    }

    if (sortType === "low-high") {
      list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortType === "high-low") {
      list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return list;
  }, [products, search, category, sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img src={assets.dropdown_icon} alt="filter" className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORY</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3 cursor-pointer' type="checkbox" value={'Men'} onChange={toggleCategory} />Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3 cursor-pointer' type="checkbox" value={'Women'} onChange={toggleCategory} />Women
            </p>
          </div>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1="ALL" text2="COLLECTIONS" />

          <select onChange={(e) => setSortType(e.target.value)} className='border border-gray-300 text-sm px-2'>
            <option value="relevent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item) => (
            <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image} customizable={item.customizable} />
          ))}
        </div>

        {!filterProducts.length && (
          <p className='mt-10 text-center text-sm text-gray-500'>No products found.</p>
        )}
      </div>
    </div>
  )
}
export default Collection
