<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
            <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">School Attendance System</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your account</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@test.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-blue-600"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    const response = await axios.post('http://localhost:8000/api/auth/login', {
      email: form.email,
      password: form.password
    })

    if (response.data.success) {
      const { access_token, user: userData } = response.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      toast.success('Login successful!')

      // IMPORTANT: redirect by role (FIX HERE)
      switch (userData.role) {
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
          router.push('/login')
      }

      return
    }

    toast.error('Invalid credentials')
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>