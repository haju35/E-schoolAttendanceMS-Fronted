<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Dark Mode Toggle Button -->
    <button 
      @click="toggleDarkMode" 
      class="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <!-- Sun icon for light mode -->
      <svg v-if="!isDarkMode" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
      <!-- Moon icon for dark mode -->
      <svg v-else class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    </button>

    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-colors duration-300">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
            <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM9 13.5h6m-6 0a9 9 0 00-9 9h18a9 9 0 00-9-9z"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Create New Password</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Please enter your new password below</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <div class="relative">
              <input
                v-model="form.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {{ showConfirmPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Password strength indicator -->
        <div v-if="form.password" class="space-y-2">
          <div class="flex items-center space-x-2">
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full transition-all duration-300 rounded-full"
                :class="passwordStrengthClass"
                :style="{ width: passwordStrengthPercentage + '%' }"
              ></div>
            </div>
            <span class="text-xs font-medium" :class="passwordStrengthTextClass">
              {{ passwordStrengthText }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p :class="{ 'text-green-600 dark:text-green-400': hasMinLength, 'text-gray-400': !hasMinLength }">
              ✓ At least 6 characters
            </p>
            <p :class="{ 'text-green-600 dark:text-green-400': hasUpperCase, 'text-gray-400': !hasUpperCase }">
              ✓ At least one uppercase letter
            </p>
            <p :class="{ 'text-green-600 dark:text-green-400': hasLowerCase, 'text-gray-400': !hasLowerCase }">
              ✓ At least one lowercase letter
            </p>
            <p :class="{ 'text-green-600 dark:text-green-400': hasNumber, 'text-gray-400': !hasNumber }">
              ✓ At least one number
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 dark:focus:ring-offset-gray-800"
          >
            {{ loading ? 'Resetting Password...' : 'Reset Password' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
            ← Back to Login
          </router-link>
        </div>

        <div v-if="successMessage" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors duration-200">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700 dark:text-green-400">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-200">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { resetPassword, loading } = useAuth()

const form = reactive({
  password: '',
  password_confirmation: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isDarkMode = ref(false)

// Password strength computed properties
const hasMinLength = computed(() => form.password.length >= 6)
const hasUpperCase = computed(() => /[A-Z]/.test(form.password))
const hasLowerCase = computed(() => /[a-z]/.test(form.password))
const hasNumber = computed(() => /[0-9]/.test(form.password))

const passwordStrength = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength += 25
  if (hasUpperCase.value) strength += 25
  if (hasLowerCase.value) strength += 25
  if (hasNumber.value) strength += 25
  return strength
})

const passwordStrengthPercentage = computed(() => passwordStrength.value)

const passwordStrengthText = computed(() => {
  if (passwordStrength.value === 100) return 'Strong'
  if (passwordStrength.value >= 75) return 'Good'
  if (passwordStrength.value >= 50) return 'Fair'
  if (passwordStrength.value >= 25) return 'Weak'
  return 'Very Weak'
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value === 100) return 'bg-green-500'
  if (passwordStrength.value >= 75) return 'bg-blue-500'
  if (passwordStrength.value >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
})

const passwordStrengthTextClass = computed(() => {
  if (passwordStrength.value === 100) return 'text-green-600 dark:text-green-400'
  if (passwordStrength.value >= 75) return 'text-blue-600 dark:text-blue-400'
  if (passwordStrength.value >= 50) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
})

const token = route.params.token as string
const email = route.query.email as string

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  updateDarkModeClass()
}

// Update HTML class based on dark mode state
const updateDarkModeClass = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

// Initialize dark mode from localStorage or system preference
const initDarkMode = () => {
  const savedDarkMode = localStorage.getItem('darkMode')
  
  if (savedDarkMode !== null) {
    // Use saved preference
    isDarkMode.value = savedDarkMode === 'true'
  } else {
    // Use system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  updateDarkModeClass()
}

// Watch for dark mode changes
watch(isDarkMode, () => {
  updateDarkModeClass()
})

const handleResetPassword = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validate password match
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match'
    toast.error('Passwords do not match')
    return
  }
  
  // Validate password length
  if (form.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    toast.error('Password must be at least 6 characters')
    return
  }
  
  // Validate password strength (optional)
  if (passwordStrength.value < 50) {
    errorMessage.value = 'Please choose a stronger password'
    toast.error('Please choose a stronger password')
    return
  }
  
  try {
    const success = await resetPassword({
      token,
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    
    if (success) {
      successMessage.value = 'Password has been reset successfully! Redirecting to login...'
      toast.success('Password reset successful!')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      errorMessage.value = 'Failed to reset password. The link may have expired. Please request a new one.'
      toast.error('Failed to reset password. Please try again.')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to reset password. Please try again.'
    toast.error(errorMessage.value)
  }
}

// Check if token and email are present
onMounted(() => {
  initDarkMode()
  
  if (!token || !email) {
    errorMessage.value = 'Invalid or expired reset link. Please request a new password reset.'
    toast.error('Invalid reset link')
  }
})
</script>

<style scoped>
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
}
</style>