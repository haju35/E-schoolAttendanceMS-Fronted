import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import type { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData, User, ApiResponse, LoginResponse } from '@/types'

export function useAuth() {
  const router = useRouter()
  const toast = useToast()

  const user = ref<User | null>(null)           // Current user data
  const token = ref<string | null>(localStorage.getItem('access_token'))        // JWT token
  const loading = ref(false)                    // Loading state
  const isAuthenticated = computed(() => !!token.value)  // Auth status

  // Set axios header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }
  
  const login = async (credentials: LoginCredentials) => {         
    loading.value = true 
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
      
      if (response.data.success && response.data.data) {
        const { access_token, user: userData } = response.data.data
        
        token.value = access_token
        user.value = userData
        
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        toast.success('Login successful!')
        
        // Redirect based on role
        setTimeout(() => {
          redirectByRole(userData.role)
        }, 1000)
        
        return true
      }
      
      return false
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
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
      await axios.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
      toast.info('Logged out successfully')
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
  
  const redirectByRole = (role: string) => {
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'teacher':
        router.push('/teacher/dashboard')
        break
      case 'student':
        router.push('/student/dashboard')
        break
      case 'family':
        router.push('/family/dashboard')
        break
      default:
        router.push('/dashboard')
  }
}
  
  return { 
    user, 
    token, 
    loading, 
    isAuthenticated, 
    login, 
    register,
    forgotPassword,
    resetPassword,
    logout,
    getCurrentUser,
    redirectByRole
  }
}