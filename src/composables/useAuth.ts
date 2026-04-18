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
        const { access_token, user: userData, is_class_teacher: classTeacherStatus } = response.data

        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('is_class_teacher')
        
        token.value = access_token
        user.value = userData
        isClassTeacher.value = classTeacherStatus || false
        
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('is_class_teacher', String(classTeacherStatus || false))
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        toast.success('Login successful!')
        
        // Redirect based on role and class teacher status
        redirectByRole(userData.role, classTeacherStatus)
        
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
      const response = await axios.post<ApiResponse>('/auth/forgot-password', data)
      
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
      const response = await axios.post<ApiResponse>('/auth/reset-password', data)
      
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
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }
  
  const getCurrentUser = async () => {
    try {
      const response = await axios.get<ApiResponse<User>>('/auth/user')
      
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
  
  // SINGLE redirectByRole function (fixed)
  const redirectByRole = (role: string, isClassTeacherStatus?: boolean) => {
    // If teacher and is class teacher, go to homeroom dashboard
    if (role === 'teacher' && isClassTeacherStatus) {
      router.push('/homeroom/dashboard')
      return
    }
    
    const routes: Record<string, string> = {
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
      family: '/family/dashboard'
    }

    router.push(routes[role] || '/login')
  }
  
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
    redirectByRole
  }
}