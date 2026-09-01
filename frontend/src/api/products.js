import api from './axios'

export const getProducts = () => api.get('/api/products')

export const getMyProducts = () => api.get('/api/products/mine')

export const getProductById = (id) => api.get(`/api/products/${id}`)

export const createProduct = (payload) => api.post('/api/products', payload)

export const updateProduct = (id, payload) => api.put(`/api/products/${id}`, payload)

export const deleteProduct = (id) => api.delete(`/api/products/${id}`)
