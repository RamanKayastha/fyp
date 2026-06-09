import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {


    const [visible, setVisible] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { search, setSearch, getCartCount } = useContext(ShopContext);

    return (
        <>
            <div className='relative flex items-center justify-between py-5 font-medium'>
                <Link to="/"><img src={assets.logo} alt="logo" className='w-40' /></Link>

                <ul className='hidden sm:flex sm:absolute sm:left-1/2 sm:-translate-x-1/2 gap-5 text-sm text-gray-700'>
                    <NavLink to="/" className='flex flex-col items-center gap-1'>
                        <p>HOME</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                    </NavLink>
                    <NavLink to="/collections" className='flex flex-col items-center gap-1'>
                        <p>COLLECTION</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                    </NavLink>
                    <NavLink to="/about" className='flex flex-col items-center gap-1'>
                        <p>ABOUT</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                    </NavLink>
                    <NavLink to="/contact" className='flex flex-col items-center gap-1'>
                        <p>CONTACT</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                    </NavLink>
                </ul>

                <div className='flex items-center gap-6'>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="hidden sm:flex items-center border border-gray-300 rounded-full px-3 py-1.5"
                    >
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`bg-transparent text-sm outline-none transition-all duration-300 ${isSearchOpen ? "w-60 opacity-100 mr-2" : "w-0 opacity-0 mr-0"
                                }`}
                        />
                        <div className="flex items-center gap-2 text-gray-700">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isSearchOpen && search.trim()) return;
                                    if (isSearchOpen) {
                                        setSearch('');
                                    }
                                    setIsSearchOpen((prev) => !prev);
                                }}
                                aria-label="Toggle search"
                                className="cursor-pointer hover:text-red-600 transition"
                            >
                                <img src={assets.search_icon} alt="search" className='w-4 min-w-4' />
                            </button>
                        </div>
                    </form>

                    <button
                        type="button"
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                        aria-label="Toggle mobile search"
                        className='sm:hidden'
                    >
                        <img src={assets.search_icon} alt="search" className='w-5 cursor-pointer' />
                    </button>

                    <div className='group relative'>
                        <Link to="/login">
                            <img src={assets.profile_icon} alt="profile" className='w-5 cursor-pointer' />
                        </Link>
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black'>My Profile</p>
                                <p className='cursor-pointer hover:text-black'>My Orders</p>
                                <p className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>
                    </div>

                    <Link to="/cart" className='relative'>
                        <img src={assets.cart_icon} alt="cart" className='w-5 min-w-5 cursor-pointer' />
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 text-white bg-black rounded-full text-[10px]'>{getCartCount()}</p>
                    </Link>

                    <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="menu" className='w-5 sm:hidden cursor-pointer' />
                </div>

                {/* mobile menu: dimmed overlay + top sheet */}
                {visible && (
                    <div className="fixed inset-0 z-50 sm:hidden">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setVisible(false)}
                            aria-hidden="true"
                        />
                        <div className="absolute top-0 left-0 right-0 z-10 max-h-[min(85vh,100%)] overflow-y-auto rounded-b-2xl bg-white shadow-xl">
                            <div className="flex flex-col text-gray-600">
                                <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                                    <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
                                    <p>Close</p>
                                </div>
                            </div>
                            <NavLink onClick={() => setVisible(false)} to="/" className="flex flex-col items-center gap-1 p-3 cursor-pointer">
                                <p>HOME</p>
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} to="/collections" className="flex flex-col items-center gap-1 p-3 cursor-pointer">
                                <p>COLLECTION</p>
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} to="/about" className="flex flex-col items-center gap-1 p-3 cursor-pointer">
                                <p>ABOUT</p>
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} to="/contact" className="flex flex-col items-center gap-1 p-3 cursor-pointer">
                                <p>CONTACT</p>
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className={`sm:hidden overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-16 pb-3' : 'max-h-0'}`}
            >
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5">
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent text-sm outline-none flex-1"
                    />
                    <img src={assets.search_icon} alt="search" className='w-4 min-w-4' />
                </div>
            </form>
        </>
    );
};

export default Navbar;