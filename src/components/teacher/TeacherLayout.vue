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
            <span class="ml-2 text-sm text-gray-500 hidden md:block">Teacher Portal</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center space-x-2 focus:outline-none">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-600 font-semibold">{{ teacherInitials }}</span>
                </div>
                <span class="text-gray-700 hidden md:block">{{ teacherName }}</span>
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <router-link to="/teacher/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showProfileMenu = false">
                  My Profile
                </router-link>
                <router-link to="/teacher/change-password" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showProfileMenu = false">
                  Change Password
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
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-lg font-bold">{{ teacherInitials }}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ teacherName }}</p>
              <p class="text-sm text-gray-500">{{ teacherQualification }}</p>
              <p class="text-xs text-gray-400">ID: {{ employeeId }}</p>
            </div>
          </div>
        </div>
        
        <nav class="mt-5 px-2 space-y-1">
          <!-- Dashboard -->
          <router-link to="/teacher/dashboard" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/teacher/dashboard' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/dashboard' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>

          <!-- Mark Attendance -->
          <router-link to="/teacher/attendance" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/teacher/attendance' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/attendance' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Mark Attendance
          </router-link>

          <!-- View Attendance -->
          <router-link to="/teacher/view-attendance" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/teacher/view-attendance' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/view-attendance' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            View Attendance
          </router-link>

          <!-- My Classes - Different from Students -->
            <router-link to="/teacher/classes" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/teacher/classes' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
              <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/classes' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              My Classes
          </router-link>

          <!-- My Students - FIXED: Changed to div with click handler -->
          <div 
            @click="navigateToStudents" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer"
            :class="[$route.path === '/teacher/students' || $route.path.includes('/teacher/students/') ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
          >
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/students' || $route.path.includes('/teacher/students/') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            My Students
          </div>

          <!-- Reports -->
          <router-link to="/teacher/reports" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/teacher/reports' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/reports' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Reports
          </router-link>

          <!-- Profile -->
          <router-link to="/teacher/profile" class="group flex items-center px-2 py-2 text-base font-medium rounded-md" :class="[$route.path === '/teacher/profile' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
            <svg class="mr-3 h-6 w-6" :class="[$route.path === '/teacher/profile' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { teacherApi } from '../../services/teacherApi'
import { useToast } from 'vue-toastification'

const router = useRouter()
const { user, logout: authLogout } = useAuth()
const toast = useToast()
const sidebarOpen = ref(false)
const showProfileMenu = ref(false)
const teacherData = ref<any>(null)

const teacherName = computed(() => user.value?.name || 'Teacher')
const teacherInitials = computed(() => teacherName.value.charAt(0).toUpperCase())
const teacherQualification = computed(() => teacherData.value?.qualification || 'Teacher')
const employeeId = computed(() => teacherData.value?.employee_id || '')

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const fetchTeacherData = async () => {
  try {
    const response = await teacherApi.getProfile()
    console.log('Teacher profile data:', response.data)
    
    if (response.data.success) {
      teacherData.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching teacher data:', error)
  }
}

// NEW: Navigate to students with class parameters
const navigateToStudents = async () => {
  // If we already have teacher data with class info
  if (teacherData.value?.class) {
    const classId = teacherData.value.class.id
    const sectionId = teacherData.value.class.section_id
    
    if (classId && sectionId) {
      router.push({
        path: `/teacher/students/${classId}`,
        query: { section_id: sectionId.toString() }
      })
      return
    }
  }
  
  // If teacher data is not loaded yet, fetch it first
  if (!teacherData.value) {
    try {
      const response = await teacherApi.getProfile()
      if (response.data.success && response.data.data.class) {
        const classId = response.data.data.class.id
        const sectionId = response.data.data.class.section_id
        
        if (classId && sectionId) {
          router.push({
            path: `/teacher/students/${classId}`,
            query: { section_id: sectionId.toString() }
          })
        } else {
          toast.warning('You are not assigned to any class yet')
          router.push('/teacher/students')
        }
      } else {
        toast.warning('You are not assigned to any class yet')
        router.push('/teacher/students')
      }
    } catch (error) {
      console.error('Error fetching teacher class:', error)
      toast.error('Failed to load class information')
      router.push('/teacher/students')
    }
  } else {
    // Teacher data loaded but no class
    toast.warning('You are not assigned to any class yet')
    router.push('/teacher/students')
  }
}

const logout = () => {
  authLogout()
  router.push('/login')
}

onMounted(() => {
  fetchTeacherData()
})
</script>