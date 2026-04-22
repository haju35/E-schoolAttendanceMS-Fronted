import api from './api';

export const studentApi = {
    // Dashboard
    getDashboard: () => api.get('/student/dashboard'),
    
    // Profile
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data: any) => api.put('/student/profile', data),
    changePassword: (data) => api.post('/student/profile/change-password', data),
    
    // Attendance
    getAttendance: (params?: any) => api.get('/student/attendance', { params }),
    getAttendanceSummary: () => api.get('/student/attendance/summary'),
    updatePassword: (data: any) => api.put('/student/password', data),
    uploadPhoto: (formData: FormData) => api.post('/student/photo', formData)
};

export default studentApi;