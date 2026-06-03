import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/marketing/About'
import Contact from './pages/marketing/Contact'
import Product from './pages/marketing/Product'
import Orders from './pages/marketing/Orders'
import Placeorder from './pages/marketing/Placeorder'
import Login from './pages/marketing/Login'
import Collection from './pages/marketing/Collection'
import Cart from './pages/marketing/Cart'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productID' element={<Product />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/place-order' element={<Placeorder />} />
        <Route path='/login' element={<Login />} />
        <Route path='/collections' element={<Collection />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App