import api from './axios'

export const getUsers = () => api.get('/api/users')

export const getUserById = (id) => api.get(`/api/users/${id}`)

export const createUser = (payload) => api.post('/api/users', payload)

export const updateUser = (id, payload) => api.put(`/api/users/${id}`, payload)

export const deleteUser = (id) => api.delete(`/api/users/${id}`)
