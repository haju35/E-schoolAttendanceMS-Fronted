import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import components with correct paths
import Login from '../components/auth/Login.vue'
import Register from '../components/auth/Register.vue'
import ForgotPassword from '../components/auth/ForgotPassword.vue'
import ResetPassword from '../components/auth/ResetPassword.vue'

// Lazy load admin components
const AdminDashboard = () => import('@/components/admin/Dashboard.vue')
const AdminLayout = () => import('@/components/admin/AdminLayout.vue')
const AdminAcademicYears = () => import('@/components/admin/AcademicYears.vue')
const AdminSections = () => import('@/components/admin/Sections.vue')
const AdminSubjects = () => import('@/components/admin/Subjects.vue')
const AdminUsers = () => import('@/components/admin/users.vue')
const AdminFamilies = () => import('@/components/admin/Families.vue')
const AdminStudents = () => import('@/components/admin/Students.vue')
const AdminTeachers = () => import('@/components/admin/Teachers.vue')
const AdminClasses = () => import('@/components/admin/Classes.vue')
const AdminReports = () => import('@/components/admin/Reports.vue')
const TeacherAssignments = () => import('@/components/admin/TeacherAssignments.vue');

// Lazy load teacher components
const TeacherLayout = () => import('@/components/teacher/TeacherLayout.vue')
const TeacherDashboard = () => import('@/components/teacher/Dashboard.vue')
const TeacherAttendance = () => import('@/components/teacher/Attendance.vue')
const TeacherViewAttendance = () => import('@/components/teacher/ViewAttendanceTeacher.vue')
const TeacherClasses = () => import('@/components/teacher/Classes.vue')
const TeacherStudents = () => import('@/components/teacher/Students.vue')
const TeacherReports = () => import('@/components/teacher/Reports.vue')
const TeacherProfile = () => import('@/components/teacher/Profile.vue')

// Lazy load student components
const StudentLayout = () => import('@/components/student/StudentLayout.vue')
const StudentDashboard = () => import('@/components/student/Dashboard.vue')
const StudentAttendance = () => import('@/components/student/Attendance.vue')
const StudentProfile = () => import('@/components/student/Profile.vue')


// Lazy load family components
const FamilyLayout = () => import('@/components/family/FamilyLayout.vue')
const FamilyDashboard = () => import('@/components/family/Dashboard.vue')
const FamilyChildren = () => import('@/components/family/Children.vue')
const FamilyAttendance = () => import('@/components/family/Attendance.vue')
const FamilyNotifications = () => import('@/components/family/Notifications.vue')
const FamilyProfile = () => import('@/components/family/Profile.vue')
const FamilyLeaveRequest = () => import('@/components/family/LeaveRequest.vue')

