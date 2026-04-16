import api from './api';

export const familyApi = {
    // Dashboard
    getDashboard: () => api.get('/family/dashboard'),
    
    // Children
    getChildren: () => api.get('/family/children'),
    getChildDetails: (childId: number) => api.get(`/family/children/${childId}`),
    getChildAttendance: (childId: number, params?: any) => api.get(`/family/children/${childId}/attendance`, { params }),
    getChildAttendanceSummary: (childId: number) => api.get(`/family/children/${childId}/summary`),
    updateAttendance: (recordId: number, data: any) => api.put(`/family/attendance/${recordId}`, data),
    
    // Notifications
    getNotifications: () => api.get('/family/notifications'),
    markNotificationRead: (id: number) => api.put(`/family/notifications/${id}/read`),
    markAllNotificationsRead: () => api.post('/family/notifications/mark-all-read'),
    
    // Profile
    getProfile: () => api.get('/family/profile'),
    updateProfile: (data: any) => api.put('/family/profile', data),
    changePassword: (data: any) => api.put('/family/change-password', data),
    
    // Leave Requests
    submitLeave: (data: any) => api.post('/family/leave-requests', data),
    getLeaveRequests: (params?: any) => api.get('/family/leave-requests', { params }),
    getLeaveRequest: (id: number) => api.get(`/family/leave-requests/${id}`),
    cancelLeaveRequest: (id: number) => api.delete(`/family/leave-requests/${id}`),
    
    // Generic methods
    get: api.get,
    post: api.post,
    put: api.put,
    delete: api.delete
};

export default familyApi;