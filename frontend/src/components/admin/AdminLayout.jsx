import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { assets } from '../../assets/frontend_assets/assets'

const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Add Items', path: '/admin/add-items' },
    { label: 'Items List', path: '/admin/items' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Settings', path: '/admin/settings' },
]

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const sidebar = (
        <aside className="h-full w-72 border-r bg-white">
            <div className="flex h-20 items-center justify-between px-6">
                <NavLink to="/admin" className="flex items-center gap-3">
                    <img src={assets.logo} alt="Forever admin" className="w-36" />
                </NavLink>
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
                        end={item.path === '/admin'}
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

            <div className="mx-4 mt-8 rounded-3xl bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-medium text-black">Premium Store Admin</p>
                <p className="mt-2 text-xs leading-5">Manage products, orders, and customers from one clean dashboard.</p>
            </div>
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
                                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Admin Panel</p>
                                <h1 className="text-xl font-semibold text-black">Store Management</h1>
                            </div>
                        </div>

                     <div className="flex items-center gap-3">

                            {/* <button type="button" className="relative rounded-full border bg-white px-3 py-2 text-sm hover:bg-gray-50">
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-black" />
                                Alerts
                            </button> */}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen((prev) => !prev)}
                                    className="flex items-center gap-3 rounded-full border bg-white py-1 pl-1 pr-3 hover:bg-gray-50"
                                >
                                    <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-sm font-medium text-white">A</span>
                                    <span className="hidden text-sm font-medium sm:block">Admin</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-44 rounded-2xl border bg-white p-2 text-sm shadow-lg">
                                        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-100">Profile</button>
                                        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-100">Account</button>
                                        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-red-500 hover:bg-red-50">Logout</button>
                                    </div>
                                )}
                            </div>
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

export default AdminLayout
