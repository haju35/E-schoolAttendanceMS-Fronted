<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-20 top-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="md:hidden mr-4 text-gray-600 dark:text-gray-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">E-School Attendance</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDark"
              class="relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300"
              :class="isDark ? 'bg-indigo-600' : 'bg-gray-300'"
            >
              <span
                class="w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 flex items-center justify-center"
                :class="isDark ? 'translate-x-7' : 'translate-x-0'"
              >
                <span v-if="!isDark" class="text-yellow-500 text-xs"></span>
                <span v-else class="text-gray-700 text-xs"></span>
              </span>
            </button>

            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center space-x-2 focus:outline-none">
                <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <img 
                    v-if="profilePhotoUrl" 
                    :src="profilePhotoUrl" 
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <span class="text-indigo-600 dark:text-indigo-300 font-semibold">{{ parentInitials }}</span>
                </div>
                <span class="text-gray-700 dark:text-gray-300 hidden md:block">{{ parentName }}</span>
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <router-link to="/family/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" @click="showProfileMenu = false">
                  My Profile
                </router-link>
                <hr class="my-1 dark:border-gray-700">
                <a href="#" @click="logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <div :class="['fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg mt-16 transform transition-transform duration-200 ease-in-out', sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      <div class="h-full overflow-y-auto">
        <nav class="mt-5 px-2 space-y-1">
          <!-- Dashboard -->
          <router-link to="/family/dashboard" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/family/dashboard' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/family/dashboard' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>

          <!-- Attendance History -->
          <router-link to="/family/attendance" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path.startsWith('/family/attendance') ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/family/attendance') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            Attendance History
          </router-link>

          <!-- Leave Requests -->
          <router-link to="/family/leave" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/family/leave' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/family/leave' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Leave Requests
          </router-link>

          <!-- Profile -->
          <router-link to="/family/profile" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/family/profile' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/family/profile' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profile
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="pt-16 md:ml-64 transition-all duration-200">
      <router-view />
    </main>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useDarkMode } from '@/composables/useDarkMode'
import familyApi from '@/services/familyApi'

const router = useRouter()
const route = useRoute()

// Make sure to get fetchUser from useAuth
const { user, logout: authLogout, fetchUser } = useAuth()
const sidebarOpen = ref(false)
const showProfileMenu = ref(false)
const { isDark, toggleDark } = useDarkMode()
const profilePhotoUrl = ref<string | null>(null)

// Computed properties that will react to user changes
const parentName = computed(() => {
  console.log('Computing parentName, user value:', user.value)
  if (user.value?.name) {
    return user.value.name
  }
  // Fallback to localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      if (parsed.name) return parsed.name
    } catch (e) {}
  }
  return 'Family Member'
})

const parentInitials = computed(() => {
  const name = parentName.value
  return name !== 'Family Member' ? name.charAt(0).toUpperCase() : 'F'
})

const handleImageError = () => {
  console.error('Failed to load profile image')
  profilePhotoUrl.value = null
}

const fetchUserProfile = async () => {
  try {
    console.log('Fetching user profile...')
    const response = await familyApi.getProfile()
    console.log('Profile API response:', response.data)
    
    if (response.data.success && response.data.data) {
      // Update user data via fetchUser as well
      await fetchUser()
      
      if (response.data.data.photo) {
        const photo = response.data.data.photo
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        profilePhotoUrl.value = photo.startsWith('http') ? photo : `${baseURL}/storage/${photo}`
        console.log('Profile photo URL set to:', profilePhotoUrl.value)
      }
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const logout = () => {
  showProfileMenu.value = false
  authLogout()
  router.push('/login')
}

onMounted(async () => {
  console.log('Family Layout mounted')
  // Fetch user data first
  await fetchUser()
  console.log('User after fetch:', user.value)
  // Then fetch profile for photo
  await fetchUserProfile()
})
</script>