// src/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('API 요청 에러:', error)
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 응답 에러:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  },
)

export default api
