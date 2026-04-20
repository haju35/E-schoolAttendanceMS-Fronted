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
const AdminUsers = () => import('@/components/admin/Users.vue') 
const AdminFamilies = () => import('@/components/admin/Families.vue')
const AdminStudents = () => import('@/components/admin/Students.vue')
const AdminTeachers = () => import('@/components/admin/Teachers.vue')
const AdminProfiles = () => import('@/components/admin/Profile.vue');
const AdminClasses = () => import('@/components/admin/Classes.vue')
const AdminReports = () => import('@/components/admin/Reports.vue')
const TeacherAssignments = () => import('@/components/admin/TeacherAssignments.vue');
const ClassTeacherAssignment = () => import('@/components/admin/ClassTeacherAssignment.vue')
const RolesPermissions = () => import('@/components/admin/RolesPermissions.vue')

// Lazy load teacher components
const TeacherLayout = () => import('@/components/teacher/TeacherLayout.vue')
const TeacherDashboard = () => import('@/components/teacher/Dashboard.vue')
const TeacherAttendance = () => import('@/components/teacher/Attendance.vue')
const ViewAttendanceSubject = () => import('@/components/teacher/ViewAttendanceSubject.vue')
const TeacherClasses = () => import('@/components/teacher/Classes.vue')
const TeacherStudents = () => import('@/components/teacher/Students.vue')
const TeacherReports = () => import('@/components/teacher/Reports.vue')
const TeacherProfile = () => import('@/components/teacher/Profile.vue')
const HomeroomLayout = () => import('@/components/teacher/HomeroomLayout.vue')
const HomeroomDashboard = () => import('@/components/teacher/HomeroomDashboard.vue')
const HomeroomAttendance = () => import('@/components/teacher/HomeroomAttendance.vue')
const ViewAttendanceTeacher = () => import('@/components/teacher/ViewAttendanceTeacher.vue')

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
      { path: 'users', name: 'admin.Users', component: AdminUsers, meta: { title: 'User Management' } },
      { path: 'academic-years', name: 'admin.Academic-years', component: AdminAcademicYears, meta: { title: 'AcademicYears' } },
      { path: 'sections', name: 'admin.sections', component: AdminSections, meta: { title: 'sections' } },
      { path: 'subjects', name: 'admin.subjects', component: AdminSubjects, meta: { title: 'subjects' } },
      { path: 'families', name: 'admin.families', component: AdminFamilies, meta: { title: 'Families' } },
      { path: 'students', name: 'admin.students', component: AdminStudents, meta: { title: 'Students' } },
      { path: 'teachers', name: 'admin.teachers', component: AdminTeachers, meta: { title: 'Teachers' } },
      { path: 'classes', name: 'admin.classes', component: AdminClasses, meta: { title: 'Classes' } },
      { path: 'reports', name: 'admin.reports', component: AdminReports, meta: { title: 'Reports' } },
      { path: 'profiles', name: 'admin.profile', component: AdminProfiles, meta: { title: 'profile' } },
      {
        path: 'teacher-assignments',
        name: 'admin.teacher-assignments',
        component: TeacherAssignments,
        meta: { title: 'Teacher Assignments' }
      },
      { 
        path: 'roles', 
        name: 'admin.roles', 
        component: RolesPermissions 
      },
      { 
        path: 'class-teachers', 
        name: 'admin.class-teachers', 
        component: ClassTeacherAssignment,
        meta: { title: 'Class Teacher Assignment' }
      }
    ]
  },
  
  // Teacher routes (Regular teacher)
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      { path: '', redirect: '/teacher/dashboard' },
      { path: 'dashboard', name: 'teacher.dashboard', component: TeacherDashboard, meta: { title: 'Dashboard' } },
      { path: 'attendance', name: 'teacher.attendance', component: TeacherAttendance, meta: { title: 'Mark Attendance' } },
      { path: 'view-attendance', name: 'teacher.view-attendance', component: ViewAttendanceSubject, meta: { title: 'View Attendance' } },
      { path: 'classes', name: 'teacher.classes', component: TeacherClasses, meta: { title: 'My Classes' } },
      { path: 'students/:id?', name: 'teacher.students', component: TeacherStudents, meta: { title: 'My Students' } },
      { path: 'reports', name: 'teacher.reports', component: TeacherReports, meta: { title: 'Reports' } },
      { path: 'profile', name: 'teacher.profile', component: TeacherProfile, meta: { title: 'Profile' } },
    ]
  },  
  
  // Homeroom Teacher routes (Class teacher)
// Homeroom Teacher routes (Class teacher)
{
  path: '/homeroom',
  component: HomeroomLayout,
  meta: { requiresAuth: true, role: 'teacher', isHomeroom: true },
  children: [
    { path: '', redirect: '/homeroom/dashboard' },
    { path: 'dashboard', name: 'homeroom.dashboard', component: HomeroomDashboard, meta: { title: 'Homeroom Dashboard' } },
    { path: 'attendance', name: 'homeroom.attendance', component: HomeroomAttendance, meta: { title: 'Mark Attendance' } },
    { path: 'view-attendance', name: 'homeroom.view-attendance', component: ViewAttendanceTeacher, meta: { title: 'View Attendance' } },
    { path: 'students', name: 'homeroom.students', component: () => import('@/components/teacher/HomeroomStudents.vue'), meta: { title: 'My Students' } },
    { path: 'students/:id', name: 'homeroom.student-detail', component: () => import('@/components/teacher/HomeroomStudents.vue'), meta: { title: 'Student Details' } },
    { path: 'reports', name: 'homeroom.reports', component: () => import('@/components/teacher/HomeroomReports.vue'), meta: { title: 'Reports' } },
    { path: 'profile', name: 'homeroom.profile', component: TeacherProfile, meta: { title: 'Profile' } },
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

// Navigation guard
router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  const userStr = localStorage.getItem('user')
  const isClassTeacher = localStorage.getItem('is_class_teacher') === 'true'
  
  // Parse user if exists
  let user = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (e) {
      localStorage.removeItem('user')
      return '/login'
    }
  }

  // Redirect teacher to homeroom if they are a class teacher
  if (to.path === '/teacher/dashboard' && isClassTeacher && token) {
    return '/homeroom/dashboard'
  }

  if (to.path.startsWith('/teacher') && to.path !== '/teacher/login' && isClassTeacher && token) {
    return '/homeroom/dashboard'
  }

  // Redirect homeroom to regular teacher if not class teacher
  if (to.path.startsWith('/homeroom') && token && user && user.role === 'teacher' && !isClassTeacher) {
    return '/teacher/dashboard'
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
  
  // Check role-based access
  if (to.meta.role) {
    if (!user || user.role !== to.meta.role) {
      console.warn('Role mismatch:', user?.role, '-> required:', to.meta.role)
      if (user && user.role) {
        if (user.role === 'teacher' && isClassTeacher) {
          return '/homeroom/dashboard'
        }
        return `/${user.role}/dashboard`
      }
      return '/login'
    }
  }
  
  // If route is for guests only (login/register)
  if (to.meta.guest && token && user) {
    if (user.role === 'teacher' && isClassTeacher) {
      return '/homeroom/dashboard'
    }
    const routes: Record<string, string> = {
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
      family: '/family/dashboard'
    }
    return routes[user.role] || '/login'
  }
  
  return true
})

export default router