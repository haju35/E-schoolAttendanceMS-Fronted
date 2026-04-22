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
            
            <!-- User Menu with Photo -->
            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center space-x-2 focus:outline-none">
                <!-- Profile Photo or Initials -->
                <div class="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <img 
                    v-if="profilePhotoUrl" 
                    :src="profilePhotoUrl" 
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-indigo-600 dark:text-indigo-300 font-semibold">{{ userInitial }}</span>
                </div>
                <span class="text-gray-700 dark:text-gray-300 hidden md:block">{{ adminName }}</span>
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <router-link to="/admin/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" @click="showProfileMenu = false">
                  My Profile
                </router-link>
                <hr class="my-1 dark:border-gray-700">
                <a href="#" @click="handleLogout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
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
          <router-link to="/admin/dashboard" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/dashboard' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/dashboard' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>

          <!-- Academic Years -->
          <router-link to="/admin/academic-years" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/academic-years' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/academic-years' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Academic Years
          </router-link>

          <!-- Sections -->
          <router-link to="/admin/sections" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/sections' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/sections' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
            Sections
          </router-link>

          <!-- Students -->
          <router-link to="/admin/students" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/students' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/students' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Students
          </router-link>

          <!-- Teachers -->
          <router-link to="/admin/teachers" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/teachers' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/teachers' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Teachers
          </router-link>

          <!-- Families -->
          <router-link to="/admin/families" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/families' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/families' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Families
          </router-link>

          <!-- Classes -->
          <router-link to="/admin/classes" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/classes' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/classes' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Classes
          </router-link>

          <!-- Subjects -->
          <router-link to="/admin/subjects" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/subjects' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/subjects' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            Subjects
          </router-link>

          <!-- Teacher Assignments -->
          <router-link to="/admin/teacher-assignments" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/teacher-assignments' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/teacher-assignments' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Teacher Assignments
          </router-link>

          <!-- Class Teachers -->
          <router-link to="/admin/class-teachers" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/class-teachers' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/class-teachers' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Class Teachers
          </router-link>

          <!-- Reports -->
          <router-link to="/admin/reports" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/reports' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/reports' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Reports
          </router-link>

          <!-- Roles & Permissions -->
          <router-link to="/admin/roles" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/roles' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/roles' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0 0V5m0 6v6m0 0H8m4 0h4"></path>
            </svg>
            Roles & Permissions
          </router-link>

          <!-- My Profile -->
          <router-link to="/admin/profile" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/admin/profile' ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/admin/profile' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            My Profile
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="pt-16 md:ml-64 transition-all duration-200">
      <div class="p-6">
        <router-view />
      </div>
    </main>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { useDarkMode } from '@/composables/useDarkMode'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const toast = useToast()

const sidebarOpen = ref(false)
const showProfileMenu = ref(false)
const { isDark, toggleDark } = useDarkMode()
const profilePhotoUrl = ref<string | null>(null)

const adminName = computed(() => user.value?.name || 'Admin')
const userInitial = computed(() => adminName.value.charAt(0).toUpperCase())

// Fetch user profile to get photo URL
const fetchUserProfile = async () => {
  try {
    const response = await api.get('/admin/profile')
    if (response.data.success && response.data.data.photo) {
      const photo = response.data.data.photo
      if (photo.startsWith('http')) {
        profilePhotoUrl.value = photo
      } else {
        profilePhotoUrl.value = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${photo}`
      }
    } else {
      profilePhotoUrl.value = null
    }
  } catch (error) {
    console.error('Error fetching profile photo:', error)
  }
}

// Watch for route changes to refresh photo
watch(() => route.path, (newPath) => {
  if (newPath === '/admin/profile') {
    setTimeout(fetchUserProfile, 500)
  }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = async () => {
  showProfileMenu.value = false
  await logout()
  router.push('/login')
  toast.success('Logged out successfully')
}

onMounted(() => {
  fetchUserProfile()
  
  // Listen for storage events
  window.addEventListener('storage', (e) => {
    if (e.key === 'user' || e.key === 'user_photo') {
      fetchUserProfile()
    }
  })
})
</script>