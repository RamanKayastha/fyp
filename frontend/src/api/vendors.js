import api from './axios'

export const applyAsVendor = (payload) => api.post('/api/vendors/apply', payload)

export const getMyVendorApplication = () => api.get('/api/vendors/me')

export const getVendorApplications = () => api.get('/api/vendors/applications')

export const reviewVendorApplication = (id, payload) =>
  api.put(`/api/vendors/applications/${id}/review`, payload)
