import api from './axios'

export const initiatePayment = (payload) => api.post('/api/payments/initiate', payload)

export const verifyPayment = (payload) => api.post('/api/payments/verify', payload)