const routes: RouteRecordRaw[] = [
  // Public routes
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'register', component: Register, meta: { guest: true, adminOnly: true } },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword, meta: { guest: true } },
  { path: '/reset-password/:token', name: 'reset-password', component: ResetPassword, meta: { guest: true } },
  
  // Admin routes (protected)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin.dashboard', component: AdminDashboard, meta: { title: 'Dashboard' } },
      { path: 'users', name: 'admin.users', component: AdminUsers, meta: { title: 'User Management' } },
      { path: 'academic-years', name: 'admin.Academic-years', component: AdminAcademicYears, meta: { title: 'AcademicYears' } },
      { path: 'sections', name: 'admin.sections', component: AdminSections, meta: { title: 'sections' } },
      { path: 'subjects', name: 'admin.subjects', component: AdminSubjects, meta: { title: 'subjects' } },
      { path: 'families', name: 'admin.families', component: AdminFamilies, meta: { title: 'Families' } },
      { path: 'students', name: 'admin.students', component: AdminStudents, meta: { title: 'Students' } },
      { path: 'teachers', name: 'admin.teachers', component: AdminTeachers, meta: { title: 'Teachers' } },
      { path: 'classes', name: 'admin.classes', component: AdminClasses, meta: { title: 'Classes' } },
      { path: 'reports', name: 'admin.reports', component: AdminReports, meta: { title: 'Reports' } },
      {
        path: 'teacher-assignments',
        name: 'admin.teacher-assignments',
        component: TeacherAssignments,
        meta: { title: 'Teacher Assignments' }
      }
    ]
  },
  
  // Teacher routes
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      { path: '', redirect: '/teacher/dashboard' },
      { path: 'dashboard', name: 'teacher.dashboard', component: TeacherDashboard, meta: { title: 'Dashboard' } },
      { path: 'attendance', name: 'teacher.attendance', component: TeacherAttendance, meta: { title: 'Mark Attendance' } },
      { path: 'view-attendance', name: 'teacher.view-attendance', component: TeacherViewAttendance, meta: { title: 'View Attendance' } },
      { path: 'classes', name: 'teacher.classes', component: TeacherClasses, meta: { title: 'My Classes' } },
      { path: 'students/:id?', name: 'teacher.students', component: TeacherStudents, meta: { title: 'My Students' } },
      { path: 'reports', name: 'teacher.reports', component: TeacherReports, meta: { title: 'Reports' } },
      { path: 'profile', name: 'teacher.profile', component: TeacherProfile, meta: { title: 'Profile' } }
    ]
  },
  
  // Student routes
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { path: '', redirect: '/student/dashboard' },
      { path: 'dashboard', name: 'student.dashboard', component: StudentDashboard, meta: { title: 'Dashboard' } },
      { path: 'attendance', name: 'student.attendance', component: StudentAttendance, meta: { title: 'My Attendance' } },
      { path: 'profile', name: 'student.profile', component: StudentProfile, meta: { title: 'Profile' } }
    ]
  },
  
  // Family routes
  {
    path: '/family',
    component: FamilyLayout,
    meta: { requiresAuth: true, role: 'family' },
    children: [
      { path: '', redirect: '/family/dashboard' },
      { path: 'dashboard', name: 'family.dashboard', component: FamilyDashboard, meta: { title: 'Dashboard' } },
      { path: 'children', name: 'family.children', component: FamilyChildren, meta: { title: 'My Children' } },
      { path: 'children/:id', name: 'family.child-details', component: FamilyAttendance, meta: { title: 'Child Attendance' } },
      { path: 'attendance/:id?', name: 'family.attendance', component: FamilyAttendance, meta: { title: 'Attendance History' } },
      { path: 'notifications', name: 'family.notifications', component: FamilyNotifications, meta: { title: 'Notifications' } },
      { path: 'profile', name: 'family.profile', component: FamilyProfile, meta: { title: 'Profile' } },
      { path: 'leave', name: 'family.leave', component: FamilyLeaveRequest, meta: { title: 'Submit Leave' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// FIXED: Navigation guard using the new pattern (return values instead of next())
router.beforeEach((to, from) => {
  const token = localStorage.getItem('access_token')
  const userStr = localStorage.getItem('user')
  
  // Parse user if exists
  let user = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (e) {
      console.error('Failed to parse user data')
    }
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!token || !user) {
      // Redirect to Vue login page (not external URL)
      return '/login'
    }
    
    // Check role-based access
    if (to.meta.role && user.role !== to.meta.role) {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'admin') {
        return '/admin/dashboard'
      } else if (user.role === 'teacher') {
        return '/teacher/dashboard'
      } else if (user.role === 'student') {
        return '/student/dashboard'
      } else if (user.role === 'family') {
        return '/family/dashboard'
      } else {
        return '/login'
      }
    }
    
    // Allow access
    return true
  }
  
  // If route is for guests only (login/register)
  if (to.meta.guest) {
    if (token && user) {
      // User is already logged in, redirect to appropriate dashboard
      if (user.role === 'admin') {
        return '/admin/dashboard'
      } else if (user.role === 'teacher') {
        return '/teacher/dashboard'
      } else if (user.role === 'student') {
        return '/student/dashboard'
      } else if (user.role === 'family') {
        return '/family/dashboard'
      } else {
        return '/login'
      }
    }
    // Allow access to guest pages
    return true
  }
  
  // Allow access by default
  return true
})

export default router