import api from './api';

export const teacherApi = {
    // Dashboard
    getDashboard: () => api.get('/teacher/dashboard'),
    
    // Profile
    getProfile: () => api.get('/teacher/profile'),
    updateProfile: (data: any) => api.put('/teacher/profile', data),
    uploadPhoto: (formData: any) => api.post('/teacher/profile/photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    getStudentDetails: (studentId: number) => api.get(`/teacher/students/${studentId}`),
    
    // ADD THIS METHOD
    changePassword: (data: any) => api.post('/teacher/profile/change-password', data),
    
    // Classes
    getClasses: () => api.get('/teacher/classes'),
    getClassStudents: (classId: number, sectionId: number) => 
        api.get(`/teacher/classes/${classId}/students`, { 
            params: { section_id: sectionId } 
        }),
    
    // Attendance
    getAttendanceForm: (classId: number, sectionId: number, date?: string, subjectId: number) => 
        api.get('/teacher/attendance', { 
            params: { 
                class_room_id: classId, 
                section_id: sectionId,
                subject_id: subjectId,
                date: date || new Date().toISOString().split('T')[0]
            } 
        }),
    submitAttendance: (data: any) => api.post('/teacher/attendance', data),
    updateAttendance: (id: number, data: any) => api.put(`/teacher/attendance/${id}`, data),
    deleteAttendance: (id: number) => api.delete(`/teacher/attendance/${id}`),
    
    // Reports
    getAttendanceReport: (params: any) => api.get('/teacher/reports/attendance', { params }),
    
    // Student Details
    getStudentDetails: (studentId: number) => api.get(`/teacher/students/${studentId}`),

    getClassTeacherDashboard: () => api.get('/teacher/class-teacher/dashboard'),

    markClassAttendance: (data: { date: string; attendance: Array<{ student_id: number; status: string; remarks?: string }> }) => api.post('/teacher/attendance/class', data),

    getClassAttendance: (date: string) => api.get(`/teacher/class-attendance?date=${date}`),

    getStudentClassAttendance: (studentId: number) => api.get(`/teacher/class-attendance/student/${studentId}`),

    getClassTeacherClasses: () => api.get('/teacher/class-teacher/classes'),
    
    checkClassTeacherStatus: () => api.get('/teacher/class-teacher/status'),
};

export default teacherApi;