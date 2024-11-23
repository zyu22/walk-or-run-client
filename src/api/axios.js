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
    const token = localStorage.getItem('accessToken') // accessToken으로 수정
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Bearer 추가
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
