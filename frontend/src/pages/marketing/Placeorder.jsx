import { useContext, useState } from 'react'
import Title from '../../components/Title'
import CartTotal from '../../components/CartTotal'
import { assets } from '../../assets/frontend_assets/assets'
import { ShopContext } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { areasForCity, citiesForRegion, nepalRegions } from '../../data/nepalLocations'

const inputClass = 'border border-gray-300 rounded py-1.5 px-3.5 w-full bg-white'

const Placeorder = () => {
  const [method, setMethod] = useState('cod')
  const [saving, setSaving] = useState(false)
  const { navigate, getCartCount, placeOrder, initiatePayment, customLines } = useContext(ShopContext)
  const { userDTO } = useAuth()

    const [form, setForm] = useState({
    fullName: userDTO?.username || '',
    region: '',
    phone: userDTO?.contact || '',
    city: '',
    area: '',
    landmark: '',
  })

  const cities = citiesForRegion(form.region)
  const areas = areasForCity(form.region, form.city)

  const updateForm = (key, value) => {
    setForm((prev) => {
      if (key === 'region') {
        return { ...prev, region: value, city: '', area: '' }
      }
      if (key === 'city') {
        return { ...prev, city: value, area: '' }
      }
      return { ...prev, [key]: value }
    })
  }

  const handlePlaceOrder = async () => {
    if (getCartCount() === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }

    const required = [
      ['fullName', 'Full name is required'],
      ['region', 'Region is required'],
      ['phone', 'Phone number is required'],
      ['city', 'City is required'],
      ['area', 'Area is required'],
      ['landmark', 'Street address / landmark is required'],
    ]
    const missing = required.find(([key]) => !String(form[key] || '').trim())
    if (missing) {
      toast.error(missing[1])
      return
    }

    if (!/^9\d{9}$/.test(form.phone.trim())) {
      toast.error('Enter a valid 10-digit phone number')
      return
    }

    setSaving(true)
    try {
      const delivery = {
        ...form,
        email: userDTO?.email || '',
      }

      if (method === 'cod') {
        const hasCustomItems = (customLines || []).length > 0
        await placeOrder(delivery, method)
        toast.success('Order placed successfully')
        navigate(hasCustomItems ? '/custom-orders' : '/orders')
        return
      }

      const payment = await initiatePayment(delivery)
      if (!payment?.formUrl || !payment?.formFields) {
        throw new Error('eSewa did not return payment details')
      }
      const esewaForm = document.createElement('form')
      esewaForm.method = 'POST'
      esewaForm.action = payment.formUrl
      Object.entries(payment.formFields).forEach(([name, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value ?? ''
        esewaForm.appendChild(input)
      })
      document.body.appendChild(esewaForm)
      esewaForm.submit()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to place order')
      setSaving(false)
    }
  }

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:w-120'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <input
          className={inputClass}
          type='text'
          placeholder='Full Name'
          value={form.fullName}
          onChange={(e) => updateForm('fullName', e.target.value)}
        />

        <select
          className={inputClass}
          value={form.region}
          onChange={(e) => updateForm('region', e.target.value)}
        >
          <option value=''>Select Region (Province)</option>
          {nepalRegions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <input
          className={inputClass}
          type='text'
          placeholder='Phone Number'
          value={form.phone}
          onChange={(e) => updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          maxLength={10}
        />

        <select
          className={inputClass}
          value={form.city}
          disabled={!form.region}
          onChange={(e) => updateForm('city', e.target.value)}
        >
          <option value=''>{form.region ? 'Select City' : 'Select region first'}</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          className={inputClass}
          value={form.area}
          disabled={!form.city}
          onChange={(e) => updateForm('area', e.target.value)}
        >
          <option value=''>{form.city ? 'Select Area' : 'Select city first'}</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <input
          className={inputClass}
          type='text'
          placeholder='Street address / Landmark'
          value={form.landmark}
          onChange={(e) => updateForm('landmark', e.target.value)}
        />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('esewa')} className='flex items-center gap-3  p-2 px-3 cursor-pointer '>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'esewa' ? 'bg-black' : ''}`}></p>
              <img className='h-7 mx-4' src={assets.esewa_logo} alt="eSewa" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3  p-2 px-3 cursor-pointer '>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-black' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4' >CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button
              type='button'
              disabled={saving}
              onClick={handlePlaceOrder}
              className='bg-black text-white px-16 py-3 cursor-pointer disabled:opacity-60'
            >
              {saving ? (method === 'cod' ? 'Placing...' : 'Redirecting...') : (method === 'cod' ? 'Place Order' : 'Pay with eSewa')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Placeorder
