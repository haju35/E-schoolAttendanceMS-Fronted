import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import api from '@/services/api'
import type { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData, User, ApiResponse, LoginResponse } from '@/types'

const user = ref<User | null>(null)          
const token = ref<string | null>(localStorage.getItem('access_token'))    
const loading = ref(false)   
const isClassTeacher = ref<boolean>(localStorage.getItem('is_class_teacher') === 'true')

// Set axios header if token exists
if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const router = useRouter()
  const toast = useToast()

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials) => {         
    loading.value = true 
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
      
      if (response.data.success) {
        const { access_token, user: userData, is_class_teacher: classTeacherStatus, subject_count } = response.data

        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('is_class_teacher')
        localStorage.removeItem('dashboard_type')
        localStorage.removeItem('subject_count')
        
        token.value = access_token
        user.value = userData
        isClassTeacher.value = classTeacherStatus || false
        
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('is_class_teacher', String(classTeacherStatus || false))
        localStorage.setItem('subject_count', String(subject_count || 0))
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        toast.success('Login successful!')
        
        // Check if user has both roles before redirecting
        await checkAndRedirect(userData.role, classTeacherStatus)
        
        return true
      }
      toast.error('Login failed')
      return false
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    } finally {
      loading.value = false
    }
  }

  // NEW: Fetch user function to refresh user data
  const fetchUser = async () => {
    loading.value = true
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        loading.value = false
        return null
      }
      
      const response = await api.get<ApiResponse<User>>('/auth/user')
      
      if (response.data.success && response.data.data) {
        user.value = response.data.data
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data.data))
        console.log('User fetched successfully:', user.value)
        return user.value
      }
      
      return null
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // Try to get from localStorage as fallback
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
          console.log('User loaded from localStorage:', user.value)
          return user.value
        } catch (e) {}
      }
      return null
    } finally {
      loading.value = false
    }
  }

  const checkAndRedirect = async (role: string, isClassTeacherStatus?: boolean) => {
    console.log('=== checkAndRedirect called ===');
    console.log('Role:', role);
    console.log('isClassTeacherStatus:', isClassTeacherStatus);
    
    if (role !== 'teacher') {
      console.log('Non-teacher role, redirecting...');
      const routes: Record<string, string> = {
        admin: '/admin/dashboard',
        student: '/student/dashboard',
        family: '/family/dashboard'
      }
      router.push(routes[role] || '/login')
      return
    }
    
    if (isClassTeacherStatus) {
      const subjectCount = parseInt(localStorage.getItem('subject_count') || '0')
      console.log('Subject count from localStorage:', subjectCount);
      
      if (subjectCount > 0) {
        console.log('Teacher has BOTH roles - redirecting to role selection');
        router.push('/role-selection')
      } else {
        console.log('Teacher is ONLY homeroom teacher - redirecting to homeroom dashboard');
        localStorage.setItem('dashboard_type', 'homeroom')
        router.push('/homeroom/dashboard')
      }
    } else {
      console.log('Teacher is NOT a class teacher - redirecting to subject dashboard');
      localStorage.setItem('dashboard_type', 'subject')
      router.push('/teacher/dashboard')
    }
  }

  const register = async (data: RegisterData) => {
    loading.value = true
    
    try {
      const response = await axios.post<ApiResponse>('/register', data)
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        return true
      }
      
      return false
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }
  
  const forgotPassword = async (data: ForgotPasswordData) => {
    loading.value = true
    
    try {
      const response = await api.post<ApiResponse>('/auth/forgot-password', data)
      
      if (response.data.success) {
        toast.success(response.data.message || 'Password reset link sent!')
        return true
      }
      
      return false
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset link'
      toast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }
  
  const resetPassword = async (data: ResetPasswordData) => {
    loading.value = true
    
    try {
      const response = await api.post<ApiResponse>('/auth/reset-password', data)
      
      if (response.data.success) {
        toast.success('Password reset successful! Please login.')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        return true
      }
      
      return false
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password'
      toast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      isClassTeacher.value = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('is_class_teacher')
      localStorage.removeItem('dashboard_type')
      localStorage.removeItem('subject_count')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }
  
  const getCurrentUser = async () => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/user')
      
      if (response.data.success && response.data.data) {
        user.value = response.data.data
        return user.value
      }
      
      return null
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }
  
  const redirectByRole = (role: string, isClassTeacherStatus?: boolean) => {
    checkAndRedirect(role, isClassTeacherStatus)
  }
  
  // Load user from localStorage on initialization
  const initializeUser = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && !user.value) {
      try {
        user.value = JSON.parse(storedUser)
        console.log('User initialized from localStorage:', user.value)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
  }
  
  // Call initialization
  initializeUser()
  
  return { 
    user, 
    token, 
    loading, 
    isAuthenticated, 
    isClassTeacher,
    login, 
    register,
    forgotPassword,
    resetPassword,
    logout,
    getCurrentUser,
    fetchUser,
    redirectByRole
  }
}