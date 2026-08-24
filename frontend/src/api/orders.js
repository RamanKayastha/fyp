import api from './axios'

export const createOrder = (payload) => api.post('/api/orders', payload)

export const getMyOrders = () => api.get('/api/orders')

export const getAllOrders = () => api.get('/api/orders/all')

export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, { status })
