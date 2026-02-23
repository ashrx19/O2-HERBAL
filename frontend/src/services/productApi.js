import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const getProducts = (params = {}) => API.get('/products', { params })
export const getProductById = (id) => API.get(`/products/${id}`)

export default API
