import axios from 'axios'

const API_BASE_PATH = (import.meta.env.VITE_API_BASE_PATH || '/class-pet-house/api').replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE_PATH,
  timeout: 10000
})

// 请求拦截器 - 自动带 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器
api.interceptors.response.use(
  res => res.data,
  err => {
    const status = err.response?.status
    const data = err.response?.data
    const url = err.config?.url

    // 只有在非登录接口报错 401 时才强制跳回登录页
    if (status === 401 && !url?.includes('/auth/login')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(data || err)
  }
)

export { API_BASE_PATH }
export default api
