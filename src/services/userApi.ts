import api from './api';

export const userApi = {
    // Get all users with filters and pagination
    getUsers: (params?: any) => api.get('/admin/users', { params }),
    
    // Get single user
    getUser: (id: number) => api.get(`/admin/users/${id}`),
    
    // Create new user
    createUser: (data: any) => api.post('/admin/users', data),
    
    // Update user
    updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),

    // Get all roles
    getRoles: () => api.get('/admin/roles'),
    
    // Delete user
    deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
    
    // Toggle user status (active/inactive)
    toggleUserStatus: (id: number) => api.post(`/admin/users/${id}/toggle-status`)
};

export default userApi;