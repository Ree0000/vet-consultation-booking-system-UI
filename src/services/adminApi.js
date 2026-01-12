import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//
// // Create axios instance
// const adminApi = axios.create({
//   baseURL: `${API_URL}/admin`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const API_URL = '/api';

// Create axios instance
const adminApi = axios.create({
  // baseURL: API_URL,
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin Appointments API
export const adminAppointmentsAPI = {
  getAll: (params) => adminApi.get('/appointments', { params }),
  getStats: () => adminApi.get('/appointments/stats'),
  updateStatus: (id, status) => adminApi.put(`/appointments/${id}/status`, { status }),
};

// Admin Veterinarians API
export const adminVeterinariansAPI = {
  getAll: () => adminApi.get('/veterinarians'),
  create: (data) => adminApi.post('/veterinarians', data),
  update: (id, data) => adminApi.put(`/veterinarians/${id}`, data),
  toggleAvailability: (id) => adminApi.patch(`/veterinarians/${id}/availability`),
  delete: (id) => adminApi.delete(`/veterinarians/${id}`),
};

// Admin Users API
export const adminUsersAPI = {
  getAll: (params) => adminApi.get('/users', { params }),
  getOne: (id) => adminApi.get(`/users/${id}`),
  update: (id, data) => adminApi.put(`/users/${id}`, data),
  resetPassword: (id) => adminApi.post(`/users/${id}/reset-password`),
};

export default adminApi;
