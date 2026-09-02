import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/frontend_assets/assets'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { label: 'Dashboard', path: '/vendor' },
    { label: 'Sales', path: '/vendor/sales' },
    { label: 'Add Items', path: '/vendor/add-items' },
    { label: 'Items List', path: '/vendor/items' },
    { label: 'Orders', path: '/vendor/orders' },
    { label: 'Custom Orders', path: '/vendor/custom-orders' },
    { label: 'Profile', path: '/vendor/profile' },
]

const VendorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const { userDTO, logout } = useAuth()
    const navigate = useNavigate()

    const displayName = userDTO?.shopName || userDTO?.username || 'Vendor'
    const initials = displayName.trim().charAt(0).toUpperCase()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const sidebar = (
        <aside className="h-full w-72 border-r bg-white">
            <div className="flex h-20 items-center justify-between px-6">
                <Link to="/vendor" className="flex items-center gap-3">
                    <img src={assets.logo} alt="Stitch and Story vendor" className="w-36" />
                </Link>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-full border px-3 py-1 text-sm text-gray-500 lg:hidden"
                >
                    Close
                </button>
            </div>

            <nav className="flex flex-col gap-2 px-4 text-sm text-gray-600">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/vendor'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `px-4 py-3 transition-all duration-200 ${isActive
                                ? 'bg-black text-white shadow-sm'
                                : 'hover:bg-gray-100 hover:text-black'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )

    return (
        <div className="min-h-screen bg-[#f7f7f7] text-gray-800">
            <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
                {sidebar}
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <div className="relative h-full max-w-[85vw]">
                        {sidebar}
                    </div>
                </div>
            )}

            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
                    <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-full border px-3 py-2 text-sm lg:hidden"
                            >
                                Menu
                            </button>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Vendor Panel</p>
                                <h1 className="text-xl font-semibold text-black">{displayName}</h1>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileOpen((prev) => !prev)}
                                className="flex items-center gap-3 rounded-full border bg-white py-1 pl-1 pr-3 hover:bg-gray-50"
                            >
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-sm font-medium text-white">{initials}</span>
                                <span className="hidden max-w-32 truncate text-sm font-medium sm:block">{displayName}</span>
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-44 rounded-2xl border bg-white p-2 text-sm shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false)
                                            navigate('/vendor/profile')
                                        }}
                                        className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-100"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="block w-full rounded-xl px-3 py-2 text-left text-red-500 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default VendorLayout
