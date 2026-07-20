import axios from 'axios';

// Automatically detect if we are running in local development.
// Vite sets import.meta.env.DEV for us, so this works no matter which
// port the dev server actually ends up on (5173, 5174, ...).
const isDevelopment = import.meta.env.DEV;

// Use localhost for dev, but use the relative '/api' path for production
const BASE_URL = isDevelopment ? 'http://localhost:8080/api' : '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request Interceptor: Attach the token automatically to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, log out the user
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;