<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm fixed w-full z-20 top-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="md:hidden mr-4 text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <span class="text-xl font-bold text-indigo-600">E-School Attendance</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center space-x-2 focus:outline-none">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-600 font-semibold">{{ parentInitials }}</span>
                </div>
                <span class="text-gray-700 hidden md:block">{{ parentName }}</span>
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <router-link to="/family/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showProfileMenu = false">
                  My Profile
                </router-link>
                <hr class="my-1">
                <a href="#" @click="logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <div :class="['fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg mt-16 transform transition-transform duration-200 ease-in-out', sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      <div class="h-full overflow-y-auto">
        <div class="px-4 py-6 border-b">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white text-lg font-bold">{{ parentInitials }}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ parentName }}</p>
              <p class="text-sm text-gray-500">family</p>
            </div>
          </div>
        </div>
        
        <nav class="mt-5 px-2 space-y-1">
          <!-- Dashboard -->
          <router-link to="/family/dashboard" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/family/dashboard' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/family/dashboard' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>

          <!-- Attendance History -->
          <router-link to="/family/attendance" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path.startsWith('/family/attendance') ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/family/attendance') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            Attendance History
          </router-link>

          <!-- Leave Requests -->
          <router-link to="/family/leave" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/family/leave' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/family/leave' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Leave Requests
          </router-link>

          <!-- Profile -->
          <router-link to="/family/profile" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/family/profile' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/family/profile' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { user, logout: authLogout } = useAuth()
const sidebarOpen = ref(false)
const showProfileMenu = ref(false)

const parentName = computed(() => user.value?.name || 'family')
const parentInitials = computed(() => parentName.value.charAt(0).toUpperCase())

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const logout = () => {
  authLogout()
  router.push('/login')
}
</script>