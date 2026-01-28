import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred'
    const detail = error.response?.data?.detail

    if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail) && detail.length > 0) {
      // Handle FastAPI validation errors (array of {loc, msg, type})
      message = detail.map(err => err.msg || err.message).join(', ')
    } else if (error.message) {
      message = error.message
    }

    return Promise.reject({ message, status: error.response?.status })
  }
)

export default api
