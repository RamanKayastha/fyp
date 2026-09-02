import api from './axios'

export const applyAsVendor = (payload) => {
  const data = new FormData()
  data.append('shopName', payload.shopName)
  data.append('phone', payload.phone)
  data.append('address', payload.address)
  data.append('idDocument', payload.idDocument)
  data.append('payoutAccount', payload.payoutAccount)
  data.append('note', payload.note || '')
  data.append('proof', payload.proof)
  return api.post('/api/vendors/apply', data)
}

export const getMyVendorApplication = () => api.get('/api/vendors/me')

export const getVendorApplications = () => api.get('/api/vendors/applications')

export const reviewVendorApplication = (id, payload) =>
  api.put(`/api/vendors/applications/${id}/review`, payload)

export const getVendorApplicationDocument = (id) =>
  api.get(`/api/vendors/applications/${id}/document`, { responseType: 'blob' })
