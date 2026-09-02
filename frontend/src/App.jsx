import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/marketing/About'
import Contact from './pages/marketing/Contact'
import Product from './pages/marketing/Product'
import Customize from './pages/marketing/Customize'
import Orders from './pages/marketing/Orders'
import CustomOrders from './pages/marketing/CustomOrders'
import Placeorder from './pages/marketing/Placeorder'
import PaymentSuccess from './pages/marketing/PaymentSuccess'
import PaymentFailure from './pages/marketing/PaymentFailure'
import Login from './pages/marketing/Login'
import Register from './pages/marketing/Register'
import VerifyOtp from './pages/marketing/VerifyOtp'
import Collection from './pages/marketing/Collection'
import Cart from './pages/marketing/Cart'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAddItems from './pages/admin/AdminAddItems'
import AdminItemsList from './pages/admin/AdminItemsList'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomOrders from './pages/admin/AdminCustomOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'
import AdminActivityLog from './pages/admin/AdminActivityLog'
import OAuthSuccess from './pages/auth/OAuthSuccess'
import Profile from './pages/marketing/Profile'
import BecomeVendor from './pages/marketing/BecomeVendor'
import ProtectedRoute from './components/ProtectedRoute'
import VendorLayout from './components/vendor/VendorLayout'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorSales from './pages/vendor/VendorSales'
import AdminVendors from './pages/admin/AdminVendors'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isVendorRoute = location.pathname.startsWith('/vendor')
  const isCustomizeRoute = location.pathname.includes('/customize')
  const isStaffRoute = isAdminRoute || isVendorRoute

  return (
    <div className={isStaffRoute || isCustomizeRoute ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
      <ToastContainer />
      {!isStaffRoute && (
        <div className={isCustomizeRoute ? 'border-b border-slate-200 bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : ''}>
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productID' element={<Product />} />
        <Route path='/product/:productID/customize' element={<Customize />} />
        <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='/custom-orders' element={<ProtectedRoute><CustomOrders /></ProtectedRoute>} />
        <Route path='/place-order' element={<ProtectedRoute><Placeorder /></ProtectedRoute>} />
        <Route path='/payment/success' element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path='/payment/failure' element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify' element={<VerifyOtp />} />
        <Route path='/oauth-success' element={<OAuthSuccess />} />
        <Route path='/collections' element={<Collection />} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/become-vendor' element={<ProtectedRoute><BecomeVendor /></ProtectedRoute>} />
        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path='/vendor' element={<ProtectedRoute vendorOnly><VendorLayout /></ProtectedRoute>}>
          <Route index element={<VendorDashboard />} />
          <Route path='sales' element={<VendorSales />} />
          <Route path='add-items' element={<AdminAddItems key="vendor-new" />} />
          <Route path='items' element={<AdminItemsList />} />
          <Route path='items/:id/edit' element={<AdminAddItems />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='custom-orders' element={<AdminCustomOrders />} />
          <Route path='profile' element={<AdminSettings />} />
        </Route>
        <Route path='/admin' element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path='sales' element={<VendorSales />} />
          <Route path='add-items' element={<AdminAddItems key="new" />} />
          <Route path='items' element={<AdminItemsList />} />
          <Route path='items/:id/edit' element={<AdminAddItems />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='custom-orders' element={<AdminCustomOrders />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='vendors' element={<AdminVendors />} />
          <Route path='activity' element={<AdminActivityLog />} />
          <Route path='profile' element={<AdminSettings />} />
          <Route path='settings' element={<AdminSettings />} />
        </Route>
      </Routes>
      {!isStaffRoute && !isCustomizeRoute && <Footer />}
    </div>
  )
}

export default App