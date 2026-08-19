import api from './axios';

export const authApi = {
  register: (data)          => api.post('/auth/register', data),
  login:    (data)          => api.post('/auth/login', data),
  logout:   ()              => api.post('/auth/logout'),
};

export const hostelApi = {
  getAll:   (params)        => api.get('/hostels', { params }),
  getById:  (id)            => api.get(`/hostels/${id}`),
  create:   (data)          => api.post('/hostels', data),
  update:   (id, data)      => api.put(`/hostels/${id}`, data),
  delete:   (id)            => api.delete(`/hostels/${id}`),
};

export const roomApi = {
  getByHostel: (hostelId, params) => api.get(`/rooms/hostel/${hostelId}`, { params }),
  getById:     (id)               => api.get(`/rooms/${id}`),
  create:      (data)             => api.post('/rooms', data),
  update:      (id, data)         => api.put(`/rooms/${id}`, data),
  delete:      (id)               => api.delete(`/rooms/${id}`),
};

export const bookingApi = {
  create:        (data)           => api.post('/bookings', data),
  getMyBookings: (params)         => api.get('/bookings/my', { params }),
  getAll:        (params)         => api.get('/bookings', { params }),
  getById:       (id)             => api.get(`/bookings/${id}`),
  updateStatus:  (id, data)       => api.put(`/bookings/${id}/status`, data),
  cancel:        (id)             => api.put(`/bookings/${id}/cancel`),
  uploadReceipt: (id, formData)   => api.post(`/bookings/${id}/receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const adminApi = {
  getUsers:        (params)       => api.get('/admin/users', { params }),
  toggleUserStatus:(id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  getStats:        ()             => api.get('/admin/stats'),
};
